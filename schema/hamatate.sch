<?xml version="1.0" encoding="UTF-8"?>
<schema xmlns="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt">
 <ns prefix="tei" uri="http://www.tei-c.org/ns/1.0"/>
 <pattern id="hamatate-identifiers">
  <rule context="tei:div[@type='textSegment']">
   <assert test="@xml:id">Every T segment must have xml:id.</assert>
   <assert test="starts-with(@xml:id,'A228401-T')">T segment IDs must use the project T identifier.</assert>
  </rule>
  <rule context="tei:sp">
   <assert test="@who">Every speech must point to a role with @who.</assert>
  </rule>
  <rule context="tei:castItem/tei:role">
   <assert test="@xml:id">Every dramatic role must carry its R identifier.</assert>
  </rule>
 </pattern>
 <pattern id="research-separation">
  <rule context="tei:standOff/tei:list[@type='hypothesizedPerformanceUnits']/tei:item">
   <assert test="starts-with(@xml:id,'A228401-S')">S units must preserve project S identifiers.</assert>
  </rule>
  <rule context="tei:standOff/tei:list[@type='scenarios']/tei:item">
   <assert test="tei:list[@type='orderedUnits']">Every scenario must explicitly contain an ordered unit list.</assert>
  </rule>
 </pattern>
</schema>