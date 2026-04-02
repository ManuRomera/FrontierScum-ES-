import { seedItemCatalog } from "./catalog.js";
import { FS } from "./config.js";

let randomDataPromise = null;

const DATA_PATH = `systems/${FS.systemId}/module/random-character-data.json`;

const BACKGROUND_NAMES = {
  "Carcass Trapper": "Trapero de carroña",
  "Frostbit Prospector": "Buscador aterido",
  "Discharged Deputy": "Ayudante expulsado",
  "Suffering Clerk": "Escribiente sufrido",
  "Butcher-Cook": "Cocinero carnicero",
  "Doctor Sans Diploma": "Doctor sin diploma",
  "Ghoulish Undertaker": "Sepulturero macabro",
  "Calloused Ranch Hand": "Peón curtido",
  "Factory Cog": "Engranaje de fábrica",
  "Gambler and a Cheat": "Tahúr y tramposo",
  "Charlatan and a Fraud": "Charlatán y farsante",
  "Drifter": "Errante",
};

const CRIME_ADJECTIVES = {
  "Accidental": "accidental",
  "Attempted": "en grado de tentativa",
  "Good-humored": "de buen humor",
  "Casual": "casual",
  "Unoriginal": "poco original",
  "Horse": "ecuestre",
  "Wanton": "descarado",
  "Hired": "a sueldo",
  "Gruesome": "espeluznante",
  "Spectacular": "espectacular",
  "Repeated": "reiterado",
  "Unionized": "sindicado",
};

const CRIME_NOUNS = {
  "Loitering": "merodeo",
  "Fraud": "fraude",
  "Extortion": "extorsión",
  "Picketing": "piquete",
  "Smuggling": "contrabando",
  "Theft": "hurto",
  "Burglary": "allanamiento",
  "Robbery": "robo",
  "Rustling": "abigeato",
  "Grave robbing": "profanación de tumbas",
  "Arson": "incendio provocado",
  "Murder": "asesinato",
};

const WANTED_STATE_KEYS = {
  "Dead or Alive": "deadOrAlive",
  "Dead": "dead",
  "Alive": "alive",
};

const HORSE_TYPES = {
  "Nag": "Rocín",
  "Donkey": "Burro",
  "Mule": "Mula",
  "Riding horse": "Caballo de monta",
  "Draft horse": "Caballo de tiro",
  "Race horse": "Caballo de carreras",
};

const HORSE_COATS = {
  "Brown": "Marrón",
  "White": "Blanco",
  "Grey": "Gris",
  "Black": "Negro",
  "Painted": "Pinto",
};

const HAT_COLORS = {
  "black cherry": "negro cereza",
  "midnight blue": "azul medianoche",
  "charcoal": "carbón",
  "steel": "acero",
  "chocolate brown": "marrón chocolate",
  "tuscan brown": "marrón toscano",
  "pecan brown": "marrón pecán",
  "buckskin brown": "marrón gamuza",
  "light brown": "marrón claro",
  "bone white": "blanco hueso",
  "silver sand white": "blanco arena de plata",
  "crystal white": "blanco cristal",
};

const HAT_MATERIALS = {
  "straw": "paja",
  "felt": "fieltro",
  "leather": "cuero",
};

const HAT_CONDITIONS = {
  "new": "nuevo",
  "second hand": "de segunda mano",
  "worn out": "desgastado",
  "dusty": "polvoriento",
  "chipped": "desportillado",
  "old": "viejo",
  "crumpled": "arrugado",
  "way too large": "demasiado grande",
};

const OUTLAW_WITH_TRANSLATIONS = {
  "A Liar’S Schooling": "Aprendizaje de mentiroso",
  "A Coward's Machinations": "Maquinaciones de cobarde",
  "Concealed Purpose": "Propósito oculto",
  "A Penchant For Grudges": "Tendencia al rencor",
  "A Mysterious Past": "Pasado misterioso",
  "A Loud Mouth": "Bocaza",
  "Misgivings Of Honor": "Escrúpulos de honor",
  "A Lack Of Judgment": "Falta de juicio",
  "An Expensive Education": "Educación cara",
  "A Flashing Temper": "Pronto temperamento",
  "Friends In High Places": "Amistades influyentes",
  "A Cold Conscience": "Conciencia fría",
  "A Politician’S Outlook": "Talante de político",
  "An Extensive Vocabulary": "Vocabulario extenso",
  "A Know-It-All’S Pride": "Orgullo de sabelotodo",
  "An Artist's Soul": "Alma de artista",
  "An Apathetic Disposition": "Carácter apático",
  "A Stubborn Personality": "Personalidad terca",
  "A Rebellious Attitude": "Actitud rebelde",
  "Hypocritical Tendencies": "Tendencias hipócritas",
  "Unbridled Joie De Vivre": "Alegría de vivir desbocada",
  "An Unquenchable Thirst": "Sed insaciable",
  "Illusions Of Grandeur": "Ínfulas de grandeza",
  "An Optimistic Streak": "Racha de optimismo",
  "A Cynical Facade": "Fachada cínica",
  "An Appetite For Danger": "Apetito por el peligro",
  "Delicate Sensibilities": "Sensibilidades delicadas",
  "A Habit For Rumors": "Costumbre de propagar rumores",
  "A Cavalier Attitude": "Actitud despreocupada",
  "Morals For Sale": "Moral en venta",
  "Expensive Tastes": "Gustos caros",
  "Night Terrors": "Terrores nocturnos",
  "Silver Fever": "Fiebre de la plata",
  "An Inquiring Mind": "Mente inquisitiva",
  "An Unearthly Hunger": "Hambre antinatural",
  "A Need To Preach": "Necesidad de sermonear",
};

