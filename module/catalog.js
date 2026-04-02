import { FS } from "./config.js";

const catalog = [
  {
    id: "pocket-pistol",
    name: "Pistola de faltriquera",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/gun-pistol-brown.webp",
    system: {
      cost: 10,
      damage: "d6",
      ammo: "balas-de-pistola",
      hands: "1",
      range: "Corta",
      slot: "belt",
      summary: "Cabe en un bolsillo.",
      weaponClass: "gun",
    },
  },
  {
    id: "revolver",
    name: "Revólver",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/gun-pistol-wood.webp",
    system: {
      cost: 15,
      damage: "d6!",
      ammo: "balas-de-pistola",
      hands: "1",
      range: "Media",
      slot: "belt",
      summary: "Daño explosivo al sacar el máximo.",
      weaponClass: "gun",
    },
  },
  {
    id: "rat-rifle",
    name: "Rifle de ratas",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/rifle-brown.webp",
    system: {
      cost: 10,
      damage: "d4!",
      ammo: "cartuchos-de-rifle",
      hands: "2",
      range: "Media",
      slot: "back",
      summary: "Ligero, feo y bastante fiable.",
      weaponClass: "gun",
    },
  },
  {
    id: "repeater-rifle",
    name: "Rifle de repetición",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/rifle-fluted.webp",
    system: {
      cost: 30,
      damage: "d6!",
      ammo: "cartuchos-de-rifle",
      hands: "2",
      range: "Media",
      slot: "back",
      summary: "Un clásico de la frontera.",
      weaponClass: "gun",
    },
  },
  {
    id: "hunting-rifle",
    name: "Rifle de caza",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/rifle-white.webp",
    system: {
      cost: 20,
      damage: "d8",
      ammo: "cartuchos-de-rifle",
      hands: "2",
      range: "Larga",
      slot: "back",
      summary: "Disparo potente a distancia.",
      weaponClass: "gun",
    },
  },
  {
    id: "long-rifle",
    name: "Rifle largo",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/rifle-bayonet.webp",
    system: {
      cost: 60,
      damage: "d10",
      ammo: "cartuchos-de-rifle",
      hands: "2",
      range: "Muy larga",
      slot: "back",
      summary: "Pesado y preciso a larga distancia.",
      weaponClass: "gun",
    },
  },
  {
    id: "sawed-off",
    name: "Escopeta recortada",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/gun-topbarrel.webp",
    system: {
      cost: 10,
      damage: "d4 / 2d4",
      ammo: "cartuchos-de-escopeta",
      hands: "2",
      range: "Corta",
      slot: "belt",
      summary: "Ambos cañones a la vez.",
      weaponClass: "gun",
    },
  },
  {
    id: "double-shotgun",
    name: "Escopeta de dos cañones",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/guns/gun-double-barrel.webp",
    system: {
      cost: 20,
      damage: "d6 / 2d6",
      ammo: "cartuchos-de-escopeta",
      hands: "2",
      range: "Corta",
      slot: "back",
      summary: "Ambos cañones a la vez.",
      weaponClass: "gun",
    },
  },
  {
    id: "bow",
    name: "Arco",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/bows/shortbow-recurve.webp",
    system: {
      cost: 8,
      damage: "d6",
      ammo: "flechas",
      hands: "2",
      range: "Media",
      slot: "back",
      summary: "Las flechas suelen recuperarse.",
      weaponClass: "ranged",
    },
  },
  {
    id: "throwing-knives",
    name: "Cuchillos arrojadizos",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/daggers/knife-engraved-black.webp",
    system: {
      cost: 5,
      damage: "d4!",
      ammo: "",
      hands: "1",
      range: "Corta",
      slot: "belt",
      summary: "Un hueco completo; suelen recuperarse.",
      weaponClass: "thrown",
    },
  },
  {
    id: "fire-bottle",
    name: "Botella incendiaria",
    type: "weapon",
    folder: "Armas",
    img: "icons/consumables/potions/bottle-round-corked-red.webp",
    system: {
      cost: 6,
      damage: "d4!",
      ammo: "",
      hands: "1",
      range: "Corta",
      slot: "pocket",
      summary: "Daña también a criaturas adyacentes.",
      weaponClass: "thrown",
    },
  },
  {
    id: "dynamite",
    name: "Cartucho de dinamita",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/thrown/bomb-fuse-red-black.webp",
    system: {
      cost: 12,
      damage: "d4! + 4",
      ammo: "",
      hands: "1",
      range: "Corta",
      slot: "pocket",
      summary: "Daña también a criaturas adyacentes.",
      weaponClass: "thrown",
    },
  },
  {
    id: "knife",
    name: "Navaja",
    type: "weapon",
    folder: "Armas",
    img: "icons/weapons/daggers/dagger-simple-black.webp",
    system: {
      cost: 5,
      damage: "d4",
      ammo: "",
      hands: "1",
      range: "Melé",
      slot: "belt",
      summary: "Ligera y rápida.",
      weaponClass: "melee",
    },
  },
  {
    id: "hat",
    name: "Sombrero",
    type: "protection",
    folder: "Protección",
    img: "icons/equipment/head/hat-belted-simple-brown.webp",
    system: {
      cost: 10,
      slot: "head",
      reduction: "Ignora un golpe al perderlo.",
      protectionClass: "hat",
      summary: "Se pierde para ignorar el daño.",
    },
  },
  {
    id: "thick-coat",
    name: "Abrigo grueso",
    type: "protection",
    folder: "Protección",
    img: "icons/equipment/back/cloak-brown-fur-brown.webp",
    system: {
      cost: 10,
      slot: "back",
      reduction: "-1 daño",
      protectionClass: "armor",
      summary: "Pieles, abrigo o armadura ligera.",
    },
  },
  {
    id: "shield",
    name: "Escudo",
    type: "protection",
    folder: "Protección",
    img: "icons/equipment/shield/heater-wooden-boss-brown.webp",
    system: {
      cost: 5,
      slot: "back",
      reduction: "-1 daño",
      protectionClass: "shield",
      summary: "Ocupa las manos cuando se usa.",
    },
  },
  {
    id: "pistol-slugs",
    name: "Balas de pistola",
    type: "ammo",
    folder: "Munición",
    img: "icons/weapons/ammunition/bullets-cartridge-shell-gray.webp",
    system: {
      cost: 5,
      slot: "pocket",
      quantity: 1,
      ammoClass: "pistol",
      summary: "Un hueco de munición.",
    },
  },
  {
    id: "rifle-rounds",
    name: "Cartuchos de rifle",
    type: "ammo",
    folder: "Munición",
    img: "icons/containers/ammunition/bullets-belt.webp",
    system: {
      cost: 5,
      slot: "pocket",
      quantity: 1,
      ammoClass: "rifle",
      summary: "Un hueco de munición.",
    },
  },
  {
    id: "shotgun-shells",
    name: "Cartuchos de escopeta",
    type: "ammo",
    folder: "Munición",
    img: "icons/containers/ammunition/shot-barrel.webp",
    system: {
      cost: 5,
      slot: "pocket",
      quantity: 1,
      ammoClass: "shotgun",
      summary: "Un hueco de munición.",
    },
  },
  {
    id: "arrows",
    name: "Flechas",
    type: "ammo",
    folder: "Munición",
    img: "icons/weapons/ammunition/arrows-broadhead-white.webp",
    system: {
      cost: 5,
      slot: "back",
      quantity: 1,
      ammoClass: "arrow",
      summary: "Un carcaj o manojo de flechas.",
    },
  },
  {
    id: "laudanum",
    name: "Láudano",
    type: "medical",
    folder: "Curación",
    img: "icons/consumables/potions/bottle-corked-red.webp",
    system: {
      cost: 10,
      slot: "pocket",
      healing: "Recupera d4 HP; te emborrachas si no curas al máximo.",
      uses: 4,
      summary: "4 usos.",
    },
  },
  {
    id: "injury-kit",
    name: "Botiquín de heridas",
    type: "medical",
    folder: "Curación",
    img: "icons/containers/bags/pack-leather-red.webp",
    system: {
      cost: 10,
      slot: "back",
      healing: "Te devuelve a 0 HP + Seso del doctor.",
      uses: 4,
      summary: "4 usos.",
    },
  },
  {
    id: "doctors-bag",
    name: "Maletín de doctor",
    type: "medical",
    folder: "Curación",
    img: "icons/containers/bags/case-simple-leather-brown.webp",
    system: {
      cost: 20,
      slot: "back",
      healing: "Recupera d6 + Seso del doctor HP.",
      uses: 6,
      summary: "6 usos.",
    },
  },
  {
    id: "gin-pills",
    name: "Píldoras de ginebra",
    type: "medical",
    folder: "Curación",
    img: "icons/consumables/potions/potion-vial-tube-yellow.webp",
    system: {
      cost: 10,
      slot: "pocket",
      healing: "Recupera d4 HP, pero solo mientras estás borracho.",
      uses: 8,
      summary: "8 usos.",
    },
  },
  {
    id: "healthful-bitters",
    name: "Bíteres saludables",
    type: "medical",
    folder: "Curación",
    img: "icons/consumables/potions/bottle-corked-green.webp",
    system: {
      cost: 6,
      slot: "pocket",
      healing: "Recupera d4 HP y con 3+ también cura Miserable.",
      uses: 1,
      summary: "1 uso.",
    },
  },
  {
    id: "opium-tincture",
    name: "Tintura de opio",
    type: "medical",
    folder: "Curación",
    img: "icons/consumables/potions/bottle-bulb-corked-purple.webp",
    system: {
      cost: 10,
      slot: "pocket",
      healing: "Recupera d10 HP; DR18 Aplomo o caes en sueño profundo.",
      uses: 4,
      summary: "4 usos.",
    },
  },
  {
    id: "condition-poison",
    name: "Veneno",
    type: "condition",
    folder: "Condiciones",
    img: "icons/skills/toxins/symbol-poison-drop-skull-green.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Toxina, picadura o ponzoña activa.",
      notes: "Aplícala cuando el personaje haya sido envenenado. El DJ decide daño, chequeos o deterioro según la fuente.",
    },
  },
  {
    id: "condition-bleeding",
    name: "Sangrado",
    type: "condition",
    folder: "Condiciones",
    img: "icons/skills/wounds/injury-triple-slash-bleed.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Pierdes sangre de forma visible.",
      notes: "Úsala para recordar heridas abiertas, chorros de sangre o la necesidad de vendar cuanto antes.",
    },
  },
  {
    id: "condition-fever",
    name: "Fiebre",
    type: "condition",
    folder: "Condiciones",
    img: "icons/skills/wounds/illness-disease-glowing-green.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Temblores, sudor y mala cara.",
      notes: "Sirve para marcar fiebre, infección reciente o recuperación penosa tras enfermedad.",
    },
  },
  {
    id: "condition-disease",
    name: "Enfermedad",
    type: "condition",
    folder: "Condiciones",
    img: "icons/skills/wounds/blood-cells-disease-green.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Peste, infección o dolencia seria.",
      notes: "Mantén esta condición mientras el personaje siga enfermo o contagioso.",
    },
  },
  {
    id: "condition-filth",
    name: "Mugre",
    type: "condition",
    folder: "Condiciones",
    img: "icons/magic/death/blood-corruption-vomit-red.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Suciedad, infección o costra acumulada.",
      notes: "Úsala para recordar roña, costras, pus, vómitos o un estado físico especialmente lamentable.",
    },
  },
  {
    id: "condition-hunger",
    name: "Hambre",
    type: "condition",
    folder: "Condiciones",
    img: "icons/consumables/food/dried-fruit-candy-brown.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Llevas demasiado tiempo sin comer.",
      notes: "Marca privación de comida, debilidad por ayuno o penurias de viaje.",
    },
  },
  {
    id: "condition-thirst",
    name: "Sed",
    type: "condition",
    folder: "Condiciones",
    img: "icons/sundries/survival/waterskin-leather-brown.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "La garganta pide agua y ya no negocia.",
      notes: "Perfecta para desiertos, travesías largas o falta de cantimplora.",
    },
  },
  {
    id: "condition-cold",
    name: "Frío",
    type: "condition",
    folder: "Condiciones",
    img: "icons/magic/water/snowflake-ice-gray.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Helado, tiritando o entumecido.",
      notes: "Recuerda tormentas, noches crueles, agua helada o congelación.",
    },
  },
  {
    id: "condition-heat",
    name: "Calor",
    type: "condition",
    folder: "Condiciones",
    img: "icons/magic/fire/flame-burning-skull-orange.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Sofoco, insolación o abrasamiento.",
      notes: "Para desierto, incendios, metal al rojo o jornadas abrasadoras.",
    },
  },
  {
    id: "condition-pain",
    name: "Dolor",
    type: "condition",
    folder: "Condiciones",
    img: "icons/skills/wounds/injury-body-pain-gray.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Dolor agudo o incapacitante.",
      notes: "Marca costillas rotas, hombro desencajado, migraña salvaje o cualquier dolor persistente.",
    },
  },
  {
    id: "condition-curse",
    name: "Maldición",
    type: "condition",
    folder: "Condiciones",
    img: "icons/magic/control/voodoo-doll-pain-damage-purple.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Mal fario, embrujo o condena.",
      notes: "Úsala para marcar maldiciones, juramentos siniestros o efectos sobrenaturales persistentes.",
    },
  },
  {
    id: "condition-deep-sleep",
    name: "Sueño profundo",
    type: "condition",
    folder: "Condiciones",
    img: "icons/magic/control/sleep-bubble-purple.webp",
    system: {
      cost: 0,
      slot: "condition",
      summary: "Dormido sin remedio o narcotizado.",
      notes: "Ideal para opio, golpes en la cabeza, sedantes o desmayos largos.",
    },
  },
  {
    id: "canteen",
    name: "Cantimplora",
    type: "gear",
    folder: "Equipo",
    img: "icons/sundries/survival/waterskin-leather-brown.webp",
    system: {
      cost: 5,
      slot: "belt",
      summary: "Agua o licor para el camino.",
    },
  },
  {
    id: "rope",
    name: "Cuerda",
    type: "gear",
    folder: "Equipo",
    img: "icons/sundries/survival/rope-coiled-brown.webp",
    system: {
      cost: 5,
      slot: "belt",
      summary: "Útil, fea y siempre corta.",
    },
  },
  {
    id: "bean-can",
    name: "Lata de alubias",
    type: "gear",
    folder: "Equipo",
    img: "icons/tools/cooking/can.webp",
    system: {
      cost: 1,
      slot: "pocket",
      summary: "Cena triste pero cena.",
    },
  },
  {
    id: "oil-lantern",
    name: "Farol de aceite",
    type: "gear",
    folder: "Equipo",
    img: "icons/sundries/lights/lantern-iron-yellow.webp",
    system: {
      cost: 8,
      slot: "back",
      summary: "Luz sucia para noches peores.",
    },
  },
  {
    id: "blanket",
    name: "Manta",
    type: "gear",
    folder: "Equipo",
    img: "icons/sundries/survival/bedroll-grey.webp",
    system: {
      cost: 4,
      slot: "back",
      summary: "Sirve para dormir o tiritar menos.",
    },
  },
  {
    id: "small-tent",
    name: "Tienda pequeña",
    type: "gear",
    folder: "Equipo",
    img: "icons/environment/settlement/tent.webp",
    system: {
      cost: 12,
      slot: "back",
      summary: "Cobijo miserable contra el viento.",
    },
  },
  {
    id: "lockpicks",
    name: "Ganzúas",
    type: "gear",
    folder: "Equipo",
    img: "icons/tools/hand/lockpicks-steel-grey.webp",
    system: {
      cost: 8,
      slot: "pocket",
      summary: "Cuando llamar a la puerta no apetece.",
    },
  },
  {
    id: "deck-of-cards",
    name: "Baraja marcada",
    type: "gear",
    folder: "Equipo",
    img: "icons/sundries/gaming/playing-cards.webp",
    system: {
      cost: 3,
      slot: "pocket",
      summary: "Siempre sale una mano mejor.",
    },
  },
  {
    id: "shovel",
    name: "Pala",
    type: "gear",
    folder: "Equipo",
    img: "icons/tools/hand/shovel-spade-steel-grey.webp",
    system: {
      cost: 6,
      slot: "back",
      summary: "Para cavar, ocultar o desenterrar.",
    },
  },
  {
    id: "saddlebags",
    name: "Alforjas",
    type: "gear",
    folder: "Equipo",
    img: "icons/containers/bags/pack-simple-leather-brown.webp",
    system: {
      cost: 10,
      slot: "horse",
      summary: "Equipo pensado para la montura.",
    },
  },
  {
    id: "saddle",
    name: "Silla",
    type: "gear",
    folder: "Equipo",
    img: "icons/commodities/leather/leather-buckle-steel-tan.webp",
    system: {
      cost: 10,
      slot: "horse",
      summary: "Silla de montar para una montura robada o propia.",
    },
  },
];

