import { FS } from "../config.js";
import {
  buildD20Formula,
  buildRollFormula,
  clamp,
  createChatFlavor,
  formatRollResult,
  getAbilityLabel,
  getActiveD20Result,
  normalizeRollFormula,
  optionList,
  numberOr,
  waitForDialog,
} from "../utils.js";

const ABILITY_KEYS = Object.keys(FS.abilities);
const SKILL_KEYS = ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"];
const AMMO_BY_REF = {
  "balas-de-pistola": "pistol-slugs",
  "cartuchos-de-rifle": "rifle-rounds",
  "cartuchos-de-escopeta": "shotgun-shells",
  "flechas": "arrows",
};

const encodeContext = (context) => encodeURIComponent(JSON.stringify(context));

export class FSActor extends Actor {
  static async create(data, options = {}) {
    data.prototypeToken = data.prototypeToken || {};

    let defaults = {};
    if (data.type === "character") {
      defaults = {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        vision: true,
      };
    } else if (data.type === "npc") {
      defaults = {
        actorLink: false,
        disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
        vision: false,
      };
    } else if (data.type === "horse") {
      defaults = {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        vision: true,
      };
    }

    foundry.utils.mergeObject(data.prototypeToken, defaults, { overwrite: false });
    return super.create(data, options);
  }

  get speaker() {
    return ChatMessage.getSpeaker({ actor: this });
  }

  get negativeHp() {
    return Math.max(0, -(numberOr(this.system.hp?.value, 0)));
  }

  _characterSlotKeys() {
    return [
      "headSlot",
      "conditionSlot1",
      "conditionSlot2",
      "conditionSlot3",
      "beltSlot1",
      "beltSlot2",
      "beltSlot3",
      "backSlot1",
      "backSlot2",
      "backSlot3",
      "pocketSlot1",
      "pocketSlot2",
      "pocketSlot3",
      "pocketSlot4",
      "pocketSlot5",
      "pocketSlot6",
      "pocketSlot7",
      "pocketSlot8",
      "pocketSlot9",
      "pocketSlot10",
    ];
  }

  _normalizeAbilityKey(value) {
    if (!value) return "";
    const normalized = String(value).trim().toLowerCase();
    if (FS.abilities[normalized]) return normalized;
    return (
      Object.entries(FS.abilities).find(([, config]) => config.label.toLowerCase() === normalized)?.[0] ||
      ""
    );
  }

  getAbilityScore(ability) {
    const key = this._normalizeAbilityKey(ability);
    if (!key) return 0;

    const values = this.system.abilities || {};
    if (!this.system.drunk) {
      return numberOr(values[key], 0);
    }

    const swapA = this._normalizeAbilityKey(this.system.drunkAbility1);
    const swapB = this._normalizeAbilityKey(this.system.drunkAbility2);
    if (!swapA || !swapB || swapA === swapB) {
      return numberOr(values[key], 0);
    }
    if (key === swapA) return numberOr(values[swapB], 0);
    if (key === swapB) return numberOr(values[swapA], 0);
    return numberOr(values[key], 0);
  }

  async _ensureDrunkAbilities() {
    if (!this.system.drunk) return;
    const swapA = this._normalizeAbilityKey(this.system.drunkAbility1);
    const swapB = this._normalizeAbilityKey(this.system.drunkAbility2);
    if (swapA && swapB && swapA !== swapB) return;

    const first = Math.floor(Math.random() * ABILITY_KEYS.length);
    let second = Math.floor(Math.random() * ABILITY_KEYS.length);
    while (second === first) second = Math.floor(Math.random() * ABILITY_KEYS.length);

    await this.update({
      "system.drunkAbility1": FS.abilities[ABILITY_KEYS[first]].label,
      "system.drunkAbility2": FS.abilities[ABILITY_KEYS[second]].label,
    });
  }

