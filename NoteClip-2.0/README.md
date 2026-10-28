# NoteClip 2.0

A standalone prototype for generating customer-ready pest control service notes from technician inputs.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server.

## Host on GitHub Pages

This project is static. Publish all four runtime files together: `index.html`, `styles.css`, `note-generator.js`, and `script.js`. The page loads `note-generator.js` before `script.js`; include the new generator file when updating an existing deployment.

Keep `LUCIDE-LICENSE.txt` with the published files for the bundled action icons.

Put the `NoteClip-2.0` folder in a GitHub repository, then enable GitHub Pages from the repository settings and publish from the branch/folder that contains these files.

## What this version does

- Lets a tech select multiple pest issues.
- Shows ant species options when ants are selected.
- Shows spider activity options when spiders are selected.
- Captures conducive conditions, gate status, and house-specific observations.
- Generates one professional paragraph that includes what was seen, what was done, and what to expect.
- Creates a manual AI polish prompt that can be copied into ChatGPT, Gemini, or another model when desired.
- Runs as a static web app, so it can be hosted on GitHub Pages and used from an iPhone browser.

## Note Wording

The local generator uses separate phrase banks for inspections, treatments, expectations, conditions, and gate notes. It uses plain technician language and complete sentences instead of long lists of service actions.

- The note presents findings first, completed work next, and expectations last in one paragraph.
- Selected pest findings also confirm treatment; the workflow does not require a separate treatment confirmation.
- Routine treatment is described once for the affected areas, with distinct tasks such as web removal or source checks added as needed.
- Pest names are kept in the findings instead of being repeated as separate treatment lists. Wording variation stays within the service sequence.
- Pest names share an "activity" ending within each service area. Webs, nests, and specific spider locations keep their own descriptions.
- Exterior and interior findings appear in separate sentences before treatment, within the same note paragraph.
- The page chooses a wording variation when opened and when the form is reset.
- `Reword` creates another wording variation using the current inputs.
- Wording stays stable during review and copying. Opening the conditions list does not reword the note.
- `Copy Prompt` includes exactly the draft shown in the preview, plus the technician inputs.
- Mosquito fogging and monthly MMS retain separate wording. MMS does not name a product; box service appears only when selected.
- House-specific text is included directly, with whitespace normalized and a sentence ending added if needed.

`note-generator.js` contains the language banks and paragraph composition. `script.js` handles the form and copy controls.

## Mobile Controls

A fixed bottom action bar contains `Reword`, `Copy note`, and `Copy Prompt`. `Reword` generates another wording using the current inputs. The controls and status feedback remain reachable while scrolling; the copy action has the largest button.

The layout reserves space below the page content and accounts for iPhone safe areas. The house-specific text field uses a 16px default font. Icons are bundled directly in the page, with no external icon service required.

## Checks

Run `node --test tests/generator.test.cjs` from this folder. These checks cover variation, findings-before-treatment order, repeated wording, service facts, selected pests and subtypes, house details, regeneration, prompt copying, service switching, and reset behavior.

## LLM integration direction

The current prototype uses a stronger local rule-based generator so it works immediately without an API key. The manual AI prompt is kept as an optional polish step. For a future direct AI button on iPhone, the safest hosted path is a small backend/API proxy so the LLM key is never exposed in the browser.