const folderColor = {
  "Armas": "#23140d",
  "Protección": "#594130",
  "Munición": "#7b602c",
  "Curación": "#385232",
  "Equipo": "#496270",
  "Condiciones": "#5d3241",
};

const getFolder = async (name) => {
  let folder = game.folders.find(
    (entry) => entry.type === "Item" && entry.name === `Frontier Scum ES - ${name}`,
  );
  if (!folder) {
    folder = await Folder.create({
      name: `Frontier Scum ES - ${name}`,
      type: "Item",
      color: folderColor[name] ?? null,
    });
  }
  return folder;
};

export const seedItemCatalog = async (silent = false) => {
  const created = [];
  const updates = [];
  const catalogIndex = new Map(catalog.map((entry) => [entry.id, entry]));
  for (const entry of catalog) {
    let existing = game.items.find(
      (item) => item.getFlag(FS.systemId, "catalogId") === entry.id,
    );
    const folder = await getFolder(entry.folder);
    if (existing) {
      const patch = {};
      if (existing.name !== entry.name) patch.name = entry.name;
      if (existing.img !== entry.img) patch.img = entry.img;
      if (existing.folder?.id !== folder.id) patch.folder = folder.id;
      if (Object.keys(patch).length) {
        patch._id = existing.id;
        updates.push(patch);
      }
      continue;
    }

    const [item] = await Item.createDocuments([
      {
        name: entry.name,
        type: entry.type,
        img: entry.img,
        folder: folder.id,
        system: entry.system,
        flags: {
          [FS.systemId]: {
            catalogId: entry.id,
          },
        },
      },
    ]);
    created.push(item);
  }

  if (updates.length) {
    await Item.updateDocuments(updates);
  }

  let embeddedUpdates = 0;
  for (const actor of game.actors ?? []) {
    const actorPatches = [];
    for (const item of actor.items ?? []) {
      const catalogId = item.getFlag(FS.systemId, "catalogId");
      if (!catalogId) continue;
      const entry = catalogIndex.get(catalogId);
      if (!entry) continue;

      const patch = { _id: item.id };
      let changed = false;
      if (item.name !== entry.name) {
        patch.name = entry.name;
        changed = true;
      }
      if (item.img !== entry.img) {
        patch.img = entry.img;
        changed = true;
      }
      if (changed) actorPatches.push(patch);
    }

    if (actorPatches.length) {
      await actor.updateEmbeddedDocuments("Item", actorPatches);
      embeddedUpdates += actorPatches.length;
    }
  }

  if (!silent) {
    ui.notifications.info(
      `Catalogo base actualizado: ${created.length} creados, ${updates.length} del directorio y ${embeddedUpdates} en fichas.`,
    );
  }
  return { created, updates, embeddedUpdates };
};

export const registerItemDirectoryButton = () => {
  Hooks.on("renderItemDirectory", (_app, html, options) => {
    const root = html instanceof HTMLElement ? html : html?.[0];
    if (!root) return;
    if (!options?.isFirstRender || !game.user.can("ITEM_CREATE")) return;
    if (root.querySelector(".fs-seed-items")) return;

    const dirHeader = root.querySelector(".directory-header");
    if (!dirHeader?.parentNode) return;

    const header = document.createElement("header");
    header.classList.add("directory-header", "fs-seed-items");
    header.innerHTML = `
      <div class="header-actions action-buttons flexrow">
        <button type="button" class="fs-seed-items-button">
          <i class="fas fa-suitcase"></i> Crear equipo base
        </button>
      </div>
    `;
    dirHeader.parentNode.insertBefore(header, dirHeader);
    header
      .querySelector(".fs-seed-items-button")
      .addEventListener("click", () => seedItemCatalog());
  });
};
