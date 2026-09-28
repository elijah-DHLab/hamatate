# Hamatate 10.1 — Knowledge Map specification

## Purpose
The knowledge map is not an ERD and not a reconstruction funnel. It visualizes the epistemic architecture of the project: independent material witnesses → selected evidence → explicit research claims → hypothesized performance units (S) → scenarios made of several S units. Every research relation remains traceable back to evidence and source.

## Non-equivalences
- Witness ≠ evidence.
- Evidence ≠ claim.
- T/P/PS/M/AV records ≠ S.
- S ≠ a scene found in a source.
- Scenario ≠ a proven historical evening.
- A technical foreign key ≠ an epistemically self-explanatory relation.

## Relation types shown
1. Documentary/database relation — containment, pointer, identifier.
2. Evidence selection — a feature of a witness is used for a question.
3. Research relation — identification, attribution, order, version, certainty; must preserve provenance/responsibility/confidence.
4. Alternative/competing claim — preserved rather than overwritten.
5. Scenario relation — selection/version/order of S units.
6. Traceability relation — scenario → S → claim → evidence → witness.
7. Authority relation — text role R → person authority ID.

## UI behavior
The SVG uses a fixed viewBox for layout stability. Nodes and edges are clickable. Clicking a node explains what it is, where it is stored, what relation it participates in, and what must not be inferred from it. Clicking an edge explains the epistemic semantics of that link. Route buttons demonstrate the Tender, King Pic, scenario-back-to-source, and role-to-person paths.
