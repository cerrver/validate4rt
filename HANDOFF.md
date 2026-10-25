# HANDOFF — VALIDATE consortium site

Maintainer notes for whoever (person or assistant) edits this site next. Keep this file current: every change set should add a line to §6.

## 1. What this site is

Public site of the VALIDATE consortium (VALIdation of Decision support models for rAdioThErapy), chaired by Joseph O. Deasy (MSK) and co-chaired by Laura Cella (CNR, Naples). Folder `validate4rt/` in "Web site design and deployment", one subfolder per site like `deasylab/` and `msk-predictive-informatics/`. Deploys to GitHub Pages; the domain validate4rt.org points at it (see README for the two options).

Brief from Joseph (2026-10-21): emphasise the **mission** and the **members**; the state of current validation efforts is secondary. Hence: no "status" blocks on the projects page, and the member map is the hero visual.

## 2. Sources

- `VALIDATE_Consortium_Deck_v6_1.pptx` (Joseph, 33 slides, "Updated from the 17 May 2026 ESTRO meeting · VALIDATE Working Programme"). All mission text, the seven commitments, the four barriers, the four projects, the caveats and the member list come from it.
- Member names and affiliations were checked against institutional pages by web search on 2026-10-21 (see §4 for what could not be confirmed).
- Literature: every DOI on the site was checked against a publisher, repository or OpenAlex record on 2026-10-21.
- Map: Natural Earth land polygons (`world-atlas` 110m for the world, 50m simplified for Europe), projected with d3-geo; city coordinates are standard geographic coordinates, rounded.

## 3. Fixed conventions

- Typography: IBM Plex Serif (headings), IBM Plex Sans (text), IBM Plex Mono (code tree), self-hosted so the pages make no third-party request.
- Colour: navy `#002650` sampled from the logo for headings and emphasis; marigold `#e9a400` only for map pins and figure marks, never for text. Dark mode via tokens; the header and footer swap to the white logo.
- The backronym headline marks the acronym letters: VALI·D·A·T·E inside "VALIdation of Decision support models for rAdioThErapy".
- Members are listed by country (alphabetical), then institution, with name and city only: no titles or degrees, so nothing goes stale. Chair and co-Chair are tagged.
- Membership is dated "as of the VALIDATE meeting at ESTRO 2026, 17 May 2026". Update the date when the roster changes.
- Numbers from the Cochrane review are quoted as the review states them: 592 models; 480 (81%) never externally validated; nine validated at least twice; "calibration performance was not always reported". The 112 "validated at least once" is 592 − 480 and is not written on the site as a stated figure.
- Citation style: Vancouver-like, DOI link on every reference.
- Links to pages use relative paths (`approach.html`, `index.html#members`) so the site works at the GitHub URL and at the domain.

## 4. Items to verify (as of 2026-10-21)

