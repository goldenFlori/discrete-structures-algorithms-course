/* =====================================================================
 *  E VETMJA SKEDAR QË DUHET TË REDAKTONI PËR TË PUBLIKUAR MATERIAL TË RI.
 *
 *  Për të shtuar një laborator:
 *    1. Kopjoni fletoren  ->  content/notebooks/laborator-10.ipynb
 *    2. Shtoni një hyrje te `labs` më poshtë
 *    3. git push
 *
 *  Gjithçka tjetër (kreu, timeline, kërkimi, detyrat, paketat Python,
 *  navigimi para/pas) gjenerohet automatikisht.
 *
 *  Udhëzues i plotë:  ../../docs/UDHEZUES.md
 * ===================================================================== */

/* ---------------------------------------------------------------------
 *  INFORMACIONI I LËNDËS
 *  Vlerat e panjohura janë lënë bosh me qëllim — asgjë nuk u shpik.
 *  Plotësojini kur t'i keni; faqja i fsheh fushat bosh automatikisht.
 * ------------------------------------------------------------------- */
export const course = {
  title: 'Struktura Diskrete & Algoritme',
  titleEn: 'Discrete Structures & Algorithms',
  program: 'Shkenca të të Dhënave & Inxhinieri Informatike',
  year: 'Viti i Parë',
  component: 'Komponenti Laboratorik',

  // Burimi: koka e fletores `detyra2_algoritme.ipynb`. I vetmi fakt i dokumentuar.
  faculty: 'Fakulteti i Shkencave të Natyrës',

  university: '', // p.sh. 'Universiteti i Tiranës'
  lecturer: '', // p.sh. 'Emri Mbiemri'
  email: '',
  semester: '',
  schedule: '', // p.sh. 'E martë 10:00–12:00, Salla 305'

  // Vendoseni linkun e klasës suaj. Nëse lihet bosh, butoni fshihet kudo.
  classroomUrl: '',

  description:
    'Komponenti laboratorik i lëndës. Çdo laborator kombinon teorinë, ' +
    'pseudokodin, analizën e kompleksitetit, implementimin në Python dhe ' +
    'vizualizimin — nga renditja dhe Big-O deri te grafet, rrugët më të ' +
    'shkurtra dhe rrjedhat maksimale.',
};

/* ---------------------------------------------------------------------
 *  TEMAT E LËNDËS  (përdoren për filtrim dhe për kreun)
 * ------------------------------------------------------------------- */
export const topics = [
  { id: 'renditje', name: 'Renditja', labs: [1, 2, 3] },
  { id: 'kompleksitet', name: 'Kompleksiteti i Algoritmeve', labs: [1, 2, 3] },
  { id: 'grafe', name: 'Teoria e Grafeve', labs: [4, 5, 6] },
  { id: 'pershkim', name: 'Përshkimi i Grafeve', labs: [5, 6] },
  { id: 'mst', name: 'Pemët Përfshirëse Minimum', labs: [5] },
  { id: 'rruget', name: 'Rrugët më të Shkurtra', labs: [7, 8] },
  { id: 'dp', name: 'Programim Dinamik', labs: [7, 8] },
  { id: 'rrjedha', name: 'Rrjedha Maksimale', labs: [8, 9] },
];

/* ---------------------------------------------------------------------
 *  LABORATORËT
 *
 *  Fusha të detyrueshme :  n, title, status
 *  Fusha opsionale      :  week, topics, summary, resources, homework,
 *                          visualizers, note
 *
 *  status:  'published' | 'updated' | 'draft' | 'coming-soon'
 *           ('draft' dhe 'coming-soon' NUK e publikojnë përmbajtjen)
 *
 *  resources[].type: 'main' | 'supplementary' | 'demo' | 'reference'
 *  Rendi i `resources` është rendi që i sugjerohet studentit.
 * ------------------------------------------------------------------- */
