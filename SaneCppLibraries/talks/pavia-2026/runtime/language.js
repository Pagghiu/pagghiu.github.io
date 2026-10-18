(() => {
  'use strict';
  const dictionary = window.SANE_ITALIAN || {};
  const reverse = new Map(Object.entries(dictionary).map(([en,it]) => [it,en]));
  const originals = new WeakMap(), attributes = new WeakMap();
  const selector = document.getElementById('deck-language');
  const storageKey = 'sane-deck-language';
  let language = 'en', observer;
  const protectedTags = new Set(['PRE','CODE','SCRIPT','STYLE','TEXTAREA']);
  function translated(core) {
    const simple = dictionary[core];
    if (simple !== undefined) return simple;
    let m;
    if ((m = core.match(/^Slide (\d+) of (\d+)(.*)$/))) return `Slide ${m[1]} di ${m[2]}${m[3].replace('dependencies','dipendenze').replace('catalog','catalogo')}`;
    if ((m = core.match(/^Show animation step (\d+)$/))) return `Mostra il passo ${m[1]} dell’animazione`;
    if ((m = core.match(/^(\d+)\/12 edits$/))) return `${m[1]}/12 modifiche`;
    if ((m = core.match(/^(\d+\/\d+) slides visited( · target 45 minutes)?$/))) return `${m[1]} slide visitate${m[2] ? ' · obiettivo 45 minuti' : ''}`;
    if ((m = core.match(/^(\d+) libraries · (.*)$/))) return `${m[1]} librerie · ${m[2]}`;
    if ((m = core.match(/^(\d+\s{2})(Backup · )?(.+)$/))) return m[1]+(m[2] || '')+translated(m[3]);
    if ((m = core.match(/^(\d+\. )(.+)$/))) return m[1]+translated(m[2]);
    if ((m = core.match(/^Next(?: slide)?: (.+)$/))) return 'Prossima slide: '+translated(m[1]);
    if ((m = core.match(/^(\d+\/\d+) slides visited · (\d+)%$/))) return `${m[1]} slide visitate · ${m[2]}%`;
    if ((m = core.match(/^(.* · )?(running|paused|finished) · ([\d:]+) active time · (\d+) visits$/))) return `${m[1] || ''}${translated(m[2])} · ${m[3]} di tempo effettivo · ${m[4]} visite`;
    if ((m = core.match(/^(.* · )(running|paused|finished)$/))) return m[1]+translated(m[2]);
    if ((m = core.match(/^(GrowableBuffer<Buffer>|VectorStdCharAdapter) · (alive|destroyed)$/))) return `${m[1]} · ${m[2] === 'alive' ? 'attivo' : 'distrutto'}`;
    if ((m = core.match(/^M1 Pro · all three measured together · libuv: 37 C source files \+ CMake configuration \(([\d.]+) s median\)\.$/))) return `M1 Pro · tre librerie nella stessa misura · libuv: 37 file C + configurazione CMake (mediana ${m[1]} s).`;
    return core;
  }
  function text(value) {
    const string = String(value ?? ''), core = string.trim();
    if (!core) return string;
    const english = reverse.get(core) || core;
    const result = language === 'it' ? translated(english) : english;
    return string.slice(0,string.length-string.trimStart().length)+result+string.slice(string.trimEnd().length);
  }
  function updateText(node) {
    const current = node.data;
    if (!current.trim()) return;
    const saved = originals.get(node);
    const english = saved && current === saved.last ? saved.en : (reverse.has(current.trim()) ? textToEnglish(current) : current);
    const result = text(english);
    originals.set(node,{en:english,last:result});
    if (result !== current) node.data = result;
  }
  function textToEnglish(value) {
    const core=value.trim(), en=reverse.get(core) || core;
    return value.slice(0,value.length-value.trimStart().length)+en+value.slice(value.trimEnd().length);
  }
  function walk(node) {
    if (node.nodeType === 3) { updateText(node); return; }
    if (node.nodeType === 1) {
      if (protectedTags.has(node.tagName) || node.hasAttribute('data-no-translate')) return;
      // Entity decoding can leave adjacent text nodes in some DOMs. Join plain
      // prose leaves so the complete sentence uses one translation; never enter code.
      const children=[...node.childNodes];
      if(children.length>1 && children.every(child=>child.nodeType===3)) {
        children[0].data=children.map(child=>child.data).join('');
        children.slice(1).forEach(child=>child.remove());
      }
      let saved=attributes.get(node);
      if (!saved) { saved=new Map(); attributes.set(node,saved); }
      for (const name of ['aria-label','alt','title']) {
        if (!node.hasAttribute(name)) continue;
        const current=node.getAttribute(name), old=saved.get(name);
        const en=old && current===old.last ? old.en : textToEnglish(current);
        const result=text(en);saved.set(name,{en,last:result});
        if (result!==current) node.setAttribute(name,result);
      }
    }
    [...node.childNodes].forEach(walk);
  }
  function observe() {
    observer?.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  }
  function refresh() {
    observer?.disconnect();
    walk(document.documentElement);
    if (selector) selector.value=language;
    observe();
  }
  function setLanguage(value,{persist=true,notify=true}={}) {
    const next=value==='it' ? 'it' : 'en', changed=next!==language;
    language=next;document.documentElement.lang=language;
    refresh();
    if (persist) { try { localStorage.setItem(storageKey,language); } catch (_) {} }
    if (changed && notify) document.dispatchEvent(new CustomEvent('deck:language',{detail:{language}}));
  }
  window.SaneLanguage={text,refresh,setLanguage,get language(){return language;}};
  if (window.MutationObserver) observer=new window.MutationObserver(refresh);
  let initial='en';
  try { initial=new URLSearchParams(location.search).get('lang') || localStorage.getItem(storageKey) || 'en'; } catch (_) {}
  selector?.addEventListener('change',()=>setLanguage(selector.value));
  setLanguage(initial,{persist:false});
})();
