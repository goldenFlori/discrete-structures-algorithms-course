# Rishikimi i laboratorëve 1–10 — gabime, përmirësime, mungesa

> Rishikim i plotë i fletoreve të laboratorit kundrejt programit të lëndës
> ([`LEKSIONET-DHE-LABORATORET.md`](LEKSIONET-DHE-LABORATORET.md)), tetor 2026.
> Lexuesi: pedagogët e laboratorit.
>
> Çdo pikë ka një **shkallë** dhe një **ndreqje konkrete**. Çdo laborator ka issue-n e vet në GitHub;
> ndreqjet bëhen me një PR për laborator.

**Shkallët:**

| Shenja | Kuptimi |
|:-:|---|
| 🔴 **Gabim** | Pohim i pasaktë matematikisht ose algoritmikisht; studenti mëson diçka të gabuar. |
| 🟠 **Paqartësi** | E saktë në thelb, por e formuluar në mënyrë që mund të keqkuptohet ose që bie ndesh me leksionin. |
| 🟡 **Mungesë** | Koncept i rëndësishëm i programit pa ushtrim, ose ushtrim që mungon për ta kuptuar temën. |
| ⚪ **Formë** | Drejtshkrim, dublikime, kod që nuk ekzekutohet në shfletues, matje të zhurmshme. |

**Përfundimi i shkurtër.** Fletoret *Ushtrime Shtesë* (Lab 1–4, 9) dhe Laboratori 10 janë të sakta: çdo pohim i
vështirë u verifikua (p.sh. kundërshembulli më i shkurtër me 6 elemente në Lab 1, peshat e MST-ve në Lab 5,
rrjedha max 25 në detyrën e Lab 9). Gabimet e vërteta janë në fletoret kryesore: **4 gabime**, **6 paqartësi**,
**11 mungesa**.

---

## Çështje të përbashkëta

| | Çështja | Ndreqja |
|:-:|---|---|
| ⚪ | **Pygame/Tkinter** në fletoret kryesore: nuk ekzekutohen në shfletues (Colab, platforma). | Mbeten për punë lokale; platforma shfaq vizualizimin interaktiv në vend të tyre. Çdo qelizë e tillë merr një shënim të shkurtër në krye: *"Ky ushtrim hap një dritare; në faqe shihni vizualizimin interaktiv."* |
| ⚪ | **Drejtshkrimi:** Lab 4 (i gjithë) dhe pjesët SCC/topologjike të Lab 5 janë shkruar pa ë dhe ç ("Teorine", "eshte"). | Rishkruhen me drejtshkrim të plotë. |
| ⚪ | **Matja e kohës një herë të vetme** (Lab 1 Ush. 4, Lab 2 Ush. 3–5): për n të vogla rezultati është zhurmë. | Ku mbetet koha, përsëritet matja dhe merret minimumi (si te Lab 1 Ush. 2). Ku qëllimi është kompleksiteti, numërohen operacionet. |
| ⚪ | **Titujt e dyfishtë** (Lab 5: çdo ushtrim e ka titullin dy herë) — përmbajtja shfaqet dy herë në tabelën e përmbajtjes. | Hiqet qeliza e dytë; përditësohen indekset e vizualizimeve te `site/content/course.mjs`. |

---

## Laboratori 1 — Insertion Sort & Selection Sort

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟡 | **Qëndrueshmëria (stability)** kërkohet në Detyrën e Lab 2 ("A është i qëndrueshëm?"), por nuk mësohet askund. | Ushtrim i shkurtër në *Ushtrime Shtesë*: renditen çifte `(nota, emri)` sipas notës; Insertion ruan rendin e emrave me notë të njëjtë, Selection jo — me kundërshembullin `[(2,'a'),(2,'b'),(1,'c')]`. |
| ⚪ | Ush. 4 përdor `matplotlib` me *hover* (`mpl_connect`), që nuk punon në shfletues, dhe një matje të vetme. | Rishkruhet me Plotly (si Ush. 2) dhe me matje të përsëritura. |
| ✅ | *Ushtrime Shtesë* — i saktë dhe i plotë (HI si `assert`, kundërshembulli, inputi më i keq). | — |

## Laboratori 2 — Kompleksiteti kohor dhe Merge Sort