export const labs = [
  {
    n: 1,
    week: 1,
    status: 'published',
    title: 'Insertion Sort & Selection Sort',
    topics: ['renditje', 'kompleksitet'],
    summary:
      'Hyrje në renditjen si problem themelor. Dy algoritmet e para: si funksionojnë, ' +
      'si i vizualizojmë dhe pse rendi fillestar i të dhënave ndikon te njëri por jo te tjetri.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 1 — Materiali kryesor',
        notebook: 'laborator-01.ipynb',
        note: 'Teoria + 4 ushtrime (2 Pygame, 1 Plotly, 1 matplotlib).',
      },
    ],
    visualizers: ['renditja', 'kompleksiteti'],
    // Raportuar në docs/ANALYSIS.md (C-1); nuk u korrigjua asnjë fletore.
    issues: [
      'Ushtrimi 2 ka një gabim të ruajtur `NameError: name \'plt\' is not defined` — ' +
        'qeliza importon Plotly por thërret `plt`. Grafiku nuk u prodhua kurrë.',
    ],
  },

  {
    n: 2,
    week: 2,
    status: 'published',
    title: 'Kompleksiteti Kohor dhe Merge Sort',
    topics: ['kompleksitet', 'renditje'],
    summary:
      'Notacioni Big O dhe pse numërojmë operacione e jo sekonda. Merge Sort si përgjigjja ' +
      'ndaj pyetjes "a mund të bëjmë më mirë se O(n²)?" — Përça e Sundo në praktikë.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 2 — Materiali kryesor',
        notebook: 'laborator-02.ipynb',
        note: 'Teoria e Big-O + 5 ushtrime. Grafikët Plotly janë interaktivë në këtë faqe.',
      },
    ],
    visualizers: ['kompleksiteti', 'renditja'],
  },

  {
    n: 3,
    week: 3,
    status: 'published',
    title: 'Analiza e Kompleksitetit Mbi Algoritmet e Renditjes',
    topics: ['kompleksitet', 'renditje'],
    summary:
      'Krahasimet si metrikë e pavarur nga hardware-i. Tre algoritmet × tre raste ' +
      '(rastësor, i renditur, reverse) dhe kurbat e rritjes O(n²) kundrejt O(n log n).',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 3 — Materiali kryesor',
        notebook: 'laborator-03.ipynb',
        note: 'Teoria + 4 ushtrime, përfshirë lojën "Gjej Algoritmin!".',
      },
    ],
    visualizers: ['kompleksiteti', 'renditja'],
  },

  {
    n: 4,
    week: 4,
    status: 'published',
    title: 'Hyrje në Teorinë e Grafeve',
    topics: ['grafe'],
    summary:
      'G = (V, E): kulme, brinjë, fuqi, lake dhe brinjë paralele. Llojet e grafeve, ' +
      'lista kundrejt matricës së fqinjësisë, bashkësi e pavarur, klikë dhe grafe dyanësore.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 4 — Materiali kryesor',
        notebook: 'laborator-04.ipynb',
        note: 'Terminologjia shqip↔anglisht + 4 ushtrime (2 Pygame, 2 NetworkX).',
      },
    ],
    visualizers: ['grafet'],
  },

  {
    n: 5,
    week: 5,
    status: 'published',
    title: 'Algoritmet e Grafeve: BFS, DFS, Kruskal & Prim',
    topics: ['pershkim', 'mst', 'grafe'],
    summary:
      'Përshkimi i grafeve me radhë dhe stivë, zgjidhja e labirintit, dhe dy algoritmet ' +
      'greedy për Pemën Përfshirëse Minimum. Përfshin punë në klasë dhe detyra shtëpie.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 5 — Materiali kryesor',
        notebook: 'laborator-05.ipynb',
        // Fletorja mbulon Ushtrimet 1-6; 4-6 i përkasin Laboratorit 6 (shih ANALYSIS.md C-2).
        // Fletorja mbulon Ushtrimet 1-6. Këtu shfaqen 1-3 dhe pastaj
        // Punë në Klasë + Detyrat; Ushtrimet 4-6 i takojnë Laboratorit 6.
        // `to` është përjashtues. `null` = fillimi / fundi i fletores.
        sections: {
          ranges: [
            [null, 'ushtrimi-4-komponentet-e-lidhura-fort'],
            ['pune-ne-klase', null],
          ],
        },
        note: 'Ushtrimet 1–3, Punë në Klasë dhe Detyrat e Shtëpisë.',
      },
    ],
    homework: [
      {
        embedded: true,
        title: '3 probleme: lidhshmëria me BFS, nivelet e BFS, MST me Kruskal',
        anchor: 'detyra-per-shtepi',
        note: 'Brenda fletores së laboratorit — plotësohen boshllëqet `# PLOTESO`.',
      },
    ],
    visualizers: ['grafet'],
  },

  {
    n: 6,
    week: 6,
    status: 'published',
    title: 'Komponentet e Lidhura Fort & Renditjet Topologjike',
    topics: ['pershkim', 'grafe'],
    summary:
      'SCC në grafe të drejtuara dhe renditja topologjike e një DAG-u. Ndërtohen mbi BFS/DFS ' +
      'të Laboratorit 5 dhe zbatohen te varësitë: lëndë universitare, hapa ndërtimi, receta.',
    // Shih docs/ANALYSIS.md, C-2: nuk u dorëzua `Laborator6.ipynb`; materiali jeton
    // në Ushtrimet 4-6 të fletores së Laboratorit 5, e cila referohet shprehimisht
    // nga detyra e shtëpisë së këtij laboratori.
    note:
      'Materiali i këtij laboratori ndodhet në Ushtrimet 4–6 të fletores së Laboratorit 5. ' +
      'Detyra e shtëpisë i referohet pikërisht atyre ushtrimeve.',
    needsConfirmation:
      'Nuk u dorëzua fletore e veçantë `Laborator6.ipynb`. Nëse ekziston, shtojeni te ' +
      'content/notebooks/ dhe ndryshoni `resources` e këtij laboratori.',
    resources: [
      {
        type: 'main',
        title: 'Ushtrimet 4–6 (nga fletorja e Laboratorit 5)',
        notebook: 'laborator-05.ipynb',
        sections: { ranges: [['ushtrimi-4-komponentet-e-lidhura-fort', 'pune-ne-klase']] },
        note: 'SCC, Renditjet Topologjike dhe loja interaktive e renditjes topologjike.',
      },
    ],
    visualizers: ['grafet'],
  },

  {
    n: 7,
    week: 7,
    status: 'published',
    title: 'Rrugët më të Shkurtra: Dijkstra · Bellman-Ford · Floyd-Warshall',
    topics: ['rruget', 'dp'],
    summary:
      'Tre algoritmet kryesore të rrugëve më të shkurtra, kushtet e tyre dhe kompleksiteti. ' +
      'Nga GPS-i mbi hartën e Shqipërisë te zbulimi i cikleve negative dhe matrica e distancave.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 7 — Materiali kryesor',
        notebook: 'laborator-07.ipynb',
        note: '6 ushtrime Pygame + Punë në Klasë me 4 probleme.',
      },
      {
        type: 'supplementary',
        title: 'Dijkstra — Hap pas hapi',
        notebook: 'dijkstra-animated.ipynb',
        lang: 'en',
        note: 'Fletore plotësuese që regjistron çdo hap të algoritmit dhe i vizaton me matplotlib.',
      },
      {
        type: 'supplementary',
        title: 'Bellman-Ford — Hap pas hapi',
        notebook: 'bellman-ford-animated.ipynb',
        lang: 'en',
        note: 'Struktura paralele me fletoren e Dijkstra-s — ideale për krahasim ballë-për-ballë.',
      },
    ],
    visualizers: ['rruget', 'floyd-warshall'],
  },

  {
    n: 8,
    week: 8,
    status: 'published',
    title: 'Floyd-Warshall & Rrjedhat Maksimale: Edmonds-Karp',
    topics: ['rruget', 'dp', 'rrjedha'],
    summary:
      'Programimi dinamik për të gjitha çiftet e kulmeve, dhe hyrja në rrjedhat maksimale. ' +
      'Tre skenarë realë: logjistika urbane, rrjeti i klinikave dhe ujësjellësi në emergjencë.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 8 — Materiali kryesor',
        notebook: 'laborator-08.ipynb',
        note: 'Pseudokodi i plotë, matricat D dhe P, 3 skenarë realë + 7 pyetje reflektuese.',
      },
    ],
    visualizers: ['floyd-warshall', 'rruget'],
  },

  {
    n: 9,
    week: 9,
    status: 'published',
    title: 'Max-Flow / Min-Cut & Ford-Fulkerson kundrejt Edmonds-Karp',
    topics: ['rrjedha', 'grafe'],
    summary:
      'Teorema Max-Flow = Min-Cut dhe pse zgjedhja e rrugës rritëse (DFS apo BFS) ndryshon ' +
      'numrin e iterimeve por jo rezultatin final.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 9 — Materiali kryesor',
        notebook: 'laborator-09.ipynb',
        note: '4 ushtrime + loja finale "Pipeline Defender". Detyrat janë brenda fletores.',
      },
    ],
    homework: [
      {
        embedded: true,
        title: '3 detyra: Min-Cut i rrjetit ISP, Ford-Fulkerson dhe Edmonds-Karp mbi rrjetin hekurudhor',
        anchor: 'detyra-shtepie',
        note: 'Brenda fletores — ndryshohen vetëm vlerat e shënuara me `# TODO`.',
      },
    ],
  },
];

