import { FS } from "./config.js";

const RULES_FOLDER = "Frontier Scum | Reglas";
const RULES_FLAG = "rulesJournalId";
const RULES_JOURNAL_ID = "compendio";

const rulesContent = `
  <section class="fs-rules-journal">
    <h1>Frontier Scum | Reglas completas de juego</h1>
    <p>Este diario reúne en un solo lugar la referencia de juego útil para mesa dentro de Foundry, junto con el estado actual de automatización del sistema.</p>

    <h2>1. Base del juego</h2>
    <p>Cada PJ es un forajido con cuatro atributos: <strong>Aplomo</strong>, <strong>Brío</strong>, <strong>Seso</strong> y <strong>Suerte</strong>. La ficha también recoge HP, Ases, plata, recompensa, delito, equipo, historia, montura y hasta 6 habilidades.</p>
    <p>Los HP representan aguante, dolor, rozaduras, casi-impactos y heridas reales. Los <strong>Ases</strong> permiten repetir una tirada una vez. Cada PJ empieza cada sesión con un As.</p>

    <h2>2. Habilidades</h2>
    <p>Las habilidades no forman una lista cerrada. Son etiquetas narrativas. Si una habilidad aplica y el DJ está de acuerdo, el chequeo correspondiente se hace con <strong>Ventaja</strong>. Un 20 natural permite ganar un As o aprender una habilidad apropiada. Si ya tienes 6, para aprender una nueva debes reemplazar una antigua.</p>
    <p>Un 1 natural en un chequeo de atributo hace que todo el grupo pierda todos sus Ases.</p>

    <h2>3. Chequeos de atributo</h2>
    <p>Cuando el resultado es incierto, tira <strong>d20 + atributo + modificadores</strong> contra una <strong>DR</strong>. Si igualas o superas la DR, tienes éxito.</p>
    <ul>
      <li><strong>DR 6</strong>: infalible.</li>
      <li><strong>DR 8</strong>: sencillo.</li>
      <li><strong>DR 10</strong>: podría ser peor.</li>
      <li><strong>DR 12</strong>: estándar.</li>
      <li><strong>DR 14</strong>: difícil.</li>
      <li><strong>DR 16</strong>: muy difícil.</li>
      <li><strong>DR 18</strong>: casi imposible.</li>
    </ul>
    <p>Un fallo no debería detener la ficción: algo pasa, pero con coste, riesgo o complicación.</p>

    <h2>4. Reacciones y moral</h2>
    <p><strong>Reacción</strong>: tira <strong>2d6</strong> cuando no esté claro cómo reacciona una criatura o grupo. 2-3 matar o capturar, 4-6 irritado, 7-8 apático, 9-10 algo amistoso, 11-12 aparentemente amistoso.</p>
    <p><strong>Moral</strong>: tira <strong>2d6</strong> cuando un enemigo pierde a su líder, se queda a la mitad, o se ve solo y muy herido. Si supera su Moral, huye o se rinde.</p>
    <p>Los PNJ normalmente no hacen chequeos como los PJ salvo que el DJ lo considere necesario.</p>

    <h2>5. Combate</h2>
    <p>Al inicio de cada asalto se tira <strong>1d6</strong>: 1-3 actúa antes el enemigo, 4-6 actúan antes los PJ. Cuando haga falta iniciativa individual, compara <strong>d6 + Brío</strong>.</p>
    <ul>
      <li><strong>Ataque cuerpo a cuerpo</strong>: chequea Aplomo para golpear; cuando te atacan en melé, chequea Aplomo para evitar el golpe.</li>
      <li><strong>Ataque a distancia sin arma de fuego</strong>: chequea Brío para impactar; cuando te disparan así, chequea Brío para esquivar.</li>
      <li><strong>Disparar un arma de fuego en melé</strong>: chequea Aplomo para impactar; cuando te lo hacen a ti, chequea Aplomo para evitarlo.</li>
      <li><strong>Disparo normal con arma de fuego</strong>: impacta automáticamente; si te disparan así, te impactan automáticamente.</li>
      <li><strong>Tiro difícil</strong>: chequea Brío para impactar; cuando te lo hacen a ti, chequea Suerte para evitarlo. El DJ ajusta la DR según distancia, visibilidad, cobertura, movimiento, disparo apresurado o disparar con dos armas.</li>
    </ul>
    <p><strong>Cláusula de la refriega</strong>: cuando dos bandos intercambian golpes cuerpo a cuerpo, un PJ puede hacer un solo chequeo de Aplomo por asalto: si tiene éxito, hiere; si falla, le hieren. Estar superado en número modifica la DR.</p>
    <p>Si tiras varios dados de daño, puedes repartirlos entre objetivos cercanos.</p>

    <h2>6. Daño y daño explosivo</h2>
    <p>Los daños marcados con asterisco son <strong>explosivos</strong>: cuando sacas el máximo en un dado de daño, añades otro dado del mismo tipo.</p>
    <p>Daño habitual resumido de la hoja de referencia:</p>
    <ul>
      <li>Pistola de faltriquera d6.</li>
      <li>Revólver d6*.</li>
      <li>Rifle de ratas d4*.</li>
      <li>Rifle de repetición d6*.</li>
      <li>Rifle de caza d8.</li>
      <li>Escopeta recortada d4 o 2d4 con ambos cañones.</li>
      <li>Escopeta doble d6 o 2d6 con ambos cañones.</li>
      <li>Arco d6.</li>
      <li>Cuchillos arrojadizos d4*.</li>
      <li>Botella incendiaria d4* y daña adyacentes.</li>
      <li>Dinamita d4* + 4 y daña adyacentes.</li>
      <li>Desarmado 1 + la mitad de Aplomo, redondeando hacia arriba, mínimo 1.</li>
    </ul>

    <h2>7. Munición</h2>
    <p>Si sacas un <strong>1</strong> en cualquiera de tus dados de daño con un arma a distancia, pierdes una ranura de munición de ese tipo. Tras un tiroteo, un chequeo de Suerte puede recuperar una ranura de munición. Flechas y cuchillos arrojadizos suelen recuperarse sin tirada.</p>

    <h2>8. Protección</h2>
    <ul>
      <li><strong>Sombrero</strong>: se pierde para ignorar todo el daño de un ataque.</li>
      <li><strong>Pieles / abrigo / armadura ligera</strong>: reducen el daño en 1.</li>
      <li><strong>Escudo</strong>: reduce el daño en 1.</li>
    </ul>

    <h2>9. Descanso, Miserable y Borracho</h2>
    <p>Tras una refriega recuperas <strong>d4 HP</strong>, más 1 por fumar, beber o echar una siesta. Hasta la mañana siguiente recuperas <strong>2 HP</strong> por dormir, comer y entretenerte. En comodidad, cama, comida, bebida o buena compañía, curas el doble.</p>
    <p>Si pasas un día sin comida, agua o sueño, te vuelves <strong>Miserable</strong>. Un Miserable no recupera HP al descansar.</p>
    <p>Al emborracharte por primera vez intercambias dos atributos al azar. Más adelante siempre se intercambian esos mismos dos hasta que duermas la mona o se te pase.</p>
    <p>Si una condición no tiene efecto propio, trátala como Miserable o improvisa una consecuencia apropiada. Algunas condiciones hacen daño por sí mismas, como frío, veneno o ciertos estados especiales.</p>

    <h2>10. Curación</h2>
    <ul>
      <li><strong>Láudano</strong>: cura d4 HP y te emborracha si no te curas por completo. 4 usos.</li>
      <li><strong>Botiquín de heridas</strong>: te devuelve a 0 HP + Seso del doctor. 4 usos.</li>
      <li><strong>Maletín de doctor</strong>: cura d6 + Seso del doctor. 6 usos.</li>
      <li><strong>Píldoras de ginebra</strong>: curan d4 HP, pero solo mientras estás borracho. 8 usos.</li>
      <li><strong>Bíteres saludables</strong>: curan d4 HP y con 3+ también curan Miserable. 1 uso.</li>
      <li><strong>Tintura de opio</strong>: cura d10 HP y exige DR18 Aplomo o caes en sueño profundo. 4 usos.</li>
    </ul>

    <h2>11. Caída y muerte</h2>
    <p>Cuando llegas a 0 HP o menos por daño no letal, tira <strong>d20 + Aplomo - HP negativos</strong>.</p>
    <ul>
      <li><strong>10 o menos</strong>: caes inconsciente hasta volver a 1 HP o más.</li>
      <li><strong>11 o más</strong>: permaneces donde estás.</li>
    </ul>
    <p>Si el daño era potencialmente letal, usa ese mismo esquema como <strong>chequeo de muerte</strong>:</p>
    <ul>
      <li><strong>1 natural</strong>: pifia mortal, muerte todavía peor.</li>
      <li><strong>1 o menos</strong>: muerto.</li>
      <li><strong>2-5</strong>: estás muriendo. El tiempo puede ser minutos, horas, días o semanas.</li>
      <li><strong>6-10</strong>: fuera de combate hasta volver a 1 HP.</li>
      <li><strong>11-15</strong>: una lección para bien o para mal; afecta a una característica aleatoria.</li>
      <li><strong>16+</strong>: aguantas y te mantienes.</li>
      <li><strong>20 natural</strong>: segundo aliento; subes HP máximo y recuperas HP.</li>
    </ul>

    <h2>12. Viaje y supervivencia</h2>
    <ul>
      <li><strong>Cazar</strong>: chequea Seso; el tipo de presa depende de d8 + Suerte.</li>
      <li><strong>Forrajear</strong>: chequea Seso; obtienes d4 raciones o agua.</li>
      <li><strong>Pescar</strong>: chequea Suerte; obtienes d4 raciones.</li>
    </ul>
    <p>Si fallas al cazar, forrajear o pescar, encuentras algo, pero con complicación. Hacerlo en terreno duro o sin equipo apropiado suele implicar Desventaja. Comer carne cruda o beber agua sin hervir exige Aplomo o terminas Miserable por intoxicación.</p>

    <h2>13. Monturas, conducción e inventario</h2>
    <p>Manejar una montura usa Brío. Mantenerse en la silla usa Brío. Guiar un carro usa Aplomo. Calmar o dar órdenes a un caballo usa Seso.</p>
    <p>Inventario por ranuras:</p>
    <ul>
      <li><strong>Bolsillos</strong>: 10</li>
      <li><strong>Cinto</strong>: 3</li>
      <li><strong>Espalda</strong>: 3</li>
      <li><strong>Montura</strong>: 10, o 20 sin jinete</li>
    </ul>

    <h2>14. Ciudad y juerga</h2>
    <p>La parte urbana cubre servicios, establos, baños, hoteles, trenes, comida, encargos y encuentros callejeros. Normalmente se resuelve narrativamente salvo que haya riesgo o incertidumbre real.</p>
    <p>En una gran juerga, los PJ con Suerte 0 o superior <strong>suman d100</strong>; los que tienen Suerte negativa <strong>restan d100</strong>. El resultado determina cuánta plata queda y si se consulta tabla de ganancias, pérdidas o deudas.</p>

    <h2>15. Estado actual de automatización del sistema</h2>
    <p><strong>Automatizado ahora mismo:</strong> chequeos de atributo, habilidades como ventaja, consecuencias de 1/20 natural, Ases para repetir tiradas desde el chat, descanso, chequeos de caída y muerte, reacción, moral, creación aleatoria de PJ, uso de armas con la lógica base para ataques de PJ, daño desde el chat, reducción automática de daño por armadura y escudo, pérdida del sombrero para bloquear un ataque, recuperación del sombrero con Suerte, consumo y recuperación básica de munición, y uso real de objetos de curación.</p>
    <p><strong>Parcial:</strong> inventario por ranuras, refriega, armas arrojadizas y consumibles, borracheras y estados especiales según contexto, y algunas rarezas de armas o criaturas.</p>
    <p><strong>Manual todavía:</strong> iniciativa por asalto asistida fuera del chat, defensa reactiva completa cuando atacan a un PJ, duelo completo, cobertura táctica detallada, viaje completo, ciudad, juerga, y rasgos especiales concretos de criaturas y PNJ.</p>
  </section>
`;

