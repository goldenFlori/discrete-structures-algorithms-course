# Struktura Diskrete & Algoritme — Shoqëruesi Digjital i Laboratorit

Faqja e komponentit laboratorik të lëndës **Struktura Diskrete & Algoritme**
(Shkenca të të Dhënave & Inxhinieri Informatike, viti i parë).

Fletoret Jupyter mbeten burimi akademik. Faqja u shton organizimin, navigimin,
kërkimin dhe vizualizimin interaktiv që Google Classroom nuk mund t'i japë —
pa shtuar një projekt të dytë programimi për t'u mirëmbajtur.

---

## Për pedagogun

**→ [`docs/UDHEZUES.md`](docs/UDHEZUES.md)** — gjithçka që ju duhet gjatë semestrit.

Publikimi javor është:

```bash
cp Laborator10.ipynb site/content/notebooks/laborator-10.ipynb
# shtoni ~12 rreshta te site/content/course.mjs
git add . && git commit -m "Laboratori 10" && git push
```

Kreu, timeline-i, kërkimi, navigimi, faqja e detyrave dhe tabela e paketave
Python përditësohen vetvetiu.

---

## Dokumentet

| Skedari | Çfarë përmban |
|---|---|
| [`docs/ANALYSIS.md`](docs/ANALYSIS.md) | Auditimi i plotë i 14 fletoreve, rindërtimi i strukturës së lëndës, paqartësitë e gjetura dhe arsyetimi i çdo vendimi teknik |
| [`docs/UDHEZUES.md`](docs/UDHEZUES.md) | Udhëzuesi praktik i mirëmbajtjes |
| [`docs/LEKSIONET-DHE-LABORATORET.md`](docs/LEKSIONET-DHE-LABORATORET.md) | Harta koncept-për-koncept: çdo slide i Leksioneve 1–6 ↔ ushtrimi që e praktikon; ushtrimet shtesë dhe Laboratori 10 |

> **Laboratori 6** nuk ka fletore më vete: materiali i tij jeton në Ushtrimet 4–6
> të fletores së Laboratorit 5, të cilave u referohet shprehimisht detyra e
> Laboratorit 6. Faqja e trajton kështu; detajet te `docs/ANALYSIS.md`, **C-2**.

---

## Zhvillimi

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # ndërton në site/dist/
npm run preview    # shikon ndërtimin, ashtu siç publikohet
npm run qa         # ~80 kontrolle në një shfletues të vërtetë
```

### Struktura

```
site/
├── content/
│   ├── course.mjs          # i vetmi skedar konfigurimi
│   └── notebooks/          # fletoret origjinale (vetëm lexohen)
│       ├── arkiv/          # versione të zëvendësuara — nuk publikohen
│       └── MANIFEST.json   # sha256 + emri origjinal i çdo fletoreje
├── scripts/
│   ├── notebook.mjs        # .ipynb → paraqitje e sigurt për web
│   ├── build-content.mjs   # hapi i ndërtimit + validimi i konfigurimit
│   ├── vendor.mjs          # kopjon plotly.js në dist/
│   ├── dev-extras.mjs      # kërkimi ⌘K + Plotly edhe gjatë npm run dev
│   └── qa.mjs              # testet në shfletues
└── src/
    ├── components/
    │   ├── nb/             # renderuesi i pastër i fletoreve (+ vizualizimet brenda tyre)
    │   ├── site/           # navigimi, kërkimi ⌘K, tema, fundi i faqes
    │   └── VizEmbed.astro  # id e vizualizimit → komponenti React
    ├── pages/              # kreu, laboratorët, detyrat, vizualizimet, mjedisi
    ├── viz/                # 13 vizualizimet interaktive (React + HeroUI)
    │   ├── algorithms/     # algoritmet si funksione të pastra që kthejnë hapat
    │   └── kit/            # VizShell, PlayerBar, GraphCanvas, LineChart …
    └── styles/app.css      # Tailwind v4 + tema e HeroUI, e çelët dhe e errët
```

### Arkitektura, shkurt

| Shtresa | Zgjedhja | Pse |
|---|---|---|
| Gjenerimi | **Astro**, dalje statike | Modeli Laborator→Resurse me validim; JS vetëm aty ku duhet |
| Fletoret | konvertues i shkruar posaçërisht | Lexon `.ipynb` si JSON — **nuk e ekzekuton kurrë** |
| Kodi | **Shiki** | Ngjyrosje në kohë ndërtimi, 0 KB JS |
| Matematika | **KaTeX** | Renderohet në ndërtim |
| Grafikët e fletoreve | **plotly.js** me ngarkim të vonuar | Outputet ekzistuese mbeten interaktive, jo screenshot |
| Kërkimi | **Pagefind** | Indeks statik, pa API, pa çelës, pa kosto |
| Ndërfaqja | **Tailwind CSS v4** + **HeroUI v3** | Dizajn modern, i njëjtë në HTML statik dhe në React; temë e errët |
| Vizualizimet | **React** si “ishuj” Astro + SVG | Hidratohen vetëm kur studenti arrin te to; renderohen fillimisht në server |
| Hosting | **GitHub Pages** | Falas, i besueshëm, pa server |

Arsyetimi i plotë dhe alternativat e refuzuara: `docs/ANALYSIS.md`, seksioni **J**.

---

## Parime që sistemi i respekton

- **Sistemi nuk i ndryshon kurrë fletoret.** Ato vetëm lexohen; `MANIFEST.json`
  ruan `sha256` e secilës bashkë me emrin me të cilin u dorëzua, dhe çdo ndryshim
  që bën autori (`identik: false`) shënohet aty me përshkrim.
- **Asnjë fletore nuk ekzekutohet gjatë ndërtimit.** Shumë prej tyre hapin dritare
  Pygame ose Tkinter; publikohen rezultatet që janë ruajtur brenda tyre.
- **Përmbajtja e fletoreve trajtohet si e pabesueshme.** HTML-ja e papërpunuar në
  Markdown është e çaktivizuar, daljet HTML pastrohen, dhe JavaScript-i i ruajtur
  në outpute nuk ekzekutohet kurrë.
- **Përmbajtja akademike nuk është prekur.** Asnjë teori, shembull, vlerë numerike,
  kërkesë ushtrimi apo detyrë nuk u rishkrua dhe asgjë nuk u përkthye. Problemet
  teknike të gjetura janë **raportuar** te `docs/ANALYSIS.md`, jo korrigjuar në heshtje.
- **Asgjë nuk u shpik.** Titujt, temat dhe varësitë vijnë nga vetë fletoret.
  Të dhënat e panjohura (universiteti, pedagogu, orari, afatet) janë lënë bosh.
- **Pa llogari, pa fjalëkalime, pa bazë të dhënash.** Dorëzimi i detyrave mbetet
  në Google Classroom, qëllimisht.

---

## Publikimi

GitHub Actions ndërton dhe publikon në GitHub Pages sa herë ndryshon `site/`.

Aktivizimi, një herë: **Settings → Pages → Source: “GitHub Actions”**.

Kosto e vazhdueshme: **zero**.
