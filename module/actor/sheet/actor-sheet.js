import { FS } from "../../config.js";
import { slotKeys } from "../../utils.js";

export default class FSActorSheet extends foundry.appv1.sheets.ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      resizable: true,
    });
  }

  async getData(options = {}) {
    const data = await super.getData(options);
    data.actor = this.actor;
    data.system = this.actor.system;
    data.config = FS;
    data.tooltips = FS.tooltips;
    data.abilityEntries = Object.entries(FS.abilities).map(([key, config]) => ({
      key,
      label: config.label,
      value: this.actor.system.abilities?.[key] ?? 0,
      tooltip: FS.tooltips[key] ?? "",
    }));

    if (this.actor.type === "character") {
      data.wantedOptions = FS.wantedStates;
      const currentMisery = String(this.actor.system.misery || "").trim();
      data.miseryOptions = [...FS.miseryOptions];
      if (
        currentMisery &&
        !data.miseryOptions.some((entry) => entry.key === currentMisery)
      ) {
        data.miseryOptions.push({ key: currentMisery, label: currentMisery });
      }
      data.skillEntries = slotKeys("skill", 6).map((key) => ({
        key,
        value: this.actor.system[key] || "",
      }));
      data.conditionEntries = this._slotEntries("conditionSlot", 3, "condition");
      data.beltEntries = this._slotEntries("beltSlot", 3, "belt");
      data.backEntries = this._slotEntries("backSlot", 3, "back");
      data.pocketEntries = this._slotEntries("pocketSlot", 10, "pocket");
      data.headEntry = this._slotEntries("headSlot", 1, "head")[0];
      data.skillSuggestions = FS.skillSuggestions;
    }

    if (this.actor.type === "horse") {
      data.horseEntries = this._slotEntries("slot", 10, "horse");
    }

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    this._migrateLegacySlots();
    html.find(".slot-use").on("click", this._onUseSlot.bind(this));
    html.find(".slot-sacrifice").on("click", this._onSacrificeSlot.bind(this));
    html.find(".slot-open").on("click", this._onOpenSlotItem.bind(this));
    html.find(".slot-delete").on("click", this._onDeleteSlot.bind(this));
    html.find(".skill-use").on("click", this._onUseSkill.bind(this));
  }

  _slotEntries(prefix, count, group) {
    return Array.from({ length: count }, (_, index) => {
      const key = count === 1 ? prefix : `${prefix}${index + 1}`;
      const idKey = `${key}Id`;
      const itemId = this.actor.system[idKey] || "";
      const item = itemId ? this.actor.items.get(itemId) : null;
      const value = this.actor.system[key] || "";
      const tooltip = item ? this._buildItemTooltip(item) : FS.tooltips[group] ?? "";
      const resourceLabel =
        item?.type === "ammo" ? String(Number(item.system.quantity) || 0) : "";
      const resourceTooltip =
        item?.type === "ammo"
          ? `Ranuras disponibles de ${item.name}: ${resourceLabel}`
          : "";
      return {
        key,
        idKey,
        value,
        item,
        itemId,
        canUse: ["weapon", "medical"].includes(item?.type),
        canSacrificeHat: item?.type === "protection" && item?.system?.protectionClass === "hat",
        canOpen: Boolean(item),
        canDelete: Boolean(item),
        resourceLabel,
        resourceTooltip,
        tooltip,
      };
    });
  }

  _buildItemTooltip(item) {
    const lines = [item.name];
    const labelFor = (entries, key) => entries.find((entry) => entry.key === key)?.label || key;

    if (item.system.summary) lines.push(item.system.summary);

    if (item.type === "weapon") {
      if (item.system.weaponClass) lines.push(`Clase: ${labelFor(FS.weaponClasses, item.system.weaponClass)}`);
      if (item.system.damage) lines.push(`Daño: ${item.system.damage}`);
      if (item.system.range) lines.push(`Alcance: ${item.system.range}`);
      if (item.system.hands) lines.push(`Manos: ${item.system.hands}`);
      if (item.system.ammo) lines.push(`Munición: ${item.system.ammo}`);
      if (item.getFlag(FS.systemId, "spent")) lines.push("Gastado: debes recuperarlo antes de volver a usarlo.");
    }

    if (item.type === "medical") {
      if (item.system.healing) lines.push(`Efecto: ${item.system.healing}`);
      if (Number.isFinite(Number(item.system.uses))) lines.push(`Usos: ${item.system.uses}`);
    }

    if (item.type === "protection") {
      if (item.system.protectionClass) {
        lines.push(`Clase: ${labelFor(FS.protectionClasses, item.system.protectionClass)}`);
      }
      if (item.system.reduction) lines.push(`Protección: ${item.system.reduction}`);
    }

    if (item.type === "ammo") {
      if (item.system.ammoClass) lines.push(`Tipo: ${labelFor(FS.ammoClasses, item.system.ammoClass)}`);
      if (Number.isFinite(Number(item.system.quantity))) lines.push(`Cantidad: ${item.system.quantity}`);
    }

    if (item.type === "condition") {
      lines.push("Condición activa.");
    }

    if (Number(item.system.cost) > 0) {
      lines.push(`Coste: ${item.system.cost} S`);
    }

    if (item.system.notes) lines.push(item.system.notes);

    return lines.filter(Boolean).join("\n");
  }

  async _onUseSlot(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;
    await this.actor.useOwnedItem(itemId);
  }

  async _onOpenSlotItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;
    const item = this.actor.items.get(itemId);
    item?.sheet?.render?.(true);
  }

  async _onSacrificeSlot(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    if (!itemId) return;
    await this.actor.sacrificeHat(itemId);
  }

  async _onDeleteSlot(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    const key = event.currentTarget.dataset.slotKey;
    if (!itemId || !key) return;

    const idKey = `${key}Id`;
    await this.actor.update({
      [`system.${key}`]: "",
      [`system.${idKey}`]: "",
    });

    const item = this.actor.items.get(itemId);
    if (item) {
      await item.delete();
    }
  }

  async _onUseSkill(event) {
    event.preventDefault();
    const skill = event.currentTarget.dataset.skill?.trim();
    if (!skill) {
      ui.notifications.warn("Escribe una habilidad antes de usarla.");
      return;
    }
    await this.actor.skillCheck(skill);
  }

  async _migrateLegacySlots() {
    if (this._migratingLegacySlots) return;
    const slotKeysToMigrate =
      this.actor.type === "character"
        ? [
            "headSlot",
            ...slotKeys("conditionSlot", 3),
            ...slotKeys("beltSlot", 3),
            ...slotKeys("backSlot", 3),
            ...slotKeys("pocketSlot", 10),
          ]
        : this.actor.type === "horse"
          ? slotKeys("slot", 10)
          : [];

    if (!slotKeysToMigrate.length) return;

    const updates = {};
    this._migratingLegacySlots = true;
    try {
      for (const key of slotKeysToMigrate) {
        const idKey = `${key}Id`;
        const currentValue = this.actor.system[key];
        if (!currentValue || this.actor.system[idKey]) continue;

        let item = this.actor.items.find((entry) => entry.name === currentValue);
        if (!item) {
          const worldItem = game.items.find((entry) => entry.name === currentValue);
          if (worldItem) {
            item = await this._ensureOwnedItem(worldItem);
          }
        }

        if (item) {
          updates[`system.${idKey}`] = item.id;
        }
      }

      if (Object.keys(updates).length) {
        await this.actor.update(updates);
      }
    } finally {
      this._migratingLegacySlots = false;
    }
  }

  async _onDropItem(event, data) {
    event.preventDefault();
    if (!["character", "horse"].includes(this.actor.type)) {
      return super._onDropItem(event, data);
    }

    let item = data;
    if (!item.system && data.uuid) {
      const document = await fromUuid(data.uuid);
      item = document?.toObject?.() ?? data;
    }
    if (!item?.system) {
      return super._onDropItem(event, data);
    }

    if (this.actor.type === "horse") {
      return this._assignHorseSlot(item);
    }
    return this._assignCharacterSlot(event, item);
  }

  async _ensureOwnedItem(item) {
    if (item.parent?.id === this.actor.id) return item;
    const source = item.toObject ? item.toObject() : item;
    const [created] = await this.actor.createEmbeddedDocuments("Item", [source]);
    return created;
  }

  async _assignCharacterSlot(event, item) {
    const explicitGroup = event.target.closest("[data-slot-group]")?.dataset?.slotGroup;
    const preferredGroup =
      item.type === "condition" ? "condition" : explicitGroup || item.system.slot || "pocket";
    const groups = {
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

    if (explicitGroup === "condition" && item.type !== "condition") {
      ui.notifications.warn("En esa zona solo puedes soltar condiciones.");
      return;
    }

    const field = groups[preferredGroup]?.find((key) => !this.actor.system[key]);
    if (!field) {
      ui.notifications.warn("No queda ningun hueco libre en esa zona.");
      return;
    }

    const ownedItem = await this._ensureOwnedItem(item);
    await this.actor.update({
      [`system.${field}`]: ownedItem.name,
      [`system.${field}Id`]: ownedItem.id,
    });
  }

  async _assignHorseSlot(item) {
    const field = Array.from({ length: 10 }, (_, index) => `slot${index + 1}`).find(
      (key) => !this.actor.system[key],
    );
    if (!field) {
      ui.notifications.warn("No quedan huecos libres en la montura.");
      return;
    }

    const ownedItem = await this._ensureOwnedItem(item);
    await this.actor.update({
      [`system.${field}`]: ownedItem.name,
      [`system.${field}Id`]: ownedItem.id,
    });
  }
}
