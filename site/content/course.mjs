/* =====================================================================
 *  E VETMJA SKEDAR QË DUHET TË REDAKTONI PËR TË PUBLIKUAR MATERIAL TË RI.
 *
 *  Për të shtuar një laborator:
 *    1. Kopjoni fletoren  ->  content/notebooks/laborator-10.ipynb
 *    2. Shtoni një hyrje te `labs` më poshtë
 *    3. git push
 *
 *  Gjithçka tjetër (kreu, timeline, kërkimi, detyrat, paketat Python,
 *  navigimi para/pas) gjenerohet automatikisht. Për t'i dhënë laboratorit
 *  vizualizime interaktive, shtoni rreshta te `embeds` në fund të skedarit.
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

  // Repo-ja në GitHub (pronari/emri). Përdoret për butonin "Hap në Colab".
  // Lëreni bosh nëse repo-ja nuk është publike.
  repo: 'goldenFlori/discrete-structures-algorithms-course',
  branch: 'main',

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
  { id: 'grafe', name: 'Teoria e Grafeve', labs: [4, 5, 6, 10] },
  { id: 'pershkim', name: 'Përshkimi i Grafeve', labs: [5, 6] },
  { id: 'mst', name: 'Pemët Përfshirëse Minimum', labs: [5] },
  { id: 'rruget', name: 'Rrugët më të Shkurtra', labs: [7, 8] },
  { id: 'dp', name: 'Programim Dinamik', labs: [7, 8] },
  { id: 'rrjedha', name: 'Rrjedha Maksimale', labs: [8, 9, 10] },
];

/* ---------------------------------------------------------------------
 *  BLLOQET TEMATIKE  (rendi i lëndës në faqen kryesore)
 * ------------------------------------------------------------------- */