const OUTLAW_AND_TRANSLATIONS = {
  "Sharpened teeth": "Dientes afilados",
  "Piercing eyes": "Ojos penetrantes",
  "A forked tongue": "Lengua bífida",
  "A breath to remember": "Aliento inolvidable",
  "A bone-white smile": "Sonrisa blanca como hueso",
  "Piercings aplenty": "Piercings por todas partes",
  "A grating cough": "Tos rasposa",
  "A mess of bad innards": "Entrañas hechas polvo",
  "A telltale scar": "Cicatriz reveladora",
  "Wooden dentures": "Dentadura de madera",
  "Bleeding gums": "Encías sangrantes",
  "Tobacco-stained teeth": "Dientes manchados de tabaco",
  "Lumbago": "Lumbago",
  "Watery eyes": "Ojos llorosos",
  "Beset by fleas": "Cubierto de pulgas",
  "Clammy hands": "Manos sudorosas",
  "Wind-flayed skin": "Piel azotada por el viento",
  "A glass eye": "Ojo de cristal",
  "A broken nose": "Nariz rota",
  "A singer’s voice": "Voz de cantante",
  "Cauliflower ears": "Orejas de coliflor",
  "Missing a nose": "Sin nariz",
  "Plague-pox scars": "Cicatrices de viruela pestosa",
  "A hook hand": "Mano de gancho",
  "A groomed appearance": "Aspecto bien arreglado",
  "Silver-blued skin": "Piel azulada por la plata",
  "A wheezing cough": "Tos sibilante",
  "Cropped ears": "Orejas recortadas",
  "A signature laugh": "Risa inconfundible",
};

const SKILL_PROMPT_TRANSLATIONS = {
  "A friend tried to eat you": "Un amigo intentó comerte",
  "Coyotes stole your carrion": "Los coyotes te robaron la carroña",
  "You found a ripe deer in a tree": "Encontraste un ciervo bien cebado en un árbol",
  "The river filled with dead fish": "El río se llenó de peces muertos",
  "Nightbears tracked you for days": "Osos nocturnos te siguieron durante días",
  "Your gutting knife broke": "Se te rompió el cuchillo de desollar",
  "The fire died in a blizzard": "El fuego se apagó en plena ventisca",
  "They stole your nuggets": "Te robaron las pepitas",
  "Stuck in a glacial ravine": "Quedaste atrapado en un barranco glacial",
  "Hunted by sabre cats": "Te cazaron gatos de sable",
  "Making your own dynamite": "Fabricando tu propia dinamita",
  "The mine flooded with water": "La mina se inundó",
  "Killing the wrong scum": "Mataste a la sabandija equivocada",
  "Losing the cell keys": "Perdiste las llaves del calabozo",
  "Not sharing your bribes": "No compartiste tus sobornos",
  "Bringing a sword to a gunfight": "Llevaste un sable a un tiroteo",
  "Arresting the sheriff": "Arrestaste al sheriff",
  "Drinking on the job": "Bebías en el trabajo",
  "Got locked in the vault after closing": "Te encerraron en la caja fuerte al cerrar",
  "Became hostage in a robbery gone wrong": "Fuiste rehén en un atraco salido mal",
  "Acted the director's scapegoat": "Pagaste los platos rotos del director",
  "Had to fight an angry depositor": "Tuviste que pelear con un depositante furioso",
  "Skimmed a little silver off the top": "Te quedaste con un poco de plata de más",
  "Won the 'employee of the month' award": "Ganaste el premio a empleado del mes",
  "Rats claimed the pantry": "Las ratas se adueñaron de la despensa",
  "All the meat rotted": "Toda la carne se pudrió",
  "The kitchen caught on fire": "La cocina se incendió",
  "Someone poisoned your stew": "Alguien envenenó tu estofado",
  "There was only dirt to eat": "Solo había tierra para llevarse a la boca",
  "The hog wasn't wholly dead": "El cerdo no estaba del todo muerto",
  "Sneaking into medical school": "Colándote en la facultad de medicina",
  "Practicing surgery on stolen corpses": "Practicando cirugía con cadáveres robados",
  "Selling organs to the highest bidder": "Vendiendo órganos al mejor postor",
  "Forging prescriptions in the night": "Falsificando recetas al amparo de la noche",
  "Stealing an actual doctor's identity": "Robando la identidad de un médico de verdad",
  "Making medicine from sewer slop": "Fabricando medicinas con porquería de alcantarilla",
  "Digging graves in a mire": "Cavando tumbas en un lodazal",
  "Hiding from ghouls": "Escondiéndote de los necrófagos",
  "Making things from bone": "Fabricando cosas con huesos",
  "Gathering coffin wood": "Reuniendo madera para ataúdes",
  "Reburying the headstrong": "Volviendo a enterrar a los testarudos",
  "Working in the dark": "Trabajando a oscuras",
  "Slacking off in the manure pit": "Escaqueándote en el estercolero",
  "Hosting fights in the bullpen": "Montando peleas en el corral",
  "Shoeing an angry horse": "Herrando a un caballo furioso",
  "Racing wagons on the range": "Corriendo carromatos por la llanura",
  "Branding the wrong cow": "Marcaste la vaca equivocada",
  "Herding cattle through a cave": "Arreando reses por una cueva",
  "Getting stuck between gears": "Quedándote atrapado entre engranajes",
  "Working for a week straight": "Trabajando una semana seguida",
  "Fighting the foreman's thugs": "Peleando contra los matones del capataz",
  "Climbing the smogpipe": "Trepando por la chimenea de humo",
  "Lifting beams with your back": "Levantando vigas con la espalda",
  "Napping in the boiler room": "Echando siestas en la sala de calderas",
  "Were thrown into a busy street": "Te lanzaron a una calle abarrotada",
  "Bet your life and lost": "Apostaste tu vida y perdiste",
  "Were thrown from a balcony": "Te tiraron desde un balcón",
  "Got hustled by another scum": "Otra sabandija te timó",
  "Were thrown from a riverboat": "Te arrojaron de un barco fluvial",
  "Bet your life and won": "Apostaste tu vida y ganaste",
  "Were surrounded by rabble": "Te rodeó la chusma",
  "Fleeced the wrong scum": "Desplumaste a la sabandija equivocada",
  "Made your first silver": "Ganaste tu primera plata",
  "Were chased out of town": "Te echaron del pueblo a la carrera",
  "Lost your entire stock": "Perdiste toda tu mercancía",
  "Sold some actual treasure": "Vendiste un tesoro de verdad",
  "You had the best day of your life": "Tuviste el mejor día de tu vida",
  "You learned a craft": "Aprendiste un oficio",
  "You killed your first scum": "Mataste a tu primera sabandija",
  "You got a friend in trouble": "Metiste a un amigo en problemas",
  "You were hanged for your crimes": "Te ahorcaron por tus crímenes",
  "You committed your first crime": "Cometiste tu primer delito",
  "A loan shark came to collect": "Un prestamista vino a cobrarse lo suyo",
  "Other scum took all you had": "Otras sabandijas te quitaron todo lo que tenías",
  "You were lost in the wilderness": "Te perdiste en la intemperie",
  "The train derailed": "El tren descarriló",
  "You drank overmuch": "Bebiste más de la cuenta",
  "You went to a funeral": "Fuiste a un funeral",
  "Your horse ran off with another scum": "Tu caballo se largó con otra sabandija",
  "You had to leave town unseen": "Tuviste que abandonar el pueblo sin que te vieran",
  "The stagecoach went over a cliff": "La diligencia se despeñó",
  "You fell into the river": "Caíste al río",
  "You got shot at for the first time": "Te dispararon por primera vez",
  "The beans went bad": "Las alubias se echaron a perder",
  "The theatre came to town": "El teatro llegó al pueblo",
  "You staged a jailbreak": "Montaste una fuga carcelaria",
  "You were dragged behind your horse": "Te arrastró tu caballo",
  "You spent a year locked up": "Pasaste un año entre rejas",
  "You got lost in the streets": "Te perdiste por las calles",
  "You caught the plague pox": "Pillaste la viruela pestosa",
  "You were accepted into a gang": "Te aceptaron en una banda",
  "The saloon caught on fire": "El saloon se incendió",
  "You dug your own grave": "Cavaste tu propia tumba",
  "You went to a dinner party": "Fuiste a una cena elegante",
  "You missed the train": "Perdiste el tren",
  "You got a nasty wound": "Te llevaste una herida fea",
  "The general store was robbed": "Asaltaron la tienda del pueblo",
  "The outhouse door jammed behind you": "La puerta de la letrina se atascó contigo dentro",
  "Your horse died": "Tu caballo murió",
  "You were caught in a storm": "Te atrapó una tormenta",
  "You were mistaken for another scum": "Te confundieron con otra sabandija",
  "You had the worst day of your life": "Tuviste el peor día de tu vida",
};

