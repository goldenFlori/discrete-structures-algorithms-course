# Leksionet ↔ Laboratorët — Harta e Mbulimit

> Ky dokument lidh çdo koncept të leksioneve të koordinatores së lëndës
> ([`goldenFlori/materials`](https://github.com/goldenFlori/materials), dosja `Leksione-Slides/`)
> me vendin ku praktikohet në laborator. Qëllimi: **asnjë koncept i leksionit pa ushtrim**.
>
> Lexuesi: pedagogët e laboratorit.

---

## 1. Çfarë u shtua

| Fletorja | Lab | Leksioni | Përmbajtja |
|---|:-:|---|---|
| `laborator-01-ushtrime-shtese.ipynb` | 1 | L1 (slides 17–45) | pseudokodi rresht për rresht, HI si `assert`, kundërshembulli që testet nuk e gjejnë, inputi më i keq, HI e Selection Sort |
| `laborator-02-ushtrime-shtese.ipynb` | 2 | L2 + L3 (slides 2, 21) | tabela e numërimit të rreshtave, $c$ dhe $n_0$, klasat O(·), tabela "285 vite", `Merge` i saktë |
| `laborator-03-ushtrime-shtese.ipynb` | 3 | L3 | logaritmi si përgjysmime, pema rekursive e matur, induksioni i fortë në çdo thirrje, rasti bazë i gabuar |
| `laborator-04-ushtrime-shtese.ipynb` | 4 | L4 (i plotë) | Königsberg/Euler, lema e shtrëngimit të duarve, $K_n$, $\overline G$, $Q_3$, nëngrafet, paraqitjet, ecjet, diametri, KLF |
| `laborator-09-ushtrime-shtese.ipynb` | 9 | L5–6 (slides 2–79) | rrjedha e lejueshme, prerja, greedy që dështon, $G_f$, `rritRrjedhë`, FF/EK, shembulli me $C$, prerja min nga $G_f$ |
| `laborator-10.ipynb` *(i ri)* | 10 | L5–6 (slides 80–90) | çiftëzimi dyanësor (vajzat/kotelet), caktimi (lulet/buqetat), modelim i lirë |

Çdo fletore e re:
- **nuk kërkon Pygame/Tkinter** — punon në Colab, Jupyter, VS Code, dhe shfaqet plotësisht në faqe;
- ka qeliza **`kontrollo(...)`** që i testojnë funksionet e studentit: ✓ gati · ✗ gabim (me arsyen) · ⏳ pa plotësuar;
- ka **Punë në Klasë** (me laps e letër) dhe **Pyetje Reflektuese**;
- citon slide-t e leksionit dhe përdor **terminologjinë e leksionit** (p.sh. *udhëtim/udha/shteg*, *derdhje*, *rrjeta mbetëse*, *brinjë kthyese*).

Ndryshime të vogla në fletoret ekzistuese (të regjistruara te `MANIFEST.json`):

| Fletorja | Ndryshimi |
|---|---|
| `laborator-01.ipynb` | Ushtrimi 2 u rishkrua në Plotly → korrigjon `NameError` (ANALYSIS **C-1**). |
| `laborator-09.ipynb` | "kulm (sink)" → "**derdhje** (sink)"; shënim për antisimetrinë kundrejt përkufizimit të leksionit. |
| `laborator-08.ipynb` | I njëjti shënim për antisimetrinë. |

---

### Vizualizimet interaktive në faqe

Çdo laborator ka tani vizualizimet e veta në faqe — **40 ushtrime interaktive** me 13
vizualizues (React + HeroUI). Çdo ushtrim që hap një dritare Pygame/Tkinter shfaq në faqe
versionin e tij interaktiv, me të njëjtat të dhëna si fletorja (harta e Shqipërisë, UrbanPost,
aeroporti TIA, labirinti …). Harta e plotë: `embeds` te `site/content/course.mjs`.
Rrjetat e **detyrave të shtëpisë** nuk janë përfshirë qëllimisht në vizualizues, që të mos
japin përgjigjen.

---

## 2. Harta koncept → ushtrim

Legjenda: **K** = laboratori kryesor ekzistues · **S** = ushtrimet shtesë · **10** = Laboratori 10.

### Leksioni 1 — Hyrje; Insertion Sort; Analiza e rastit më të keq

| Koncepti (slide) | Ku praktikohet |
|---|---|
| Problemi i renditjes (19–20) | K1 Ush. 1–4 |
| Insertion Sort — ideja, pseudokodi, shembulli `[6,4,3,8,5]` (21–27) | K1 Ush. 1 (Pygame) · **S1 Ush. 1** (gjurmimi i saktë i slide-ve) |
| "Vërtetim" empirik dhe kufijtë e tij (31–34) | **S1 Ush. 3** — algoritëm që kalon 10 000 teste por është i gabuar |
| Analiza e rastit më të keq — "kundërshtari" (34–35, 45) | **S1 Ush. 4** — inputi më i keq, verifikuar ndaj të gjitha permutacioneve |
| Katër përbërësit e induksionit (40–41) | **S1 Kujtues + Punë në Klasë 2** |
| Korrektësia e Insertion Sort me induksion (42–44) | **S1 Ush. 2** (HI si `assert`) · **S1 Punë në Klasë 3–4** |

### Leksioni 2 — Analiza asimptotike

| Koncepti (slide) | Ku praktikohet |
|---|---|
| Pse jo sekonda (3–4) | K2 Ush. 3–5 · Detyra Lab 3 |
| Numërimi i veprimeve rresht për rresht (5) | **S2 Ush. 1** — tabela automatike + formulat e mbyllura |
| Ideja asimptotike, termi dominues (7–9) | K2 Ush. 1 · **S2 Ush. 3** |
| Pro/kundër, $10^9 n$ kundrejt $n^2$ (10) | **S2 Ush. 4** (diskutim) |
| Përkufizimi joformal dhe formal i O(·) (11–15) | **S2 Kujtues + Ush. 2** |
| Shembulli $2n^2+10$, $c=3,n_0=4$ / $c=7,n_0=2$ (16–19) | **S2 Ush. 2** (test + grafik) |
| $n = O(n^2)$ (20) | **S2 Ush. 2** · **S2 Punë në Klasë 3** ($n^2 \ne O(n)$) |
| Insertion Sort është $O(n^2)$ (21–25) | **S2 Ush. 1** · K3 Ush. 2–3 |

### Leksioni 3 — Merge Sort

| Koncepti (slide) | Ku praktikohet |
|---|---|
| Tabela e kohës për $n$ deri në $3\cdot10^9$ (2) | **S2 Ush. 4** (riprodhon 10⁻⁵ s, 0.001 s, 1000 s, 285 vite) |
| Përça e sundo (3–8) | K2 · **S3 Kujtues** |
| Pseudokodi i MergeSort dhe `Merge` (9, 21) | K2 Ush. 2 · **S2 Ush. 5** (pseudokodi i slide-it dështon me `IndexError` — studentët e korrigjojnë) |
| Korrektësia me induksion të fortë (25–26) | **S3 Ush. 3** (HI në çdo kthim rekursiv) · **S3 Punë në Klasë 2** ("Plotëso hapin induktiv!") |
| Induksioni iterativ kundrejt rekursiv (27) | **S3 Kujtues** (tabelë) |
| Logaritmi si numër përgjysmimesh (31) | **S3 Ush. 1** |
| $O(n\log n)$ kundrejt $O(n^2)$ (29–32) | K3 Ush. 3 · **S3 Ush. 4** |
| Pema rekursive (33–39) | **S3 Ush. 2** (e matur nga kodi) · **S3 Punë në Klasë 1, 3** |

### Leksioni 4 — Grafet

| Koncepti (slide) | Ku praktikohet |
|---|---|
| Königsberg, Euler, multigrafi (2–3, 42) | **S4 Ush. 1** |
| Përkufizimi $G=(V,E)$, fqinjësia, incidenca (24–32) | K4 Teoria · **S4 Kujtues** |
| Fuqitë, lema e shtrëngimit të duarve (33–34) | K4 Ush. 1 · **S4 Ush. 2** (përfshirë vargun që kalon lemën por nuk realizohet) |
| Grafe të rregullt, $Q_3$ (35) | **S4 Ush. 3** |
| Graf i plotë, grafi plotësues (36–37) | K4 Ush. 3 · **S4 Ush. 3** |
| Grafe dyanësorë | K4 Ush. 2 · 10 Ush. 1–2 |
| Nëngraf, i induktuar, përfshirës, klikë, e pavarur (36–40) | K4 Ush. 2 · **S4 Ush. 4** |
| Multigrafe, digrafe, fuqitë hyrëse/dalëse, grafe me pesha (41–45) | K4 Ush. 3–4 · **S4 Ush. 5** |
| Matrica dhe lista e fqinjësisë; grafe të dendur/të rrallë; kompromiset (46–56) | K4 Ush. 4 · **S4 Ush. 5** |
| Udhëtim, udha, cikël, shteg, cikël elementar (57–62) | **S4 Ush. 6** |
| Shtegu më i shkurtër, largesa, diametri (63–64) | **S4 Ush. 7** → BFS në Lab 5 |
| Graf i lidhur, komponentet e lidhura (65–66) | **S4 Ush. 7** · K5 Detyra 1 |
| Rrugëtim, cirkuit, rrugë, cirkuit elementar (67–71) | **S4 Kujtues** · **S4 Punë në Klasë 3** |
| Digraf i lidhur, i lidhur fort, KLF (72–73) | **S4 Ush. 8** · Lab 6 (Ush. 4 e fletores 5 + detyra) |

### Leksionet 5–6 — Rrjedha Max / Prerja Min / Aplikime

| Koncepti (slide) | Ku praktikohet |
|---|---|
| Rrjetat e transportit, burim, derdhje, kapacitet (3–5) | K8, K9 · **S9 Kujtues** |
| $s$-$t$ prerja dhe kapaciteti i saj (7–10) | K9 Ush. 1 + Loja Finale · **S9 Ush. 2** (vetëm brinjët $S\to T$!) |
| Rrjedha: kufizimi i kapacitetit, ruajtja, vlera (11–17) | **S9 Ush. 1** |
| Teorema rrjedhë-max = prerje-min; dualiteti i dobët (18–23) | K9 · **S9 Ush. 2** (të 16 prerjet) · **S9 Punë në Klasë 4** (vërtetim formal) |
| Algoritmi greedy dhe pse dështon (26–36) | **S9 Ush. 3** (riprodhon slides 28–31 dhe 33–35) |
| Rrjeta mbetëse, brinja kthyese, kapaciteti mbetës (37–39) | K9 Ush. 2–3 · **S9 Ush. 4** |
| Rrugë rritëse, `rritRrjedhë` (40–46) | **S9 Ush. 5** |
| Ford-Fulkerson (47–58) | K8 Ush. 3 · K9 Ush. 2–3 · **S9 Ush. 6** |
| Pse FF funksionon — Lema 2, prerja nga kulmet e arritshëm (59–64) | **S9 Ush. 8** (+ verifikim në 150 rrjeta të rastit) |
| Shembulli me $C$, zgjedhja e rrugës (66–73) | **S9 Ush. 7** ($2C$ kundrejt 2 iteracioneve) |
| Edmonds-Karp, $O(nm^2)$ (74–75) | K9 Ush. 2–3 · **S9 Ush. 6–7** |
| Integraliteti (76) | **S9 Ush. 6** · 10 Ush. 2 |
| Çiftëzimi maksimum në grafe dyanësore (81–85) | **10 Ush. 1–2** |
| Problemet e caktimit — lulet dhe buqetat (86–89) | **10 Ush. 3** · **10 Ush. 4** (modelim i ri) |

---

## 3. Laboratorët pa leksion përkatës në `materials`

Repo-ja `materials` përmban vetëm **Leksionet 1–6**. Temat e mëposhtme të laboratorëve **nuk** kanë slide
atje (ndoshta trajtohen në seminare ose në leksione që nuk janë ngarkuar ende):

| Lab | Temat |
|:-:|---|
| 5 | BFS, DFS, Kruskal, Prim |
| 6 | Renditja topologjike (KLF-të janë në L4, slide 73) |
| 7 | Dijkstra, Bellman-Ford, Floyd-Warshall |
| 8 | Floyd-Warshall (Edmonds-Karp lidhet me L5–6) |

Kur të shtohen leksionet përkatëse në `materials`, këto laboratorë mund të marrin të njëjtin trajtim.

---

## 4. Zgjidhjet dhe rigjenerimi (vetëm lokalisht)

Zgjidhjet **nuk** ndodhen në GitHub — repo-ja është publike. Ato janë në `zgjidhjet/` (te `.gitignore`):

```
zgjidhjet/
├── laborator-01-ushtrime-shtese-ZGJIDHJE.ipynb   ← e ekzekutuar, të gjitha kontrollet ✓
├── …
└── burimi/                 ← burimi i vetëm nga i cili gjenerohen të dy versionet
    ├── common.py           (shënjuesit #<< PLOTESO … #>>, ekzekutimi, verifikimi)
    └── lab01.py … lab10.py
```

Për të ndryshuar një ushtrim: redaktoni `zgjidhjet/burimi/labNN.py`, pastaj

```bash
pip install nbformat nbclient ipykernel matplotlib plotly networkx numpy
cd zgjidhjet/burimi && python lab04.py
```

Skripti ekzekuton **të dy** versionet dhe ndalon me gabim nëse zgjidhja nuk kalon çdo kontroll, ose nëse versioni
i studentit ka gabime të papritura. Fletorja e studentit shkruhet direkt te `site/content/notebooks/`.

> ⚠️ Mos e kopjoni `zgjidhjet/` në Classroom ose në repo publike. Nëse përdorni një kompjuter tjetër, transferojeni
> dosjen me dorë.

---

## 5. Sugjerim për përdorimin në orë

Ushtrimet shtesë janë projektuar për **~45–60 minuta**. Dy mënyra:

- **Brenda orës:** 30 min laboratori kryesor (vizualizimet Pygame) + 45 min ushtrimet shtesë, Punë në Klasë në fund.
- **Si detyrë:** laboratori kryesor në orë, ushtrimet shtesë në shtëpi — kontrollet `kontrollo(...)` i lejojnë
  studentët të vetë-verifikohen pa pritur korrigjimin.
