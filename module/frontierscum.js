import { FSActor } from "./actor/actor.js";
import { FSCharacterSheet } from "./actor/sheet/character-sheet.js";
import { FSHorseSheet } from "./actor/sheet/horse-sheet.js";
import { FSNpcSheet } from "./actor/sheet/npc-sheet.js";
import { registerItemDirectoryButton, seedItemCatalog } from "./catalog.js";
import { FS } from "./config.js";
import { FSItem } from "./item/item.js";
import { FSItemSheet } from "./item/sheet/item-sheet.js";
import { migrateGeneratedCharacters, registerActorDirectoryButton } from "./random-character.js";
import { configureHandlebars } from "./handlebars.js";
import { registerRulesJournalButton, seedRulesJournals } from "./rules-journals.js";

const ensureTranslations = async () => {};

Hooks.once("init", async function () {
  console.log("Inicializando Frontier Scum en Castellano");
  await ensureTranslations();

  game.frontierscumEs = {
    config: FS,
    FSActor,
    FSItem,
  };

  CONFIG.Actor.documentClass = FSActor;
  CONFIG.Item.documentClass = FSItem;
  CONFIG.FS = FS;

  foundry.documents.collections.Actors.unregisterSheet(
    "core",
    foundry.appv1.sheets.ActorSheet,
  );
  foundry.documents.collections.Actors.registerSheet(FS.systemId, FSCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Hoja de personaje",
  });
  foundry.documents.collections.Actors.registerSheet(FS.systemId, FSHorseSheet, {
    types: ["horse"],
    makeDefault: true,
    label: "Hoja de montura",
  });
  foundry.documents.collections.Actors.registerSheet(FS.systemId, FSNpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "Hoja de PNJ",
  });

  foundry.documents.collections.Items.unregisterSheet(
    "core",
    foundry.appv1.sheets.ItemSheet,
  );
  foundry.documents.collections.Items.registerSheet(FS.systemId, FSItemSheet, {
    makeDefault: true,
    label: "Hoja de objeto",
  });

  configureHandlebars();
  registerActorDirectoryButton();
  registerItemDirectoryButton();
  registerRulesJournalButton();
});

Hooks.once("ready", async function () {
  if (!game.user.isGM) return;
  await seedItemCatalog(true);
  await seedRulesJournals(true);
  await migrateGeneratedCharacters(true);
});

Hooks.on("renderChatMessageHTML", (message, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  const resolveSingleTarget = () => {
    const targets = Array.from(game.user.targets ?? []);
    if (targets.length !== 1) {
      ui.notifications.warn("Marca exactamente un objetivo antes de aplicar daño.");
      return null;
    }
    const actor = targets[0]?.actor;
    if (!actor) {
      ui.notifications.warn("El objetivo marcado no tiene actor.");
      return null;
    }
    return actor;
  };

  const currentTargetActor = () => {
    const targets = Array.from(game.user.targets ?? []);
    if (targets.length !== 1) return null;
    return targets[0]?.actor ?? null;
  };

  const resolveSourceName = (button) =>
    button.closest(".fs-chat-card")?.querySelector(".fs-chat-title")?.textContent?.trim() ||
    message?.speaker?.alias ||
    "Aplicar daño";

  root.querySelectorAll(".fs-apply-damage").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const actor = resolveSingleTarget();
      if (!actor?.applyTargetedDamage) return;
      const damage = Number(event.currentTarget.dataset.damage) || 0;
      await actor.applyTargetedDamage({
        damage,
        sourceName: resolveSourceName(event.currentTarget),
        useHat: false,
      });
    });
  });

  root.querySelectorAll(".fs-roll-weapon-damage").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const actorId = event.currentTarget.dataset.actorId;
      const itemId = event.currentTarget.dataset.itemId;
      const formula = event.currentTarget.dataset.formula;
      const actor = game.actors.get(actorId);
      if (!actor?.rollWeaponDamage) return;
      await actor.rollWeaponDamage({ itemId, formula });
    });
  });

  root.querySelectorAll(".fs-block-attack-hat").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const targetActorId = event.currentTarget.dataset.targetActorId;
      const actor = game.actors.get(targetActorId);
      if (!actor?.sacrificeHat) return;
      await actor.sacrificeHat(
        null,
        event.currentTarget.dataset.sourceName || resolveSourceName(event.currentTarget),
      );
      root.querySelectorAll(".fs-roll-weapon-damage, .fs-block-attack-hat").forEach((entry) => entry.remove());
    });
  });

  root.querySelectorAll(".fs-spend-ace-roll").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const actorId = event.currentTarget.dataset.actorId;
      const contextText = event.currentTarget.dataset.context;
      if (!actorId || !contextText) return;
      const actor = game.actors.get(actorId);
      if (!actor?.rerollWithAce) return;

      try {
        const context = JSON.parse(decodeURIComponent(contextText));
        await actor.rerollWithAce(context);
        root.querySelectorAll(".fs-spend-ace-roll").forEach((entry) => entry.remove());
      } catch (error) {
        console.error("Frontier Scum ES | No se pudo repetir la tirada con un As", error);
        ui.notifications.error("No se pudo repetir la tirada con un As.");
      }
    });
  });

  root.querySelectorAll(".fs-recover-hat").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const actorId = event.currentTarget.dataset.actorId;
      const actor = game.actors.get(actorId);
      if (!actor?.recoverLostHat) return;
      await actor.recoverLostHat();
      root.querySelectorAll(".fs-recover-hat").forEach((entry) => entry.remove());
    });
  });
});
