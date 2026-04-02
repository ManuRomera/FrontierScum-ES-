export class FSItem extends Item {
  get isUsable() {
    return ["weapon", "medical"].includes(this.type);
  }

  async use() {
    if (!this.isUsable) return;

    if (this.actor) {
      return this.actor.useOwnedItem(this.id);
    }

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: `<div class="fs-chat-card"><div class="fs-chat-title">${this.name}</div><div class="fs-chat-details">Arrastra este objeto a una ficha para poder usarlo desde el sistema.</div></div>`,
    });
  }
}
