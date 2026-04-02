import { FS } from "../../config.js";
import FSActorSheet from "./actor-sheet.js";

export class FSNpcSheet extends FSActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["frontierscum", "sheet", "actor", "npc"],
      template: `systems/${FS.systemId}/templates/actor/npc-sheet.html`,
      width: 720,
      height: 520,
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".reaction-button").on("click", (event) => {
      event.preventDefault();
      this.actor.rollReaction();
    });
    html.find(".morale-button").on("click", (event) => {
      event.preventDefault();
      this.actor.rollMorale();
    });
  }
}