/* ---------------------------------------------------------------------
 *  DETYRAT E PAVARURA (fletore më vete)
 *  Detyrat brenda një laboratori deklarohen te vetë laboratori, më sipër.
 *
 *  `due` lihet bosh me qëllim — asnjë afat nuk u shpik.
 * ------------------------------------------------------------------- */
export const homework = [
  {
    id: 'algoritmet-e-renditjes',
    lab: 2,
    alsoLabs: [1],
    title: 'Algoritmet e Renditjes',
    status: 'published',
    notebook: 'detyra-lab02-algoritmet-e-renditjes.ipynb',
    topics: ['renditje', 'kompleksitet'],
    summary:
      'Komentoni rresht për rresht Insertion, Selection dhe Merge Sort, pastaj plotësoni ' +
      'tabelat e karakteristikave (best/average/worst case, stable, in-place) dhe krahasimin final.',
    due: '',
  },
  {
    id: 'analiza-e-kompleksitetit',
    lab: 3,
    alsoLabs: [2],
    title: 'Analiza e Kompleksitetit Kohor',
    status: 'published',
    notebook: 'detyra-lab03-analiza-e-kompleksitetit.ipynb',
    topics: ['kompleksitet'],
    summary:
      'Zëvendësoni matjen e sekondave me numërimin e krahasimeve — saktësisht 3 rreshta ' +
      '`# NDRYSHO` — dhe përgjigjuni 5 pyetjeve analize mbi grafikun që prodhoni.',
    // Shih ANALYSIS.md C-3: fletorja ruan grafikun e gatshëm.
    spoilerWarning:
      'Fletorja ruan grafikun përfundimtar nga një ekzekutim i mëparshëm. Në këtë faqe ai ' +
      'shfaqet i palosur — hapeni vetëm pasi të keni punuar vetë.',
    due: '',
  },
  {
    id: 'scc-dhe-renditje-topologjike',
    lab: 6,
    title: 'Komponentet e Lidhura Fort & Renditjet Topologjike',
    status: 'published',
    notebook: 'detyra-lab06-scc-dhe-renditje-topologjike.ipynb',
    topics: ['pershkim', 'grafe'],
    summary:
      'Dy probleme, secili me punë me shkrim (tabela reach dhe SCC) dhe kod me boshllëqe ' +
      '`# PLOTESO` që ripërdorin funksionet e Ushtrimeve 4–6 të laboratorit.',
    due: '',
  },
];

