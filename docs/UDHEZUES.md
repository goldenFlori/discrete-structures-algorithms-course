# Udhëzues për Pedagogun

Gjithçka që ju duhet gjatë semestrit, në një faqe.

> **Rregulli i vetëm që vlen ta mbani mend:**
> ju prekni **fletoret** dhe **një skedar konfigurimi**. Asgjë tjetër.
>
> Skedari i konfigurimit është `site/content/course.mjs`.

---

## 0 · Përgatitja (një herë)

```bash
cd site
npm install          # vetëm herën e parë
npm run dev          # hap http://localhost:4321
```

Ndryshimet shfaqen menjëherë. Ndalojeni me `Ctrl+C`.

> Nëse shtoni ose ndryshoni një fletore ndërsa `npm run dev` po punon,
> ndalojeni dhe nisni sërish — fletoret përpunohen para nisjes së serverit.

**Struktura e dosjeve që ju intereson:**

```
site/
├── content/
│   ├── course.mjs            ← E VETMJA skedar që redaktoni
│   └── notebooks/            ← këtu hidhni fletoret .ipynb
│       └── arkiv/            ← versione të vjetra, nuk publikohen
└── ...                       ← pjesa tjetër nuk ka nevojë të preket
```

---

## 1 · Si të shtoj një laborator të ri

**Hapi 1** — kopjoni fletoren:

```
site/content/notebooks/laborator-10.ipynb
```

**Hapi 2** — hapni `site/content/course.mjs` dhe shtoni në fund të listës `labs`:

```js
{
  n: 10,
  week: 10,
  status: 'published',
  title: 'Titulli i vërtetë i laboratorit',
  topics: ['grafe'],                      // id nga lista `topics` më lart
  summary: 'Dy-tri fjali për studentin.',
  resources: [
    {
      type: 'main',
      title: 'Laboratori 10 — Materiali kryesor',
      notebook: 'laborator-10.ipynb',
      note: 'Çfarë përmban.',
    },
  ],
},
```

**Hapi 3** — publikoni:

```bash
git add . && git commit -m "Laboratori 10" && git push
```

Kaq. Brenda ~2 minutash përditësohen **vetvetiu**:

- kartela “Laboratori aktual” në kreun
- timeline-i i semestrit dhe lista e laboratorëve
- indeksi i kërkimit
- navigimi ← / →
- tabela e paketave te faqja Python (nga importet reale të fletores)
- tabela e përmbajtjes brenda faqes së laboratorit
- faqja e detyrave, nëse fletorja përmban një seksion “Detyra për Shtëpi”

---

## 2 · Si të shtoj disa resurse në një laborator

Shtoni hyrje te `resources`. **Rendi është rendi që i sugjerohet studentit** —
kutia “Nga ku të filloj” ndërtohet nga ai.

```js
resources: [
  { type: 'main',          title: 'Materiali kryesor', notebook: 'laborator-11.ipynb' },
  { type: 'supplementary', title: 'Demonstrim: A*',    notebook: 'astar-demo.ipynb', lang: 'en' },
],
```

| `type` | Ku shfaqet |
|---|---|
| `main` | Renderohet i plotë në faqen e laboratorit |
| `supplementary` | Merr faqen e vet, e lidhur nga laboratori |
| `demo` | Njësoj si `supplementary`, me etiketë tjetër |

`lang: 'en'` shton distinktivin **EN**, që studenti ta dijë përpara se të klikojë.

---

## 3 · Si të shtoj një material plotësues

Njësoj si më sipër: `type: 'supplementary'`. Ai merr automatikisht:

- faqen e vet me tabelën e përmbajtjes
- lidhje mbrapsht te laboratori prind
- lidhje anash te materialet e tjera plotësuese të të njëjtit laborator
- butonin e shkarkimit

---

## 4 · Si të shtoj një detyrë si fletore më vete

**Hapi 1** — kopjoni fletoren:

```
site/content/notebooks/detyra-lab10-diçka.ipynb
```

**Hapi 2** — shtoni te lista `homework` në `course.mjs`:

```js
{
  id: 'diçka',                        // bëhet URL: /detyrat/diçka/
  lab: 10,                            // laboratori kryesor
  alsoLabs: [9],                      // opsionale — nëse mbulon edhe të tjerë
  title: 'Titulli i detyrës',
  status: 'published',
  notebook: 'detyra-lab10-diçka.ipynb',
  topics: ['grafe'],
  summary: 'Çfarë duhet të bëjë studenti.',
  due: '',                            // lëreni bosh nëse s'ka afat të fiksuar
},
```

Detyra shfaqet menjëherë te `/detyrat/`, te faqja e Laboratorit 10 dhe te kreu.

> **`due` bosh** shfaqet si *“Njoftohet në Google Classroom”*. Kjo është
> sjellja e paracaktuar me qëllim — asnjë afat nuk shpiket.

---

## 5 · Si të shënoj një detyrë që ndodhet brenda laboratorit

