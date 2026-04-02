import { FS } from "../../config.js";
import FSActorSheet from "./actor-sheet.js";

export class FSCharacterSheet extends FSActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["frontierscum", "sheet", "actor", "character"],
      template: `systems/${FS.systemId}/templates/actor/character-sheet.html`,
      width: 820,
      height: 1080,
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".ability-name").on("click", this._onAbilityClick.bind(this));
    html.find(".fs-rest-brawl").on("click", (event) => {
      event.preventDefault();
      this.actor.restAfterScuffle();
    });
    html.find(".fs-rest-full").on("click", (event) => {
      event.preventDefault();
      this.actor.fullRest();
    });
    html.find(".fs-drop-check").on("click", (event) => {
      event.preventDefault();
      this.actor.rollDropCheck();
    });
    html.find(".fs-death-check").on("click", (event) => {
      event.preventDefault();
      this.actor.rollDeathCheck();
    });
    html.find(".fs-recover-ammo").on("click", (event) => {
      event.preventDefault();
      this.actor.recoverAmmo();
    });
  }

  _onAbilityClick(event) {
    event.preventDefault();
    this.actor.abilityCheck(event.currentTarget.dataset.ability);
  }
}