const HORSE_LIKES_TRANSLATIONS = {
  "Pre-chewed hay": "Heno premasticado",
  "Being tucked in": "Que lo arropen",
  "Imported liquor": "Licor importado",
  "Scaring lawfolk": "Asustar a la ley",
  "Human food": "Comida humana",
  "Staying dry": "Mantenerse seco",
  "Being saddle free": "Ir sin silla",
  "A braided mane": "Una crin trenzada",
  "The rain": "La lluvia",
  "Sad music": "La música triste",
  "A silver a day": "Una plata al día",
  "PC-on-PC violence": "Violencia entre PJ",
  "Eating raw flesh": "Comer carne cruda",
  "Sniffing gunpowder": "Olisquear pólvora",
  "Neighing at night": "Relinchar por la noche",
  "Showing off": "Lucirse",
  "Chewing boots": "Masticar botas",
  "A daily bath": "Un baño diario",
  "Running in circles": "Correr en círculos",
  "Adrenaline rushes": "Subidones de adrenalina",
  "Staying indoors": "Quedarse bajo techo",
  "Peace and quiet": "Paz y tranquilidad",
  "Sugar cubes": "Terrones de azúcar",
  "Rushing headfirst": "Lanzarse de cabeza",
  "Laughter": "Las carcajadas",
  "Watching duels": "Ver duelos",
  "Being read to": "Que le lean",
  "Carrying carrion": "Llevar carroña",
  "Positive feedback": "Refuerzo positivo",
  "Taunting predators": "Provocar depredadores",
  "Smoking cigarettes": "Fumar cigarrillos",
  "Putting out fires": "Apagar fuegos",
  "Crushing bones": "Crujir huesos",
  "Naps at high noon": "Siestas al mediodía",
  "Kicking doors": "Patear puertas",
  "Changing owners": "Cambiar de dueño",
};

const GUN_CATALOG = {
  "Pocket pistol (d6, fits in a pocket)": "pocket-pistol",
  "Revolver (d6*)": "revolver",
  "Rat rifle (d4*)": "rat-rifle",
  "Repeater rifle (d6*)": "repeater-rifle",
  "Hunting rifle (d8)": "hunting-rifle",
  "Long rifle (d10)": "long-rifle",
  "Sawed-off shotgun (d4/2d4 both barrels)": "sawed-off",
  "Double-barreled shotgun (d6/2d6 both barrels)": "double-shotgun",
};

const GUN_AMMO = {
  "pocket-pistol": "pistol-slugs",
  "revolver": "pistol-slugs",
  "rat-rifle": "rifle-rounds",
  "repeater-rifle": "rifle-rounds",
  "hunting-rifle": "rifle-rounds",
  "long-rifle": "rifle-rounds",
  "sawed-off": "shotgun-shells",
  "double-shotgun": "shotgun-shells",
};

