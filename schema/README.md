# Validation

`tei/A228401.xml` includes an `xml-model` pointer to the current TEI release `tei_all.rng` and to the local `hamatate.sch`.

For production use, process `hamatate.odd` with the TEI Stylesheets or Roma to generate the project RELAX NG schema, then validate the TEI against both that schema and the Schematron rules.
