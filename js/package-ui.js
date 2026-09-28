(function(){
const RT=window.HAMATATE_RUNTIME||{};
let PKG={manifest:RT.manifest||{},index:RT.index||{},relations:RT.relations||{},tei:RT.tei||'',personsTei:RT.personsTei||'',odd:RT.odd||'',schematron:RT.schematron||'',validation:RT.validation||''};
let traceId='A228401-T16';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

async function refreshLiveFiles(){
  if(!(location.protocol==='http:'||location.protocol==='https:'))return;
  try{
    const [m,i,r,t,p]=await Promise.all([
      fetch('manifest.json').then(x=>x.json()),fetch('data/index.json').then(x=>x.json()),fetch('data/relations.json').then(x=>x.json()),fetch('tei/A228401.xml').then(x=>x.text()),fetch('tei/persons.xml').then(x=>x.text())
    ]);
    PKG={...PKG,manifest:m,index:i,relations:r,tei:t,personsTei:p};
    window.HAMATATE_LINK_MODE='live JSON + TEI';
  }catch(e){console.warn('Linked resources fallback in use',e)}
}
function parseXML(txt){try{return new DOMParser().parseFromString(txt,'application/xml')}catch(e){return null}}
function findXmlId(doc,id){if(!doc)return null;try{return doc.evaluate(`//*[@xml:id="${id.replace(/"/g,'')}"]`,doc,p=>p==='xml'?'http://www.w3.org/XML/1998/namespace':null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}
function xmlForId(id){let d=parseXML(PKG.tei),n=findXmlId(d,id);if(n)return n;d=parseXML(PKG.personsTei);return findXmlId(d,id)}
function serializeNode(n){return n?new XMLSerializer().serializeToString(n):''}
function idxRecord(id){const I=PKG.index||{};if(id.startsWith('A228401-T'))return (I.segments||[]).find(x=>x.id===id);if(id.startsWith('A228401-R'))return I.roles&&I.roles[id];if(id.startsWith('per'))return I.persons&&I.persons[id];if(id.startsWith('A228401-S'))return (I.units||[]).find(x=>x.id===id);return null}
function neighbors(id){const E=(PKG.relations&&PKG.relations.edges)||[];return E.filter(e=>e.source===id||e.target===id).slice(0,12)}
function labelFor(id){const rec=idxRecord(id);if(!rec)return id;if(rec.name)return rec.name;if(rec.character)return rec.character;if(rec.title && rec.title!==id)return rec.title;const node=((PKG.relations||{}).nodes||[]).find(n=>n.id===id);return node&&node.label||id}
function uiExplanation(id){if(id.startsWith('A228401-T'))return 'יחידת טקסט. במצב „מהדורה מקושרת” היא מופיעה עם קוד T, קישור ל־S וכפתור לפרטי היחידה.';if(id.startsWith('A228401-R'))return 'תפקיד בתוך רפליקה. לחיצה על שם התפקיד פותחת את התפקיד, השחקנ.ית וה־person ID.';if(id.startsWith('per'))return 'רשומת אדם. היא יכולה להופיע שוב בתפקידים ובהצגות אחרות בלי לשכפל את זהותה.';if(id.startsWith('A228401-S'))return 'יחידת מופע משוערת. בדף ההצגה היא מוצגת בשם אנושי; במודל היא מחברת עדים, טענות ותרחישים.';return 'זהות מקושרת בממשק.'}
function indexHTML(id){const r=idxRecord(id);if(!r)return '<p>אין רשומת אינדקס ישירה; ייתכן שהזהות קיימת רק בגרף או ב־TEI.</p>';let pairs=[];if(id.startsWith('A228401-T'))pairs=[['כותרת',r.title],['S',r.s],['סוג',r.genre],['עמודים',r.pages]];else if(id.startsWith('A228401-R'))pairs=[['תפקיד',r.character],['S',r.scene_id],['שחקנ.ית',r.performer],['person',r.person_id]];else if(id.startsWith('per'))pairs=[['שם',r.name],['Wikidata',r.wikidata],['VIAF',r.viaf],['מגדר',r.gender]];else pairs=[['כותרת',r.title]];return '<ul>'+pairs.filter(x=>x[1]!==undefined&&x[1]!==''&&x[1]!==null).map(x=>`<li><b>${esc(x[0])}:</b> ${esc(x[1])}</li>`).join('')+'</ul>'}
function teiHTML(id){const n=xmlForId(id);if(!n)return '<p>לא נמצא <code>xml:id</code> ישיר בקובצי TEI הנוכחיים.</p>';const attrs=[...n.attributes].slice(0,6).map(a=>`${a.name}=${a.value}`).join(' · ');return `<p><b>&lt;${n.localName}&gt;</b></p><p><code>${esc(attrs||'xml:id='+id)}</code></p><p>ה־ID נפתר ישירות למסמך TEI.</p>`}
function graphHTML(id){const ns=neighbors(id);if(!ns.length)return '<p>אין קשת ישירה ב־relations.json.</p>';return '<ul>'+ns.map(e=>{const other=e.source===id?e.target:e.source;const dir=e.source===id?'→':'←';return `<li><code>${esc(id)}</code> ${dir} <code>${esc(other)}</code><br><span>${esc(e.type||'relation')}</span></li>`}).join('')+'</ul>'}
function renderTrace(){
  document.querySelectorAll('[data-trace-id]').forEach(b=>b.classList.toggle('on',b.dataset.traceId===traceId));
  const ttl=document.getElementById('traceTitle'),sub=document.getElementById('traceSubtitle');if(!ttl)return;
  ttl.textContent=labelFor(traceId);sub.innerHTML=`<code>${esc(traceId)}</code>`;
  document.getElementById('traceUI').innerHTML=`<p>${uiExplanation(traceId)}</p><p><b>אותו ID</b> נשאר זמין גם כשעוברים בין קריאה, מודל ומקור.</p>`;
  document.getElementById('traceIndex').innerHTML=indexHTML(traceId);
  document.getElementById('traceTEI').innerHTML=teiHTML(traceId);
  document.getElementById('traceGraph').innerHTML=graphHTML(traceId);
  const xml=serializeNode(xmlForId(traceId));document.getElementById('teiFragment').textContent=xml||'לא נמצא fragment ישיר עבור '+traceId;
}
function openInUI(id){
  if(id.startsWith('A228401-T')){setSiteView('readerView');readerOrder='text';readerTextMode='semantic';syncReaderControls();renderReader();const hit=Object.entries(READER_UNITS).find(([k,u])=>(u.segments||[]).includes(id));setTimeout(()=>{if(hit)jumpReader(hit[0]);else window.scrollTo({top:0,behavior:'smooth'})},80);return}
  if(id.startsWith('A228401-R')){setSiteView('readerView');setTimeout(()=>openKnowledgeCard('role',id),80);return}
  if(id.startsWith('per')){setSiteView('readerView');setTimeout(()=>openKnowledgeCard('person',id),80);return}
  if(id==='A228401-S10'){setSiteView('showView');setTimeout(()=>openFocus('tender'),80);return}
  if(id==='A228401-S12'){setSiteView('showView');setTimeout(()=>openFocus('king'),80);return}
  setSiteView('modelView');setModelSubview('relationModel');
}
function renderResources(){const el=document.getElementById('packageResources');if(!el)return;const m=PKG.manifest||{};const R=m.resources||{};const D=m.descriptions||{};const order=['tei','persons','semanticSource','index','relations','odd','schematron','interface'];el.innerHTML=order.filter(k=>R[k]).map(k=>`<article class="resource-card"><div><b>${esc(k)}</b><p>${esc(D[k]||'')}</p><code>${esc(R[k])}</code></div><div class="resource-actions"><a href="${esc(R[k])}" target="_blank">פתח קובץ</a><button data-resource-preview="${esc(k)}">הצג כאן</button></div></article>`).join('');}
function previewResource(k){let txt='';if(k==='tei')txt=PKG.tei;else if(k==='persons')txt=PKG.personsTei;else if(k==='odd')txt=PKG.odd;else if(k==='schematron')txt=PKG.schematron;else if(k==='index')txt=JSON.stringify(PKG.index,null,2);else if(k==='relations')txt=JSON.stringify(PKG.relations,null,2);else if(k==='semanticSource')txt=JSON.stringify(window.SEMANTIC_EDITION,null,2);else if(k==='interface')txt='הקובץ הנוכחי: index.html';document.getElementById('modalTitle').textContent='משאב החבילה: '+k;document.getElementById('modalBody').innerHTML=`<pre class="xml-fragment" style="max-height:65vh">${esc((txt||'').slice(0,120000))}</pre>`;document.getElementById('overlay').classList.add('on')}
window.packageLinkHTML=id=>`<button class="package-inline" data-package-id="${esc(id)}">עקבו בחבילה ↗</button>`;
window.openPackageTrace=function(id){traceId=id;setSiteView('packageView');renderTrace();setTimeout(()=>document.querySelector('.package-workbench')?.scrollIntoView({behavior:'smooth',block:'start'}),60)};
document.addEventListener('click',e=>{const t=e.target.closest('[data-trace-id]');if(t){traceId=t.dataset.traceId;renderTrace();return}const p=e.target.closest('[data-package-id]');if(p){e.preventDefault();openPackageTrace(p.dataset.packageId);return}const r=e.target.closest('[data-resource-preview]');if(r){previewResource(r.dataset.resourcePreview);return}});
document.getElementById('traceOpenUI')?.addEventListener('click',()=>openInUI(traceId));
refreshLiveFiles().then(()=>{document.getElementById('packageMode').textContent=window.HAMATATE_LINK_MODE||'linked';renderResources();renderTrace()});
renderResources();renderTrace();document.getElementById('packageMode').textContent=window.HAMATATE_LINK_MODE||'offline bundle';
})();