| | Çështja | Ndreqja |
|:-:|---|---|
| 🔴 | **"n₀" përdoret gabim.** Ush. 4 e quan $n_0$ pikën ku Insertion bëhet 2× më i ngadaltë se Merge Sort. Në përkufizimin e O(·) (leksioni 2, slides 11–15), $n_0$ është madhësia nga e cila $f(n) \le c\,g(n)$ për **çdo** $n \ge n_0$. Studenti që i ngatërron humbet pikë te përkufizimi formal. | Riemërtohet **"pika e kryqëzimit"** (crossover) dhe shtohet një paragraf që e dallon nga $n_0$ i përkufizimit, me lidhje te *Ushtrime Shtesë* Ush. 2 ku $n_0$ përdoret saktë. Hiqet edhe "Rregulla e artë: n₀" nga teoria. |
| 🔴 | **Quick Sort renditet O(n log n)** në tabelën e teorisë. Kjo vlen vetëm për rastin mesatar; rasti më i keq është $O(n^2)$. | "Quick Sort (mesatarisht; rasti më i keq O(n²))". |
| 🟠 | **Kontradiktë me teorinë:** teoria thotë *"nuk matim kohën në sekonda, por numrin e operacioneve"*, ndërsa të tre ushtrimet matin sekonda. | Ush. 3 bëhet numërim krahasimesh (si Lab 3); koha mbetet vetëm si ilustrim, me matje të përsëritura. |
| ⚪ | Ush. 3, 4, 5 përsërisin të njëjtin eksperiment dhe ripërkufizojnë të njëjtat funksione; Ush. 5 rendit 10 000 elemente me algoritme kuadratike (shumë i ngadaltë në shfletues). | Bashkohen në **një** eksperiment të mirëprojektuar me n ≤ 2000; funksionet përkufizohen një herë. |

## Laboratori 3 — Analiza e kompleksitetit