Nëse fletorja e laboratorit ka një seksion me titull që përmban “Detyra për Shtëpi”
(ose “Detyrë Shtëpie”), sistemi **e njeh vetë** dhe i jep identitet vizual.

Që ajo të shfaqet edhe në listën qendrore të detyrave, shtoni te laboratori:

```js
homework: [
  {
    embedded: true,
    title: 'Përshkrimi i shkurtër i detyrës',
    anchor: 'detyra-per-shtepi',   // id-ja e seksionit brenda fletores
    note: 'Plotësohen boshllëqet `# PLOTESO`.',
  },
],
```

**Si ta gjeni `anchor`-in:** hapni faqen e laboratorit, klikoni titullin e seksionit
në tabelën e përmbajtjes dhe kopjoni atë që vjen pas `#` në shtegun e shfletuesit.

> Përmbajtja e detyrës **nuk dublikohet kurrë**. Lista e detyrave thjesht lidhet
> te seksioni i saktë i fletores.

---

## 6 · Si të përditësoj një laborator ekzistues

Zëvendësoni fletoren me të njëjtin emër dhe bëni push:

```bash
cp ~/Desktop/Laborator7.ipynb site/content/notebooks/laborator-07.ipynb
git add . && git commit -m "Përditësim i Laboratorit 7" && git push
```

Për t'ua bërë të dukshme studentëve, ndryshoni statusin:

```js
status: 'updated',    // shfaq distinktivin "I përditësuar"
```

---

## 7 · Si të trajtoj një version të rishikuar

**Mos publikoni dy versione të të njëjtit material.** Kjo është pikërisht
problemi që kjo faqe zgjidh.

1. Zëvendësoni fletoren aktuale me versionin e ri (i njëjti emër skedari).
2. Nëse doni ta ruani të vjetrin për gjurmueshmëri, vendoseni te
   `site/content/notebooks/arkiv/` — kjo dosje **nuk publikohet kurrë**.
3. Vendosni `status: 'updated'`.

> Git e mban gjithsesi historikun e plotë të çdo versioni.

### Kur një fletore u shërben dy laboratorëve

Kjo ndodh tashmë me Laboratorët 5 dhe 6 (shih `docs/ANALYSIS.md`, çështja C-2).
Zgjidhet me `sections.ranges` — një listë intervalesh `[nga, deri]`, ku
`deri` është **përjashtues** dhe `null` do të thotë fillimi/fundi i fletores:

```js
// Laboratori 5: Ushtrimet 1–3, pastaj Punë në Klasë + Detyrat
sections: {
  ranges: [
    [null, 'ushtrimi-4-komponentet-e-lidhura-fort'],
    ['pune-ne-klase', null],
  ],
},

// Laboratori 6: vetëm Ushtrimet 4–6
sections: { ranges: [['ushtrimi-4-komponentet-e-lidhura-fort', 'pune-ne-klase']] },
```

Nëse shkruani një ankorë që nuk ekziston, `npm run content` ju paralajmëron me emër.

---

## 8 · Si të shënoj “Së shpejti” dhe si të publikoj/çpublikoj

| Doni | Vendosni |
|---|---|
| Material i dukshëm | `status: 'published'` |
| Material i dukshëm, i shënuar si i rifreskuar | `status: 'updated'` |
| Vendmbajtëse në timeline, pa përmbajtje | `status: 'coming-soon'` |
| Fshihet plotësisht | `status: 'draft'` |

**Për `coming-soon` dhe `draft` nuk gjenerohet fare faqe.** Nuk ka URL për të
hamendësuar dhe përmbajtja nuk përfshihet në kërkim. Kjo është verifikuar
automatikisht (`npm run qa`).

Për një laborator “së shpejti” mjaftojnë disa rreshta — pa fletore:

```js
{ n: 11, week: 11, status: 'coming-soon', title: 'Titulli, nëse e dini' },
```

---

## 9 · Si të shtoj një vizualizues të ri interaktiv

1. Krijoni `site/src/scripts/viz/emri.ts` (kopjoni një ekzistues si model —
   të gjithë përdorin `Player` dhe `buildControls` nga `common.ts`).
2. Regjistrojeni si custom element në fund të skedarit.
3. Shtoni një hyrje te `visualizers` në `course.mjs`.
4. Shtoni `id`-në e tij te `visualizers: [...]` i laboratorëve përkatës.
5. Shtoni emrin e tag-ut te harta `TAG` në `site/src/pages/vizualizime/[id].astro`.

Vizualizuesi ngarkohet **vetëm** në faqen e vet — faqet e teorisë mbeten të lehta.

---

## 10 · Si të përditësoj informacionin e Python-it

**Tabela e paketave nuk shkruhet me dorë.** Ajo nxirret nga `import`-et reale
të fletoreve sa herë ndërtohet faqja. Shtoni një fletore që përdor `scipy` dhe
`scipy` shfaqet vetë.

Për tekstin shpjegues (hapat e instalimit, gabimet e zakonshme), redaktoni
`site/src/pages/python.astro`.

