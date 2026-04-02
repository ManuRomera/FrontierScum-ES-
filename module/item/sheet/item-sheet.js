import { FS } from "../../config.js";

export class FSItemSheet extends foundry.appv1.sheets.ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["frontierscum", "sheet", "item"],
      template: `systems/${FS.systemId}/templates/item/item-sheet.html`,
      width: 760,
      height: 460,
    });
  }

  async getData(options = {}) {
    const data = await super.getData(options);
    data.item = this.item;
    data.system = this.item.system;
    data.config = FS;
    data.slotTypes = FS.slotTypes;
    data.weaponClasses = FS.weaponClasses;
    data.protectionClasses = FS.protectionClasses;
    data.ammoClasses = FS.ammoClasses;
    data.itemTypeLabel = FS.itemTypeLabels[this.item.type] ?? this.item.type;
    data.tooltips = FS.tooltips;
    data.isUsable = this.item.isUsable;
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".use-item").on("click", async (event) => {
      event.preventDefault();
      await this.item.use();
    });
  }
}