  async setDrunk(active, sourceName = "Borrachera") {
    await this.update({ "system.drunk": active });
    if (active) {
      await this._ensureDrunkAbilities();
    }
    await ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: sourceName,
        subtitle: this.name,
        outcome: active ? "Condición: Borracho" : "Ya no estás borracho",
        details: active
          ? `Intercambias ${this.system.drunkAbility1 || "dos atributos"} y ${this.system.drunkAbility2 || "hasta dormir la mona"}.`
          : "",
      }),
    });
  }

  _getProtectionState() {
    const protections = [];

    for (const key of this._characterSlotKeys()) {
      const itemId = this.system[`${key}Id`];
      if (!itemId) continue;
      const item = this.items.get(itemId);
      if (!item || item.type !== "protection") continue;
      protections.push({ key, item });
    }

    const byClass = (klass) => protections.filter((entry) => entry.item.system.protectionClass === klass);
    return {
      all: protections,
      hats: byClass("hat"),
      armors: byClass("armor"),
      shields: byClass("shield"),
    };
  }

  _getReductionValue(item) {
    const match = String(item?.system?.reduction || "").match(/(\d+)/);
    return match ? numberOr(match[1], 0) : 0;
  }

  _getSimpleReductionValue(text) {
    const match = String(text || "").match(/([+\-]?\d+)/);
    return match ? Math.abs(numberOr(match[1], 0)) : 0;
  }

  async _removeSlottedItem(itemId) {
    if (!itemId) return;
    const updates = {};

    for (const key of this._characterSlotKeys()) {
      const idKey = `${key}Id`;
      if (this.system[idKey] === itemId) {
        updates[`system.${key}`] = "";
        updates[`system.${idKey}`] = "";
      }
    }

    if (Object.keys(updates).length) {
      await this.update(updates);
    }

    const item = this.items.get(itemId);
    if (item) {
      await item.delete();
    }
  }

  async _placeItemInFirstFreeSlot(item) {
    if (this.type !== "character" || !item) return;
    const slotOrder = {
      head: ["headSlot"],
      condition: ["conditionSlot1", "conditionSlot2", "conditionSlot3"],
      belt: ["beltSlot1", "beltSlot2", "beltSlot3"],
      back: ["backSlot1", "backSlot2", "backSlot3"],
      pocket: [
        "pocketSlot1",
        "pocketSlot2",
        "pocketSlot3",
        "pocketSlot4",
        "pocketSlot5",
        "pocketSlot6",
        "pocketSlot7",
        "pocketSlot8",
        "pocketSlot9",
        "pocketSlot10",
      ],
    };
    const preferred = slotOrder[item.system.slot] ? item.system.slot : "pocket";
    const key = slotOrder[preferred].find((entry) => !this.system[`${entry}Id`]);
    if (!key) return;

    await this.update({
      [`system.${key}`]: item.name,
      [`system.${key}Id`]: item.id,
    });
  }

  hasSacrificialHat() {
    return Boolean(this._getProtectionState().hats[0]?.item);
  }

  async sacrificeHat(itemId = null, sourceName = "Sombrero sacrificado", attackerName = "") {
    const hat =
      (itemId ? this.items.get(itemId) : null) ||
      this._getProtectionState().hats[0]?.item;

    if (!hat || hat.type !== "protection" || hat.system.protectionClass !== "hat") {
      ui.notifications.warn("No tienes un sombrero que sacrificar.");
      return false;
    }

    const storedHat = hat.toObject();
    delete storedHat._id;
    await this.setFlag(FS.systemId, "lostHat", storedHat);
    await this._removeSlottedItem(hat.id);

    const recoverButton = `
      <button
        type="button"
        class="fs-chat-action fs-recover-hat"
        data-actor-id="${this.id}"
        title="Intenta recuperar el sombrero con una tirada de Suerte."
      >
        Recuperar sombrero
      </button>
    `;

    await ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: sourceName,
        subtitle: this.name,
        outcome: "Sombrero perdido",
        details: `${hat.name}: ignoras por completo el daño de este ataque.${attackerName ? ` Ataque bloqueado a ${attackerName}.` : ""}`,
        footer: recoverButton,
      }),
    });
    return true;
  }

  async recoverLostHat() {
    const hatData = this.getFlag(FS.systemId, "lostHat");
    if (!hatData) {
      ui.notifications.warn("No hay ningún sombrero pendiente de recuperar.");
      return;
    }

    const roll = await new Roll(buildRollFormula("1d20", this.getAbilityScore("luck"))).evaluate();
    const success = roll.total >= 12;

    let details = "El sombrero no sobrevive al golpe.";
    if (success) {
      const [created] = await this.createEmbeddedDocuments("Item", [hatData]);
      await this._placeItemInFirstFreeSlot(created);
      await this.unsetFlag(FS.systemId, "lostHat");
      details = `${created.name}: vuelve contigo tras un chequeo de Suerte exitoso.`;
    } else {
      await this.unsetFlag(FS.systemId, "lostHat");
    }

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Recuperar sombrero",
        subtitle: `DR 12 | ${formatRollResult(roll)}`,
        outcome: success ? "Sombrero recuperado" : "Sombrero perdido para siempre",
        details,
      }),
    });
  }

  _getProtectionProfile() {
    if (this.type === "character") {
      const state = this._getProtectionState();
      const hat = state.hats[0]?.item ?? null;
      const armor = state.armors[0]?.item ?? null;
      const shield = state.shields[0]?.item ?? null;
      const armorReduction = armor ? this._getReductionValue(armor) : 0;
      const shieldReduction = shield ? this._getReductionValue(shield) : 0;
      const detailParts = [];
      if (armorReduction) detailParts.push(`${armor.name}: -${armorReduction}`);
      if (shieldReduction) detailParts.push(`${shield.name}: -${shieldReduction}`);
      return {
        hat,
        reduction: armorReduction + shieldReduction,
        detailParts,
      };
    }

    if (this.type === "npc") {
      const reduction = this._getSimpleReductionValue(this.system.protection);
      return {
        hat: null,
        reduction,
        detailParts: reduction ? [`Protección: -${reduction}`] : [],
      };
    }

    return { hat: null, reduction: 0, detailParts: [] };
  }

  async _resolveThresholdCheck({ lethal = true } = {}) {
    if (numberOr(this.system.hp?.value, 0) > 0) return;
    if (lethal) {
      await this.rollDeathCheck({ negativeHp: this.negativeHp, skipDialog: true });
    } else {
      await this.rollDropCheck({ negativeHp: this.negativeHp, skipDialog: true });
    }
  }

  async applyTargetedDamage({
    damage = 0,
    sourceName = "Aplicar daño",
    useHat = false,
    lethal = true,
  } = {}) {
    const incomingDamage = Math.max(0, numberOr(damage, 0));
    const profile = this._getProtectionProfile();
    const detailParts = [];
    let prevented = 0;
    let finalDamage = incomingDamage;

    if (useHat) {
      if (!profile.hat) {
        ui.notifications.warn(`${this.name} no tiene sombrero que sacrificar.`);
        return null;
      }
      await this.sacrificeHat(profile.hat.id, sourceName);
      prevented = incomingDamage;
      finalDamage = 0;
      detailParts.push(`${profile.hat.name}: daño anulado antes de tirar daño.`);
    } else if (profile.reduction > 0) {
      prevented = Math.min(incomingDamage, profile.reduction);
      finalDamage = Math.max(0, incomingDamage - profile.reduction);
      detailParts.push(...profile.detailParts);
    }

    const currentHp = numberOr(this.system.hp?.value, 0);
    const newHp = currentHp - finalDamage;
    await this.update({ "system.hp.value": newHp });

    if (!detailParts.length) detailParts.push("Sin protección aplicada.");
    if (newHp < 0) {
      detailParts.push(`HP negativos: ${Math.abs(newHp)}.`);
    }

    await ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: sourceName,
        subtitle: this.name,
        outcome:
          newHp <= 0
            ? `Daño final: ${finalDamage} | Queda a 0 HP o menos`
            : `Daño final: ${finalDamage}`,
        details: detailParts.join(" | "),
        footer: prevented
          ? `Daño prevenido: ${prevented} | Daño entrante: ${incomingDamage}`
          : `Daño entrante: ${incomingDamage}`,
      }),
    });

    await this._resolveThresholdCheck({ lethal });

    return {
      incomingDamage,
      prevented,
      finalDamage,
      newHp,
    };
  }

  _buildAceButton(context) {
    if (this.type !== "character" || numberOr(this.system.aces, 0) < 1) return "";
    return `
      <button
        type="button"
        class="fs-chat-action fs-spend-ace-roll"
        data-actor-id="${this.id}"
        data-context="${encodeContext(context)}"
        title="Gasta un As para repetir esta tirada."
      >
        As
      </button>
    `;
  }

  async _promptLearnSkill(ability) {
    const emptySlot = SKILL_KEYS.find((key) => !String(this.system[key] || "").trim());
    const replaceOptions = SKILL_KEYS.map((key) => {
      const current = String(this.system[key] || "").trim();
      return `<option value="${key}">${current || `${key.toUpperCase()} (vacío)`}</option>`;
    }).join("");

    const formData = await waitForDialog({
      title: `Nueva habilidad de ${getAbilityLabel(ability)}`,
      content: `
        <form class="fs-dialog-grid">
          <label>Habilidad</label>
          <input type="text" name="skill" placeholder="Nueva habilidad útil"/>
          ${emptySlot ? "" : `<label>Reemplaza</label><select name="slot">${replaceOptions}</select>`}
        </form>
      `,
      okLabel: "Aprender",
      parse: (html) => ({
        skill: String(html.find('[name="skill"]').val() || "").trim(),
        slot: emptySlot || html.find('[name="slot"]').val() || SKILL_KEYS[0],
      }),
    });

    if (!formData?.skill) return null;
    await this.update({ [`system.${formData.slot}`]: formData.skill });
    return formData.skill;
  }

  async _applyAbilityNaturalConsequences(natural, ability) {
    const notes = [];

    if (natural === 1 && this.type === "character") {
      const characters = game.actors.filter((actor) => actor.type === "character" && numberOr(actor.system.aces, 0) > 0);
      if (characters.length) {
        await Actor.updateDocuments(
          characters.map((actor) => ({
            _id: actor.id,
            "system.aces": 0,
          })),
        );
      }
      notes.push("1 natural: todos los PJ pierden todos sus Ases.");
    }

    if (natural === 20 && this.type === "character") {
      const choice = await waitForDialog({
        title: "20 natural",
        content: `
          <form class="fs-dialog-grid">
            <label>Recompensa</label>
            <select name="reward">
              <option value="ace">Ganar 1 As</option>
              <option value="skill">Aprender una habilidad</option>
            </select>
          </form>
        `,
        okLabel: "Aceptar",
        parse: (html) => ({
          reward: html.find('[name="reward"]').val() || "ace",
        }),
      });

      if (choice?.reward === "skill") {
        const learned = await this._promptLearnSkill(ability);
        if (learned) {
          notes.push(`20 natural: aprendes ${learned}.`);
        } else {
          await this.update({ "system.aces": numberOr(this.system.aces, 0) + 1 });
          notes.push("20 natural: ganas 1 As.");
        }
      } else {
        await this.update({ "system.aces": numberOr(this.system.aces, 0) + 1 });
        notes.push("20 natural: ganas 1 As.");
      }
    }

    return notes;
  }

  _singleTargetActor() {
    const targets = Array.from(game.user?.targets ?? []);
    if (targets.length !== 1) return null;
    return targets[0]?.actor ?? null;
  }

  _ownedAmmoItemsForWeapon(item) {
    const catalogId = AMMO_BY_REF[item?.system?.ammo];
    if (!catalogId) return [];
    return this.items.filter((entry) => entry.getFlag(FS.systemId, "catalogId") === catalogId);
  }

  _ownedAmmoItemForWeapon(item) {
    const ammoItems = this._ownedAmmoItemsForWeapon(item);
    return ammoItems.find((entry) => numberOr(entry.system.quantity, 0) > 0) ?? ammoItems[0] ?? null;
  }

  _isSpentThrownWeapon(item) {
    return item?.getFlag(FS.systemId, "catalogId") === "throwing-knives" && Boolean(item.getFlag(FS.systemId, "spent"));
  }

  _consumableThrownWeapon(item) {
    const catalogId = item?.getFlag(FS.systemId, "catalogId");
    return ["fire-bottle", "dynamite"].includes(catalogId);
  }

  _weaponAmmoWarning(item) {
    if (!item || item.type !== "weapon") return "";
    if (item.system.ammo) {
      const ammoItems = this._ownedAmmoItemsForWeapon(item);
      const quantity = ammoItems.reduce((total, ammoItem) => total + Math.max(0, numberOr(ammoItem.system.quantity, 0)), 0);
      if (!ammoItems.length || quantity < 1) {
        return `Necesitas ${item.system.ammo} disponible para usar ${item.name}.`;
      }
    }
    if (this._isSpentThrownWeapon(item)) {
      return `Debes recuperar ${item.name} antes de volver a usarlo.`;
    }
    return "";
  }

  _attackOptionsForItem(item) {
    const modifierOptions = optionList(
      FS.modifierOptions,
      (value) => (value > 0 ? `+${value}` : value),
      0,
    );

    if (item.system.weaponClass === "gun") {
      return {
        title: `Usar ${item.name}`,
        content: `
          <form class="fs-dialog-grid">
            <label>Tipo de ataque</label>
            <select name="attackType">
              <option value="gun">Disparo normal</option>
              <option value="gunTough">Tiro difícil</option>
              <option value="gunMelee">Disparo en melé</option>
            </select>
            <label>Dificultad</label>
            <select name="dr">${optionList(FS.drOptions, (value) => `DR ${value}`, 12)}</select>
            <label>Situación</label>
            <select name="mode">
              <option value="normal" selected>Normal</option>
              <option value="advantage">Ventaja</option>
              <option value="disadvantage">Desventaja</option>
            </select>
            <label>Modificador</label>
            <select name="modifier">${modifierOptions}</select>
          </form>
        `,
      };
    }

    if (item.system.weaponClass === "melee") {
      return {
        title: `Usar ${item.name}`,
        content: `
          <form class="fs-dialog-grid">
            <label>Modo</label>
            <select name="attackType">
              <option value="melee">Ataque cuerpo a cuerpo</option>
              <option value="scuffle">Refriega</option>
            </select>
            <label>Dificultad</label>
            <select name="dr">${optionList(FS.drOptions, (value) => `DR ${value}`, 12)}</select>
            <label>Situación</label>
            <select name="mode">
              <option value="normal" selected>Normal</option>
              <option value="advantage">Ventaja</option>
              <option value="disadvantage">Desventaja</option>
            </select>
            <label>Modificador</label>
            <select name="modifier">${modifierOptions}</select>
          </form>
        `,
      };
    }

    return {
      title: `Usar ${item.name}`,
      content: `
        <form class="fs-dialog-grid">
          <label>Dificultad</label>
          <select name="dr">${optionList(FS.drOptions, (value) => `DR ${value}`, 12)}</select>
          <label>Situación</label>
          <select name="mode">
            <option value="normal" selected>Normal</option>
            <option value="advantage">Ventaja</option>
            <option value="disadvantage">Desventaja</option>
          </select>
          <label>Modificador</label>
          <select name="modifier">${modifierOptions}</select>
          <input type="hidden" name="attackType" value="ranged"/>
        </form>
      `,
    };
  }

  _attackSpec(item, attackType) {
    if (attackType === "gun") {
      return {
        label: "Disparo normal",
        autoHit: true,
        ability: null,
        details: "Disparo normal con arma de fuego: impacta automáticamente.",
      };
    }
    if (attackType === "gunTough") {
      return {
        label: "Tiro difícil",
        autoHit: false,
        ability: "slick",
        details: "Tiro difícil con arma de fuego: chequeo de Brío para impactar.",
      };
    }
    if (attackType === "gunMelee") {
      return {
        label: "Disparo en melé",
        autoHit: false,
        ability: "grit",
        details: "Arma de fuego en melé: chequeo de Aplomo para impactar.",
      };
    }
    if (attackType === "melee") {
      return {
        label: "Ataque cuerpo a cuerpo",
        autoHit: false,
        ability: "grit",
        details: "Ataque cuerpo a cuerpo: chequeo de Aplomo para impactar.",
      };
    }
    if (attackType === "scuffle") {
      return {
        label: "Refriega",
        autoHit: false,
        ability: "grit",
        details: "Refriega: en un éxito hieres; en un fallo te hieren a ti.",
        scuffle: true,
      };
    }
    return {
      label: "Ataque a distancia",
      autoHit: false,
      ability: "slick",
      details: "Ataque a distancia sin arma de fuego: chequeo de Brío para impactar.",
    };
  }

  async _createAttackMessage({ item, spec, targetActor, formula, attackType, dr = 12, mode = "normal", modifier = 0, rerolled = false }) {
    const buttons = [];
    if (targetActor?.hasSacrificialHat?.()) {
      buttons.push(`
        <button
          type="button"
          class="fs-chat-action fs-block-attack-hat"
          data-target-actor-id="${targetActor.id}"
          data-source-name="${item.name}"
          title="${FS.tooltips.consumeHat}"
        >
          Sombrero
        </button>
      `);
    }
    buttons.push(`
      <button
        type="button"
        class="fs-chat-action fs-roll-weapon-damage"
        data-actor-id="${this.id}"
        data-item-id="${item.id}"
        data-formula="${formula}"
        data-target-actor-id="${targetActor?.id || ""}"
        title="Tira el daño de este ataque."
      >
        Tirar daño
      </button>
    `);

    await ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: item.name,
        subtitle: targetActor ? `Objetivo: ${targetActor.name}` : "",
        outcome: "Impacta",
        details: `${spec.label}. ${spec.details}${rerolled ? " Repetido con un As." : ""}`,
        footer: `<div class="fs-chat-actions">${buttons.join("")}</div>`,
      }),
    });
  }

  async _consumeAmmoForWeapon(item, roll) {
    const results = roll.dice.flatMap((die) => die.results.map((result) => result.result));
    if (!results.includes(1)) return "";

    const catalogId = AMMO_BY_REF[item.system.ammo];
    if (catalogId) {
      const ammoItem = this._ownedAmmoItemForWeapon(item);
      if (!ammoItem) {
        return `Has sacado un 1 en daño: pierdes una ranura de ${item.system.ammo}, pero no hay munición registrada en la ficha.`;
      }

      const quantity = numberOr(ammoItem.system.quantity, 1);
      if (quantity > 1) {
        await ammoItem.update({ "system.quantity": quantity - 1 });
      } else {
        await ammoItem.update({ "system.quantity": 0 });
      }
      return `Has sacado un 1 en daño: pierdes una ranura de ${ammoItem.name}.`;
    }

    if (item.getFlag(FS.systemId, "catalogId") === "throwing-knives") {
      await item.setFlag(FS.systemId, "spent", true);
      return "Has sacado un 1 en daño: pierdes temporalmente este juego de cuchillos arrojadizos hasta recuperarlo.";
    }

    return "";
  }

  async _consumeThrownWeapon(item) {
    if (!this._consumableThrownWeapon(item)) return "";
    await this._removeSlottedItem(item.id);
    return `${item.name}: se consume al usarlo.`;
  }

  _damageButtonsForRoll(roll) {
    const buttons = [
      `<button type="button" class="fs-chat-action fs-apply-damage" data-damage="${roll.total}" title="${FS.tooltips.applyDamage}">Aplicar daño</button>`,
    ];

    const damageDice = roll.dice.filter((die) => die.faces > 1);
    if (damageDice.length > 1 || damageDice.some((die) => die.results.length > 1)) {
      damageDice.forEach((die) => {
        die.results.forEach((result) => {
          buttons.push(
            `<button type="button" class="fs-chat-action fs-apply-damage" data-damage="${result.result}" title="Aplica este dado por separado a un objetivo marcado.">Aplicar ${result.result}</button>`,
          );
        });
      });
    }

    return buttons.join("");
  }

  async rollWeaponDamage({ itemId, formula, rerolled = false } = {}) {
    const item = this.items.get(itemId);
    if (!item) return;

    const normalizedFormula = normalizeRollFormula(formula) || "1";
    let roll;
    try {
      roll = await new Roll(normalizedFormula).evaluate();
    } catch (error) {
      console.error(`Frontier Scum ES | No se pudo tirar el daño de ${item.name}`, error);
      ui.notifications.error(`No se pudo tirar el daño de ${item.name}. Revisa la fórmula.`);
      return;
    }

    const ammoNote = await this._consumeAmmoForWeapon(item, roll);
    const spentNote = await this._consumeThrownWeapon(item);
    const footerButtons = this._damageButtonsForRoll(roll);
    const aceButton = this._buildAceButton({
      kind: "damage",
      itemId: item.id,
      formula,
    });

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: item.name,
        subtitle: `${item.system.range || "Alcance variable"} | ${item.system.hands || "1"} mano(s)`,
        outcome: `Daño: ${roll.total}`,
        details: [item.system.summary, item.system.ammo ? `Munición: ${item.system.ammo}` : "", ammoNote, spentNote, rerolled ? "Repetido con un As." : ""]
          .filter(Boolean)
          .join(" | "),
        footer: `
          ${normalizedFormula !== formula ? `<div>Tirada: ${normalizedFormula}</div>` : ""}
          <div class="fs-chat-actions">
            ${footerButtons}
            ${aceButton}
          </div>
        `,
      }),
    });
  }

  async useOwnedItem(itemId) {
    const item = this.items.get(itemId);
    if (!item) return;

    if (item.type === "weapon") {
      return this._useWeapon(item);
    }

    if (item.type === "medical") {
      return this._useMedicalItem(item);
    }

    return ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: item.name,
        subtitle: item.system.summary || "",
        details: item.system.notes || "",
      }),
    });
  }

  async _useWeapon(item) {
    const ammoWarning = this._weaponAmmoWarning(item);
    if (ammoWarning) {
      ui.notifications.warn(ammoWarning);
      return;
    }

    const formulas = String(item.system.damage || "")
      .split("/")
      .map((entry) => entry.trim())
      .filter(Boolean);

    let formula = formulas[0] || "1";
    if (formulas.length > 1) {
      const modeChoice = await waitForDialog({
        title: `Usar ${item.name}`,
        content: `
          <form class="fs-dialog-grid">
            <label>Daño</label>
            <select name="formula">
              ${formulas.map((entry) => `<option value="${entry}">${entry}</option>`).join("")}
            </select>
          </form>
        `,
        parse: (html) => ({
          formula: html.find('[name="formula"]').val() || formulas[0],
        }),
      });
      if (!modeChoice) return;
      formula = modeChoice.formula;
    }

    const targetActor = this._singleTargetActor();
    if (!targetActor) {
      ui.notifications.warn("Marca un objetivo para resolver el ataque según el manual. Se tirará solo el daño.");
      return this.rollWeaponDamage({ itemId: item.id, formula });
    }

    const attackDialog = this._attackOptionsForItem(item);
    const attackChoice = await waitForDialog({
      title: attackDialog.title,
      content: attackDialog.content,
      parse: (html) => ({
        attackType: html.find('[name="attackType"]').val() || "gun",
        dr: numberOr(html.find('[name="dr"]').val(), 12),
        mode: html.find('[name="mode"]').val() || "normal",
        modifier: numberOr(html.find('[name="modifier"]').val(), 0),
      }),
    });
    if (!attackChoice) return;

    const spec = this._attackSpec(item, attackChoice.attackType);
    if (spec.autoHit) {
      return this._createAttackMessage({
        item,
        spec,
        targetActor,
        formula,
        attackType: attackChoice.attackType,
      });
    }

    const abilityValue = this.getAbilityScore(spec.ability);
    const roll = await new Roll(
      buildD20Formula({
        mode: attackChoice.mode,
        modifier: abilityValue + attackChoice.modifier,
      }),
    ).evaluate();
    const success = roll.total >= attackChoice.dr;
    const natural = getActiveD20Result(roll);
    const notes = [spec.details];
    notes.push(...(await this._applyAbilityNaturalConsequences(natural, spec.ability)));

    const aceButton =
      natural === 1 || natural === 20
        ? ""
        : this._buildAceButton({
            kind: "attack",
            itemId: item.id,
            formula,
            attackType: attackChoice.attackType,
            dr: attackChoice.dr,
            mode: attackChoice.mode,
            modifier: attackChoice.modifier,
          });

    if (success && !spec.scuffle) {
      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: `${spec.label} | DR ${attackChoice.dr} | ${formatRollResult(roll)}`,
          outcome: "Impacta",
          details: notes.join(" "),
          footer: `<div class="fs-chat-actions">${aceButton}</div>`,
        }),
      });

      return this._createAttackMessage({
        item,
        spec,
        targetActor,
        formula,
        attackType: attackChoice.attackType,
        dr: attackChoice.dr,
        mode: attackChoice.mode,
        modifier: attackChoice.modifier,
      });
    }

    const outcome = success
      ? "Hiere en la refriega"
      : spec.scuffle
        ? "En la refriega te hieren a ti"
        : "Falla";

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: item.name,
        subtitle: `${spec.label} | DR ${attackChoice.dr} | ${formatRollResult(roll)}`,
        outcome,
        details: notes.join(" "),
        footer: `<div class="fs-chat-actions">${aceButton}</div>`,
      }),
    });
  }

  async _resolveHealingTarget() {
    const targetActor = this._singleTargetActor();
    return targetActor || this;
  }

  async _healTarget(target, amount, sourceName, details = "") {
    const currentHp = numberOr(target.system.hp?.value, 0);
    const maxHp = numberOr(target.system.hp?.max, 0);
    const healedTo = clamp(currentHp + amount, currentHp, maxHp);
    const recovered = healedTo - currentHp;
    await target.update({ "system.hp.value": healedTo });
    return {
      recovered,
      healedTo,
      maxHp,
      details,
      sourceName,
    };
  }

  async _useMedicalItem(item) {
    const target = await this._resolveHealingTarget();
    const uses = numberOr(item.system.uses, 0);
    if (uses === 0) {
      ui.notifications.warn(`${item.name} ya no tiene usos disponibles.`);
      return;
    }

    const catalogId = item.getFlag(FS.systemId, "catalogId");
    const healerWits = this.getAbilityScore("wits");
    let outcome = item.system.healing || "Sin efecto definido.";
    let details = [];

    if (catalogId === "laudanum") {
      const roll = await new Roll("1d4").evaluate();
      const result = await this._healTarget(target, roll.total, item.name);
      if (result.healedTo < result.maxHp) {
        await target.update({ "system.drunk": true });
        await target._ensureDrunkAbilities?.();
        details.push("No se cura por completo: queda Borracho.");
      }
      outcome = `${target.name} recupera ${result.recovered} HP.`;
      details.push(`HP: ${result.healedTo}/${result.maxHp}`);
      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
        }),
      });
    } else if (catalogId === "injury-kit") {
      const currentHp = numberOr(target.system.hp?.value, 0);
      const base = Math.max(currentHp, 0);
      const healedTo = clamp(base + Math.max(healerWits, 0), 0, numberOr(target.system.hp?.max, 0));
      const recovered = healedTo - currentHp;
      await target.update({ "system.hp.value": healedTo });
      outcome = `${target.name} vuelve a ${healedTo} HP (${recovered >= 0 ? `+${recovered}` : recovered}).`;
      details.push(`Seso del doctor: ${healerWits}`);
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
        }),
      });
    } else if (catalogId === "doctors-bag") {
      const roll = await new Roll(buildRollFormula("1d6", healerWits)).evaluate();
      const result = await this._healTarget(target, Math.max(0, roll.total), item.name);
      outcome = `${target.name} recupera ${result.recovered} HP.`;
      details.push(`HP: ${result.healedTo}/${result.maxHp}`);
      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
        }),
      });
    } else if (catalogId === "gin-pills") {
      if (!target.system.drunk) {
        ui.notifications.warn(`${target.name} debe estar Borracho para beneficiarse de las píldoras de ginebra.`);
        return;
      }
      const roll = await new Roll("1d4").evaluate();
      const result = await this._healTarget(target, roll.total, item.name);
      outcome = `${target.name} recupera ${result.recovered} HP mientras está Borracho.`;
      details.push(`HP: ${result.healedTo}/${result.maxHp}`);
      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
        }),
      });
    } else if (catalogId === "healthful-bitters") {
      const roll = await new Roll("1d4").evaluate();
      const result = await this._healTarget(target, roll.total, item.name);
      outcome = `${target.name} recupera ${result.recovered} HP.`;
      details.push(`HP: ${result.healedTo}/${result.maxHp}`);
      if (roll.total >= 3 && target.system.miserable) {
        await target.update({ "system.miserable": false, "system.misery": "" });
        details.push("Cura Miserable.");
      }
      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
        }),
      });
    } else if (catalogId === "opium-tincture") {
      const healRoll = await new Roll("1d10").evaluate();
      const result = await this._healTarget(target, healRoll.total, item.name);
      outcome = `${target.name} recupera ${result.recovered} HP.`;
      details.push(`HP: ${result.healedTo}/${result.maxHp}`);

      const gritRoll = await new Roll(buildRollFormula("1d20", target.getAbilityScore("grit"))).evaluate();
      if (gritRoll.total < 18) {
        const conditionText = String(target.system.condition1 || "").trim();
        await target.update({
          "system.condition1": [conditionText, "Sueño profundo"].filter(Boolean).join(" | "),
        });
        details.push(`Falla DR18 Aplomo: cae en sueño profundo.`);
      }

      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
          details: details.join(" | "),
          footer: `Chequeo de Aplomo: ${formatRollResult(gritRoll)} vs DR 18`,
        }),
      });
    } else {
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: item.name,
          subtitle: target.name,
          outcome,
        }),
      });
    }

    await item.update({ "system.uses": Math.max(uses - 1, 0) });
  }

  async abilityCheck(ability) {
    return this._runAbilityCheck({
      title: `Chequeo de ${getAbilityLabel(ability)}`,
      chatTitle: `Chequeo de ${getAbilityLabel(ability)}`,
      ability,
      defaultMode: "normal",
      detailsPrefix: "",
    });
  }

  async skillCheck(skill) {
    const abilityOptions = Object.entries(FS.abilities)
      .map(([key, config]) => `<option value="${key}">${config.label}</option>`)
      .join("");

    const formData = await waitForDialog({
      title: `Usar habilidad: ${skill}`,
      content: `
        <form class="fs-dialog-grid">
          <label>Habilidad</label>
          <div class="fs-dialog-note">${skill}</div>
          <label>Atributo</label>
          <select name="ability">${abilityOptions}</select>
          <label>Dificultad</label>
          <select name="dr">${optionList(FS.drOptions, (value) => `DR ${value}`, 12)}</select>
          <label>Situación</label>
          <select name="mode">
            <option value="advantage" selected>Ventaja por habilidad</option>
            <option value="normal">Normal</option>
            <option value="disadvantage">Desventaja</option>
          </select>
          <label>Modificador</label>
          <select name="modifier">${optionList(FS.modifierOptions, (value) => value > 0 ? `+${value}` : value, 0)}</select>
        </form>
      `,
      parse: (html) => ({
        ability: html.find('[name="ability"]').val() || "grit",
        dr: numberOr(html.find('[name="dr"]').val(), 12),
        mode: html.find('[name="mode"]').val() || "advantage",
        modifier: numberOr(html.find('[name="modifier"]').val(), 0),
      }),
    });
    if (!formData) return;

    return this._runAbilityCheck({
      title: `Habilidad: ${skill}`,
      chatTitle: `Chequeo de ${getAbilityLabel(formData.ability)}`,
      ability: formData.ability,
      dr: formData.dr,
      mode: formData.mode,
      modifier: formData.modifier,
      detailsPrefix: `Habilidad: ${skill}. ${formData.mode === "advantage" ? "Ventaja por habilidad aplicable." : ""}`.trim(),
    });
  }

  async _runAbilityCheck({
    title,
    chatTitle,
    ability,
    dr = 12,
    mode = "normal",
    modifier = 0,
    defaultMode = null,
    detailsPrefix = "",
    rerolled = false,
  }) {
    let formData = { dr, mode, modifier };

    if (defaultMode) {
      formData = await waitForDialog({
        title,
        content: `
          <form class="fs-dialog-grid">
            <label>Dificultad</label>
            <select name="dr">${optionList(FS.drOptions, (value) => `DR ${value}`, dr)}</select>
            <label>Situación</label>
            <select name="mode">
              <option value="normal" ${defaultMode === "normal" ? "selected" : ""}>Normal</option>
              <option value="advantage" ${defaultMode === "advantage" ? "selected" : ""}>Ventaja</option>
              <option value="disadvantage" ${defaultMode === "disadvantage" ? "selected" : ""}>Desventaja</option>
            </select>
            <label>Modificador</label>
            <select name="modifier">${optionList(FS.modifierOptions, (value) => value > 0 ? `+${value}` : value, modifier)}</select>
          </form>
        `,
        parse: (html) => ({
          dr: numberOr(html.find('[name="dr"]').val(), dr),
          mode: html.find('[name="mode"]').val() || defaultMode,
          modifier: numberOr(html.find('[name="modifier"]').val(), modifier),
        }),
      });
      if (!formData) return;
    }

    const totalModifier = this.getAbilityScore(ability) + formData.modifier;
    const roll = await new Roll(
      buildD20Formula({ mode: formData.mode, modifier: totalModifier }),
    ).evaluate();
    const success = roll.total >= formData.dr;
    const natural = getActiveD20Result(roll);

    const notes = detailsPrefix ? [detailsPrefix] : [];
    notes.push(...(await this._applyAbilityNaturalConsequences(natural, ability)));
    if (rerolled) notes.push("Repetido con un As.");

    const aceButton =
      natural === 1 || natural === 20
        ? ""
        : this._buildAceButton({
            kind: "ability",
            ability,
            dr: formData.dr,
            mode: formData.mode,
            modifier: formData.modifier,
            title,
            chatTitle,
            detailsPrefix,
          });

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: chatTitle,
        subtitle: `DR ${formData.dr} | ${formatRollResult(roll)}`,
        outcome: success ? "Éxito" : "Fracaso",
        details: notes.join(" "),
        footer: aceButton ? `<div class="fs-chat-actions">${aceButton}</div>` : "",
      }),
    });
  }

  async rerollWithAce(context = {}) {
    if (this.type !== "character") return;
    const currentAces = numberOr(this.system.aces, 0);
    if (currentAces < 1) {
      ui.notifications.warn("No te quedan Ases.");
      return;
    }

    await this.update({ "system.aces": currentAces - 1 });

    if (context.kind === "ability") {
      return this._runAbilityCheck({
        title: context.title,
        chatTitle: context.chatTitle,
        ability: context.ability,
        dr: context.dr,
        mode: context.mode,
        modifier: context.modifier,
        detailsPrefix: context.detailsPrefix,
        rerolled: true,
      });
    }

    if (context.kind === "attack") {
      const item = this.items.get(context.itemId);
      if (!item) return;
      const spec = this._attackSpec(item, context.attackType);
      const targetActor = this._singleTargetActor();
      const abilityValue = this.getAbilityScore(spec.ability);
      const roll = await new Roll(
        buildD20Formula({
          mode: context.mode,
          modifier: abilityValue + numberOr(context.modifier, 0),
        }),
      ).evaluate();
      const success = roll.total >= numberOr(context.dr, 12);
      const natural = getActiveD20Result(roll);
      const notes = [spec.details];
      notes.push(...(await this._applyAbilityNaturalConsequences(natural, spec.ability)));
      notes.push("Repetido con un As.");

      await roll.toMessage({
        speaker: this.speaker,
        flavor: createChatFlavor({
          title: item.name,
          subtitle: `${spec.label} | DR ${context.dr} | ${formatRollResult(roll)}`,
          outcome: success ? (spec.scuffle ? "Hiere en la refriega" : "Impacta") : (spec.scuffle ? "En la refriega te hieren a ti" : "Falla"),
          details: notes.join(" "),
        }),
      });

      if (success && !spec.scuffle && targetActor) {
        return this._createAttackMessage({
          item,
          spec,
          targetActor,
          formula: context.formula,
          attackType: context.attackType,
          dr: context.dr,
          mode: context.mode,
          modifier: context.modifier,
          rerolled: true,
        });
      }
      return;
    }

    if (context.kind === "damage") {
      return this.rollWeaponDamage({
        itemId: context.itemId,
        formula: context.formula,
        rerolled: true,
      });
    }
  }

  async spendAce() {
    ui.notifications.info("Usa el botón \"As\" del mensaje de chat de la tirada que quieras repetir.");
  }

  async restAfterScuffle() {
    const formData = await waitForDialog({
      title: "Descanso tras una refriega",
      content: `
        <form class="fs-dialog-grid fs-dialog-checkboxes">
          <label><input type="checkbox" name="smoke"/> Fumar</label>
          <label><input type="checkbox" name="drink"/> Beber</label>
          <label><input type="checkbox" name="nap"/> Siesta</label>
        </form>
      `,
      parse: (html) => ({
        smoke: html.find('[name="smoke"]').is(":checked"),
        drink: html.find('[name="drink"]').is(":checked"),
        nap: html.find('[name="nap"]').is(":checked"),
      }),
    });
    if (!formData) return;

    if (this.system.miserable) {
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: "Descanso tras una refriega",
          outcome: "Los personajes Miserables no recuperan HP al descansar.",
        }),
      });
      return;
    }

    const bonus = Number(formData.smoke) + Number(formData.drink) + Number(formData.nap);
    const roll = await new Roll(buildRollFormula("1d4", bonus)).evaluate();
    const hpMax = numberOr(this.system.hp?.max, 0);
    const currentHp = numberOr(this.system.hp?.value, 0);
    const healedHp = clamp(currentHp + roll.total, currentHp, hpMax);

    await this.update({ "system.hp.value": healedHp });
    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Descanso tras una refriega",
        subtitle: `HP actuales: ${healedHp}/${hpMax}`,
        outcome: `Recuperas ${roll.total} HP.`,
      }),
    });
  }

  async fullRest() {
    const formData = await waitForDialog({
      title: "Descanso completo",
      content: `
        <form class="fs-dialog-grid fs-dialog-checkboxes">
          <label><input type="checkbox" name="sleep" checked/> Dormir</label>
          <label><input type="checkbox" name="food" checked/> Comida</label>
          <label><input type="checkbox" name="fun" checked/> Entretenimiento</label>
          <label><input type="checkbox" name="comfort"/> Comodidad, buena comida, bebida, cama o compañía</label>
        </form>
      `,
      parse: (html) => ({
        sleep: html.find('[name="sleep"]').is(":checked"),
        food: html.find('[name="food"]').is(":checked"),
        fun: html.find('[name="fun"]').is(":checked"),
        comfort: html.find('[name="comfort"]').is(":checked"),
      }),
    });
    if (!formData) return;

    if (this.system.miserable) {
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: "Descanso completo",
          outcome: "Los personajes Miserables no recuperan HP al descansar.",
        }),
      });
      return;
    }

    const comforts = Number(formData.sleep) + Number(formData.food) + Number(formData.fun);
    const multiplier = formData.comfort ? 2 : 1;
    const recovered = comforts * 2 * multiplier;
    const hpMax = numberOr(this.system.hp?.max, 0);
    const currentHp = numberOr(this.system.hp?.value, 0);
    const healedHp = clamp(currentHp + recovered, currentHp, hpMax);

    await this.update({ "system.hp.value": healedHp });
    await ChatMessage.create({
      speaker: this.speaker,
      content: createChatFlavor({
        title: "Descanso completo",
        subtitle: `HP actuales: ${healedHp}/${hpMax}`,
        outcome: `Recuperas ${recovered} HP.`,
      }),
    });
  }

  async rollDropCheck({ negativeHp = this.negativeHp, skipDialog = false } = {}) {
    let appliedNegativeHp = negativeHp;
    if (!skipDialog) {
      const formData = await waitForDialog({
        title: "Chequeo de caída",
        content: `
          <form class="fs-dialog-grid">
            <label>HP negativos</label>
            <select name="negativeHp">${optionList(FS.negativeHpOptions, (value) => value, this.negativeHp)}</select>
          </form>
        `,
        parse: (html) => ({
          negativeHp: numberOr(html.find('[name="negativeHp"]').val(), this.negativeHp),
        }),
      });
      if (!formData) return;
      appliedNegativeHp = formData.negativeHp;
    }

    const grit = this.getAbilityScore("grit");
    const roll = await new Roll(buildRollFormula("1d20", grit - appliedNegativeHp)).evaluate();
    const outcome =
      roll.total <= 10
        ? "Inconsciente hasta volver a 1 HP o más."
        : "Permaneces con tus HP actuales.";

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Chequeo de caída",
        subtitle: `${formatRollResult(roll)} | penalizador: -${appliedNegativeHp}`,
        outcome,
      }),
    });
  }

  async rollDeathCheck({ negativeHp = this.negativeHp, skipDialog = false } = {}) {
    let appliedNegativeHp = negativeHp;
    if (!skipDialog) {
      const formData = await waitForDialog({
        title: "Chequeo de muerte",
        content: `
          <form class="fs-dialog-grid">
            <label>HP negativos</label>
            <select name="negativeHp">${optionList(FS.negativeHpOptions, (value) => value, this.negativeHp)}</select>
          </form>
        `,
        parse: (html) => ({
          negativeHp: numberOr(html.find('[name="negativeHp"]').val(), this.negativeHp),
        }),
      });
      if (!formData) return;
      appliedNegativeHp = formData.negativeHp;
    }

    const grit = this.getAbilityScore("grit");
    const roll = await new Roll(buildRollFormula("1d20", grit - appliedNegativeHp)).evaluate();
    const natural = getActiveD20Result(roll);

    let outcome = "";
    let details = "";

    if (natural === 1) {
      outcome = "Pifia mortal. Muerto, y de una manera todavía peor.";
    } else if (natural === 20) {
      const recoveryRoll = await new Roll("1d4").evaluate();
      await this.update({
        "system.hp.max": numberOr(this.system.hp?.max, 0) + 1,
        "system.hp.value": numberOr(this.system.hp?.value, 0) + recoveryRoll.total,
      });
      outcome = "Segundo aliento.";
      details = `Aumenta tu HP máximo en 1 y recupera ${recoveryRoll.total} HP.`;
    } else if (roll.total <= 1) {
      outcome = "Muerto. Hasta aquí llegó el camino.";
    } else if (roll.total <= 5) {
      const timerRoll = await new Roll("1d6").evaluate();
      const timer = {
        1: "d10 minutos",
        2: "d10 minutos",
        3: "d8 horas",
        4: "d8 horas",
        5: "d6 días",
        6: "d4 semanas",
      }[timerRoll.total];
      outcome = "Condenado.";
      details = `Morirás en ${timer}.`;
    } else if (roll.total <= 10) {
      outcome = "Fuera de combate hasta volver a 1 HP o más.";
    } else if (roll.total <= 15) {
      const abilityIndex = await new Roll("1d4").evaluate();
      const abilityKey = ABILITY_KEYS[abilityIndex.total - 1];
      const abilityValue = this.getAbilityScore(abilityKey);
      const swing = await new Roll("1d6").evaluate();
      let delta = 0;
      if (swing.total === 1) delta = -1;
      else if (swing.total > abilityValue) delta = 1;
      else if (swing.total < abilityValue) delta = -1;

      if (delta !== 0) {
        const currentValue = numberOr(this.system.abilities?.[abilityKey], 0);
        await this.update({
          [`system.abilities.${abilityKey}`]: delta < 0 ? Math.max(-6, currentValue + delta) : currentValue + delta,
        });
      }

      outcome = "Una lección para bien o para mal.";
      details = `${delta >= 0 ? "Aumenta" : "Disminuye"} ${getAbilityLabel(abilityKey)} en ${Math.abs(delta || 1)}.`;
    } else {
      outcome = "Aguantas. Permaneces con tus HP actuales.";
    }

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Chequeo de muerte",
        subtitle: `${formatRollResult(roll)} | penalizador: -${appliedNegativeHp}`,
        outcome,
        details,
      }),
    });
  }

  _ammoRecoveryOptions() {
    const ownedAmmo = this.items.filter((item) => item.type === "ammo");
    const options = ownedAmmo.map((item) => ({
      label: item.name,
      value: item.id,
      auto: item.getFlag(FS.systemId, "catalogId") === "arrows",
    }));

    if (this.items.some((item) => this._isSpentThrownWeapon(item))) {
      options.push({
        label: "Cuchillos arrojadizos",
        value: "throwing-knives",
        auto: true,
      });
    }

    return options;
  }

  async recoverAmmo() {
    const options = this._ammoRecoveryOptions();
    if (!options.length) {
      ui.notifications.warn("No tienes tipos de munición que recuperar.");
      return;
    }

    const formData = await waitForDialog({
      title: "Recuperar munición",
      content: `
        <form class="fs-dialog-grid">
          <label>Munición</label>
          <select name="ammo">
            ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
          </select>
        </form>
      `,
      parse: (html) => ({
        ammo: html.find('[name="ammo"]').val() || options[0].value,
      }),
    });
    if (!formData) return;

    const selected = options.find((option) => option.value === formData.ammo);
    if (!selected) return;

    if (selected.value === "throwing-knives") {
      const knives = this.items.find((item) => item.getFlag(FS.systemId, "catalogId") === "throwing-knives");
      if (knives) {
        await knives.unsetFlag(FS.systemId, "spent");
      }
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: "Recuperar munición",
          outcome: "Recuperas los cuchillos arrojadizos sin tirada.",
        }),
      });
      return;
    }

    const ammoItem = this.items.get(selected.value);
    if (!ammoItem) return;

    if (selected.auto) {
      await ammoItem.update({ "system.quantity": numberOr(ammoItem.system.quantity, 1) + 1 });
      await ChatMessage.create({
        speaker: this.speaker,
        content: createChatFlavor({
          title: "Recuperar munición",
          outcome: `Recuperas una ranura de ${ammoItem.name} sin tirada.`,
        }),
      });
      return;
    }

    const roll = await new Roll(buildRollFormula("1d20", this.getAbilityScore("luck"))).evaluate();
    const success = roll.total >= 12;
    if (success) {
      await ammoItem.update({ "system.quantity": numberOr(ammoItem.system.quantity, 1) + 1 });
    }

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Recuperar munición",
        subtitle: `DR 12 | ${formatRollResult(roll)}`,
        outcome: success
          ? `Recuperas una ranura de ${ammoItem.name}.`
          : `No recuperas ${ammoItem.name}.`,
      }),
    });
  }

  async rollMorale() {
    const roll = await new Roll("2d6").evaluate();
    const threshold = numberOr(this.system.morale, 7);
    const key = roll.total > threshold ? "Huye o se rinde" : "Se mantiene firme";

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Moral",
        subtitle: `Umbral ${threshold}`,
        outcome: key,
      }),
    });
  }

  async rollReaction() {
    const roll = await new Roll("2d6").evaluate();
    let key = "";
    if (roll.total <= 3) key = "Matar o capturar a los PJ";
    else if (roll.total <= 6) key = "Irritado";
    else if (roll.total <= 8) key = "Apático";
    else if (roll.total <= 10) key = "Algo amigable";
    else key = "Aparentemente amistoso";

    await roll.toMessage({
      speaker: this.speaker,
      flavor: createChatFlavor({
        title: "Reacción",
        outcome: key,
      }),
    });
  }
}