Për të përshkruar një paketë të re, shtoni një rresht te harta `PKG` në
`site/scripts/build-content.mjs`:

```js
scipy: { pip: 'scipy', role: 'browser', label: 'Llogaritje shkencore' },
```

---

## 11 · Si të ndryshoj informacionin e lëndës

Gjithçka është në krye të `site/content/course.mjs`, te objekti `course`:

```js
university: 'Universiteti i …',        // fushat bosh fshihen automatikisht
lecturer:   'Emri Mbiemri',
email:      '…',
semester:   'Semestri i parë 2025–2026',
schedule:   'E martë 10:00–12:00, Salla 305',
classroomUrl: 'https://classroom.google.com/c/…',   ← vendoseni këtë
```

> **`classroomUrl` është bosh tani.** Sapo ta vendosni, butoni “Classroom”
> shfaqet në shiritin e navigimit, te faqja e detyrave, te çdo laborator me
> detyrë dhe te faqja e informacionit. Derisa të jetë bosh, ato butona fshihen
> në vend që të çojnë diku të prishur.

---

## 12 · Si funksionon publikimi

```
git push  →  GitHub Actions  →  GitHub Pages
                 (~2 min)
```

**Aktivizimi, një herë:**

1. Shtyjeni repo-n në GitHub.
2. **Settings → Pages → Source: “GitHub Actions”**.
3. Bëni një push (ose Actions → “Publiko faqen” → *Run workflow*).

Kosto: **zero**. Nuk ka server, bazë të dhënash, çelësa API apo abonim.

Për të parë lokalisht saktësisht atë që do të shohin studentët:

```bash
npm run build && npm run preview
```

> Kërkimi funksionon vetëm pas `npm run build` — indeksi krijohet gjatë ndërtimit,
> jo në `npm run dev`.

---

## 13 · Nëse publikimi dështon

Hapni **Actions** në GitHub dhe klikoni ekzekutimin e kuq. Gabimet e mundshme:

| Mesazhi | Shkaku | Zgjidhja |
|---|---|---|
| `Fletorja mungon: …` | Emri te `course.mjs` nuk përputhet me skedarin | Kontrolloni shkronjat e mëdha/të vogla dhe prapashtesën `.ipynb` |
| `ankora "…" nuk u gjet` | Një `sections.ranges` tregon një titull që nuk ekziston | Kopjojeni id-në nga tabela e përmbajtjes së faqes |
| `status i panjohur` | Gabim shtypi | Vetëm: `published`, `updated`, `draft`, `coming-soon` |
| `temë e panjohur` / `vizualizues i panjohur` | Referim te diçka që s'ekziston | Shtojeni te `topics` / `visualizers`, ose hiqeni referimin |
| `Unexpected token` | Presje ose kllapë që mungon në `course.mjs` | Numri i rreshtit është në mesazh |

**Provojeni gjithmonë lokalisht para se të bëni push:**

```bash
npm run content     # zgjat ~2 sekonda dhe kap 99% të gabimeve
```

Kjo komandë printon edhe vërejtje të dobishme, p.sh. *“Fletore e papërdorur”*
kur një `.ipynb` ndodhet në dosje por nuk është referuar askund.

**Faqja u publikua por duket e prishur (pa CSS):** `BASE_PATH` nuk përputhet me
adresën. Workflow-i e merr vetë nga cilësimet e Pages, prandaj zakonisht mjafton
një *Run workflow* i ri pasi t'i keni ruajtur ato cilësime.

---

## 14 · Kontroll cilësie përpara një jave të rëndësishme

```bash
npm run build
npm run qa
```

`npm run qa` hap një shfletues të vërtetë dhe kontrollon 56 gjëra: ngarkimin e
çdo faqeje, punën e të pesë vizualizuesve, kërkimin, shkarkimet, pamjen në
celular, shkronjat shqipe, matematikën, dhe që materiali i papublikuar **nuk**
është i arritshëm.

Herën e parë mund t'ju duhet një shfletues për testim:

```bash
npx playwright install chromium
```

---

## Çfarë të mos bëni

- ❌ Mos redaktoni asgjë brenda `site/src/generated/` — rigjenerohet çdo herë.
- ❌ Mos redaktoni `.ipynb` te `dist/` ose `public/` — ato janë kopje.
- ❌ Mos publikoni dy versione të të njëjtit laborator si dy resurse.
- ❌ Mos shkruani HTML me dorë për një laborator të ri.

## Çfarë mbetet gjithmonë e vërtetë

- Fletoret origjinale në `content/notebooks/` **nuk ndryshohen kurrë** nga sistemi.
  Ato vetëm lexohen. `content/notebooks/MANIFEST.json` mban `sha256` e secilës,
  bashkë me emrin origjinal me të cilin u dorëzua.
- Asnjë fletore **nuk ekzekutohet** gjatë ndërtimit. Faqja shfaq vetëm rezultatet
  që ju keni ruajtur brenda fletores.
- Faqja nuk ka llogari, nuk mbledh të dhëna dhe nuk ruan asgjë për studentët.
