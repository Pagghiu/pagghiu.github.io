(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...document.querySelectorAll('[data-scene-steps]')];
  function renderScene(section) {
    const step = Number(section.dataset.step || 0);
    section.querySelectorAll('[data-phase]').forEach(el => {
      const visible = Number(el.dataset.phase) === step;
      el.classList.toggle('active', visible);
      el.setAttribute('aria-hidden', String(!visible));
    });
    section.querySelectorAll('.scene-controls button').forEach((b, i) => {
      b.classList.toggle('active', i === step);
      b.setAttribute('aria-pressed', String(i === step));
    });
    section.querySelectorAll('.history-track > div').forEach((el,i) => el.classList.toggle('revealed',i<=step));
    if (section.classList.contains('capacity-slide')) {
      section.querySelector('#capacity-base-label').textContent=['caller-owned array','caller-owned heap storage','zoomed: same base address'][step];
      section.querySelector('#capacity-range-label').textContent=['fixed extent','runtime extent','beginning of the reservation'][step];
      section.querySelector('#capacity-live-label').textContent=['existing elements','existing elements','constructed elements · within committed pages'][step];
      section.querySelector('#capacity-unused-label').textContent=step===2?'uncommitted portion →':'';
    }
    section.querySelectorAll('[data-storage-phase]').forEach(el => { el.hidden=Number(el.dataset.storagePhase)!==step; });
  }
  scenes.forEach(section => {
    const controls = section.querySelector('.scene-controls');
    for (let i=0;i<Number(section.dataset.sceneSteps);i++) {
      const button=document.createElement('button');button.type='button';
      button.setAttribute('aria-label',`Show animation step ${i+1}`);
      button.addEventListener('click',()=>window.SaneDeck.setScene(section,i));
      controls.appendChild(button);
    }
    renderScene(section);
  });
  document.addEventListener('deck:scene',event=>renderScene(event.detail.section));
  const outline=document.getElementById('outline-dialog');
  const outlineList=document.getElementById('outline-list');
  document.querySelectorAll('.slide[data-slide]').forEach(section=>{
    const b=document.createElement('button');b.type='button';
    b.textContent=`${String(section.dataset.slide).padStart(2,'0')}  ${section.dataset.backup ? 'Backup · ' : ''}${section.querySelector('h1,h2').textContent}`;
    b.addEventListener('click',()=>{outline.close();window.SaneDeck.selectSlide(Number(section.dataset.slide));});
    outlineList.appendChild(b);
  });
  const toggleOutline=()=>{ if(outline.open)outline.close();else outline.showModal(); };
  document.getElementById('toggle-outline').addEventListener('click',toggleOutline);
  document.getElementById('close-outline').addEventListener('click',()=>outline.close());
  document.addEventListener('keydown',e=>{
    if (!document.body.classList.contains('audience-mode') && !document.getElementById('rehearsal-dialog')?.open && e.key.toLowerCase()==='t' && !e.ctrlKey && !e.metaKey && !e.altKey && !document.getElementById('notes-dialog')?.open) toggleOutline();
  });
  let compileFrame=0;
  const names=['sane','libuv','asio'];
  const labels={sane:'Sane',libuv:'libuv',asio:'Asio'};
  const median=values=>{const v=[...values].sort((a,b)=>a-b);return (v[Math.floor(v.length/2)]+v[Math.ceil(v.length/2)-1])/2;};
  function table(id,rows){
    const body=document.getElementById(id);body.replaceChildren();
    for(const values of rows){const row=document.createElement('tr');
      for(const value of values){const cell=document.createElement('td');cell.textContent=value;row.appendChild(cell);}
      body.appendChild(row);
    }
  }
  function renderCompile(index,animate=true){
    cancelAnimationFrame(compileFrame);
    const single=window.SANE_COMPILE_DATA.m1uv, many=window.SANE_COMPILE_DATA.fanout;
    table('compile-metrics',names.map(name=>[labels[name],`${single.fresh[name].toFixed(3)} s`,`${median(single[name]).toFixed(3)} s`]));
    if(many)table('compile-many-metrics',names.map(name=>[labels[name],...[
      many.summary['4'][name].fresh.median, many.summary['4'][name].one_source_edit.median,
      many.summary['4'][name].shared_header_edit.median,many.summary['1'][name].shared_header_edit.median
    ].map(seconds=>`${seconds.toFixed(2)} s`)]));
    const chart=document.querySelector(`[data-compile-chart="${index===2?'many':'single'}"]`);
    const values=Object.fromEntries(names.map(name=>[name,index===2&&many?many.summary['4'][name].shared_header_edit.median:median(single[name])]));
    const maximum=Math.max(...Object.values(values));
    function draw(fraction){
      for(const name of names){const row=chart.querySelector(`[data-compile-library="${name}"]`);
        const elapsed=Math.min(values[name],maximum*fraction);
        row.querySelector('.compile-bar-track span').style.width=`${elapsed/maximum*100}%`;
        row.querySelector('strong').textContent=`${elapsed.toFixed(index===2?2:3)} s`;
      }
    }
    if(reduced.matches||!animate){draw(1);return;}
    const start=performance.now();
    function tick(now){const fraction=Math.min((now-start)/3000,1);draw(fraction);if(fraction<1)compileFrame=requestAnimationFrame(tick);}
    draw(0);compileFrame=requestAnimationFrame(tick);
  }
  document.addEventListener('deck:build',event=>{
    cancelAnimationFrame(compileFrame);
    if(event.detail.index>0)renderCompile(event.detail.index);
  });
  document.addEventListener('deck:slide',event=>{
    cancelAnimationFrame(compileFrame);
    const section=event.detail.section;
    if(section.classList.contains('benchmark') && Number(section.dataset.buildStep)>0)renderCompile(Number(section.dataset.buildStep));
  });
  renderCompile(1,false);renderCompile(2,false);
})();
