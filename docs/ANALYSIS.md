# Analiza e Materialeve — Struktura Diskrete & Algoritme

> Ky dokument është rezultati i fazës së analizës (Faza 1–6) përpara ndërtimit të faqes.
> Të gjitha përfundimet janë nxjerrë duke **lexuar përmbajtjen** e 14 fletoreve të dhëna
> (markdown, kod, outpute, metadata) — jo vetëm emrat e skedarëve.
> Asnjë fletore nuk u ekzekutua gjatë analizës.

---

## 0. Çfarë u dorëzua në të vërtetë

Arkivi `labs.zip` përmbante **14 fletore `.ipynb`** dhe asgjë tjetër
(plus skedarë `__MACOSX/._*` të padobishëm, të cilët janë metadata të macOS-it dhe u injoruan).

> **⚠️ SCREENSHOT-ET NUK U DORËZUAN.** Prompti përmend pamje ekrani nga Google Classroom,
> por arkivi nuk përmbante asnjë imazh, PDF apo skedar tjetër. Prandaj **Seksioni D**
> (analiza e workflow-t aktual) bazohet vetëm në atë që *dëshmojnë vetë fletoret* —
> jo në pamjet e Classroom-it. Shihni Seksionin C, çështja **C-6**.

---

## A. CONTENT AUDIT — auditimi i çdo resursi

### A-1 · `Laborator1.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real (nga qeliza 0)** | *Laboratori 1 — Insertion Sort & Selection Sort* |
| **Java / Laboratori** | Laboratori 1 |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 5 qeliza: 1 markdown teori + 4 qeliza kodi (4 "Ushtrime") |
| **Temat** | Renditja (sorting), Insertion Sort, Selection Sort |
| **Algoritmet** | Insertion Sort, Selection Sort |
| **Teoria** | Çfarë është sorting, pse ka rëndësi, ideja e secilit algoritëm, ndikimi i rendit fillestar |
| **Ushtrimet** | Ush. 1 (Pygame: Insertion Sort), Ush. 2 (Plotly: koha vs. çrregullsia), Ush. 3 (Pygame: Selection Sort), Ush. 4 (matplotlib: krahasimi i dy algoritmeve) |
| **Detyrë brenda?** | **Jo** |
| **Bibliotekat** | `pygame`, `plotly.graph_objects`, `matplotlib.pyplot`, `random`, `time`, `os` |
| **Vizualizim** | Pygame (desktop), Plotly (browser), matplotlib (PNG e ruajtur) |
| **GUI desktop / Pygame** | **PO** — 2 nga 4 qeliza hapin dritare Pygame |
| **Ekzekutim në browser** | Jo për qelizat Pygame. Po për Plotly/matplotlib (outputet janë të ruajtura) |
| **Outpute të ruajtura** | 4 × `image/png` (matplotlib, 42–48 KB), 7 × stream, 3 × error |
| **Parakushte** | Asnjë — laboratori i parë |
| **Në faqe** | Faqe e plotë laboratori; ushtrimet Pygame shënohen `RUN LOCALLY`; Big-O/sorting lidhen me vizualizuesin interaktiv |
| **⚠ Problem i gjetur** | Qeliza 2 ka **`NameError: name 'plt' is not defined`** të ruajtur — qeliza importon `plotly` por thërret `plt.subplots()`. Shih Seksionin C, **C-1**. *Nuk u korrigjua.* |

---

### A-2 · `Laborator2 (1).ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 2 — Kompleksiteti Kohor dhe Merge Sort* |
| **Java / Laboratori** | Laboratori 2 |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 6 qeliza: 1 markdown teori + 5 qeliza kodi |
| **Temat** | Kompleksiteti kohor, notacioni Big O, rregulla e n₀, Merge Sort, Divide & Conquer |
| **Algoritmet** | Merge Sort, Insertion Sort, Selection Sort (krahasim) |
| **Teoria** | Tabelë e plotë Big O (O(1)→O(2ⁿ)), pse numërojmë operacione e jo sekonda, ideja Përça-e-Sundo |
| **Detyrë brenda?** | **Jo** |
| **Bibliotekat** | `plotly.graph_objects`, `plotly.subplots`, `numpy`, `pygame`, `random`, `time`, `os` |
| **GUI desktop / Pygame** | **PO** — 1 qelizë |
| **Outpute të ruajtura** | 4 × `application/vnd.plotly.v1+json` (181 KB + 3 më të vegjël) — **interaktive në web** |
| **Parakushte** | Laboratori 1 |
| **Në faqe** | Faqe laboratori. Grafikët Plotly rirenderohen **interaktivë** (jo screenshot). Lidhje e fortë me vizualizuesin *Eksploruesi i Kompleksitetit* |
| **⚠ Emri i skedarit** | Sufiksi ` (1)` vjen nga shkarkim i dyfishtë i shfletuesit, **jo** version i dytë. Është i vetmi Lab 2 i dorëzuar. |

---

### A-3 · `Laborator3 (1).ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 3 — Analiza e Kompleksitetit Kohor Mbi Algoritmet e Renditjes* |
| **Java / Laboratori** | Laboratori 3 |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 9 qeliza: 5 markdown + 4 kod — struktura më e pastër "teori → ushtrim" |
| **Temat** | Rendi i rritjes, krahasimet si metrikë e pavarur nga hardware-i, O(n²) vs O(n log n) |
| **Ushtrimet** | Ush. 1 (Pygame, 354 rreshta: numri i krahasimeve), Ush. 2 (Plotly: 3 raste × 3 algoritme), Ush. 3 (Plotly: kurbat e rritjes), Ush. 4 (**Lojë Pygame:** "Gjej Algoritmin!") |
| **Detyrë brenda?** | **Jo** |
| **Bibliotekat** | `pygame`, `plotly.graph_objects`, `plotly.subplots`, `math`, `random`, `os` |
| **GUI desktop / Pygame** | **PO** — 2 qeliza (Ush. 1 dhe Ush. 4) |
| **Outpute të ruajtura** | 2 × Plotly JSON, 4 × stream, 2 × error (SystemExit nga mbyllja e Pygame) |
| **Parakushte** | Laboratorët 1–2 |
| **Në faqe** | Faqe laboratori. Ush. 2/3 → Plotly interaktiv. Ush. 4 është *lojë* → shënohet `RUN LOCALLY` + ekuivalent web (self-check) |