export const blocks = [
  { id: 'renditja', name: 'Renditja & analiza e algoritmeve', lectures: 'Leksionet 1–3', labs: [1, 2, 3] },
  { id: 'grafet', name: 'Grafet', lectures: 'Leksioni 4', labs: [4, 5, 6] },
  { id: 'rruget', name: 'Rrugët më të shkurtra', lectures: '', labs: [7, 8] },
  { id: 'rrjedhat', name: 'Rrjedhat në rrjeta', lectures: 'Leksionet 5–6', labs: [9, 10] },
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
    lecture: 'Leksioni 1',
    status: 'updated',
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
        note: 'Teoria + 4 ushtrime (2 Pygame, 2 Plotly/matplotlib).',
      },
      {
        type: 'supplementary',
        title: 'Ushtrime Shtesë — A funksionon? Induksioni & rasti më i keq',
        notebook: 'laborator-01-ushtrime-shtese.ipynb',
        note:
          'Leksioni 1 (slides 17–45): pseudokodi rresht për rresht, hipoteza e induksionit si assert, ' +
          'pse testet nuk vërtetojnë, inputi më i keq. 5 ushtrime me kontroll automatik + Punë në Klasë.',
      },
    ],
    // C-1 (docs/ANALYSIS.md): Ushtrimi 2 u rishkrua në Plotly — gabimi `NameError` u korrigjua.
  },

  {
    n: 2,
    week: 2,
    lecture: 'Leksioni 2',
    status: 'updated',
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
      {
        type: 'supplementary',
        title: 'Ushtrime Shtesë — Numërimi i veprimeve & përkufizimi i O(·)',
        notebook: 'laborator-02-ushtrime-shtese.ipynb',
        note:
          'Leksioni 2 + Leksioni 3 (slides 2, 21): tabela e numërimit të rreshtave, gjetja e c dhe n₀, ' +
          'klasat O(·), Merge(L, R) i saktë. 5 ushtrime me kontroll automatik + Punë në Klasë.',
      },
    ],
  },

  {
    n: 3,
    week: 3,
    lecture: 'Leksioni 3',
    status: 'updated',
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
      {
        type: 'supplementary',
        title: 'Ushtrime Shtesë — Induksioni i fortë & pema rekursive',
        notebook: 'laborator-03-ushtrime-shtese.ipynb',
        note:
          'Leksioni 3: logaritmi si përgjysmime, pema rekursive e matur nga kodi, HI e Merge Sort në çdo ' +
          'thirrje rekursive, rasti bazë i gabuar. 4 ushtrime + Punë në Klasë.',
      },
    ],
  },

  {
    n: 4,
    week: 4,
    lecture: 'Leksioni 4',
    status: 'updated',
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
      {
        type: 'supplementary',
        title: 'Ushtrime Shtesë — Nga Königsbergu te komponentet e lidhura fort',
        notebook: 'laborator-04-ushtrime-shtese.ipynb',
        note:
          'Leksioni 4 i plotë: Euler, lema e shtrëngimit të duarve, Kₙ dhe grafi plotësues, nëngrafet, ' +
          'paraqitjet, udhëtim/udha/cikël/shteg, diametri, lidhja te digrafet. 8 ushtrime + Punë në Klasë.',
      },
    ],
  },

  {
    n: 5,
    week: 5,
    lecture: '',
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
  },

  {
    n: 6,
    week: 6,
    lecture: 'Leksioni 4',
    status: 'published',
    title: 'Komponentet e Lidhura Fort & Renditjet Topologjike',
    topics: ['pershkim', 'grafe'],
    summary:
      'SCC në grafe të drejtuara dhe renditja topologjike e një DAG-u. Ndërtohen mbi BFS/DFS ' +
      'të Laboratorit 5 dhe zbatohen te varësitë: lëndë universitare, hapa ndërtimi, receta.',
    // ANALYSIS.md C-2: materiali i këtij laboratori jeton në Ushtrimet 4–6 të fletores
    // së Laboratorit 5. Nëse shtohet një `laborator-06.ipynb`, ndryshoni `resources`.
    resources: [
      {
        type: 'main',
        title: 'Laboratori 6 — Materiali kryesor',
        notebook: 'laborator-05.ipynb',
        sections: { ranges: [['ushtrimi-4-komponentet-e-lidhura-fort', 'pune-ne-klase']] },
        note: 'SCC, Renditjet Topologjike dhe loja interaktive e renditjes topologjike.',
      },
    ],
  },

  {
    n: 7,
    week: 7,
    lecture: '',
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
  },

  {
    n: 8,
    week: 8,
    lecture: 'Leksionet 5–6',
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
  },

  {
    n: 9,
    week: 9,
    lecture: 'Leksionet 5–6',
    status: 'updated',
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
      {
        type: 'supplementary',
        title: 'Ushtrime Shtesë — Ndërtoni Ford-Fulkerson-in hap pas hapi',
        notebook: 'laborator-09-ushtrime-shtese.ipynb',
        note:
          'Leksionet 5–6: rrjedha e lejueshme, kapaciteti i prerjes, pse dështon greedy, rrjeta mbetëse, ' +
          'rritRrjedhë, FF/EK, shembulli me C, prerja min nga Gf. 8 ushtrime + Punë në Klasë.',
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

  {
    n: 10,
    week: 10,
    lecture: 'Leksionet 5–6',
    status: 'published',
    title: 'Aplikime të Rrjedhës Maksimale: Çiftëzimi & Problemet e Caktimit',
    topics: ['rrjedha', 'grafe'],
    summary:
      'Pjesa e fundit e Leksioneve 5–6: çiftëzimi maksimum në grafe dyanësore (vajzat dhe kotelet), ' +
      'problemet e caktimit (lulet dhe buqetat) dhe modelimi i një problemi të ri si rrjetë rrjedhë.',
    resources: [
      {
        type: 'main',
        title: 'Laboratori 10 — Materiali kryesor',
        notebook: 'laborator-10.ipynb',
        note: '4 ushtrime me kontroll automatik + Punë në Klasë. Pa Pygame — ekzekutohet edhe në Colab.',
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
 *  VIZUALIZIMET INTERAKTIVE
 *  `component` është emri i komponentit React te src/viz/.
 * ------------------------------------------------------------------- */
export const visualizers = [
  {
    id: 'renditja',
    component: 'SortingViz',
    title: 'Vizualizuesi i renditjes',
    tagline: 'Insertion · Selection · Merge Sort',
    summary: 'Shkruani listën tuaj ose gjeneroni rastin më të keq dhe ecni krahasim pas krahasimi, me pseudokodin e leksionit.',
    labs: [1, 2, 3],
  },
  {
    id: 'gara-e-krahasimeve',
    component: 'SortRaceViz',
    title: 'Gara e krahasimeve',
    tagline: 'Tre algoritme · i njëjti input',
    summary: 'Insertion, Selection dhe Merge Sort mbi të njëjtën listë, një krahasim për hap — dhe kurbat e rritjes së tyre.',
    labs: [3],
  },
  {
    id: 'kompleksiteti',
    component: 'ComplexityViz',
    title: 'Eksploruesi i kompleksitetit',
    tagline: 'O(1) · O(log n) · O(n) · O(n log n) · O(n²) · O(2ⁿ)',
    summary: 'Lëvizni n dhe shihni sa veprime — dhe sa kohë — kërkon secila klasë kompleksiteti.',
    labs: [2, 3],
  },
  {
    id: 'gjej-algoritmin',
    component: 'GuessAlgoGame',
    title: 'Lojë: Gjej algoritmin!',
    tagline: '8 raunde · vetëm numri i krahasimeve',
    summary: 'Programi rendit me një algoritëm të fshehur. Nga numri i krahasimeve, gjeni cili ishte.',
    labs: [3],
  },
  {
    id: 'grafet',
    component: 'GraphLab',
    title: 'Laboratori i grafeve',
    tagline: 'Ndërto · paraqitjet · analizo · BFS/DFS · Kruskal/Prim',
    summary: 'Ndërtoni grafe, multigrafe dhe digrafe; lexoni fuqitë, listën dhe matricën; gjeni klika, dyanësinë, përshkimet dhe pemën minimale.',
    labs: [4, 5],
  },
  {
    id: 'labirinti',
    component: 'MazeViz',
    title: 'Labirinti — BFS kundrejt DFS',
    tagline: 'Radhë kundrejt stivës',
    summary: 'Labirinti i laboratorit (ose një i rastit): BFS zgjerohet në valë dhe gjen rrugën më të shkurtër; DFS shkon sa më thellë.',
    labs: [5],
  },
  {
    id: 'scc-topologjike',
    component: 'SccTopoViz',
    title: 'SCC & renditjet topologjike',
    tagline: 'reach⁺ ∩ reach⁻ · kulmet e disponueshme',
    summary: 'Komponentet e lidhura fort me metodën e laboratorit dhe renditjet topologjike të ndërtuara me klikime.',
    labs: [6],
  },
  {
    id: 'rruget',
    component: 'PathsViz',
    title: 'Dijkstra kundrejt Bellman-Ford',
    tagline: 'Harta e Shqipërisë · peshë negative · cikël negativ',
    summary: 'Të dy algoritmet krah për krah mbi grafet e laboratorit, me tabelën e distancave dhe rrugën përfundimtare.',
    labs: [7],
  },
  {
    id: 'kuizi-bellman-ford',
    component: 'BfQuiz',
    title: 'Kuiz: Bellman-Ford',
    tagline: '8 pyetje · me kohë',
    summary: 'Pyetjet e kuizit të laboratorit mbi grafin me peshë negative, me shpjegim pas çdo përgjigjeje.',
    labs: [7],
  },
  {
    id: 'floyd-warshall',
    component: 'FloydViz',
    title: 'Floyd-Warshall hap pas hapi',
    tagline: 'D[i][j] = min(D[i][j], D[i][k] + D[k][j])',
    summary: 'Matricat D dhe P ndryshojnë bashkë me grafin; rindërtoni çdo rrugë nga matrica P.',
    labs: [7, 8],
  },
  {
    id: 'gara-e-rrugeve',
    component: 'PathRaceGame',
    title: 'Lojë: Gara e rrugëve',
    tagline: '8 raunde · rruga optimale nga P',
    summary: 'Ndërtoni rrugën më të shkurtër me klikime; Floyd-Warshall e zbulon optimalen.',
    labs: [7],
  },
  {
    id: 'rrjedha-max',
    component: 'MaxFlowViz',
    title: 'Rrjedha max & prerja min',
    tagline: 'Ford-Fulkerson · Edmonds-Karp · rrjeta mbetëse',
    summary: 'Rrugët rritëse, brinjët kthyese dhe prerja minimale — plus loja e gjetjes së prerjes me koston më të vogël.',
    labs: [8, 9],
  },
  {
    id: 'ciftezimi',
    component: 'MatchingViz',
    title: 'Çiftëzimi & caktimet',
    tagline: 'Vajzat dhe kotelet · lulet dhe buqetat',
    summary: 'Çiftëzimi maksimum dhe problemet e caktimit si rrjedhë maksimale, me rrugët rritëse të përkthyera në "ndërrim mendjeje".',
    labs: [10],
  },
];

/* ---------------------------------------------------------------------
 *  VIZUALIZIMET BRENDA FLETOREVE
 *
 *  Për çdo fletore: `cell` = numri i qelizës në .ipynb (nga 0). Kur qeliza
 *  hap një dritare Pygame/Tkinter, vizualizimi shfaqet në vend të saj dhe
 *  kodi Python palohet poshtë tij. Për qelizat e tjera, shfaqet pas qelizës.
 * ------------------------------------------------------------------- */
export const embeds = {
  'laborator-01.ipynb': [
    { cell: 1, viz: 'renditja', title: 'Insertion Sort hap pas hapi', props: { algo: 'insertion' } },
    { cell: 3, viz: 'renditja', title: 'Selection Sort hap pas hapi', props: { algo: 'selection' } },
  ],
  'laborator-02.ipynb': [
    { cell: 1, viz: 'kompleksiteti', title: 'Eksploruesi i kompleksitetit' },
    { cell: 2, viz: 'renditja', title: 'Merge Sort hap pas hapi', props: { algo: 'merge', values: [38, 27, 43, 3, 9, 82, 10, 15] } },
  ],
  'laborator-03.ipynb': [
    { cell: 2, viz: 'gara-e-krahasimeve', title: 'Gara e krahasimeve' },
    { cell: 8, viz: 'gjej-algoritmin', title: 'Lojë: Gjej algoritmin!' },
  ],
  'laborator-04.ipynb': [
    { cell: 2, viz: 'grafet', title: 'Ndërtoni grafin tuaj', props: { mode: 'build', preset: 'shembull' } },
    { cell: 4, viz: 'grafet', title: 'E pavarur, klikë, dyanësi', props: { mode: 'analyze', preset: 'katror' } },
    { cell: 8, viz: 'grafet', title: 'Lista dhe matrica e fqinjësisë', props: { mode: 'repr', preset: 'digraf' } },
  ],
  'laborator-05.ipynb': [
    { cell: 3, viz: 'labirinti', title: 'Labirinti me BFS dhe DFS' },
    { cell: 6, viz: 'grafet', title: 'BFS dhe DFS në grafin tuaj', props: { mode: 'traverse', preset: 'klase1' } },
    { cell: 9, viz: 'grafet', title: 'Kruskal dhe Prim', props: { mode: 'mst', preset: 'mst8' } },
    { cell: 12, viz: 'scc-topologjike', title: 'Komponentet e lidhura fort', props: { mode: 'scc', preset: 'lab' } },
    { cell: 15, viz: 'scc-topologjike', title: 'Renditja topologjike e lëndëve', props: { mode: 'topo', preset: 'lendet' } },
    { cell: 18, viz: 'scc-topologjike', title: 'Lojë: renditja topologjike', props: { mode: 'topo', preset: 'shtepia' } },
  ],
  'laborator-07.ipynb': [
    { cell: 2, viz: 'rruget', title: 'GPS: harta e Shqipërisë', props: { preset: 'shqiperia', view: 'dijkstra' } },
    { cell: 4, viz: 'rruget', title: 'Dijkstra mbi grafin tuaj', props: { preset: 'ndertoni', view: 'dijkstra' } },
    { cell: 6, viz: 'rruget', title: 'Bellman-Ford: rrjeti i dorëzimit', props: { preset: 'dorezimi', view: 'both' } },
    { cell: 8, viz: 'kuizi-bellman-ford', title: 'Kuiz: Bellman-Ford' },
    { cell: 10, viz: 'floyd-warshall', title: 'Floyd-Warshall: matrica e distancave', props: { preset: 'ush5' } },
    { cell: 12, viz: 'gara-e-rrugeve', title: 'Lojë: gara e rrugëve' },
  ],
  'laborator-08.ipynb': [
    { cell: 4, viz: 'floyd-warshall', title: 'Floyd-Warshall: UrbanPost', props: { preset: 'urbanpost' } },
    { cell: 7, viz: 'floyd-warshall', title: 'Floyd-Warshall: rrjeti mjekësor', props: { preset: 'mjekesor' } },
    { cell: 11, viz: 'rrjedha-max', title: 'Edmonds-Karp: ujësjellësi', props: { preset: 'ujesjellesi', strategy: 'ek' } },
  ],
  'laborator-09.ipynb': [
    { cell: 2, viz: 'rrjedha-max', title: 'Gjeni prerjen minimale', props: { preset: 'hidranti', mode: 'cut' } },
    { cell: 4, viz: 'rrjedha-max', title: 'Ford-Fulkerson kundrejt Edmonds-Karp', props: { preset: 'qyteti', strategy: 'ff' } },
    { cell: 6, viz: 'rrjedha-max', title: 'Data center: ngushtica', props: { preset: 'datacenter', strategy: 'ek' } },
    { cell: 8, viz: 'rrjedha-max', title: 'Aeroporti TIA', props: { preset: 'aeroporti', strategy: 'ek' } },
    { cell: 10, viz: 'rrjedha-max', title: 'Pipeline Defender', props: { preset: 'centrali', mode: 'cut' } },
  ],
  'laborator-10.ipynb': [
    { cell: 4, viz: 'ciftezimi', title: 'Vajzat dhe kotelet', props: { mode: 'matching' } },
    { cell: 13, viz: 'ciftezimi', title: 'Lulet dhe buqetat', props: { mode: 'assignment' } },
  ],
  'laborator-01-ushtrime-shtese.ipynb': [{ cell: 20, viz: 'renditja', title: 'Rasti më i keq i Insertion Sort', props: { algo: 'insertion', values: [8, 7, 6, 5, 4, 3, 2, 1] } }],
  'laborator-02-ushtrime-shtese.ipynb': [{ cell: 12, viz: 'kompleksiteti', title: 'Eksploruesi i kompleksitetit' }],
  'laborator-03-ushtrime-shtese.ipynb': [{ cell: 7, viz: 'renditja', title: 'Merge Sort hap pas hapi', props: { algo: 'merge', values: [38, 27, 43, 3, 9, 82, 10, 15] } }],
  'laborator-04-ushtrime-shtese.ipynb': [
    { cell: 6, viz: 'grafet', title: 'Urat e Königsbergut', props: { mode: 'build', preset: 'konigsberg' } },
    { cell: 35, viz: 'scc-topologjike', title: 'Komponentet e lidhura fort', props: { mode: 'scc', preset: 'lab' } },
  ],
  'laborator-09-ushtrime-shtese.ipynb': [
    { cell: 12, viz: 'rrjedha-max', title: 'Pse dështon greedy', props: { preset: 'leksioni', strategy: 'greedy' } },
    { cell: 25, viz: 'rrjedha-max', title: 'Shembulli me C', props: { preset: 'C', strategy: 'adversary' } },
  ],
  'dijkstra-animated.ipynb': [{ cell: 12, viz: 'rruget', title: 'Dijkstra hap pas hapi', props: { preset: 'nb-dijkstra', view: 'dijkstra' } }],
  'bellman-ford-animated.ipynb': [{ cell: 12, viz: 'rruget', title: 'Bellman-Ford hap pas hapi', props: { preset: 'nb-bf', view: 'bellman' } }],
};
