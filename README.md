# Hamatate interactive linked edition — version 10.2


This package merges the complete v9 interface with the linked TEI/JSON research package.

## What is preserved
- `קריאת ההצגה`: text/program/compare order; clean/linked/code edition modes.
- `מפה וחומרים`: holdings, preservation map, unit dossiers, hypotheses, scenarios, music demo.
- `מודל הנתונים`: example identity flow, edition encoding, relation space, spreadsheet model.

## What is added
- `חבילה מקושרת`: live trace across UI → JSON → TEI → relation graph.
- Shared IDs are clickable from the linked edition and knowledge cards.
- The package keeps TEI, JSON, relations, ODD, Schematron and source files separate.

## Loading model
When served over HTTP, `js/bootstrap.js` reads `data/semantic_edition_data.json` directly before the v9 interface initializes, and `js/package-ui.js` refreshes manifest/JSON/TEI live. When opened as `file://`, `data/runtime_bundle.js` is a generated fallback so the prototype remains portable. The separate data files remain the inspectable package resources.

Run locally:

```bash
python serve.py
```

Then open the URL printed by the server.


## 10.2 change
The Data Model tab now defaults to a living, stable knowledge map. The map distinguishes witnesses, evidence, research claims, hypothesized S units, scenarios, authority identities, and the absent historical performance as an inference horizon. Nodes and edges are interactive and explain both their semantics and their limits. See `KNOWLEDGE_MAP_10_1.md`.


## שינויי 10.2

- טאב **טבלאות המיפתוח** הוחזר לתרשים גרפי מלא עם קווים בין A, T, P, PS, M/AV, S, תפקידים, טענות ותרחישים.
- בטאב **קידוד המהדורה** נוסף מעל ההסבר הפרטני תרשים מהותי: עד חומרי → מהדורה דיפלומטית → עוגנים/פעולות → רשת הידע → תצוגת המשתמש.
- התרשים המהותי אינו מחליף את מסלולי הקוד הפרטניים; הוא מסביר את תפקידה של שכבת המהדורה במערכת כולה.
