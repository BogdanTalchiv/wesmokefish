/**
 * Romanian copy — the primary language of the storefront.
 *
 * Written to read like a Moldovan food brand talking to a customer, not like a
 * translated template. Claims are limited to what the audit verified.
 */
const ro = {
  meta: {
    siteName: "WeSmokeFish",
    tagline: "Pește și fructe de mare afumate",
    home: {
      title: "WeSmokeFish — pește și fructe de mare afumate, livrate în Chișinău",
      description:
        "Somon, păstrăv, creveți și midii afumate, tăiate și ambalate pentru masa ta. Comandă online, livrare în aceeași zi pentru comenzile de până la 17:00. Livrare gratuită de la 1.200 MDL.",
    },
    products: {
      title: "Toate produsele — pește și fructe de mare afumate",
      description:
        "Gama completă WeSmokeFish: pește afumat, fructe de mare, produse slab sărate și marinate, bere. Prețuri pe bucată și pe kilogram.",
    },
    delivery: {
      title: "Livrare — condiții, intervale și cost",
      description:
        "Livrare gratuită de la 1.200 MDL. Comenzile plasate între 11:00 și 17:00 se livrează în aceeași zi, între 18:00 și 22:00.",
    },
    contact: {
      title: "Contact — WeSmokeFish Chișinău",
      description: "Telefon +373 682 22 200, wesmokefishmd@gmail.com, Șoseaua Balcani 7B, Chișinău.",
    },
    faq: {
      title: "Întrebări frecvente",
      description: "Răspunsuri despre livrare, comandă, plată și produse WeSmokeFish.",
    },
    about: {
      title: "Despre noi — WeSmokeFish",
      description: "Cine suntem și cum ajunge peștele afumat de la noi pe masa ta.",
    },
  },

  nav: {
    products: "Produse",
    categories: "Categorii",
    delivery: "Livrare",
    about: "Despre noi",
    contact: "Contact",
    faq: "Întrebări frecvente",
    allProducts: "Vezi toate produsele",
    menu: "Meniu",
    closeMenu: "Închide meniul",
    openMenu: "Deschide meniul",
    skipToContent: "Sari la conținut",
    home: "Acasă",
  },

  announcement: {
    freeShipping: "Livrare gratuită de la {amount}",
    sameDay: "Comenzi până la 17:00 — livrate azi, 18:00–22:00",
    call: "Comandă la telefon",
  },

  hero: {
    eyebrow: "Pește & fructe de mare afumate",
    headline: "Fum adevărat.\nPește adevărat.",
    headlinePlain: "Fum adevărat. Pește adevărat.",
    sub: "Somon, păstrăv, creveți și midii — afumate, tăiate și ambalate ca să ajungă direct pe masă. Comanzi până la 17:00, mănânci în aceeași seară.",
    ctaPrimary: "Vezi produsele",
    ctaSecondary: "Comandă acum",
    badges: {
      freeShipping: "Livrare gratuită de la {amount}",
      sameDay: "Livrare în aceeași zi",
      chisinau: "Chișinău",
    },
    scroll: "Derulează",
  },

  trust: {
    ordering: { title: "Comandă simplă", body: "Alegi gramajul, adaugi în coș, plătești. Fără cont, fără pași în plus." },
    delivery: { title: "Livrare rapidă", body: "Comenzile de până la 17:00 ajung în aceeași seară, între 18:00 și 22:00." },
    packaging: { title: "Ambalare atentă", body: "Ambalaje sustenabile, cu impact redus asupra mediului." },
    freeShipping: { title: "Livrare gratuită", body: "Gratuit la comenzile de la {amount}. Sub acest prag, te sunăm cu costul exact." },
  },

  categories: {
    eyebrow: "Categorii",
    title: "De unde începi",
    sub: "Trei rafturi. Alege-l pe al tău.",
    view: "Vezi categoria",
    productCount: "{count} produse",
    names: {
      "peste-si-fructe-de-mare-afumate": "Afumate",
      "slab-sarat-si-marinat": "Slab sărate & marinate",
      bere: "Bere",
    },
    blurbs: {
      "peste-si-fructe-de-mare-afumate": "Somon, păstrăv, ton, creveți, midii. Tot ce trece prin afumătoare.",
      "slab-sarat-si-marinat": "Fără fum. Doar sare, mărar și marinată.",
      bere: "Rece, lângă pește. Se adaugă la aceeași comandă.",
    },
  },

  bestsellers: {
    eyebrow: "Cele mai vândute",
    title: "Cele mai iubite",
    sub: "Produsele care se termină primele.",
    cta: "Vezi toate produsele",
  },

  weekly: {
    eyebrow: "Produsele săptămânii",
    title: "Selecția săptămânii",
    sub: "Pește afumat pregătit cu grijă, pentru mesele în familie, platouri festive sau momentele în care vrei ceva cu adevărat special.",
  },

  signature: {
    eyebrow: "Semnătura noastră",
    title: "Yucola de somon",
    body: "Dacă iei un singur lucru de la noi, ia asta. Fileu de somon afumat, tăiat în felii late care se așază singure pe platou. Fumul stă în fundal — somonul rămâne în față.",
    reasonsTitle: "De ce se ia cel mai des",
    reasons: [
      "Se servește direct din ambalaj, fără pregătire.",
      "Bucata întreagă de 1,2 kg acoperă o masă de sărbătoare.",
      "Trei gramaje, de la o seară obișnuită până la petrecere.",
    ],
    cta: "Adaugă în coș",
    view: "Vezi produsul",
  },

  process: {
    eyebrow: "Cum lucrăm",
    title: "De la pește la masa ta",
    sub: "Cinci pași. Niciunul sărit.",
    steps: [
      { n: "01", title: "Selecție", body: "Alegem peștele și fructele de mare din care merită să facem ceva." },
      { n: "02", title: "Pregătire", body: "Curățat, porționat, sărat sau marinat, în funcție de produs." },
      { n: "03", title: "Afumare", body: "La rece sau ușor, cât cere fiecare pește. Fumul nu acoperă gustul." },
      { n: "04", title: "Ambalare", body: "Porționat la gramaj și închis în ambalaje sustenabile." },
      { n: "05", title: "Livrare", body: "Pornește spre tine în intervalul de livrare care urmează comenzii." },
    ],
    note: "Descriere generală a fluxului de lucru. Detaliile tehnice de afumare pot fi completate de echipa WeSmokeFish.",
  },

  editorial: {
    line1: "Unele lucruri nu au nevoie de explicații.",
    line2: "Deschizi cutia. Miroase a fum. Și știi deja.",
    cta: "Descoperă produsele",
  },

  reviews: {
    eyebrow: "Recenzii",
    title: "De ce revin clienții noștri",
    empty: {
      title: "Recenziile se adaugă în curând",
      body: "Colectăm recenzii reale de la clienți. Până atunci, preferăm să nu afișăm note pe care nu le putem dovedi.",
      cta: "Scrie-ne pe Instagram",
    },
    ratingOutOf: "{value} din 5",
    basedOn: "pe baza a {count} recenzii",
  },

  ugc: {
    eyebrow: "@wesmokefishmd",
    title: "Pe mesele voastre",
    sub: "Urmărește-ne pe Instagram și TikTok.",
    instagram: "Instagram",
    tiktok: "TikTok",
  },

  delivery: {
    eyebrow: "Livrare",
    title: "Cum ajunge la tine",
    sub: "Fără surprize la final.",
    freeTitle: "Livrare gratuită de la {amount}",
    freeBody: "Comenzile de la {amount} se livrează gratuit.",
    feeUnknown: "Pentru comenzile sub {amount}, costul livrării ți-l confirmăm telefonic la preluarea comenzii.",
    feeKnown: "Pentru comenzile sub {amount}, livrarea costă {fee}.",
    windowsTitle: "Intervale de livrare",
    windowSameDay: "Comenzile preluate între {from} și {to} se livrează în aceeași zi, între {dFrom} și {dTo}.",
    windowNextDay: "Comenzile preluate între {from} și {to} se livrează a doua zi, între {dFrom} și {dTo}.",
    zoneTitle: "Zonă de livrare",
    zoneUnknown: "Livrăm din Chișinău, Șoseaua Balcani 7B. Pentru adresa ta exactă, scrie-ne sau sună-ne și confirmăm imediat.",
    zoneKnown: "Livrăm în {zone}.",
    howTitle: "Cum comanzi",
    howSteps: [
      "Alegi produsele și gramajul.",
      "Adaugi în coș și mergi la checkout.",
      "Completezi adresa și plătești securizat.",
      "Te sunăm pentru confirmare și îți spunem intervalul.",
    ],
    contactTitle: "Preferi să comanzi prin telefon?",
    contactBody: "Sună-ne și îți luăm comanda direct.",
    cta: "Vezi condițiile complete",
  },

  faq: {
    eyebrow: "Întrebări frecvente",
    title: "Ce ne întreabă cel mai des",
    items: [
      {
        q: "Cât costă livrarea?",
        a: "Livrarea este gratuită pentru comenzile de la 1.200 MDL. Pentru comenzile sub acest prag, costul exact ți-l confirmăm telefonic atunci când preluăm comanda.",
      },
      {
        q: "Cât durează până primesc comanda?",
        a: "Comenzile preluate între 11:00 și 17:00 se livrează în aceeași zi, între 18:00 și 22:00. Comenzile preluate între 17:00 și 11:00 se livrează a doua zi, între 12:00 și 17:00.",
      },
      {
        q: "Unde livrați?",
        a: "Livrăm din Chișinău, Șoseaua Balcani 7B. Dacă vrei să fii sigur că ajungem la adresa ta, sună-ne la +373 682 22 200 și confirmăm pe loc.",
      },
      {
        q: "Trebuie să îmi fac cont ca să comand?",
        a: "Nu. Poți comanda ca oaspete, fără să îți creezi cont.",
      },
      {
        q: "Ce înseamnă prețul pe kilogram de lângă produs?",
        a: "Prețul mare este prețul pentru gramajul pe care l-ai selectat. Prețul pe kilogram este acolo ca să poți compara corect produsele între ele.",
      },
      {
        q: "Gramajul este exact?",
        a: "La unele produse gramajul este aproximativ și este marcat cu „±” în selectorul de gramaj, pentru că peștele se porționează natural.",
      },
      {
        q: "Pot comanda și bere odată cu peștele?",
        a: "Da. Berea se adaugă în același coș și ajunge cu aceeași livrare.",
      },
      {
        q: "Cum pot plăti?",
        a: "Plata se face securizat la checkout. Opțiunile disponibile îți apar în pasul de plată.",
      },
    ],
    moreTitle: "Nu ai găsit răspunsul?",
    moreBody: "Sună-ne și lămurim orice în câteva minute.",
  },

  finalCta: {
    title: "Pune-l pe masă în seara asta",
    body: "Comenzile preluate până la 17:00 ajung între 18:00 și 22:00.",
    ctaPrimary: "Vezi produsele",
    ctaSecondary: "Sună acum",
  },

  product: {
    addToCart: "Adaugă în coș",
    buyNow: "Cumpără acum",
    adding: "Se adaugă…",
    added: "Adăugat în coș",
    soldOut: "Stoc epuizat",
    quantity: "Cantitate",
    increase: "Crește cantitatea",
    decrease: "Scade cantitatea",
    perKg: "{price} / kg",
    from: "de la {price}",
    selectWeight: "Gramaj",
    weightApprox: "Gramaj aproximativ",
    description: "Descriere",
    details: "Detalii",
    ingredients: "Ingrediente",
    storage: "Păstrare",
    shelfLife: "Termen de valabilitate",
    allergens: "Alergeni",
    factsMissing: "Informațiile despre ingrediente și păstrare se completează de echipa WeSmokeFish.",
    deliveryTitle: "Livrare",
    related: "S-ar potrivi alături",
    boughtTogether: "Se comandă des împreună",
    addBoth: "Adaugă tot setul",
    totalForSet: "Total set",
    quickView: "Vizualizare rapidă",
    viewProduct: "Vezi produsul",
    openGallery: "Mărește imaginea",
    imageOf: "Imaginea {index} din {total}",
    gramsShort: "g",
    bestseller: "Cele mai vândute",
    new: "Nou",
    recentlyViewed: "Văzute recent",
    priceNote: "Preț pentru gramajul selectat",
    oneImageOnly: "Acest produs are deocamdată o singură fotografie.",
  },

  cart: {
    title: "Coșul tău",
    open: "Deschide coșul",
    close: "Închide coșul",
    empty: "Coșul e gol",
    emptyBody: "Începe cu cele mai vândute — se termină primele.",
    emptyCta: "Vezi produsele",
    subtotal: "Subtotal",
    checkout: "Finalizează comanda",
    continueShopping: "Continuă cumpărăturile",
    remove: "Elimină",
    removeItem: "Elimină {title} din coș",
    itemCount: "{count} produse",
    itemCountOne: "1 produs",
    freeShippingReached: "Livrare gratuită deblocată",
    freeShippingProgress: "Mai adaugă {amount} pentru livrare gratuită",
    deliveryNote: "Costul livrării se calculează la checkout.",
    crossSellTitle: "Completează comanda",
    thresholdNudgeTitle: "Adaugă puțin și scapi de costul livrării",
    quickAdd: "Adaugă",
    checkoutNote: "Plata se face securizat pe wesmokefish.md.",
    redirecting: "Te ducem la checkout…",
  },

  search: {
    open: "Caută",
    placeholder: "Caută somon, creveți, păstrăv…",
    label: "Caută produse",
    clear: "Șterge căutarea",
    noResults: "Nu am găsit nimic pentru „{query}”",
    noResultsBody: "Încearcă „somon”, „creveți”, „midii” sau „afumat”.",
    resultsCount: "{count} rezultate",
    viewAll: "Vezi toate rezultatele",
    suggestions: "Căutări populare",
    popular: ["somon", "creveți", "midii", "păstrăv", "pește afumat", "scrumbie"],
    close: "Închide căutarea",
  },

  collection: {
    all: "Toate produsele",
    allSub: "Gama completă WeSmokeFish.",
    filters: "Filtre",
    openFilters: "Deschide filtrele",
    applyFilters: "Vezi rezultatele",
    clearFilters: "Resetează",
    activeFilters: "{count} filtre active",
    sort: "Sortează",
    sortOptions: {
      recommended: "Recomandate",
      priceAsc: "Preț crescător",
      priceDesc: "Preț descrescător",
      perKgAsc: "Preț/kg crescător",
      nameAsc: "Alfabetic",
      newest: "Cele mai noi",
    },
    category: "Categorie",
    priceRange: "Preț",
    availability: "Disponibilitate",
    inStock: "În stoc",
    resultCount: "{count} produse",
    resultCountOne: "1 produs",
    noResults: "Niciun produs nu corespunde filtrelor.",
    noResultsCta: "Resetează filtrele",
    priceUnder: "sub {amount}",
    priceBetween: "{from} – {to}",
    priceOver: "peste {amount}",
  },

  campaign: {
    somon: {
      eyebrow: "Somon",
      title: "Somon afumat, tăiat gata de platou",
      sub: "Yucola, rulade și steak-uri de somon. Alegi gramajul, noi îl trimitem porționat.",
      cta: "Vezi somonul",
      benefits: [
        { title: "Gata de servit", body: "Se scoate din ambalaj și se pune pe platou." },
        { title: "Trei gramaje", body: "De la 300 g până la bucata întreagă de 1,2 kg." },
        { title: "Livrare în aceeași zi", body: "Comenzi până la 17:00, livrate 18:00–22:00." },
      ],
    },
    "fructe-de-mare": {
      eyebrow: "Fructe de mare",
      title: "Creveți și midii afumate",
      sub: "Aperitivul care dispare primul de pe masă. Se mănâncă cu mâna, direct din cutie.",
      cta: "Vezi fructele de mare",
      benefits: [
        { title: "Fără pregătire", body: "Se pune bolul pe masă și atât." },
        { title: "De la 77,50 MDL", body: "Cel mai accesibil mod de a completa o comandă." },
        { title: "Merg cu orice", body: "Lângă pește afumat, vin alb sau bere rece." },
      ],
    },
    "platou-festiv": {
      eyebrow: "Platou festiv",
      title: "Un platou care nu cere bucătărie",
      sub: "Somon, creveți, rulade și midii. Le combini, le pui pe un platou, ai terminat.",
      cta: "Compune platoul",
      benefits: [
        { title: "Zero gătit", body: "Totul ajunge porționat și gata de servit." },
        { title: "Livrare gratuită", body: "Comenzile de la 1.200 MDL se livrează gratuit." },
        { title: "Ajunge la timp", body: "Alegi intervalul potrivit pentru masă." },
      ],
    },
  },

  footer: {
    statement: "Pește și fructe de mare afumate, pregătite în Chișinău și livrate acasă la tine.",
    shop: "Magazin",
    info: "Informații",
    legal: "Legal",
    contactTitle: "Contact",
    phone: "Telefon",
    email: "E-mail",
    address: "Adresă",
    followUs: "Urmărește-ne",
    rights: "Toate drepturile rezervate.",
    privacy: "Politica de confidențialitate",
    terms: "Termeni și condiții",
    returns: "Politica de retur",
    cookies: "Politica de cookie-uri",
    paymentNote: "Plățile sunt procesate securizat prin Shopify.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Hai să vorbim",
    sub: "Sună, scrie sau trimite-ne un mesaj pe Instagram. Răspundem.",
    callUs: "Sună-ne",
    writeUs: "Scrie-ne",
    visitUs: "Adresa noastră",
    form: {
      title: "Trimite-ne un mesaj",
      name: "Nume",
      namePlaceholder: "Numele tău",
      email: "E-mail",
      emailPlaceholder: "adresa@exemplu.md",
      phone: "Telefon",
      phonePlaceholder: "+373 …",
      message: "Mesaj",
      messagePlaceholder: "Cu ce te putem ajuta?",
      submit: "Trimite mesajul",
      submitting: "Se trimite…",
      successTitle: "Mesajul a plecat",
      success: "Îți răspundem cât de repede putem. Dacă e urgent, sună-ne.",
      optional: "opțional",
      errorBody:
        "Mesajul nu a putut fi trimis. Sună-ne la {phone} sau scrie direct la {email} — îți răspundem la fel de repede.",
      privacyNote:
        "Folosim datele doar ca să îți răspundem la mesaj. Nu le trimitem nimănui altcuiva.",
      errors: {
        nameMin: "Scrie-ne numele tău.",
        emailInvalid: "Verifică adresa de e-mail.",
        messageMin: "Scrie câteva cuvinte despre ce ai nevoie.",
        phoneInvalid: "Verifică numărul de telefon.",
      },
    },
  },

  about: {
    eyebrow: "Despre noi",
    title: "WeSmokeFish",
    lead: "Afumăm pește și fructe de mare în Chișinău și le livrăm gata de pus pe masă.",
    body: [
      "Lucrăm cu pește și fructe de mare pe care le pregătim, le afumăm și le porționăm la gramaj. Fiecare produs pleacă spre client ambalat și gata de servit — fără pregătire în bucătărie.",
      "Gama include pește afumat la rece și ușor afumat, creveți și midii, produse slab sărate și marinate, plus o selecție de bere pentru aceeași comandă.",
      "Ne găsești pe Șoseaua Balcani 7B, Chișinău. Comenzile se plasează online sau la telefon.",
    ],
    placeholderNote:
      "Secțiune pregătită pentru povestea completă a brandului (anul înființării, echipă, afumătoare, fotografii din producție). Textul poate fi completat de echipa WeSmokeFish.",
    ctaProducts: "Vezi produsele",
    ctaContact: "Contactează-ne",
  },

  legal: {
    privacyTitle: "Politica de confidențialitate",
    termsTitle: "Termeni și condiții",
    returnsTitle: "Politica de retur",
    cookiesTitle: "Politica de cookie-uri",
    placeholderTitle: "Document în pregătire",
    placeholderBody:
      "Acest document juridic trebuie furnizat de WeSmokeFish împreună cu un consultant juridic. Nu publicăm text juridic generat automat, pentru că trebuie să reflecte exact modul real de operare al companiei.",
    placeholderContact: "Pentru orice întrebare până la publicarea documentului, scrie-ne la {email} sau sună la {phone}.",
    needed: "De completat de proprietar",
  },

  cookies: {
    title: "Cookie-uri",
    body: "Folosim cookie-uri pentru funcționarea site-ului și, cu acordul tău, pentru statistici și marketing.",
    accept: "Accept toate",
    reject: "Doar necesare",
    settings: "Setări",
    save: "Salvează opțiunile",
    necessary: "Necesare",
    necessaryBody: "Obligatorii pentru coș și checkout. Nu pot fi dezactivate.",
    analytics: "Statistici",
    analyticsBody: "Ne arată ce pagini sunt folosite, ca să le îmbunătățim.",
    marketing: "Marketing",
    marketingBody: "Permit măsurarea campaniilor pe Meta și Google.",
    more: "Detalii în politica de cookie-uri",
  },

  newsletter: {
    title: "Află primul ce iese din afumătoare",
    body: "Produse noi și disponibilitate, fără spam.",
    placeholder: "adresa@exemplu.md",
    submit: "Abonează-mă",
    submitting: "Se trimite…",
    success: "Gata. Îți scriem când apare ceva nou.",
    error: "Verifică adresa de e-mail.",
    unavailable: "Abonarea nu funcționează momentan. Încearcă mai târziu.",
    pendingNote: "Formularul se conectează la platforma de e-mail a WeSmokeFish.",
  },

  common: {
    currency: "MDL",
    loading: "Se încarcă…",
    close: "Închide",
    back: "Înapoi",
    breadcrumb: "Navigare",
    error: "Ceva nu a funcționat",
    errorBody: "Încearcă din nou sau sună-ne la {phone}.",
    retry: "Încearcă din nou",
    notFoundTitle: "Pagina nu există",
    notFoundBody: "Linkul pe care l-ai deschis nu duce nicăieri. Hai la produse.",
    notFoundCta: "Vezi produsele",
    viewAll: "Vezi tot",
    of: "din",
  },
} as const;

export default ro;

/**
 * `ro` is declared `as const` so nested keys stay strongly typed, but that
 * also makes every value a string *literal*. Widening literals back to
 * `string` lets other locales supply their own text while still being checked
 * against the exact same key structure — a missing or misspelled key in ru.ts
 * is a type error, but a different translation is not.
 */
type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : T extends object
          ? { readonly [K in keyof T]: DeepWiden<T[K]> }
          : T;

export type Dictionary = DeepWiden<typeof ro>;