const ITEM_TRANSLATIONS = [
  { test: /^Mangy fur /, catalogId: "thick-coat", name: "Piel sarnosa", summary: "Piel hecha polvo. Reduce el daño en 1." },
  { test: /^Winter coat /, catalogId: "thick-coat", name: "Abrigo de invierno", summary: "Reduce el daño en 1." },
  { test: /^Heavy wool coat /, catalogId: "thick-coat", name: "Abrigo de lana gruesa", summary: "Reduce el daño en 1." },
  { test: /^Heavy fur coat /, catalogId: "thick-coat", name: "Abrigo de piel gruesa", summary: "Reduce el daño en 1." },
  { test: /^Injury kit /, catalogId: "injury-kit", name: "Botiquín de heridas" },
  { test: /^Laudanum /, catalogId: "laudanum", name: "Láudano" },
  { test: /^Doctor's bag /, catalogId: "doctors-bag", name: "Maletín de doctor" },
  { test: /^Healthful Bitters /, catalogId: "healthful-bitters", name: "Bíteres saludables" },
  { test: /^\d+ gin pills /, catalogId: "gin-pills", name: "Píldoras de ginebra" },
  { test: /^Opium tincture /, catalogId: "opium-tincture", name: "Tintura de opio" },
  { test: /^Deck of marked cards$/, catalogId: "deck-of-cards", name: "Baraja marcada" },
  { test: /^Shovel$/, catalogId: "shovel", name: "Pala" },
  { test: /^Rope \(\d+ ft\.\)$/, catalogId: "rope", name: "Cuerda" },
  { test: /^Lantern with oil for \d+ hours$/, catalogId: "oil-lantern", name: "Farol de aceite" },
  { test: /^Blanket$/, catalogId: "blanket", name: "Manta" },
  { test: /^Small tent \(2 people\)$/, catalogId: "small-tent", name: "Tienda pequeña" },
];

const SIMPLE_NAME_TRANSLATIONS = {
  "Pickaxe": "Pico",
  "Snow goggles": "Gafas de nieve",
  "Deputy badge": "Insignia de ayudante",
  "Sheriff's sabre": "Sable del sheriff",
  "Handcuffs and key": "Esposas y llave",
  "Spyglass": "Catalejo",
  "Briefcase containing": "Maletín con",
  "Bottle of ink and a fountain pen": "Tintero y pluma estilográfica",
  "Poetry book": "Libro de poesía",
  "Abacus": "Ábaco",
  "Notepad": "Bloc de notas",
  "Beef shank": "Morcillo de vaca",
  "Meat hook": "Gancho de carnicero",
  "Sack of flour": "Saco de harina",
  "Rolling pin": "Rodillo",
  "Meat cleaver": "Cuchilla de carnicero",
  "Needle and thread": "Aguja e hilo",
  "Crowbar": "Pata de cabra",
  "Makeup kit": "Estuche de maquillaje",
  "Carved femur": "Fémur tallado",
  "Pet rat": "Rata mascota",
  "Barbed wire": "Alambre de espino",
  "Branding iron": "Hierro de marcar",
  "Small wagon": "Carro pequeño",
  "Whip": "Látigo",
  "Sledgehammer": "Maza",
  "Bag of lead shavings": "Bolsa de limaduras de plomo",
  "Wrench": "Llave inglesa",
  "Sack of charcoal": "Saco de carbón",
  "Iron chain": "Cadena de hierro",
  "Silver pocketwatch": "Reloj de plata",
  "Pomade": "Pomada",
  "Tinted glasses": "Gafas tintadas",
  "Self-help bible": "Biblia de autoayuda",
  "Clothes iron": "Plancha",
  "Fool's silver candlestick": "Candelabro de plata falsa",
  "Expensive perfume": "Perfume caro",
  "Embroidered handkerchief": "Pañuelo bordado",
  "Fly net": "Mosquitera",
  "Straight razor": "Navaja de afeitar",
  "Washcloth": "Paño de aseo",
  "Reading glasses": "Gafas de lectura",
  "Grappling hook": "Garfio",
  "Umbrella": "Paraguas",
  "Horse brush": "Cepillo para caballo",
  "Sheepskin gloves": "Guantes de piel de oveja",
  "Bedroll": "Petate",
  "Bar of soap": "Pastilla de jabón",
  "Change of formalwear": "Muda de ropa formal",
  "Tub of vaseline": "Bote de vaselina",
  "Fishing rod": "Caña de pescar",
  "Flip lighter": "Mechero",
  "Hunting knife": "Cuchillo de caza",
  "Skillet": "Sartén",
  "Large tent": "Tienda grande",
  "Spare boots": "Botas de repuesto",
  "Hatchet": "Hacha de mano",
  "Chocolate bar": "Tableta de chocolate",
  "Bottle": "Botella",
  "Health Item": "Objeto medicinal",
  "Can Of Beans": "Lata de alubias",
  "Personal Memento": "Recuerdo personal",
  "Tin of tea leaves": "Lata de hojas de té",
  "Chewing tobacco": "Tabaco de mascar",
};

const GEAR_ICONS = {
  gear: "icons/containers/bags/pack-simple-leather-brown.webp",
  medical: "icons/consumables/potions/potion-bottle-labeled-medicine-capped-red-black.webp",
  protection: "icons/equipment/back/cloak-brown-fur-brown.webp",
};

const loadRandomData = async () => {
  if (!randomDataPromise) {
    randomDataPromise = fetch(DATA_PATH).then((response) => response.json());
  }
  return randomDataPromise;
};

const pickRandom = (array, remove = false) => {
  const index = Math.floor(Math.random() * array.length);
  return remove ? array.splice(index, 1)[0] : array[index];
};

const tableByRoll = (array, rolled) =>
  [...array]
    .sort((a, b) => b.rollAtLeast - a.rollAtLeast)
    .find(({ rollAtLeast }) => rolled >= rollAtLeast);

const rollFormula = async (formula) => {
  const roll = await new Roll(formula).evaluate();
  return roll.total;
};

const expandPlaceholders = async (value) => {
  let text = String(value ?? "");
  const pattern = /#\{([^}]+)\}/;
  while (pattern.test(text)) {
    const match = text.match(pattern);
    if (!match) break;
    const total = await rollFormula(match[1]);
    text = text.replace(match[0], total);
  }
  return text;
};

const translateCrime = (crime) => {
  const [adjective, ...nounParts] = crime.split(" ");
  const noun = nounParts.join(" ");
  return `${CRIME_NOUNS[noun] ?? noun} ${CRIME_ADJECTIVES[adjective] ?? adjective}`.trim();
};

const translateBackground = (name) => BACKGROUND_NAMES[name] ?? name;
const translateHorseType = (name) => HORSE_TYPES[name] ?? name;
const translateCoat = (name) => HORSE_COATS[name] ?? name;

const normalizeText = (text) => String(text ?? "").replace(/\s+/g, " ").trim();

const translateHorseNotes = (text) =>
  normalizeText(text)
    .replace(/Morale/gi, "Moral")
    .replace(/very slow/gi, "muy lenta")
    .replace(/very fast/gi, "muy rápida")
    .replace(/bad at everything/gi, "mala en casi todo")
    .replace(/bad at maneuvering/gi, "mala maniobrando")
    .replace(/good at pulling/gi, "buena tirando")
    .replace(/good at maneuvering/gi, "buena maniobrando")
    .replace(/slow/gi, "lenta");

const translateGeneratedText = (text) => {
  const normalized = normalizeText(text);
  let translated =
    OUTLAW_WITH_TRANSLATIONS[normalized] ??
    OUTLAW_AND_TRANSLATIONS[normalized] ??
    SKILL_PROMPT_TRANSLATIONS[normalized] ??
    HORSE_LIKES_TRANSLATIONS[normalized] ??
    normalized;

  translated = translated
    .replace(/^(\d+) crude tattoos$/i, "$1 tatuajes burdos")
    .replace(/^(\d+) bullet scars$/i, "$1 cicatrices de bala")
    .replace(/^(\d+) teeth$/i, "$1 dientes")
    .replace(/^(\d+) missing fingers$/i, "$1 dedos ausentes")
    .replace(/^(\d+) silver teeth \(worth 1s each\)$/i, "$1 dientes de plata (valen 1$ cada uno)")
    .replace(/^A shotgun leg \(d4\/2d4\) with a slot’s worth of shells$/i, "Pierna de escopeta (d4/2d4) con una ranura de cartuchos")
    .replace(/doctor's Wits/gi, "Seso del doctor")
    .replace(/heal back to 0 \+ Seso del doctor HP/gi, "vuelve a 0 HP + Seso del doctor")
    .replace(/heal d4 HP and Drunk if not fully healed/gi, "recupera d4 HP y quedas Borracho si no sanas del todo")
    .replace(/heal d6 \+ Seso del doctor HP/gi, "recupera d6 + Seso del doctor HP")
    .replace(/heal d10, DR18 Grit or deep sleep/gi, "recupera d10 HP; DR18 Aplomo o sueño profundo")
    .replace(/worth 1s each/gi, "valen 1$ cada uno")
    .replace(/with a slot’s worth of shells/gi, "con una ranura de cartuchos")
    .replace(/useless documents/gi, "documentos inútiles")
    .replace(/loves you/gi, "te adora")
    .replace(/\bbite\b/gi, "mordisco")
    .replace(/\bdrinks\b/gi, "tragos")
    .replace(/\bDrunk\b/gi, "Borracho")
    .replace(/hours/gi, "horas");

  return translated;
};

const translateLooseName = (name) => {
  let translated = normalizeText(name);
  for (const [source, target] of Object.entries(SIMPLE_NAME_TRANSLATIONS)) {
    translated = translated.replace(source, target);
  }
  translated = translated
    .replace(/silver teeth/gi, "dientes de plata")
    .replace(/animal teeth/gi, "dientes de animal")
    .replace(/pieces of skunk jerky/gi, "tiras de cecina de mofeta")
    .replace(/mixed spices/gi, "pellizcos de especias")
    .replace(/wax candles/gi, "velas de cera")
    .replace(/horseshoes/gi, "herraduras")
    .replace(/company scrip/gi, "vales de empresa")
    .replace(/fine cigars/gi, "puros finos")
    .replace(/ceramic chips/gi, "fichas de cerámica")
    .replace(/business cards/gi, "tarjetas de visita")
    .replace(/matches/gi, "cerillas")
    .replace(/pieces of chewing gum/gi, "chicles")
    .replace(/cigarettes/gi, "cigarrillos")
    .replace(/strips of beef jerky/gi, "tiras de cecina")
    .replace(/biscuits/gi, "galletas")
    .replace(/uses/gi, "usos")
    .replace(/people/gi, "personas")
    .replace(/ft\./gi, "pies");
  return translated;
};

const inferSlot = (text) => {
  const value = normalizeText(text).toLowerCase();
  if (value.includes("wagon") || value.includes("carro") || value.includes("horse")) return "horse";
  if (
    value.includes("coat") ||
    value.includes("fur") ||
    value.includes("mant") ||
    value.includes("tent") ||
    value.includes("rope") ||
    value.includes("chain") ||
    value.includes("pickaxe") ||
    value.includes("pala") ||
    value.includes("shovel") ||
    value.includes("sledgehammer") ||
    value.includes("maletín") ||
    value.includes("briefcase")
  ) {
    return "back";
  }
  if (
    value.includes("knife") ||
    value.includes("navaja") ||
    value.includes("hook") ||
    value.includes("crowbar") ||
    value.includes("whip") ||
    value.includes("sabre") ||
    value.includes("sable") ||
    value.includes("hatchet")
  ) {
    return "belt";
  }
  return "pocket";
};

const catalogClone = (catalogId, overrides = {}) => {
  const worldItem = game.items.find((item) => item.getFlag(FS.systemId, "catalogId") === catalogId);
  if (!worldItem) return null;
  const source = worldItem.toObject();
  delete source._id;
  source.folder = null;
  source.flags = source.flags ?? {};
  return foundry.utils.mergeObject(source, overrides);
};

const customItem = ({ name, type = "gear", slot = "pocket", summary = "", notes = "" }) => ({
  name,
  type,
  img: GEAR_ICONS[type] ?? GEAR_ICONS.gear,
  system:
    type === "medical"
      ? {
          cost: 0,
          slot,
          summary,
          notes,
          healing: summary || notes,
          uses: 1,
        }
      : type === "protection"
        ? {
            cost: 0,
            slot,
            summary,
            notes,
            reduction: "-1 daño",
            protectionClass: name.toLowerCase().includes("sombrero") ? "hat" : "armor",
          }
        : {
            cost: 0,
            slot,
            summary,
            notes,
          },
});

const parseItemText = (text) => {
  const normalized = normalizeText(text);
  const translated = translateGeneratedText(normalized);

  for (const entry of ITEM_TRANSLATIONS) {
    if (!entry.test.test(normalized)) continue;
    const cloned = catalogClone(entry.catalogId, entry.name ? { name: entry.name } : {});
    if (!cloned) break;
    if (entry.summary) {
      cloned.system.summary = entry.summary;
    }
    cloned.system.notes = translated;
    return cloned;
  }

  if (/Antivenom/i.test(normalized)) {
    return customItem({
      name: "Antiveneno",
      type: "medical",
      slot: "pocket",
      summary: "Cura mordedura de serpiente. 1 uso.",
      notes: translated,
    });
  }

  if (/\(-1 .*damage\)/i.test(normalized)) {
    return customItem({
      name: translateLooseName(normalized.replace(/\s*\(.+\)$/, "")),
      type: "protection",
      slot: "back",
      summary: "Reduce el daño en 1.",
      notes: translated,
    });
  }

  return customItem({
    name: translateLooseName(normalized),
    slot: inferSlot(normalized),
    summary: translated,
    notes: translated,
  });
};

const buildHatItem = (hat) =>
  catalogClone("hat", {
    name: "Sombrero",
    system: {
      summary: `${HAT_CONDITIONS[hat.condition] ?? hat.condition}, ${HAT_COLORS[hat.color] ?? hat.color}, de ${HAT_MATERIALS[hat.material] ?? hat.material}.`,
      notes: `${HAT_CONDITIONS[hat.condition] ?? hat.condition}, ${HAT_COLORS[hat.color] ?? hat.color}, de ${HAT_MATERIALS[hat.material] ?? hat.material}.`,
    },
  });

const assignCharacterSlots = async (actor, items) => {
  const slotMap = {
    head: ["headSlot"],
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

  const updates = {};
  for (const item of items) {
    const slot = slotMap[item.system.slot] ? item.system.slot : "pocket";
    const key = slotMap[slot].find((candidate) => !updates[`system.${candidate}Id`] && !actor.system[`${candidate}Id`]);
    if (!key) continue;
    updates[`system.${key}`] = item.name;
    updates[`system.${key}Id`] = item.id;
  }

  if (Object.keys(updates).length) {
    await actor.update(updates);
  }
};

const assignHorseSlots = async (actor, items) => {
  const updates = {};
  for (let index = 0; index < Math.min(items.length, 10); index += 1) {
    const key = `slot${index + 1}`;
    updates[`system.${key}`] = items[index].name;
    updates[`system.${key}Id`] = items[index].id;
  }
  if (Object.keys(updates).length) {
    await actor.update(updates);
  }
};

const parseHorseStatBlock = (text) => {
  const match = normalizeText(text).match(/HP\s+(\d+)\s+Mor(?:ale|al)\s+(\d+),?\s*(.*)/i);
  if (!match) {
    return { hp: 5, morale: 7, notes: normalizeText(text) };
  }
  return {
    hp: Number(match[1]) || 5,
    morale: Number(match[2]) || 7,
    notes: match[3] || "",
  };
};

const ensureCatalog = async () => {
  const seeded = game.items.find((item) => item.getFlag(FS.systemId, "catalogId"));
  if (!seeded) {
    await seedItemCatalog();
  }
};

const generateCharacterPayload = async () => {
  const data = await loadRandomData();
  const currentBonus = {
    skill: [...data.bonus.skill],
    item: [...data.bonus.item],
  };

  const first = pickRandom(data.name.first);
  const last = pickRandom(data.name.last);
  const outlawA = translateGeneratedText(pickRandom(data.outlaw.with));
  const outlawB = translateGeneratedText(await expandPlaceholders(pickRandom(data.outlaw.and)));

  const adjectiveRoll = await rollFormula("1d12");
  const nounRoll = await rollFormula("1d12");
  const crime = `${data.crimes.adjective[adjectiveRoll - 1]} ${data.crimes.noun[nounRoll - 1]}`;
  const reward = (adjectiveRoll + nounRoll) * 10;
  const wanted = WANTED_STATE_KEYS[tableByRoll(data.deadOrAlive, await rollFormula("1d4"))?.name] ?? "deadOrAlive";

  const backgroundSource = pickRandom(data.backgrounds);
  const backgroundSkills = [...backgroundSource.skills];
  const backgroundItems = [...backgroundSource.items];

  const drawBonusSkill = () => pickRandom(currentBonus.skill, true);
  const drawBonusItem = () => pickRandom(currentBonus.item, true);

  const resolveSkill = (text) => translateGeneratedText(text === "#{BONUS_SKILL}" ? drawBonusSkill() : text);
  const resolveItem = async (value) => {
    if (value === "#{BONUS_ITEM}") {
      const entry = drawBonusItem();
      const base = await expandPlaceholders(entry.name);
      const variant = entry.variants?.length ? await expandPlaceholders(pickRandom(entry.variants)) : "";
      return normalizeText([base, variant].filter(Boolean).join(" "));
    }
    return expandPlaceholders(value);
  };

  const background = {
    name: translateBackground(backgroundSource.name),
    skills: [resolveSkill(pickRandom(backgroundSkills, true)), resolveSkill(pickRandom(backgroundSkills, true))],
    items: [await resolveItem(pickRandom(backgroundItems, true)), await resolveItem(pickRandom(backgroundItems, true))],
  };

  const bonusEntry = drawBonusItem();
  const bonusItem = normalizeText([
    await expandPlaceholders(bonusEntry.name),
    bonusEntry.variants?.length ? await expandPlaceholders(pickRandom(bonusEntry.variants)) : "",
  ].filter(Boolean).join(" "));
  const bonusSkill = translateGeneratedText(drawBonusSkill());

  const horseTypeEntry = tableByRoll(data.horse.types, await rollFormula("1d20"));
  const horse = {
    type: translateHorseType(horseTypeEntry.type),
    coat: translateCoat(pickRandom(data.horse.coat)),
    likes: translateGeneratedText(pickRandom(data.horse.likes)),
    notes: translateHorseNotes(await expandPlaceholders(horseTypeEntry.notes)),
  };

  const gunKey = (() => {
    const roll = new Roll("2d6");
    return roll.evaluate().then((evaluated) => {
      const [tens, units] = evaluated.dice[0].results.map((result) => result.result);
      return tableByRoll(data.guns, Number(`${tens}${units}`))?.name ?? data.guns[0].name;
    });
  })();

  const hat = {
    color: pickRandom(data.hats.colors),
    material: pickRandom(data.hats.materials),
    condition: pickRandom(data.hats.conditions),
  };

  const grit = await rollFormula("1d4-1d4");
  const slick = await rollFormula("1d4-1d4");
  const wits = await rollFormula("1d4-1d4");
  const luck = await rollFormula("1d4-1d4");
  const hp = Math.max(1, await rollFormula(`1d6+${grit}`));
  const silverNegatives = [grit, slick, wits, luck].filter((value) => value < 0).length;
  const silver = silverNegatives > 0 ? await rollFormula(`${silverNegatives}d10`) : 0;

  return {
    name: `${first} ${last}`,
    outlaw: [outlawA, outlawB],
    crime: translateCrime(crime),
    reward,
    wanted,
    background,
    bonusSkill,
    bonusItem,
    horse,
    gun: await gunKey,
    hat,
    abilities: { grit, slick, wits, luck },
    hp,
    silver,
  };
};

export const createRandomCharacter = async () => {
  await ensureCatalog();
  const generated = await generateCharacterPayload();

  const actor = await Actor.create({
    name: generated.name,
    type: "character",
    system: {
      background: generated.background.name,
      history: [
        `Rasgos: ${generated.outlaw.join(" y ")}.`,
        `Trasfondo aleatorio: ${generated.background.skills.join(" | ")}.`,
        `Golpe de suerte o desgracia: ${generated.bonusSkill}.`,
        `Montura robada: ${generated.horse.type} de pelaje ${generated.horse.coat}. Le gusta ${generated.horse.likes}.`,
      ].join("\n"),
      wanted: generated.wanted,
      wantedCrime: generated.crime,
      reward: generated.reward,
      silver: generated.silver,
      aces: 1,
      skill1: generated.background.skills[0],
      skill2: generated.background.skills[1],
      skill3: generated.bonusSkill,
    },
  });

  await actor.update({
    "system.abilities.grit": generated.abilities.grit,
    "system.abilities.slick": generated.abilities.slick,
    "system.abilities.wits": generated.abilities.wits,
    "system.abilities.luck": generated.abilities.luck,
    "system.hp.max": generated.hp,
    "system.hp.value": generated.hp,
  });

  const gunItem = catalogClone(GUN_CATALOG[generated.gun] ?? "revolver");
  const gunCatalogId = GUN_CATALOG[generated.gun] ?? "revolver";
  const ammoItem = catalogClone(GUN_AMMO[gunCatalogId]);
  const hatItem = buildHatItem(generated.hat);
  const miscItems = [...generated.background.items, generated.bonusItem].map(parseItemText);
  const characterItemsData = [
    gunItem,
    ammoItem,
    hatItem,
    catalogClone("canteen"),
    ...miscItems.filter((item) => item.system.slot !== "horse"),
  ].filter(Boolean);
  const horseItemsData = [
    catalogClone("saddle"),
    catalogClone("saddlebags"),
    ...miscItems.filter((item) => item.system.slot === "horse"),
  ].filter(Boolean);

  const createdCharacterItems = characterItemsData.length
    ? await actor.createEmbeddedDocuments("Item", characterItemsData)
    : [];
  await assignCharacterSlots(actor, createdCharacterItems);

  const horseStats = parseHorseStatBlock(generated.horse.notes);
  const horseActor = await Actor.create({
    name: `Montura de ${generated.name}`,
    type: "horse",
    system: {
      type: generated.horse.type,
      likes: generated.horse.likes,
      vehicle: `Pelaje: ${generated.horse.coat}`,
      stolen: true,
      morale: horseStats.morale,
      notes: horseStats.notes,
    },
  });

  await horseActor.update({
    "system.hp.max": horseStats.hp,
    "system.hp.value": horseStats.hp,
  });

  if (horseItemsData.length) {
    const createdHorseItems = await horseActor.createEmbeddedDocuments("Item", horseItemsData);
    await assignHorseSlots(horseActor, createdHorseItems);
  }

  actor.sheet?.render?.(true);
  ui.notifications.info(`Se ha creado a ${actor.name} y su montura robada.`);
  return { actor, horseActor, generated };
};

const translateHistoryLine = (line) => {
  const normalized = normalizeText(line);
  if (!normalized) return normalized;

  if (normalized.startsWith("Rasgos: ")) {
    const content = normalized.replace(/^Rasgos:\s*/u, "").replace(/\.$/, "");
    const parts = content.split(/\s+y\s+/).map((part) => translateGeneratedText(part));
    return `Rasgos: ${parts.join(" y ")}.`;
  }

  if (normalized.startsWith("Trasfondo aleatorio: ")) {
    const content = normalized.replace(/^Trasfondo aleatorio:\s*/u, "").replace(/\.$/, "");
    const parts = content.split(/\s+\|\s+/).map((part) => translateGeneratedText(part));
    return `Trasfondo aleatorio: ${parts.join(" | ")}.`;
  }

  if (normalized.startsWith("Golpe de suerte o desgracia: ")) {
    const content = normalized.replace(/^Golpe de suerte o desgracia:\s*/u, "").replace(/\.$/, "");
    return `Golpe de suerte o desgracia: ${translateGeneratedText(content)}.`;
  }

  if (normalized.startsWith("Montura robada: ")) {
    const match = normalized.match(/^Montura robada:\s+(.+?)\s+de pelaje\s+(.+?)\.\s+Le gusta\s+(.+?)\.$/i);
    if (match) {
      return `Montura robada: ${translateHorseType(match[1])} de pelaje ${translateCoat(match[2])}. Le gusta ${translateGeneratedText(match[3])}.`;
    }
  }

  return translateGeneratedText(normalized);
};

const stripGeneratedNickname = (name) =>
  normalizeText(name).replace(/^(\S+)\s+[“"][^”"]+[”"]\s+(\S+)$/u, "$1 $2");

export const migrateGeneratedCharacters = async (silent = false) => {
  if (!game.user?.isGM) return [];

  const updated = [];

  for (const actor of game.actors) {
    if (!["character", "horse"].includes(actor.type)) continue;
    const changes = {};

    if (actor.type === "character") {
      const history = String(actor.system.history || "");
      const translatedHistory = history
        .split("\n")
        .map((line) => translateHistoryLine(line))
        .join("\n");
      if (history && translatedHistory !== history) {
        changes["system.history"] = translatedHistory;
      }

      const background = String(actor.system.background || "");
      const translatedBackground = translateBackground(background);
      if (background && translatedBackground !== background) {
        changes["system.background"] = translatedBackground;
      }

      for (const key of ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"]) {
        const current = String(actor.system[key] || "");
        const translated = translateGeneratedText(current);
        if (current && translated !== current) {
          changes[`system.${key}`] = translated;
        }
      }

      const cleanName = stripGeneratedNickname(actor.name);
      if (cleanName && cleanName !== actor.name && history.includes("Rasgos:")) {
        changes.name = cleanName;
      }
    }

    if (actor.type === "horse") {
      const currentType = String(actor.system.type || "");
      const translatedType = translateHorseType(currentType);
      if (currentType && translatedType !== currentType) {
        changes["system.type"] = translatedType;
      }

      const currentLikes = String(actor.system.likes || "");
      const translatedLikes = translateGeneratedText(currentLikes);
      if (currentLikes && translatedLikes !== currentLikes) {
        changes["system.likes"] = translatedLikes;
      }

      const currentVehicle = String(actor.system.vehicle || "");
      const translatedVehicle = normalizeText(currentVehicle).replace(/^Pelaje:\s+(.+)$/i, (_m, coat) => `Pelaje: ${translateCoat(coat)}`);
      if (currentVehicle && translatedVehicle !== currentVehicle) {
        changes["system.vehicle"] = translatedVehicle;
      }

      const currentNotes = String(actor.system.notes || "");
      const translatedNotes = translateHorseNotes(currentNotes);
      if (currentNotes && translatedNotes !== currentNotes) {
        changes["system.notes"] = translatedNotes;
      }
    }

    if (Object.keys(changes).length) {
      await actor.update(changes);
      updated.push(actor);
    }
  }

  if (!silent && updated.length) {
    ui.notifications.info(`Se han actualizado ${updated.length} actores generados con textos en castellano.`);
  }

  return updated;
};

const injectActorDirectoryButton = (html) => {
  const rawRoot = html instanceof HTMLElement ? html : html?.[0];
  if (!rawRoot) return;
  if (!(game.user?.isGM || game.user?.can?.("ACTOR_CREATE"))) return;

  const root =
    rawRoot.matches?.('[data-tab="actors"]')
      ? rawRoot
      : rawRoot.querySelector?.('[data-tab="actors"]') || rawRoot;

  if (!root || root.querySelector(".fs-random-character")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "fs-random-character";
  button.title = "Crea un personaje aleatorio siguiendo las tablas de Frontier Scum.";
  button.innerHTML = `<i class="fas fa-dice-d20"></i> PJ aleatorio`;
  button.addEventListener("click", () => createRandomCharacter());

  const actions = root.querySelector(".header-actions.action-buttons, .header-actions");
  if (actions) {
    actions.append(button);
    return;
  }

  const dirHeader = root.querySelector(".directory-header");
  if (!dirHeader?.parentNode) return;

  const header = document.createElement("header");
  header.classList.add("directory-header", "fs-random-character-header");
  const wrapper = document.createElement("div");
  wrapper.classList.add("header-actions", "action-buttons", "flexrow");
  wrapper.append(button);
  header.append(wrapper);
  dirHeader.parentNode.insertBefore(header, dirHeader);
};

export const registerActorDirectoryButton = () => {
  Hooks.on("renderActorDirectory", (_app, html) => {
    injectActorDirectoryButton(html);
  });

  Hooks.on("renderSidebarTab", (app, html) => {
    if (app?.tabName !== "actors") return;
    injectActorDirectoryButton(html);
  });
};
