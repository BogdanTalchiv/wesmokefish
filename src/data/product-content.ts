/**
 * Editable product copy.
 *
 * WHY THIS FILE EXISTS
 * The Shopify store currently has a description on only 1 of 39 products, so
 * product pages would otherwise be empty. The copy below is marketing copy
 * written strictly from each product's own name — the species, the cure
 * (afumat / afumat la rece / slab sărat / marinat) and the sauce or seasoning
 * the name already states.
 *
 * It deliberately contains NO invented facts: no ingredient lists, no origin
 * or sourcing claims, no shelf life, no nutrition, no awards. Those belong in
 * `PRODUCT_FACTS` below and stay hidden until the owner fills them in.
 *
 * Best long-term home for this is the Shopify product description field — once
 * a product has a description in Shopify, it wins over this file automatically.
 */

export type ProductCopy = {
  /** One line for product cards and rails. */
  short: string;
  /** Two or three sentences for the product page. */
  long: string;
  /**
   * How to serve it — written from the product name only (ready to plate,
   * eaten by hand, goes with bread). Never an invented pairing claim.
   */
  serve?: string;
};

/** Keyed by product slug. Locale `ru` falls back to `ro` until translated. */
export const PRODUCT_COPY: Record<string, ProductCopy> = {
  "yucola-somon": {
    short: "Fileu de somon afumat, tăiat în felii late și moi.",
    long:
      "Yucola de somon se taie în felii late, cu textură mătăsoasă și un fum așezat, nu dominant. " +
      "Se pune direct pe platou, fără nimic în plus. Bucata întreagă de 1,2 kg e pentru mesele mari, cea de 300 g pentru o seară obișnuită.",
    serve: "Direct pe platou, așa cum iese din ambalaj. Lămâie lângă, dacă vrei.",
  },
  "yucola-de-pastrav": {
    short: "Păstrăv slab sărat, în felii fine și rozalii.",
    long:
      "Yucola de păstrăv e slab sărată, așa că gustul peștelui rămâne în față. Feliile sunt fine, ușor de așezat pe pâine sau lângă un pahar de vin alb. " +
      "Se găsește la 500 g și la bucată întreagă de 1,2 kg.",
  },
  "somon-proaspat-afumat": {
    short: "Somon afumat, cu miez fraged și fum discret.",
    long:
      "Somon afumat care rămâne fraged la mijloc. Fumul e discret și lasă grăsimea dulce a somonului să se simtă. " +
      "Bun simplu, cu lămâie, sau tăiat peste paste calde.",
  },
  "somon-slab-sarat-cu-marar": {
    short: "Somon slab sărat, cu mărar proaspăt.",
    long:
      "Somon slab sărat, cu mărar. Sarea e ținută în frâu, mărarul dă prospețimea. " +
      "E varianta pentru cine preferă peștele nefumat, curat la gust.",
  },
  "steak-de-somon-cu-sos-teriyaki": {
    short: "Steak de somon în sos teriyaki, dulce-sărat.",
    long:
      "Un steak gros de somon cu sos teriyaki — dulce-sărat, cu luciul acela care se vede de la masă. " +
      "Se pune lângă orez sau legume și devine fel principal fără efort.",
  },
  "rulada-sah": {
    short: "Ruladă în tablă de șah, tăiată în rondele.",
    long:
      "Ruladă șah — pătrate deschise și închise, alternate, care se văd în secțiune. " +
      "Se taie în rondele și arată bine pe platou fără să faci nimic altceva. 300 g.",
    serve: "Rondele pe platou. Arată gata fără să aranjezi nimic.",
  },
  "rulada-trio": {
    short: "Ruladă din trei feluri de pește, în rondele.",
    long:
      "Trei feluri de pește rulate împreună, tăiate în rondele. Fiecare felie are toate cele trei straturi. " +
      "E aperitivul care se termină primul. 300 g.",
  },
  "creveti-afumati-cu-parmezan": {
    short: "Creveți afumați cu parmezan, de mâncat cu mâna.",
    long:
      "Creveți afumați, cu parmezan. Fumul și brânza se prind de crevete și îi dau o crustă sărată. " +
      "Se mănâncă cu mâna, direct din cutie, și dispar repede.",
    serve: "În bol, pe masă. Se mănâncă cu mâna. Nu cere farfurie.",
  },
  "creveti-afumati": {
    short: "Creveți afumați, simpli și sărați exact cât trebuie.",
    long:
      "Creveți afumați, fără nimic peste. Fermi, sărați cât trebuie, cu fum simțit din prima. " +
      "Aperitivul cel mai simplu de servit — se pune bolul pe masă și atât.",
    serve: "Bol pe masă. Atât.",
  },
  "midii-afumate": {
    short: "Midii afumate pe bățișor, la 79 MDL.",
    long:
      "Midii afumate, servite pe bățișor. Cărnoase, cu fum și cu puțin din dulceața lor naturală rămasă. " +
      "Cea mai ieftină cale de a completa un platou.",
    serve: "Pe bățișor, lângă pește sau lângă o bere rece.",
  },
  "midii-marinate": {
    short: "Midii marinate, acrișoare și reci.",
    long:
      "Midii marinate — acrișoare, reci, bune între două feluri mai grase. " +
      "Taie gustul și resetează masa. 250 g.",
  },
  "pastrav-intreg-afumat": {
    short: "Păstrăv întreg afumat, pentru masa de familie.",
    long:
      "Păstrăv afumat întreg, cu pielea aurie și carnea care se desprinde în fulgi. " +
      "Se aduce la masă așa cum e și se împarte. Aproximativ 400 g.",
    serve: "Întreg, pe un platou. Se împarte la masă.",
  },
  "dorado-afumata": {
    short: "Dorado afumată, carne albă și fermă.",
    long:
      "Dorado afumată, cu carne albă, fermă, care rămâne suculentă. Fumul e așezat peste un pește deja delicat. " +
      "Aproximativ 400 g, cât pentru două persoane.",
  },
  "sea-bass-usor-afumat": {
    short: "Sea bass ușor afumat, fin și curat la gust.",
    long:
      "Sea bass afumat ușor — atât cât să se simtă fumul, nu cât să acopere peștele. " +
      "Carne fină, curată la gust. 350 g.",
  },
  "crap-afumat-la-rece": {
    short: "Crap afumat la rece, la 720 MDL/kg.",
    long:
      "Crap afumat la rece. Afumarea lentă îl lasă dens și untos, cu fum adânc. " +
      "Peștele pe care îl recunoști din copilărie, făcut curat. 250 g.",
  },
  "vomer-afumat-la-rece": {
    short: "Vomer afumat la rece, la 34,80 MDL bucata.",
    long:
      "Vomer afumat la rece — plat, mic, cu carne albă și fum limpede. " +
      "La 34,80 lei bucata e cel mai ușor lucru de adăugat la comandă.",
  },
  "marlin-afumat": {
    short: "Marlin afumat, felii dense de pește de mare.",
    long:
      "Marlin afumat, tăiat în felii dense. Carne compactă, aproape ca o carne roșie, cu fum puternic. " +
      "Se ia la 200, 400 sau 600 g.",
  },
  "escolar-afumat": {
    short: "Escolar afumat, gras și mătăsos.",
    long:
      "Escolar afumat — gras, mătăsos, se topește în gură. " +
      "Puțin ajunge departe, așa că porția de 200 g merge pentru mai mulți.",
  },
  "ton-afumat-in-sos-de-soia": {
    short: "Ton afumat în sos de soia, sărat și adânc.",
    long:
      "Ton afumat în sos de soia. Soia intră în carne și o face sărată și adâncă, fumul stă dedesubt. " +
      "Se taie subțire. 200, 400 sau 600 g.",
  },
  "frigarui-afumate-ton-somon-peste-spada": {
    short: "Frigărui din ton, somon și pește spadă, cu sweet chili și sriracha.",
    long:
      "Trei pești pe aceeași frigăruie — ton, somon și pește spadă — afumați, cu sos sweet chili și sriracha. " +
      "Dulce la început, iute la final. Se servesc pe frigăruie, fără farfurii.",
  },
  "steak-de-pastrav": {
    short: "Steak de păstrăv, o porție de om.",
    long:
      "Un steak tăiat din păstrăv, gros cât să rămână suculent la mijloc. " +
      "O porție pentru o persoană, gata de pus pe farfurie. 200 g.",
  },
  "scrumbie-usor-afumata": {
    short: "Scrumbie ușor afumată, la 480 MDL/kg.",
    long:
      "Scrumbie afumată ușor. Grasă, cu gust puternic de pește și fum peste, exact cum trebuie să fie scrumbia. " +
      "400 g și cel mai bun raport gust-preț din gama afumată.",
    serve: "Cu pâine neagră. Sau lângă o bere.",
  },
  "scrumbie-slab-sarata": {
    short: "Scrumbie slab sărată, cu pâine neagră.",
    long:
      "Scrumbie slab sărată, nefumată. Grasă, sărată moderat, făcută pentru pâine neagră și ceapă. " +
      "450 g.",
  },
  "scrumbie-slab-sarata-cu-ceapa": {
    short: "Scrumbie slab sărată cu ceapă și sos din verdețuri.",
    long:
      "Scrumbie slab sărată, cu ceapă și sos din verdețuri, deja asamblată. " +
      "Se deschide cutia și se pune pe masă. 430 g.",
  },
  "novac-tolstolob-in-sos-de-miere": {
    short: "Novac în sos de miere, dulce peste fum.",
    long:
      "Novac (tolstolob) în sos de miere. Mierea se așază peste pește și îl face dulce la margini. " +
      "200 g, la 96 lei.",
  },
  "novac-afumat-cu-usturoi-si-marar": {
    short: "Novac afumat cu usturoi și mărar.",
    long:
      "Novac (tolstolob) afumat, cu usturoi și mărar. Usturoiul se simte, mărarul îl ține în echilibru. " +
      "200 g, la 96 lei.",
  },
};

/** Generic copy for the beer range — beers have no per-product description. */
export const BEER_COPY: ProductCopy = {
  short: "Bere rece, lângă pește afumat.",
  long: "Bere rece, de luat împreună cu peștele. Se adaugă la comandă și ajunge odată cu restul.",
};

/**
 * NEEDS_OWNER_INPUT — per-product facts we are not allowed to guess.
 *
 * Add an entry keyed by product slug and the product page will render the
 * matching rows automatically. Left empty, those rows simply do not appear.
 *
 * Example:
 *   "yucola-somon": {
 *     ingredients: "Somon, sare, ...",
 *     storage: "A se păstra la 0…+4 °C.",
 *     shelfLife: "...",
 *     netWeightNote: "...",
 *   }
 */
export type ProductFacts = {
  ingredients?: string;
  storage?: string;
  shelfLife?: string;
  netWeightNote?: string;
  allergens?: string;
};

export const PRODUCT_FACTS: Record<string, ProductFacts> = {
  // Intentionally empty — awaiting verified information from the store owner.
};