/* ---------------------------------------------------------------------
 *  VIZUALIZUESIT INTERAKTIVË
 *  Për të shtuar një të ri: krijoni komponentin, shtoni një hyrje këtu,
 *  pastaj referojeni te `visualizers` i laboratorit përkatës.
 * ------------------------------------------------------------------- */
export const visualizers = [
  {
    id: 'kompleksiteti',
    title: 'Eksploruesi i Kompleksitetit',
    tagline: 'O(1) · O(log n) · O(n) · O(n log n) · O(n²) · O(2ⁿ)',
    labs: [2, 3],
    topics: ['kompleksitet'],
    summary:
      'Lëvizni n dhe shihni sa operacione bën secila klasë kompleksiteti. Krahasoni dy kurba ' +
      'dhe gjeni pikën ku njëra kalon tjetrën.',
    mobile: 'full',
  },
  {
    id: 'renditja',
    title: 'Vizualizuesi i Renditjes',
    tagline: 'Insertion · Selection · Merge Sort',
    labs: [1, 2, 3],
    topics: ['renditje', 'kompleksitet'],
    summary:
      'Shkruani listën tuaj dhe ecni hap pas hapi. Numëron krahasimet dhe shkëmbimet — ' +
      'pikërisht metrika që përdor Laboratori 3.',
    mobile: 'full',
  },
  {
    id: 'grafet',
    title: 'Fusha e Lojës së Grafeve',
    tagline: 'BFS · DFS · Kruskal · Prim · listë & matricë fqinjësie',
    labs: [4, 5, 6],
    topics: ['grafe', 'pershkim', 'mst'],
    summary:
      'Ndërtoni grafin tuaj me klikime, shihni listën dhe matricën e fqinjësisë live, ' +
      'dhe ekzekutoni përshkimet ose MST hap pas hapi.',
    mobile: 'limited',
  },
  {
    id: 'rruget',
    title: 'Dijkstra kundrejt Bellman-Ford',
    tagline: 'I njëjti graf · të dy algoritmet · krah për krah',
    labs: [7],
    topics: ['rruget'],
    summary:
      'Ekzekutoni të dy algoritmet mbi të njëjtin graf dhe shihni ku ndryshojnë. Aktivizoni ' +
      'një peshë negative dhe vëzhgoni saktësisht ku dështon Dijkstra.',
    mobile: 'limited',
  },
  {
    id: 'floyd-warshall',
    title: 'Stepper-i Floyd-Warshall',
    tagline: 'D[i][j] = min(D[i][j], D[i][k] + D[k][j])',
    labs: [7, 8],
    topics: ['rruget', 'dp'],
    summary:
      'Ecni nëpër trefishin e lakut një krahasim në një kohë. Matrica dhe grafi lëvizin bashkë, ' +
      'me kulmin ndërmjetës k gjithmonë të theksuar.',
    mobile: 'limited',
  },
];
