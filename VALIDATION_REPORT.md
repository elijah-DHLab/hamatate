# Validation report

| Check | Status | Detail |
|---|---|---|
| XML well-formed | **PASS** | lxml parsed the TEI document. |
| Project Schematron | **PASS** | All project assertions passed. |
| Internal ID references | **PASS** | All local #references resolve. |
| Official TEI base schema | **NOT RUN** | The XML points to the official current release tei_all.rng, but the schema could not be downloaded into this isolated build environment. |