function journalPage(title, content) {
  return [
    {
      name: title,
      type: "text",
      title: { show: true, level: 1 },
      text: { format: 1, content },
    },
  ];
}

async function ensureFolder({ name, type }) {
  let folder = game.folders.find((entry) => entry.type === type && entry.name === name);
  if (folder) return folder;
  folder = await Folder.create({
    name,
    type,
    flags: { [FS.systemId]: { [RULES_FLAG]: "folder" } },
  });
  return folder;
}

async function ensureJournal(folder) {
  const existing = game.journal.find((entry) => entry.getFlag(FS.systemId, RULES_FLAG) === RULES_JOURNAL_ID);
  const data = {
    name: "Reglas | Compendio",
    folder: folder.id,
    pages: journalPage("Reglas | Compendio", rulesContent),
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
    flags: { [FS.systemId]: { [RULES_FLAG]: RULES_JOURNAL_ID } },
  };

  if (existing) {
    await existing.update(data);
    return existing;
  }
  return JournalEntry.create(data);
}

export async function seedRulesJournals(silent = false) {
  if (!game.user.isGM) return [];
  const folder = await ensureFolder({ name: RULES_FOLDER, type: "JournalEntry" });

  const stale = game.journal.filter((entry) => {
    const flag = entry.getFlag(FS.systemId, RULES_FLAG);
    return flag && flag !== RULES_JOURNAL_ID;
  });
  if (stale.length) {
    await JournalEntry.deleteDocuments(stale.map((entry) => entry.id));
  }

  const journal = await ensureJournal(folder);
  if (!silent) {
    ui.notifications.info("Diario de reglas de Frontier Scum actualizado.");
  }
  return [journal];
}

export function registerRulesJournalButton() {
  Hooks.on("renderJournalDirectory", (_app, html) => {
    if (!game.user.isGM) return;
    const root = html instanceof HTMLElement ? html : html?.[0];
    if (!root) return;
    if (root.querySelector(".fs-seed-rules")) return;

    const footer = root.querySelector(".directory-footer");
    if (!footer) return;

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("fs-seed-rules");
    button.innerHTML = `<i class="fas fa-book"></i> Crear diario FS`;
    button.addEventListener("click", async () => {
      await seedRulesJournals();
    });
    footer.append(button);
  });
}