---

### A-4 · `Laborator4.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 4 — Hyrje ne Teorine e Grafeve* |
| **Java / Laboratori** | Laboratori 4 |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 10 qeliza: 5 markdown + 5 kod (një bosh) |
| **Temat** | G=(V,E), kulm/brinjë/fuqi/lak/brinjë paralele, rend & përmasë, llojet e grafeve, listë vs matricë fqinjësie, bashkësi e pavarur, klikë, graf dyanësor |
| **Terminologji** | Tabelë e plotë shqip↔anglisht (Kulm/Vertex, Brinjë/Edge, Fuqia/Degree, Lak/Loop, Rend/Order, Përmasa/Size) |
| **Ushtrimet** | Ush. 1 (Pygame: ndërto grafin tënd), Ush. 2 (Pygame 449 rr.: bashkësi e pavarur, klikë, dyanësor), Ush. 3 (NetworkX: 5 lloje grafesh), Ush. 4 (NetworkX+numpy: listë & matricë fqinjësie) |
| **Detyrë brenda?** | **Jo** |
| **Bibliotekat** | `pygame`, `networkx`, `numpy`, `matplotlib.pyplot`, `matplotlib.colors`, `matplotlib.patches`, `collections`, `itertools` |
| **GUI desktop / Pygame** | **PO** — 2 qeliza |
| **Outpute të ruajtura** | 2 × `image/png` të mëdha (158 KB, 260 KB) — figurat NetworkX |
| **Parakushte** | Asnjë matematikë e avancuar; laboratorët 1–3 për Big-O |
| **Në faqe** | Faqe laboratori + **lidhje e drejtpërdrejtë** me *Fusha e Lojës së Grafeve* (ndërto graf, shih listën & matricën e fqinjësisë live) — zëvendëson web-nativisht Ush. 1/2 Pygame |

---

### A-5 · `Laborator5 .ipynb` *(me hapësirë fundore në emër)*

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 5 — Algoritmet e Grafeve: BFS, DFS, Kruskal & Prim* |
| **Java / Laboratori** | Laboratori 5 **(+ materiali i Laboratorit 6)** — shih C-2 |
| **Kategoria** | `MAIN LABORATORY` + `REVISED VERSION` (versioni i zgjeruar) |
| **Struktura** | **29 qeliza** — 20 markdown + 9 kod, 3114 rreshta kodi |
| **Ushtrimet** | Ush. 1 Labirinti BFS/DFS (Tkinter, 472 rr.) · Ush. 2 Ndërtues interaktiv grafi (Pygame, 464 rr.) · Ush. 3 MST Kruskal & Prim (304 rr.) · **Ush. 4 Komponentet e Lidhura Fort (532 rr.)** · **Ush. 5 Renditjet Topologjike (240 rr.)** · **Ush. 6 Lojë: Renditje Topologjike (903 rr.)** |
| **Punë në Klasë** | **PO** — 2 probleme, me dorë në letër (BFS/DFS trace + Kruskal trace me tabela boshe) |
| **Detyrë brenda?** | **PO — Pattern B.** 3 probleme "Detyrë për Shtëpi" me qeliza kodi `# PLOTESO` (1. Lidhshmëria me BFS · 2. Nivelet & distancat BFS · 3. MST me Kruskal) |
| **A ka zgjidhje të ekspozuara?** | **Jo.** Boshllëqet janë `___` dhe `# PLOTESO`. Klasa `DSU` jepet e plotë **qëllimisht** ("mos e ndrysho"). Kjo është `STARTER CODE`, jo `SOLUTION`. ✅ |
| **Bibliotekat** | `pygame`, `tkinter`, `threading`, `collections`, `math`, `random`, `sys`, `time` |
| **GUI desktop** | **PO — dyfish:** Tkinter (Ush. 1) *dhe* Pygame (Ush. 2, 4, 6) |
| **Outpute** | 3 × stream, 2 × `SystemExit` (nga mbyllja normale e dritares) |
| **Në faqe** | **Ky është versioni që publikohet.** Ushtrimet 4–6 shfaqen edhe në faqen e Laboratorit 6 me referencë të qartë |

---

### A-6 · `Laborator5.ipynb` *(pa hapësirë)*

| Fushë | Vlerë |
|---|---|
| **Kategoria** | `REVISED VERSION` — **versioni i vjetër / i shkurtër** |
| **Verifikim programatik** | **Të 20 qelizat e tij janë byte-për-byte identike me qeliza të `Laborator5 .ipynb`.** Ky skedar është një **nënbashkësi e rreptë**. |
| **Çfarë i mungon** | Ushtrimi 4 (SCC), Ushtrimi 5 (Renditje Topologjike), Ushtrimi 6 (Loja) — 1675 rreshta kod më pak |
| **Vendimi** | **NUK publikohet si resurs i veçantë.** Faqja publikon vetëm versionin e zgjeruar. Versioni i vjetër ruhet në arkivin e repo-s për gjurmueshmëri, i shënuar `superseded`. |
| **Pse jo si "version i dytë"** | Ekspozimi i dy skedarëve pothuajse identikë është pikërisht problemi i Classroom-it që po zgjidhim. Studenti nuk duhet të gjejë vetë se cili është i plotë. |

---

