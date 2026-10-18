(() => {
  'use strict';
  const deck=window.SaneDeck, now=()=>performance.now();
  const pendingPlayback=new WeakMap(),playbackIntent=new WeakMap(),playbackErrors=new WeakMap();
  const activeVideo=()=>document.querySelector('.slide.is-current video');
  let lastMediaUpdate=-Infinity;
  function mediaState(){
    const video=activeVideo();
    if(!video)return null;
    return {slideId:video.closest('.slide').getAttribute('aria-labelledby'),
      currentTime:Number(video.currentTime)||0,duration:Number.isFinite(video.duration)?video.duration:null,
      paused:video.paused,ended:video.ended,starting:pendingPlayback.has(video),
      waiting:!video.paused&&video.readyState<3,rate:video.playbackRate||1,
      error:playbackErrors.get(video)||'',sampledAt:Date.now()};
  }
  function publishMedia(){
    const media=mediaState(),next=document.getElementById('next-slide');
    const canPlay=media&&(media.starting||(media.paused&&!media.ended));
    const label=media?.starting?'Starting video…':canPlay?'Play video':'Next step';
    next.title=window.SaneLanguage?.text(label)||label;next.setAttribute('aria-label',next.title);
    const slides=deck.getState().slides;
    next.disabled=deck.getState().slide===slides.at(-1).slide&&!canPlay;
    const message=document.getElementById('runtime-message');
    if(message){message.textContent=media?.error||'';message.hidden=!media?.error;}
    document.dispatchEvent(new CustomEvent('deck:media',{detail:{media}}));
  }
  function stopVideo(video){
    pendingPlayback.delete(video);
    playbackIntent.delete(video);
    video.pause();
  }
  function playVideo(video){
    if(!video||pendingPlayback.has(video))return;
    const request={};pendingPlayback.set(video,request);playbackIntent.set(video,request);playbackErrors.delete(video);
    if(video.ended){try{video.currentTime=0;}catch(_){}}
    publishMedia();
    function failed(error){
      if(pendingPlayback.get(video)!==request)return;
      pendingPlayback.delete(video);
      playbackIntent.delete(video);
      if(activeVideo()===video){
        if(error?.name==='AbortError'){publishMedia();return;} // Native pause may cancel play().
        const text=error?.name==='NotAllowedError'
          ? 'Playback blocked. Use the video Play control, then retry.'
          : 'Video could not start. Check the media file and retry.';
        playbackErrors.set(video,text);publishMedia();
      }
    }
    try{
      Promise.resolve(video.play()).then(()=>{
        if(activeVideo()!==video||playbackIntent.get(video)!==request){
          if(activeVideo()!==video||!playbackIntent.has(video))video.pause();
          return;
        }
        pendingPlayback.delete(video);publishMedia();
      },failed);
    }catch(error){failed(error);}
  }
  window.SaneMedia={state:mediaState,publish:publishMedia,
    forward(){
      const video=activeVideo();
      if(!video)return false;
      if(pendingPlayback.has(video))return true; // Do not skip while play() is pending.
      if(video.paused&&!video.ended){playVideo(video);return true;}
      return false;
    },
    toggle(){const video=activeVideo();if(!video)return;
      if(pendingPlayback.has(video)||!video.paused)stopVideo(video);else playVideo(video);
      publishMedia();
    },
    replay(){const video=activeVideo();if(!video)return;
      stopVideo(video);try{video.currentTime=0;}catch(_){}playVideo(video);
    },
    skip(){if(!activeVideo())return;const next=deck.getState().slide+1;
      if(next<=deck.getState().slides.length)deck.selectSlide(next);
    },
    reset(){document.querySelectorAll('video').forEach(video=>{
      stopVideo(video);playbackErrors.delete(video);try{video.currentTime=0;}catch(_){}
    });}
  };
  document.querySelectorAll('video').forEach(video=>{
    for(const event of ['play','playing','pause','ended','loadedmetadata','seeked','ratechange','waiting','error']){
      video.addEventListener(event,()=>{
        if(activeVideo()!==video)return;
        if(event==='error')playbackErrors.set(video,'Video could not start. Check the media file and retry.');
        if(event==='playing')playbackErrors.delete(video);
        publishMedia();
      });
    }
    video.addEventListener('timeupdate',()=>{
      if(activeVideo()===video&&now()-lastMediaUpdate>=250){lastMediaUpdate=now();publishMedia();}
    });
  });
  // Leaving a recorded demo stops playback without losing its position.
  document.addEventListener('deck:slide',e=>{
    document.querySelectorAll('video').forEach(video=>{
      if(video.closest('.slide')!==e.detail.section && (!video.paused||pendingPlayback.has(video)))stopVideo(video);
    });
    publishMedia();
  });
  // Swipes advance reveals as well as slides. Pinch zoom remains available for reading.
  let swipe=null, controlsTimeout=null, lastTouch=-Infinity;
  function revealFullscreenControls(){
    if(!document.body.classList.contains('fullscreen-mode'))return;
    document.body.classList.toggle('fullscreen-controls');
    clearTimeout(controlsTimeout);
    controlsTimeout=setTimeout(()=>document.body.classList.remove('fullscreen-controls'),6000);
  }
  const stage=document.getElementById('stage');
  stage.addEventListener('pointerdown',e=>{
    if(!e.isPrimary){swipe=null;return;}
    if(e.pointerType!=='touch'||e.target.closest('button,a,input,select,dialog,video')||(window.visualViewport?.scale||1)>1.05)return;
    swipe={x:e.clientX,y:e.clientY,id:e.pointerId};
  });
  stage.addEventListener('pointercancel',()=>{swipe=null;});
  stage.addEventListener('pointerup',e=>{if(e.pointerType==='touch')lastTouch=performance.now();if(!swipe||e.pointerId!==swipe.id)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6){deck.navigate(dx<0?1:-1);}else if(Math.abs(dx)<10&&Math.abs(dy)<10){revealFullscreenControls();}});
  stage.addEventListener('click',e=>{if(performance.now()-lastTouch>750&&e.detail>0&&!(e.sourceCapabilities?.firesTouchEvents)&&e.pointerType!=="touch"&&!e.target.closest('button,a,input,select,video')){revealFullscreenControls();}});
  // Source-variable arrows follow actual rendered text positions instead of fixed coordinates.
  function codeConnections(){
    document.querySelectorAll('.source-code[data-connect]').forEach(box=>{
      if(!box.getBoundingClientRect||!box.offsetWidth)return;
      const nodes=[...box.querySelectorAll('[data-variable]')].filter(n=>n.dataset.variable===box.dataset.connect);
      if(nodes.length<2)return;
      let svg=box.querySelector('.code-connection');
      if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','code-connection');svg.setAttribute('aria-hidden','true');box.appendChild(svg);}
      const rect=box.getBoundingClientRect(),scale=rect.width/box.offsetWidth;
      if(!scale)return;
      const a=nodes[0].getBoundingClientRect(),b=nodes.at(-1).getBoundingClientRect();
      const x1=(a.right-rect.left)/scale+4,y1=(a.top+a.height/2-rect.top)/scale;
      const x2=(b.right-rect.left)/scale+4,y2=(b.top+b.height/2-rect.top)/scale;
      const route=box.offsetWidth-12;
      svg.setAttribute('viewBox',`0 0 ${box.offsetWidth} ${box.offsetHeight}`);
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',`M${x1},${y1} C${route},${y1} ${route},${y2} ${x2},${y2} m9,-5 l-9,5 l9,5`);
      svg.replaceChildren(path);
    });
  }
  const drawConnections=()=>requestAnimationFrame(codeConnections);
  document.addEventListener('deck:state',drawConnections);window.addEventListener('resize',drawConnections);
  document.fonts?.ready.then(drawConnections);
  document.getElementById('stream-backpressure')?.addEventListener('click',e=>{
    const flow=document.querySelector('.stream-flow'),paused=flow.dataset.paused!=='true';flow.dataset.paused=String(paused);
    e.currentTarget.textContent=paused?'Resume the consumer':'Slow the consumer';
    document.getElementById('stream-flow-status').textContent=paused?'Pool buffers remain in use → upstream pauses.':'Completed buffers return to the pool → upstream resumes.';
  });
  document.addEventListener('deck:language',()=>{deck.fitStage();publishMedia();});
  document.getElementById('back-to-start')?.addEventListener('click',()=>{if(document.body.dataset.mode==='public')deck.restart();});
  publishMedia();drawConnections();
})();