- **Joseph's contact e-mail**: `deasyj@mskcc.org` was taken from the Deasy Lab site; confirm it is the address to publish for the consortium.
- **Vaiva Kaveckyte**: listed under "Capital Region of Denmark, Copenhagen" on the strength of a regionh.dk e-mail address in the deck's notes; no institutional page found. Confirm institution (and city) or remove.
- **Slide spellings corrected on the site**: "Jan Langendijk" → Johannes A. (Hans) Langendijk; "Sanne vn Dijck" → Lisanne V. van Dijk; "Sara Trower" → Sara Thrower; "Per Munck" → Per Munck af Rosenschöld; "Laia Humbert Vidan" → Laia Humbert-Vidan; "Peter van Luijck" → Peter van Luijk; "Jan Jakob Sonke" → Jan-Jakob Sonke; "Chuck Mayo" → Charles S. Mayo; "Rene Winter" → René M. Winter; "Dave Fuller" → Clifton D. Fuller; "Alan Mcwilliam" → Alan McWilliam. Ane L. Appelt is shown in Copenhagen (Rigshospitalet and DTU), which matches the slide and her 2025 listings.
- **Institution wording**: Martin A. Ebert is shown as "Sir Charles Gairdner Hospital and The University of Western Australia"; Carsten Brink as "Odense University Hospital and University of Southern Denmark"; Eva Onjukka as "Karolinska Institutet and Karolinska University Hospital". Adjust if the members prefer a single affiliation.
- **Chiara La Tessa** (added 2026-10-25 from the e-mail chiara.latessa@miami.edu): shown as "Sylvester Comprehensive Cancer Center, University of Miami", Miami. Her Miller School faculty page lists Department of Radiation Oncology, University of Miami Miller School of Medicine; her lab page sits under Sylvester. Adjust if she prefers the Miller School wording.
- **Daniela Thorwarth** (added 2026-10-25): shown as "University Hospital Tübingen", Tübingen, from the Universitätsklinikum Tübingen staff page (W3 Professor of Biomedical Physics, head of the Research Section for Biomedical Physics, Department of Radiation Oncology). Could also be worded "University of Tübingen".
- **Membership date**: after the October 2026 additions the "as of" line (map caption, roster note) reads "as of October 2026" rather than the ESTRO 2026 meeting date; the projects-page sentence about the working programme still cites 17 May 2026.
- **Laura Cella's institute**: "Institute of Biostructures and Bioimaging, National Research Council of Italy (CNR), Naples" from the CNR IRIS record; no degree or title shown.
- **Pneumonitis references**: the deck says "J Nucl Med + Phys Imaging Radiat Oncol published"; the site cites Thor et al. J Nucl Med 2024 (model) and Phys Imaging Radiat Oncol 2025 (prospective validation). No 2026 J Nucl Med paper was found.
- **"Hope ILD score"** is mentioned as a parallel track without a citation because no published paper by that name was found; the nearest candidate (Glick D, et al. Clin Lung Cancer 2018, Princess Margaret SBRT cohort) was not cited to avoid guessing.
- **Lymphopenia project**: the deck says both "10 centres" and "nine centres engaged"; the site gives no count.
- The deck's "≈ 21 years of unmodelled technology drift" is rendered as "roughly two decades" / the 1995–2026 timeline; the dates on that timeline (1995, 2005, 2012, 2018, 2026) are the deck's.
- ESTRO 2026 dates/city (15–19 May 2026, Stockholm) came from third-party listings because estro.org could not be fetched.

## 5. Files that change together

- Adding a member: `index.html` roster; `tools/build-map.js` if the city is new (then rebuild the maps); the "Twenty-seven investigators", "Eighteen cities, ten countries" and "ten countries" phrases in `index.html` (hero facts, map caption, Members intro, meta description).
- Changing leadership or e-mails: the leader cards appear in `#members` and `#contact` in `index.html`, and in the hero facts.
- Any dated statement: the "as of 17 May 2026" lines (map caption, roster note, projects intro) and the Milestones list.

## 6. Change log

- 2026-10-25 · (pending commit) · Members added: Daniela Thorwarth (University Hospital Tübingen; new country Germany, new city Tübingen) and Chiara La Tessa (Sylvester Comprehensive Cancer Center, University of Miami; new city Miami). Counts updated to twenty-nine investigators, twenty cities, eleven countries; both maps rebuilt with `npm run build-map`; `tools/.gitignore` added for build leftovers. Peter van Luijk and Lisanne V. van Dijk were requested too but were already on the roster.
- 2026-10-21 · (pending commit) · Fix: the base `li + li` spacing was pushing the 2nd–5th navigation links (header and footer) and the project-area cards down by 0.35em; layout lists now reset it.
- 2026-10-21 · pushed · Hero reworked at Joseph's request: mission sentence leads, member count without names, Chair/co-Chair demoted to a small line under the buttons.
- 2026-10-21 · pushed (first commit) · Site created from the v6.1 consortium deck: three pages, member map, roster, approach, projects, references, README, this file.
