# Narrative workspace

Place the narrative source documents and spreadsheet here. The game reads these six Markdown files from `src/narrative.js` at runtime:

- `00_input.md`
- `01_worldbuilding.md`
- `02_quest_design.md`
- `03_dialogue_script.md`
- `04_branch_map.md`
- `05_review_report.md`
- `삼한대전기_내러티브_요약.xlsx` (reference workbook; browser engine does not parse Excel)

Run the game through a local HTTP server from the project root. The Markdown source documents are fetched over HTTP; `file://` does not allow this module to load them.