### A-7 · `Detyra_Shtepie_Laborator6_Ushtrime.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Detyra për Shtëpi 6 — Komponentet e Lidhura Fort & Renditjet Topologjike* |
| **Kategoria** | `HOMEWORK` (standalone, Pattern A) |
| **I përket** | **Laboratorit 6** (sipas emrit dhe tekstit) |
| **Lidhje e deklaruar brenda** | Tabelë eksplicite: *"SCC → Ushtrimi 4 (`bfs_reach`, `analyze_scc`)"*, *"Renditjet Topologjike → Ushtrimi 5/6 (`build_predecessors`, `available_nodes`)"* — **këto ushtrime ekzistojnë vetëm në `Laborator5 .ipynb`** |
| **Struktura** | 7 qeliza: 2 probleme, secili me *A — Puna me shkrim* (tabela për t'u plotësuar) + *B — Kodi* (`# PLOTESO`) |
| **Bibliotekat** | `collections` |
| **GUI** | Jo — plotësisht i sigurt, pa Pygame |
| **Outpute** | Asnjë (nuk është ekzekutuar) |
| **Zgjidhje të ekspozuara?** | **Jo.** ✅ |
| **Në faqe** | Faqja e Detyrave + faqja e Laboratorit 6, me lidhje kryq te Ushtrimet 4–6 |

---

### A-8 · `Detyre_Shtepie (1).ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Detyre Shtepie — Analiza e Kompleksitetit Kohor* |
| **Kategoria** | `HOMEWORK` (standalone, Pattern A) |
| **I përket** | **Laboratorit 3** (krahasim empirik i krahasimeve; përmend drejtpërdrejt "kemi krahasuar tre algoritmet duke matur kohen ne sekonda" nga laboratori) — lidhet edhe me Lab 2 |
| **Detyra** | Zëvendëso `mat_kohen` → `mat_operacionet`; **saktësisht 3 rreshta `# NDRYSHO`** |
| **Pjesa 2** | 5 pyetje analize me hapësira *"(shkruani ketu)"* |
| **Bibliotekat** | `plotly.graph_objects`, `random`, `time` |
| **GUI** | Jo — i sigurt |
| **Outpute** | 1 × Plotly JSON (14 KB) — **kujdes:** ky është grafiku *i gatshëm*; shih C-3 |
| **Zgjidhje të ekspozuara?** | Pjesërisht — funksionet `*_ops` jepen **qëllimisht** të plota ("te gatshme, nuk i ndryshoni"). Kjo është `STARTER CODE`. ✅ |

---

### A-9 · `detyra2_algoritme.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Detyre Shtepie — Algoritmet e Renditjes* |
| **Kategoria** | `HOMEWORK` (standalone, Pattern A) |
| **I përket** | **Laboratorëve 1–2** (mbulon Insertion, Selection **dhe** Merge Sort) |
| **Përmban** | Kokë me *Lenda / Fakulteti / Emri dhe Mbiemri / Grupi* — **i vetmi burim i faktit** për emrin e fakultetit (shih C-5) |
| **Detyra** | Pjesa 1–3: komento çdo rresht të kodit + plotëso tabelën e karakteristikave. Pjesa 4: tabelë krahasuese + pyetje argumentuese |
| **Bibliotekat** | Asnjë import — vetëm Python bazë |
| **GUI** | Jo — plotësisht i sigurt |
| **Outpute** | 1 × stream |
| **Zgjidhje të ekspozuara?** | **Jo.** Kodi jepet me `#` bosh për t'u komentuar; tabelat kanë "Shkruaj ketu". ✅ |
| **⚠ Emri** | `detyra2_` sugjeron "Detyra 2". Emërtimi ndryshon nga `Detyre_Shtepie` / `Detyra_Shtepie_` — shih C-4 |

---

### A-10 · `Laborator7.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 7 — Rrugët më të Shkurtra: Dijkstra · Bellman-Ford · Floyd-Warshall* |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 14 qeliza: 8 markdown + 6 kod, 2045 rreshta |
| **Teoria** | Tabelë krahasuese (peshë negative / burim / kompleksitet), hapat e secilit algoritëm, formula `D[i][j] = min(D[i][j], D[i][k]+D[k][j])` |
| **Ushtrimet** | 1. **Dijkstra GPS: Harta e Shqipërisë** 🗺 (384 rr.) · 2. Dijkstra interaktiv (345 rr.) · 3. **Bellman-Ford: Rrjeti i Dorëzimit** (343 rr.) · 4. Bellman-Ford Kuiz (329 rr.) · 5. Floyd-Warshall: Matrica e Distancave (297 rr.) · 6. **Floyd-Warshall: Gara e Rrugëve** (347 rr.) |
| **Punë në Klasë** | **PO** — 4 probleme me dorë (Dijkstra trace, Bellman-Ford + cikël negativ, Floyd-Warshall D⁰→D⁴, tabelë krahasuese) |
| **Detyrë brenda?** | **Jo** — vetëm Punë në Klasë |
| **Bibliotekat** | `pygame` (i vetmi import!) |
| **GUI desktop / Pygame** | **PO — të 6 qelizat e kodit.** Ky është laboratori më i varur nga desktop-i |
| **Outpute** | 6 × `SystemExit` + 2 stream. **Asnjë output vizual i ruajtur** |
| **Në faqe** | ⚠ Pa vizualizues web, ky laborator do të ishte *thjesht tekst*. Prandaj **3 nga 5 vizualizuesit P0** i dedikohen pikërisht këtij laboratori |

---

### A-11 · `Laborator8.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 8 — Floyd-Warshall & Rrjedhat Maksimale: Edmonds-Karp* |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 14 qeliza: 11 markdown + 3 kod — por qelizat e kodit janë **masive: 1051, 1040, 778 rreshta** |
| **Teoria** | Rekursioni DP me 3 indekse `D[i][j][k]`, pseudokodi i plotë `FloydWarshall(W,n)`, matricat D & P, rindërtimi i rrugës, ciklet negative |
| **Skenarët realë** | **Ush. 1 — UrbanPost** (logjistikë urbane, 8 kulme, 21 harqe) · **Ush. 2 — Rrjeti i Klinikave dhe Transportit të Urgjencës Mjekësore** · **Ush. 3 — Rrjeti Urban i Ujësjellësit gjatë Emergjencës** (max-flow) |
| **Sinteza** | Qeliza 12: *"Lidhja Midis Floyd-Warshall dhe Edmonds-Karp"* + **7 Pyetje Reflektuese** |
| **Detyrë brenda?** | **Jo** |
| **Bibliotekat** | `pygame`, `collections`, `copy` |
| **GUI desktop / Pygame** | **PO — të 3 qelizat** |
| **Outpute** | 3 × `SystemExit`, 4 × stream |
| **Në faqe** | Skenarët realë marrin **identitet vizual të veçantë** (kartela `SKENAR REAL`). Qelizat 1000+ rreshta **palosen si parazgjedhje** me përmbledhje funksionesh |

---

### A-12 · `Laborator9.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Laboratori 9 — Max-Flow / Min-Cut & Ford-Fulkerson vs Edmonds-Karp* |
| **Kategoria** | `MAIN LABORATORY` |
| **Struktura** | 12 qeliza: 7 markdown + 5 kod, 2311 rreshta |
| **Teoria** | Kapacitet/rrjedhë/graf mbetës/rrugë rritëse/prerje/ngushticë, 3 kushtet e rrjedhës (`0 ≤ f(u,v) ≤ c(u,v)`), **Teorema Max-Flow = Min-Cut** |
| **Ushtrimet** | 1. Vizualizim Max-Flow/Min-Cut (370 rr.) · 2. **FF vs EK hap-pas-hapi** (Plotly + ipywidgets, 423 rr.) · 3. Network Capacity Planning (616 rr.) · 4. **Aeroporti Ndërkombëtar: Rrjedha e Pasagjerëve** (448 rr.) · **Loja Finale "Pipeline Defender"** (454 rr.) |
| **Detyrë brenda?** | **PO — Pattern B.** Qeliza 11 (158 rreshta markdown): 3 detyra me udhëzime `# TODO`, secila me 3 pyetje |
| **Natyra e detyrës** | Studenti **kopjon kodin e ushtrimit** dhe ndryshon vetëm vlerat `# TODO` (EDGES, NAMES, NYJET, BRINJET, POZICIONET, RENDI_DFS, strategjia `"dfs"`/`"bfs"`) |
| **Zgjidhje të ekspozuara?** | **Jo** — jepen vetëm të dhënat e reja, jo përgjigjet ✅ |
| **Bibliotekat** | `pygame`, `plotly.graph_objects`, `ipywidgets`, `IPython.display`, `collections`, `random` |
| **GUI desktop / Pygame** | **PO** — 4 nga 5 qeliza. Qeliza 4 përdor `ipywidgets` (kërkon kernel Jupyter aktiv) |
| **Outpute** | 1 × `application/vnd.jupyter.widget-view+json` (**nuk rirenderohet pa kernel**), 1 × `application/javascript`, 2 × stream |
| **Në faqe** | Detyra e brendshme **nuk dublikohet** — lidhje direkte te `#detyra-shtepie` i kësaj faqeje |

---

### A-13 · `dijkstra_animated.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Dijkstra's Algorithm — Interactive Step-by-Step Notebook* |
| **Kategoria** | `INTERACTIVE / ANIMATED DEMONSTRATION` (material plotësues) |
| **I përket** | **Laboratorit 7**, Ushtrimet 1–2 |
| **Gjuha** | **Anglisht** — ndryshe nga laboratorët kryesorë (shqip). Shih C-7 |
| **Struktura** | 24 qeliza, 10 seksione të numëruara: Setup → Graph → Positions → Algorithm → Drawing → Walkthrough → All Steps → Distance Table → Complexity → **Practice Exercises (A/B/C)** |
| **Cilësia pedagogjike** | Shumë e lartë — shpjegon *pse* pozicionet e nyjeve janë të ndara nga algoritmi; regjistron çdo hap (`dijkstra_steps` kthen snapshot-e) |
| **Bibliotekat** | `matplotlib.pyplot`, `matplotlib.patches`, `heapq`, `copy`, `subprocess` |
| **⚠ Varësi e munguar** | Qeliza 12 bën `subprocess.Popen([sys.executable, 'dijkstra_pygame.py'])` — **skedari `dijkstra_pygame.py` NUK u dorëzua.** Shih C-8 |
| **Outpute** | 4 × `image/png`, dy prej tyre **shumë të mëdha** (506 KB, 492 KB) — rrjeti i të gjitha hapave |
| **Në faqe** | Publikohet si demonstrim plotësues nën Lab 7; qeliza `subprocess` shënohet qartë si **jofunksionale pa skedarin shoqërues**; zëvendësohet funksionalisht nga vizualizuesi web *Dijkstra vs Bellman-Ford* |

---

### A-14 · `bellmanFord_animated.ipynb`

| Fushë | Vlerë |
|---|---|
| **Titulli real** | *Bellman-Ford Algorithm — Interactive Step-by-Step Notebook* |
| **Kategoria** | `INTERACTIVE / ANIMATED DEMONSTRATION` (material plotësues) |
| **I përket** | **Laboratorit 7**, Ushtrimet 3–4 |
| **Gjuha** | **Anglisht** |
| **Struktura** | 24 qeliza — **strukturë paralele identike** me `dijkstra_animated.ipynb` (të njëjtat 10 seksione) |
| **Përmbajtje unike** | Seksioni 9 krahason drejtpërdrejt me Dijkstra; Ushtrimi B është **zbulim i ciklit negativ**; shënim për ndalimin e hershëm (3 iterime në vend të 6) |
| **Bibliotekat** | `matplotlib.pyplot`, `matplotlib.patches`, `math`, `copy`, `subprocess` |
| **⚠ Varësi e munguar** | Qeliza 12 kërkon **`bellmanford_pygame.py`** — **nuk u dorëzua.** Shih C-8 |
| **Outpute** | **Asnjë** — fletorja nuk është ekzekutuar kurrë (ndryshe nga varianti i Dijkstra-s) |
| **Në faqe** | Si më sipër. Fakti që të dyja fletoret kanë strukturë të njëjtë e bën **krahasimin ballë-për-ballë** në web jashtëzakonisht të natyrshëm — prandaj vizualizuesi P0 i kombinon të dyja |

---

## B. COURSE STRUCTURE — struktura e rindërtuar e lëndës

```
STRUKTURA DISKRETE & ALGORITME  ·  Viti I  ·  Shkenca të të Dhënave & Inxhinieri Informatike

├── LABORATORI 1 — Insertion Sort & Selection Sort                     [PUBLISHED]
│   └── Materiali kryesor:  Laborator1.ipynb
│
├── LABORATORI 2 — Kompleksiteti Kohor dhe Merge Sort                  [PUBLISHED]
│   ├── Materiali kryesor:  Laborator2.ipynb
│   └── Detyrë shtëpie:     detyra2_algoritme.ipynb        (Lab 1+2)  ◄── i përbashkët
│
├── LABORATORI 3 — Analiza e Kompleksitetit Mbi Algoritmet e Renditjes [PUBLISHED]
│   ├── Materiali kryesor:  Laborator3.ipynb
│   └── Detyrë shtëpie:     Detyre_Shtepie_Kompleksiteti.ipynb
│
├── LABORATORI 4 — Hyrje në Teorinë e Grafeve                          [PUBLISHED]
│   └── Materiali kryesor:  Laborator4.ipynb
│
├── LABORATORI 5 — Algoritmet e Grafeve: BFS, DFS, Kruskal & Prim      [PUBLISHED]
│   ├── Materiali kryesor:  Laborator5.ipynb  (versioni i zgjeruar, Ush. 1–6)
│   │     ├── Punë në Klasë  →  2 probleme      (brenda fletores)
│   │     └── Detyra Shtëpie →  3 probleme      (brenda fletores, Pattern B)
│   └── [arkiv]  versioni i mëparshëm Ush. 1–3  — i zëvendësuar, nuk publikohet
│
├── LABORATORI 6 — Komponentet e Lidhura Fort & Renditjet Topologjike  [PUBLISHED ⚠]
│   ├── Materiali kryesor:  ◄── Ushtrimet 4–6 të Laborator5.ipynb      (shih C-2)
│   └── Detyrë shtëpie:     Detyra_Shtepie_Laborator6_Ushtrime.ipynb
│
├── LABORATORI 7 — Rrugët më të Shkurtra: Dijkstra · BF · FW           [PUBLISHED]
│   ├── Materiali kryesor:  Laborator7.ipynb  (Ush. 1–6 + Punë në Klasë)
│   ├── Plotësues:          dijkstra_animated.ipynb       (EN)
│   └── Plotësues:          bellmanFord_animated.ipynb    (EN)
│
├── LABORATORI 8 — Floyd-Warshall & Edmonds-Karp                       [PUBLISHED]
│   └── Materiali kryesor:  Laborator8.ipynb   (3 skenarë realë + sintezë)
│
├── LABORATORI 9 — Max-Flow / Min-Cut & FF vs EK                       [PUBLISHED]
│   └── Materiali kryesor:  Laborator9.ipynb
│         └── Detyra Shtëpie → 3 detyra        (brenda fletores, Pattern B)
│
└── LABORATORËT 10–15 …                                                [COMING SOON]
        (nuk u dorëzua material — faqet nuk krijohen, por sistemi i pret)
```

### Harta tematike (progresioni)

| Lab | Bllok tematik | Përparon në |
|:--:|---|---|
| 1–3 | **Renditje & Kompleksitet** | Themeli i Big-O për gjithçka që vjen |
| 4 | **Bazat e Teorisë së Grafeve** | Terminologjia & paraqitjet |
| 5–6 | **Përshkimi i Grafeve & MST** | BFS/DFS → SCC, Topologjik, Kruskal/Prim |
| 7–8 | **Rrugët më të Shkurtra** | Dijkstra → Bellman-Ford → Floyd-Warshall |
| 8–9 | **Rrjedha Maksimale** | Edmonds-Karp → Ford-Fulkerson, Min-Cut |

---

## C. AMBIGUITIES — paqartësi dhe vendime

### C-1 · `NameError` i ruajtur në Laboratorin 1 ✅ KORRIGJUAR
> **Përditësim:** Ushtrimi 2 u rishkrua në Plotly (siç e kërkonte komenti i tij) dhe u ri-ekzekutua;
> grafiku tani shfaqet interaktiv në faqe. Shih `MANIFEST.json` dhe `docs/LEKSIONET-DHE-LABORATORET.md`.

Qeliza 2 e `Laborator1.ipynb` importon `plotly.graph_objects` por thërret `plt.subplots()`.
Outputi i ruajtur është `NameError: name 'plt' is not defined` — pra ky ushtrim **nuk prodhoi kurrë grafik**.
**Veprimi:** *raportuar, jo i korrigjuar.* Faqja e shfaq qelizën normalisht dhe e shënon gabimin
si *gabim real ekzekutimi* (jo si mbyllje dritareje). **Rekomandim:** shtoni `import matplotlib.pyplot as plt`
ose kthejeni në Plotly, pastaj ri-ekzekutoni dhe ri-ngarkoni fletoren.

### C-2 · Laboratori 6 — nuk ka fletore të vetën ⚠ KËRKON KONFIRMIM
Nuk u dorëzua asnjë `Laborator6.ipynb`. Megjithatë:
- ekziston `Detyra_Shtepie_Laborator6_Ushtrime.ipynb`;
- ajo referon eksplicitisht *"Ushtrimi 4"* dhe *"Ushtrimi 5/6"* **të laboratorit**, me emra funksionesh `analyze_scc`, `build_predecessors`, `available_nodes`;
- këto ushtrime ekzistojnë **vetëm** në `Laborator5 .ipynb` (versioni i zgjeruar).

**Interpretimi më i mundshëm:** Laboratori 6 u zhvillua duke vazhduar të njëjtën fletore — Ushtrimet 4–6.
**Vendimi i zbatuar:** Laboratori 6 ka **faqen e vet** me titullin *"Komponentet e Lidhura Fort & Renditjet Topologjike"*,
e cila **nuk dublikon** përmbajtje: shfaq Ushtrimet 4–6 duke i marrë nga fletorja e Lab 5 dhe e shënon qartë burimin.
Nëse në të vërtetë ekziston një `Laborator6.ipynb` i veçantë, mjafton ta hidhni në dosje dhe të ndryshoni një rresht.
**➜ Kjo është e vetmja paqartësi që kërkon konfirmimin tuaj.**

### C-3 · Detyra e kompleksitetit ka grafikun e gatshëm brenda
`Detyre_Shtepie (1).ipynb` ruan një output Plotly. Detyra kërkon që studenti të *prodhojë* atë grafik
duke ndryshuar 3 rreshta. Outputi i ruajtur mund t'ia japë përgjigjen vizuale përpara punës.
**Vendimi:** në faqe ky output **palohet si parazgjedhje** me etiketë *"Rezultati i pritshëm — hapeni pas punës suaj"*.
Fletorja origjinale mbetet **e paprekur** për shkarkim. *Nuk u fshi asgjë.*

### C-4 · Emërtim jokonsistent i detyrave
Tre konvencione të ndryshme: `Detyre_Shtepie (1)`, `Detyra_Shtepie_Laborator6_Ushtrime`, `detyra2_algoritme`.
Asnjëra nuk tregon në mënyrë të besueshme laboratorin. **Vendimi:** lidhja lab↔detyrë deklarohet
**eksplicitisht në metadata**, kurrë nuk merret me hamendje nga emri i skedarit. Skedarët për shkarkim
riemërtohen në mënyrë të parashikueshme (`detyra-lab02-algoritmet-e-renditjes.ipynb`), **pa ndryshuar përmbajtjen**.

### C-5 · Të dhënat institucionale
I vetmi fakt i dokumentuar është koka e `detyra2_algoritme.ipynb`:
**Lenda:** Struktura Diskrete dhe Algoritme · **Fakulteti:** Shkencave të Natyrës.
Emri i universitetit, i pedagogut, orari dhe salla **nuk ekzistojnë askund**.
**Vendimi:** ato janë *placeholder-a të konfigurueshëm* në një skedar të vetëm. Asgjë nuk u shpik.

### C-6 · Screenshot-et e Google Classroom mungojnë
Arkivi nuk përmbante imazhe. Seksioni D bazohet vetëm në dëshmi nga vetë fletoret.

### C-7 · Dy gjuhë
Laboratorët kryesorë: **shqip**. Dy fletoret e animuara: **anglisht**.
**Vendimi:** asgjë nuk u përkthye. Navigimi i faqes është **shqip**; resurset në anglisht
marrin një distinktiv `EN` që studenti ta dijë përpara se të klikojë.

### C-8 · Skedarët `*_pygame.py` mungojnë ⚠
`dijkstra_animated.ipynb` dhe `bellmanFord_animated.ipynb` nisin skripte të jashtme
(`dijkstra_pygame.py`, `bellmanford_pygame.py`) që **nuk u dorëzuan**.
Pa to, seksioni 6 i të dy fletoreve dështon te studenti.
**Vendimi:** faqja e shënon atë qelizë me një kallëzues *"kërkon skedar shoqërues që nuk është publikuar"*
— nuk krijojmë buton që çon në përvojë të prishur. Nëse i keni, hidhini në `content/notebooks/` dhe shënimi hiqet.

### C-9 · `Laborator2 (1)` dhe `Laborator3 (1)`
Sufiksi ` (1)` = shkarkim i dyfishtë i shfletuesit, **jo** version i dytë (nuk ka skedar pa sufiks për t'u krahasuar).
Trajtohen si materiali i vetëm dhe zyrtar i Lab 2 / Lab 3.

### C-10 · Labs 10–15 nuk ekzistojnë
> **Përditësim:** Laboratori 10 (Aplikime të rrjedhës max — Leksionet 5–6, slides 80–90) u shtua.

Rreth 15 laboratorë priten; 9 janë dorëzuar. **Asnjë përmbajtje nuk u shpik.**
Sistemi mbështet statusin `coming-soon` dhe një lab i ri kërkon 1 skedar + 1 hyrje metadata.

---

## D. CURRENT WORKFLOW ANALYSIS — çfarë dëshmojnë materialet

*(Bazuar në dëshmi nga vetë fletoret, sepse screenshot-et nuk u dorëzuan.)*

| Dëshmi e gjetur | Problemi që tregon |
|---|---|
| Dy `Laborator5` ku njëri është nënbashkësi e rreptë e tjetrit | **Versionet e rishikuara publikohen si postime të reja.** Studenti nuk di cilin të hapë. |
| ` (1)` në 3 emra skedarësh | Shkarkime të dyfishta — dëshmi që studentët marrin skedarë, jo faqe. |
| 3 konvencione emërtimi për detyrat | **Detyrat janë të shpërndara**, jo të organizuara. Asnjë vend qendror. |
| Detyra 6 referon *"Ushtrimi 4 i laboratorit"* pa lidhje | Lidhja lab↔detyrë ekziston **vetëm në kokën e studentit**. |
| Detyrat janë herë brenda labit (5, 9), herë skedarë veçmas (2, 3, 6) | **Pa model konsistent** — studenti duhet të kujtojë ku ishte. |
| Materiali plotësues (2 fletore Dijkstra/BF) pa asnjë referencë nga Lab 7 | **Resurset e së njëjtës javë duken të palidhura.** |
| Fletoret referojnë `*_pygame.py` që s'janë aty | Varësitë e shpërndara nëpër postime humbasin. |
| Çdo lab ka grumbull të ndryshëm importesh (pygame, tkinter, networkx, plotly, ipywidgets…) | **Nuk ka një vend të vetëm që thotë "instalo këtë".** |
| 6 nga 9 labe varen nga Pygame për të gjithë vizualizimin | Nëse Pygame nuk instalohet, **studenti humbet gjithë vizualizimin**. |

**Përfundim:** problemi nuk është "fletoret nuk janë online". Problemi është se
**struktura akademike (Lab → Resurse → Detyrë) nuk ekziston askund** — ajo jeton në kujtesën e pedagogut.
Faqja e re e bën atë strukturë **të dukshme, të lidhur dhe të kërkueshme**.

---

## E. PROPOSED WEBSITE STRUCTURE

```
Kreu                 — kartelë "Laboratori Aktual", timeline, hyrje, shkurtore
Laboratorët          — 9 kartela + vendmbajtëse; grid ose timeline
  └ /laboratoret/07  — faqe e plotë laboratori
Detyrat e Shtëpisë   — TË GJITHA detyrat e semestrit në një tabelë të vetme
Vizualizime          — 5 vizualizuesit interaktivë (P0)
Python & Setup       — instalim, paketa për lab, gabime të zakonshme
Informacioni i Lëndës— programi, temat, si vlerësohet, konfigurim
Kërko                — kërkim në të gjithë faqen (Pagefind)
[Google Classroom]   — buton i jashtëm, gjithmonë i dukshëm
```

**Pse "Vizualizime" si zë kryesor i menusë:** 6 nga 9 laboratorë e humbin krejt anën vizuale
pa desktop-in. Vizualizuesit web nuk janë zbukurim — janë **zëvendësim funksional**.

---

## F. PROPOSED LABORATORY PAGE STRUCTURE

**Lab me një resurs (p.sh. Lab 4):**
```
Kokë: LABORATORI 04 · Titulli · Temat · Statusi · Java
Objektivat (nga teoria, nëse nxirren në mënyrë të besueshme)
[Sidebar TOC]  ·  MATERIALI KRYESOR (fletorja e renderuar)
Shkarkime  ·  Çfarë të instaloj  ·  ← Lab 3 | Lab 5 →
```

**Lab me shumë resurse (p.sh. Lab 7):**
```
Kokë: LABORATORI 07 · Rrugët më të Shkurtra · Dijkstra, Bellman-Ford, Floyd-Warshall
┌ NGA KU TË FILLOJ ────────────────────────────────┐
│ 1 · Materiali kryesor — Laborator7.ipynb         │  ← rendi është i deklaruar
│ 2 · Dijkstra — Animuar (EN)                      │
│ 3 · Bellman-Ford — Animuar (EN)                  │
│ 4 · Provo interaktivisht: Dijkstra vs BF         │
└──────────────────────────────────────────────────┘
MATERIALI KRYESOR      (fletorja, me TOC)
MATERIAL PLOTËSUES     (2 fletore, secila me faqen e vet)
PUNË NË KLASË          (ankora brenda fletores)
VIZUALIZIME            (kartela drejt vizualizuesve)
SHKARKIME              (3 fletore origjinale)
← Laboratori 6   |   Laboratori 8 →
```

Studenti **nuk sheh kurrë tre emra skedarësh pa kontekst**.

---

## G. HOMEWORK STRATEGY

| Pattern | Shembull | Trajtimi |
|---|---|---|
| **A — fletore veçmas** | Lab 2, Lab 3, Lab 6 | Kartelë e plotë + shkarkim + lidhje te labi |
| **B — brenda labit** | Lab 5, Lab 9 | **Zero dublikim** — kartela lidh te `#detyra-shtepie` i faqes së labit |
| **C — ushtrime që funksionojnë si detyrë** | Punë në Klasë (Lab 5, 7) | Seksion `PUNË NË KLASË`, i shënuar qartë si *jo* detyrë shtëpie |

Faqja `/detyrat` tregon **të gjithë semestrin njëherësh**: laboratori, titulli, lloji (veçmas/brenda labit),
temat, statusi, shkarkimi. **Asnjë afat nuk u shpik** — fusha `afati` ekziston, është bosh, dhe kur mungon
faqja shkruan *"Afati njoftohet në Google Classroom"*.

---

## H. PYTHON / SETUP STRATEGY

Varësitë u nxorën duke skanuar **çdo import në të 14 fletoret**:

| Paketa | Labet | Lloji |
|---|---|---|
| `pygame` | 1,2,3,4,5,6,7,8,9 | **Desktop-only** — hap dritare |
| `plotly` | 1,2,3,9 + 2 detyra | Browser-friendly |
| `matplotlib` | 1,4 + 2 fletore animuara | Prodhon PNG |
| `networkx` | 4 | Grafe |
| `numpy` | 2,4 | Numerike |
| `ipywidgets` | 9 | Kërkon kernel aktiv |
| `tkinter` | 5 | **Desktop-only**, vjen me Python |
| `collections`,`heapq`,`math`,`random`,`time`,`copy`,`itertools`,`threading`,`sys`,`os`,`subprocess` | — | Bibliotekë standarde |

Faqja `/python` jep: një komandë instalimi, një tabelë **"çfarë duhet për cilin lab"**,
udhëzim pse Pygame **nuk** punon në Google Colab, dhe gabimet e vërteta që prodhon ky material
(`SystemExit`, `pygame.error: video system not initialized`, `ModuleNotFoundError`, `NameError` i C-1).

---

## I. INTERACTIVE LEARNING PLAN

Të përzgjedhur **pas** analizës, sipas: sa laboratorë mbulojnë · sa vizualizim humbet pa desktop · vlera mësimore · kosto ndërtimi.

| # | Vizualizuesi | Labet | Pse pikërisht ky | Prioriteti |
|:-:|---|:--:|---|:--:|
| 1 | **Eksploruesi i Kompleksitetit** — O(1)…O(2ⁿ), rrëshqitës n, pikat e kryqëzimit | 2, 3 (+2 detyra) | Kompleksiteti zë **2 laboratorë të plotë dhe 2 detyra**. Koncepti më abstrakt i vitit të parë. | **P0** |
| 2 | **Vizualizuesi i Renditjes** — Insertion/Selection/Merge, hap-pas-hapi, numërues krahasimesh | 1, 2, 3 | Zëvendëson **4 ushtrime Pygame**. Numëron *krahasimet* — pikërisht metrika që Lab 3 kërkon. | **P0** |
| 3 | **Fusha e Lojës së Grafeve** — ndërto graf, listë & matricë fqinjësie live, BFS/DFS/Kruskal/Prim hap-pas-hapi | 4, 5, 6 | Zëvendëson **5 ushtrime Pygame/Tkinter**. Ndërtimi i grafit është *thelbi* i Lab 4. | **P0** |
| 4 | **Dijkstra vs Bellman-Ford** — i njëjti graf, të dy algoritmet krah për krah, peshë negative, cikël negativ | 7 (+2 fletore animuara) | Lab 7 është **100% Pygame** dhe të dy fletoret animuara **nuk hapen dot** (C-8). Vlera më e lartë e mundshme. | **P0** |
| 5 | **Stepper-i Floyd-Warshall** — matrica D, kulmi ndërmjetës k, `D[i][j]=min(D[i][j],D[i][k]+D[k][j])` | 7, 8 | I vetmi algoritëm në **dy laboratorë**. Trefishi i lakut është i pamundur të ndiqet me sy. | **P0** |
| 6 | Max-Flow / Min-Cut — rrugë rritëse, kapacitet mbetës, FF(DFS) vs EK(BFS) | 8, 9 | Vlerë e lartë, por kërkon më shumë punë; arkitektura e pret. | P1 |
| 7 | Vizualizues i rekursionit (stiva e thirrjeve) | 2 (Merge Sort) | I dobishëm, por mbulohet pjesërisht nga #2. | P2 |
| 8 | Linear vs Binary Search | — | **Nuk e ndërtojmë:** Binary Search përmendet vetëm si shembull tabele; nuk ka laborator të vetin. | ❌ |

**Parimi:** çdo vizualizues lidhet nga laboratori i tij dhe kthen te ai. Asnjëri nuk u ndërtua sepse "duket bukur" —
të pesët zëvendësojnë vizualizim që studenti **ndryshe e humbet krejt**.

---

## J. TECHNOLOGY DECISION

> Vendimi u mor **pas** analizës. Materiali diktoi arkitekturën, jo e kundërta.

### Çfarë diktoi materiali

1. Përmbajtja janë **fletore me outpute të ruajtura** → renderim në kohë ndërtimi, **pa ekzekutim**.
2. **6/9 labe janë Pygame/Tkinter** → ekzekutimi automatik është *i pamundur dhe i rrezikshëm*.
3. Një lab ka **shumë resurse** → duhet model i tipizuar Lab→Resurse, jo skedar↔faqe.
4. Kërkohen **5 vizualizues interaktivë** → duhet JS, por vetëm aty ku duhet.
5. **Një pedagog** → asnjë server, asnjë bazë të dhënash, asnjë kredencial.
6. Kosto ~0, siguri, jetëgjatësi → **statik**.

### Arkitektura e zgjedhur

| Shtresa | Zgjedhja | Arsyeja |
|---|---|---|
| Gjenerimi | **Astro** (output statik) | *Content collections* = pikërisht modeli Lab→Resurse me validim tipesh. *Islands* = JS vetëm te vizualizuesit; faqet e teorisë janë ~0 KB JS. |
| Fletoret | **Konvertues i shkruar posaçërisht** (TypeScript, kohë ndërtimi) | Lexon `.ipynb` si JSON. **Nuk e ekzekuton kurrë.** Nxjerr TOC, seksione (Ushtrim / Punë në Klasë / Detyrë / Reflektim), palos kodin e gjatë, trajton `SystemExit` si mbyllje dritareje jo si dështim. Orgjinali mbetet i paprekur. |
| Kodi | **Shiki** | I njëjti motor si VS Code, ngjyrosje në kohë ndërtimi → 0 KB JS. |
| Matematika | **KaTeX** | `O(n²)`, `D[i][k]+D[k][j]`, `0 ≤ f(u,v) ≤ c(u,v)` — renderohet në ndërtim, pa JS. |
| Plotly | **plotly.js i ngarkuar me përtesë** | Outputet ekzistuese Plotly mbeten **interaktive**, jo screenshot. Ngarkohet vetëm kur qeliza hyn në ekran. |
| Kërkimi | **Pagefind** | Indeks statik i ndërtuar automatikisht. Pa API, pa çelës, pa kosto. Punon në shqip me diakritikë. |
| Vizualizuesit | **Web Components (vanilla TS) + Canvas/SVG** | Pa framework runtime. Ngarkohen vetëm në faqen e vet. |
| Hosting | **GitHub Pages + GitHub Actions** | Falas përgjithmonë. Git = historik + kopje rezervë. Push → publikim. |

### Alternativat e shqyrtuara dhe pse u refuzuan

| Alternativa | Pse jo |
|---|---|
| **Jupyter Book / Quarto** | Renderim i shkëlqyer fletoresh, **por**: modeli është skedar→faqe (nuk mbështet *"një lab, katër resurse"*), integrimi i 5 vizualizuesve custom kërkon hakime, dhe shton varësi Python në tubacionin e publikimit. |
| **nbconvert → HTML statik** | Do të prodhonte 14 faqe të palidhura — **pikërisht Classroom me CSS**. Pa navigim, pa lidhje lab↔detyrë. |
| **Next.js / Nuxt** | SSR/serverless që nuk na duhet. Faqe krejtësisht statike; do të shtonte kosto, kompleksitet dhe sipërfaqe sulmi pa asnjë përfitim. |
| **Docusaurus / MkDocs** | Të fuqishëm për dokumentacion, **por** trajtimi i `.ipynb` është i dorës së dytë dhe modeli i përmbajtjes është "dokument", jo "laborator me resurse". |
| **JupyterLite / Pyodide** (Python në browser) | Tërheqës, **por** Pygame dhe Tkinter **nuk punojnë** — pra do të mbulonte vetëm 3 nga 9 labe, me ~10 MB shkarkim. Vizualizuesit vendas japin më shumë vlerë mësimore me shumë më pak peshë. |
| **Binder / Colab për ekzekutim** | Colab **nuk hap dot dritare Pygame**. Do të krijonte butona që çojnë në përvojë të prishur — pikërisht ajo që kërkuat të shmangim. |
| **WordPress / Moodle / LMS** | Autentikim, baza të dhënash, përditësime sigurie, kosto. Rikrijon Classroom-in që po e mbajmë. |
| **Bazë të dhënash + llogari studentësh** | Asnjë kërkesë e vërtetë nuk e justifikon. Do të shtonte GDPR, fjalëkalime, rivendosje, kosto — për zero përfitim mësimor. |

### Kufizime të rëndësishme (të deklaruara hapur)

- Ushtrimet Pygame/Tkinter **nuk ekzekutohen në web** — dhe nuk do të ekzekutohen. Faqja jep teorinë, kodin, shkarkimin dhe udhëzimin lokal.
- Outputi `ipywidgets` i Lab 9 **nuk rirenderohet** pa kernel (kufizim i vetë ipywidgets).
- Fletoret pa outpute të ruajtura (p.sh. `bellmanFord_animated`) shfaqin kod e teori, por pa figura.
- Faqja **nuk pranon dorëzime detyrash** — kjo mbetet te Google Classroom, qëllimisht.

---

## K. WEEKLY LECTURER WORKFLOW

Publikimi i një laboratori të ri, çdo javë:

```
1.  Kopjo fletoren        →  site/content/notebooks/Laborator10.ipynb
2.  Krijo 1 skedar        →  site/content/labs/lab-10.yaml   (≈12 rreshta)
3.  git add . && git commit -m "Laboratori 10" && git push
4.  GitHub Actions ndërton dhe publikon (≈2 min)
```

Automatikisht, pa asnjë punë shtesë, përditësohen:
kartela **"Laboratori Aktual"** në kreun · timeline-i · lista e laboratorëve · indeksi i kërkimit ·
navigimi **← / →** · faqja e detyrave (nëse fletorja përmban *"Detyra për Shtëpi"*) ·
tabela e paketave në `/python` (nga importet reale) · TOC-i i fletores · lidhjet e shkarkimit.

Pedagogu **nuk** shkruan kurrë HTML, nuk redakton navigim, nuk dublikon përmbajtje detyrash
dhe nuk ri-ndërton kreun me dorë.