| | Çështja | Ndreqja |
|:-:|---|---|
| 🔴 | **"Merge Sort ≈ n·log₂n krahasime, gjithmonë; tre vijat pothuajse identike"** (Ush. 2 dhe strategjia e lojës në Ush. 4). Në një listë të renditur ose të anasjelltë, çdo bashkim ndalet kur mbaron njëra gjysmë: rreth **$\tfrac{n}{2}\log_2 n$** krahasime, gjysma. Për $n=512$: e renditur 2304, e rastit 3968, $n\log_2 n = 4608$. Studenti e sheh në grafik dhe teksti e ngatërron. | Teksti dhe tabela e lojës: "Merge Sort: midis $\tfrac{n}{2}\log_2 n$ (e renditur) dhe $n\log_2 n - n + 1$ (rasti më i keq) — gjithmonë $\Theta(n\log n)$." |
| 🟡 | **Pema rekursive** e leksionit 3 (slides 33–39) nuk ka vizualizim. | Vizualizimi i ri "Pema rekursive" (platforma, #133) futet te Ushtrime Shtesë Ush. 2. |
| ⚪ | `merge_cmps` përdor Merge Sort-in **iterativ** (bottom-up), ndërsa leksioni dhe Lab 2 atë rekursiv. | Shënim i shkurtër ose kalim te versioni rekursiv, që numrat të përputhen me pemën rekursive. |

## Laboratori 4 — Hyrje në teorinë e grafeve

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟠 | **"Çdo brinjë është një çift kulmesh (u, v)"** — çift i renditur, që vlen vetëm për grafet e drejtuar. Në grafin e padrejtuar brinja është bashkësia $\{u, v\}$ (leksioni 4, slide 24). | $E \subseteq \{\{u,v\} : u,v \in V\}$ për grafin e padrejtuar; $(u,v)$ për digrafin. |
| 🟠 | **Fuqia** përkufizohet si "numri i brinjëve që lidhen me kulmin", pa thënë se **laku numërohet dy herë** — edhe pse tabela fut lakun, dhe lema e shtrëngimit të duarve kërkon këtë. (Kodi e numëron saktë: +2.) | "…ku laku numërohet dy herë; kështu $\sum_v \deg(v) = 2|E|$." |
| 🟡 | Paraqitjet krahasohen vetëm në **hapësirë**; mungon koha e veprimeve. | Tabelë: "a ekziston $(u,v)$?" O(1) me matricë, O(deg u) me listë; "fqinjët e u" O(|V|) kundrejt O(deg u). |
| ⚪ | Drejtshkrim pa ë/ç; qelizë kodi bosh në fund; "Sa brinje ka grafin i plote" → "ka grafi i plotë". | — |

## Laboratori 5 — BFS, DFS, Kruskal & Prim

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟠 | **Përkufizimi i pemës përfshirëse** nis me "graf i lidhur, **pa peshë**, i padrejtuar", pastaj MST përkufizohet me shumën e **peshave**. | Pema përfshirëse: graf i lidhur i padrejtuar. MST: graf i lidhur i padrejtuar **me peshë**. |
| 🟡 | **Vetia e prerjes (cut property)** mungon — teorema që shpjegon pse zgjedhja greedy e Kruskal-it dhe e Prim-it është e saktë. | Kujtues me vetinë e prerjes + Punë në Klasë: "Tregoni prerjen që justifikon secilën brinjë të pranuar." |
| 🟡 | **Prim** vizualizohet, por nuk praktikohet me dorë (ka vetëm gjurmimin e Kruskal-it). | Punë në Klasë Problemi 3: Prim mbi të njëjtin graf të Problemit 2, me tabelën e brinjëve kandidate; pesha duhet të dalë 10, si te Kruskal. |
| 🟡 | **Union-Find** përmendet si "struktura kryesore", por nuk shihet si punon. | Vizualizimi i ri Kruskal + union-find (platforma, #132). |
| ⚪ | Tituj të dyfishtë; drejtshkrim pa ë/ç në ushtrimet 4–6. | Shih çështjet e përbashkëta. |

## Laboratori 6 — Komponentet e lidhura fort & renditjet topologjike

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟡 | **Algoritmet standarde mungojnë.** SCC gjenden me arritshmëri çift-pas-çifti, $O(V(V+E))$; **Kosaraju** (ose Tarjan) nuk përmendet. Renditja topologjike përdor idenë e **Kahn-it** (`available_nodes`) pa e emërtuar. | Kujtues: Kahn (radha e kulmeve me fuqi hyrëse 0, $O(V+E)$) dhe Kosaraju (dy DFS, grafi i përmbysur, $O(V+E)$), me një gjurmim të shkurtër me dorë për secilin. Qasja çift-pas-çifti mbetet si përkufizim, me kompleksitetin e saj krahasuar. |
| ✅ | Detyra e shtëpisë — e saktë (G₅ ka SCC {0,1,2} dhe {3,4}). | — |

## Laboratori 7 — Dijkstra, Bellman-Ford, Floyd-Warshall

| | Çështja | Ndreqja |
|:-:|---|---|
| 🔴 | **Punë në Klasë, Problemi 2 (Bellman-Ford) ka dy brinjë C→D**, me pesha 2 dhe −1, dhe figura nuk përputhet me listën. Përgjigjja ndryshon: me −1 cikli A→B→C→D→A ka peshë **−1** (cikël negativ); me 2 ka peshë **+2** (pa cikël negativ). | Brinjët: A→B(1), B→C(−4), C→D(−1), D→A(3), B→D(2); figura rivizatohet. Cikli negativ: A→B→C→D→A me peshë −1. |
| 🟠 | **Floyd-Warshall mësohet dy herë** (Lab 7 Ush. 5–6 dhe Lab 8 pjesa 1), ndërsa teoria e tij (programimi dinamik) është vetëm te Lab 8. | Ush. 5–6 kalojnë te Laboratori 8; Lab 7 përqendrohet te rrugët nga një burim. |
| 🟡 | **Rindërtimi i rrugës** nga `prev[]` dhe **zbulimi i ciklit negativ** (iteracioni i $V$-të) nuk praktikohen me kod. | Ushtrim me `kontrollo(...)`: `rruga(prev, s, t)` dhe `ka_cikel_negativ(...)`. |
| 🟡 | Kurthi klasik: **brinjë negative në graf të padrejtuar** është cikël negativ ($u \to v \to u$). | Pyetje reflektuese. |
| ✅ | Problemi 1 (Dijkstra) — i saktë: dist = A0, B4, C6, D7, E7, F9. | — |

## Laboratori 8 — Floyd-Warshall & Edmonds-Karp

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟡 | **Cikli negativ te Floyd-Warshall** ($D[i][i] < 0$ pas algoritmit) nuk përmendet. | Paragraf + pyetje. |
| 🟡 | Krahasimi me Dijkstrën harron alternativën: **Dijkstra nga çdo kulm**, $O(V\,E\log V)$, është më e shpejtë se $O(V^3)$ në grafe të rralla (me pesha jo-negative). | Rresht në tabelë + pyetje: "Kur zgjidhni njërën, kur tjetrën?" |
| ✅ | Shënimi për antisimetrinë kundrejt leksionit — i saktë. | — |

## Laboratori 9 — Max-flow / min-cut

| | Çështja | Ndreqja |
|:-:|---|---|
| 🟠 | **Detyrat e shtëpisë kërkojnë kopjimin e ~20 000 karaktereve Pygame** në një qelizë vetëm për të ndryshuar listën e brinjëve: puna e studentit humbet në kopjim, dhe s'ka kontroll automatik. | Rishkruhen mbi funksionet e *Ushtrime Shtesë* (`rrjedha_max`, `prerja_min`) me `kontrollo(...)`. Pyetjet mbeten të njëjta (rrjedha max e ISP-së = 25, prerja = dy lidhjet drejt T). |
| ✅ | *Ushtrime Shtesë* — i saktë dhe i plotë. | — |

## Laboratori 10 — Çiftëzimi dhe problemet e caktimit

| | Çështja | Ndreqja |
|:-:|---|---|
| ✅ | I saktë dhe i plotë; ndjek slides 80–90. | — |

---

## Radha e ndreqjeve

1. **Gabimet** (🔴): Lab 2, 3, 7 — një PR për laborator, para fillimit të semestrit.
2. **Paqartësitë** (🟠) dhe **drejtshkrimi** në të njëjtat PR.
3. **Mungesat** (🟡): ushtrimet e reja, bashkë me vizualizimet e platformës (#132, #133).

Pas çdo ndryshimi në fletore: zgjidhjet te `zgjidhjet/burimi/` (nëse ushtrimi ka zgjidhje),
`MANIFEST.json`, dhe në platformë `npm run course:import` dhe `scripts/snapshot-course-notebooks.ts`.
