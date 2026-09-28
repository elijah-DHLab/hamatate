
const NS='http://www.tei-c.org/ns/1.0';
let MANIFEST, INDEX, REL, TEI_DOC, XML_TEXT, mode='reading', scenario='text';
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function q(el,sel){return el.querySelector(sel)} function qa(el,sel){return [...el.querySelectorAll(sel)]}
function xmlid(el){return el.getAttributeNS('http://www.w3.org/XML/1998/namespace','id')||el.getAttribute('xml:id')}
async function load(){
 MANIFEST=await fetch('manifest.json').then(r=>r.json());
 [INDEX,REL,XML_TEXT]=await Promise.all([fetch(MANIFEST.resources.index).then(r=>r.json()),fetch(MANIFEST.resources.relations).then(r=>r.json()),fetch(MANIFEST.resources.tei).then(r=>r.text())]);
 TEI_DOC=new DOMParser().parseFromString(XML_TEXT,'application/xml');
 if(TEI_DOC.querySelector('parsererror')) throw Error('TEI XML parse error');
 $('#pkgStatus').textContent=`TEI נטען · ${INDEX.segments.length} יחידות T · ${INDEX.units.length} יחידות S`;
 renderOutline(); renderReader(); renderScenario(); renderGraph(); renderPackage(); wireNav();
}
function tname(el){return el.localName}
function renderInline(node,linked=true){
 if(node.nodeType===3)return esc(node.nodeValue);
 if(node.nodeType!==1)return '';
 const n=tname(node), inner=[...node.childNodes].map(x=>renderInline(x,linked)).join('');
 if(n==='stage')return `<span class="stage">${inner}</span>`;
 if(n==='add')return linked?`<span class="add" title="תוספת בכתב יד">${inner}</span>`:inner;
 if(n==='del')return linked?`<span class="del" title="מחיקה: ${esc(node.getAttribute('type')||'')}">${inner}</span>`:'';
 if(n==='note')return linked?`<span class="editorial" title="הערת מהדיר">${inner}</span>`:'';
 if(n==='title')return `<span class="internal-title">${inner}</span>`;
 if(n==='unclear')return `<span class="unclear" title="לא ברור">${inner}</span>`;
 if(n==='persName'&&node.getAttribute('ref'))return `<button class="speaker" data-person="${node.getAttribute('ref').slice(1)}">${inner}</button>`;
 if(n==='choice'){const corr=node.querySelector('corr'),sic=node.querySelector('sic');return linked?`<span class="editorial" title="קריאה מקורית: ${esc(sic?.textContent||'')}">${esc(corr?.textContent||node.textContent)}</span>`:esc(corr?.textContent||node.textContent)}
 return inner;
}
function renderParagraph(p,linked){return `<div class="p">${[...p.childNodes].map(n=>renderInline(n,linked)).join('')}</div>`}
function roleInfo(rid){const r=INDEX.roles[rid]; if(!r)return null; return r}
function renderSegment(div,linked=true){
 const id=xmlid(div), meta=INDEX.segments.find(x=>x.id===id)||{}; const sid=(div.getAttribute('corresp')||'').replace('#','');
 let h=`<section class="segment" id="seg-${id}"><h2>${esc(meta.title||q(div,'head')?.textContent||id)}</h2><div class="meta"><span class="badge">${id}</span>${sid?`<button class="badge s" data-unit="${sid}">${sid} · ${esc(INDEX.units.find(x=>x.id===sid)?.title||'')}</button>`:''}${meta.genre?`<span class="badge">${esc(meta.genre)}</span>`:''}</div>`;
 for(const ch of [...div.children]){
  const n=tname(ch); if(n==='head')continue;
  if(n==='pb'){h+=`<div class="pb"><span>עמ׳ ${esc(ch.getAttribute('n'))}</span></div>`;continue}
  if(n==='sp'){
    const rid=(ch.getAttribute('who')||'').replace('#',''); const spk=q(ch,'speaker')?.textContent||roleInfo(rid)?.character||rid;
    h+=`<div class="sp"><button class="speaker" data-role="${rid}">${esc(spk)}</button>`;
    for(const p of qa(ch,':scope > p'))h+=renderParagraph(p,linked); h+='</div>';continue
  }
  if(n==='p')h+=renderParagraph(ch,linked);
  if(n==='metamark'&&linked)h+=`<div class="editorial">סימון עריכה / תזוזה: ${esc(ch.textContent)}</div>`;
 }
 return h+'</section>'
}
function bodyDivs(){return qa(TEI_DOC, 'body > div[type="textSegment"]')}
function renderOutline(){const box=$('#outlineList');box.innerHTML=INDEX.segments.map(x=>`<button data-jump="${x.id}">${esc(x.title)}</button>`).join('');$$('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById('seg-'+b.dataset.jump)?.scrollIntoView({behavior:'smooth'}))}
function renderReader(){
 const linked=mode==='linked'; $('#readerContent').innerHTML=mode==='xml'?`<pre class="code">${esc(XML_TEXT)}</pre>`:bodyDivs().map(d=>renderSegment(d,linked)).join('');
 $$('.toolbar button').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode)); wireSemantic();
}
function wireSemantic(){
 $$('[data-role]').forEach(b=>b.onclick=()=>inspectRole(b.dataset.role)); $$('[data-person]').forEach(b=>b.onclick=()=>inspectPerson(b.dataset.person)); $$('[data-unit]').forEach(b=>b.onclick=()=>inspectUnit(b.dataset.unit));
}
function inspectRole(id){const r=INDEX.roles[id]; if(!r)return; const p=r.person_id?INDEX.persons[r.person_id]:null; $('#inspect').innerHTML=`<h3>תפקיד</h3><div class="kv"><b>תפקיד</b><span>${esc(r.character)}</span><b>ID</b><span>${id}</span><b>יחידת S</b><span>${esc(r.scene_id)}</span><b>שחקן/ית</b><span>${esc(r.performer||'לא ידוע')}</span></div>${p?`<button class="rawlink" data-person="${r.person_id}">לרשומת האדם</button><div class="path">speech → ${id} → ${r.person_id}</div>`:''}`; wireSemantic()}
function inspectPerson(id){const p=INDEX.persons[id]; if(!p)return; const links=Object.values(INDEX.roles).filter(r=>r.person_id===id); $('#inspect').innerHTML=`<h3>אדם / ישות</h3><div class="kv"><b>שם</b><span>${esc(p.name)}</span><b>ID</b><span>${id}</span><b>Wikidata</b><span>${esc(String(p.wikidata||'—'))}</span><b>VIAF</b><span>${esc(String(p.viaf||'—'))}</span></div><div class="note">בתיק זה: ${links.length} תפקידים מקושרים.</div>`}
function inspectUnit(id){const u=INDEX.units.find(x=>x.id===id); const ts=INDEX.segments.filter(x=>x.s===id); const ps=INDEX.programItems.filter(x=>x.s_id===id); $('#inspect').innerHTML=`<h3>יחידת מופע משוערת</h3><div class="kv"><b>שם</b><span>${esc(u?.title||id)}</span><b>ID</b><span>${id}</span><b>טקסט</b><span>${ts.map(x=>x.id).join(', ')||'—'}</span><b>תכנייה</b><span>${ps.map(x=>x.ps_id).join(', ')||'—'}</span></div><div class="path">witness → evidence → claim → ${id} → scenario</div>`}
function renderScenario(){const seq=INDEX.scenarios[scenario]||[];$('#seq').innerHTML=seq.map(s=>`<button class="unit ${((scenario==='text'&&!INDEX.scenarios.program.includes(s))||(scenario==='program'&&!INDEX.scenarios.text.includes(s)))?'diff':''}" data-unit="${s}">${esc(INDEX.units.find(x=>x.id===s)?.title||s)}</button>`).join('');$$('.scenario-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.scenario===scenario));wireSemantic()}
function renderGraph(){const keep=REL.edges.filter(e=>['T→S','R→person','PS→S'].includes(e.type)).slice(0,70);$('#graph').innerHTML=keep.map(e=>`<div class="edgeRow"><span>${esc(label(e.source))}</span><span class="typ">${e.type}</span><span>${esc(label(e.target))}</span></div>`).join('')}
function label(id){return REL.nodes.find(n=>n.id===id)?.label||id}
function renderPackage(){const r=MANIFEST.resources;$('#packgrid').innerHTML=Object.entries(r).map(([k,v])=>`<div class="filecard"><b>${esc(k)}</b><code>${esc(v)}</code><p>${esc(MANIFEST.descriptions[k]||'Linked resource')}</p></div>`).join('')}
function wireNav(){
 $$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');$$('.view').forEach(x=>x.classList.remove('on'));$('#'+b.dataset.view).classList.add('on')});
 $$('.toolbar button').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;renderReader()});
 $$('.scenario-tabs button').forEach(b=>b.onclick=()=>{scenario=b.dataset.scenario;renderScenario()});
}
load().catch(err=>{$('#pkgStatus').textContent='שגיאה בטעינת החבילה';$('#readerContent').innerHTML=`<div class="note"><b>לא ניתן לטעון fetch מקובץ מקומי.</b><br>הרץ <code>python -m http.server 8000</code> מתיקיית החבילה ופתח את localhost. ${esc(String(err))}</div>`;console.error(err)});
