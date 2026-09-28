/* Live linked-package bootstrap.
   On HTTP we read the separate JSON file directly. On file:// the generated
   runtime bundle is the fallback, so the prototype stays portable. */
(function(){
  window.HAMATATE_LINK_MODE='offline bundle';
  try{
    if(location.protocol==='http:' || location.protocol==='https:'){
      const x=new XMLHttpRequest();
      x.open('GET','data/semantic_edition_data.json',false);
      x.send(null);
      if(x.status>=200 && x.status<300){
        window.SEMANTIC_EDITION=JSON.parse(x.responseText);
        window.HAMATATE_LINK_MODE='live JSON';
      }
    }
  }catch(err){ console.warn('Using bundled semantic fallback',err); }
})();
