import { FS } from "../../config.js";
import FSActorSheet from "./actor-sheet.js";

export class FSHorseSheet extends FSActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["frontierscum", "sheet", "actor", "horse"],
      template: `systems/${FS.systemId}/templates/actor/horse-sheet.html`,
      width: 620,
      height: 820,
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".morale-button").on("click", (event) => {
      event.preventDefault();
      this.actor.rollMorale();
    });
  }
}
