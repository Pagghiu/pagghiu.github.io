(() => {
  "use strict";
  const requestedTheme = new URLSearchParams(location.search).get("theme");
  if (["signal", "ritual", "static"].includes(requestedTheme)) document.body.dataset.theme = requestedTheme;

  const slideNumbers = [...document.querySelectorAll(".slide[data-slide]")]
    .map(section => Number(section.dataset.slide)).sort((a, b) => a - b);
  const slides = new Map(slideNumbers.map(number => [number, document.querySelector(`[data-slide="${number}"]`)]));
  const stage = document.getElementById("stage");
  const stageFit = document.getElementById("stage-fit");
  const position = document.getElementById("slide-position");
  const notesDialog = document.getElementById("notes-dialog");
  const notesText = document.getElementById("notes-text");
  let currentSlide = 1;
  let timelineStep = 0;
  let catalogGraph = false;

  function updatePosition() {
    const section = slides.get(currentSlide);
    const panels = section.querySelectorAll("[data-build]");
    const suffix = section.dataset.sceneSteps ? ` · ${Number(section.dataset.step || 0) + 1}/${section.dataset.sceneSteps}` : panels.length ? ` · ${Number(section.dataset.buildStep || 0) + 1}/${panels.length}` : section.classList.contains("catalog-slide") ? (catalogGraph ? " · dependencies" : " · catalog") : "";
    position.textContent = `Slide ${currentSlide} of ${slideNumbers.length}${suffix}`;
    document.dispatchEvent(new CustomEvent("deck:state"));
  }

  function selectBuild(section, index) {
    const panels = [...section.querySelectorAll("[data-build]")];
    if (index < 0 || index >= panels.length) return false;
    section.dataset.buildStep = String(index);
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    section.querySelectorAll("[data-select-build]").forEach(button => {
      button.classList.toggle("selected", Number(button.dataset.selectBuild) === index);
      button.setAttribute("aria-pressed", String(Number(button.dataset.selectBuild) === index));
    });
    if (section.classList.contains("integration-code")) section.querySelector("h2").textContent = ["Easy to integrate: single file libraries", "Easy to integrate: SC.cpp", "Build descriptions in C++: SC-build"][index];
    updatePosition();
    if (section.classList.contains("benchmark")) {
      document.dispatchEvent(new CustomEvent("deck:build", {detail:{section,index}}));
    }
    return true;
  }

  function renderCatalog() {
    const map = document.getElementById("library-map");
    map.classList.toggle("graph-mode", catalogGraph);
    map.closest("section").classList.toggle("graph-mode", catalogGraph);
    window.SANE_LIBRARY_GRAPH.forEach((library, index) => {
      const node = document.getElementById(`library-${library.name}`);
      const [gx, gy, gw] = library.position;
      const column = Math.floor(index / 7), row = index % 7;
      const width = catalogGraph ? gw : 344;
      const x = catalogGraph ? gx - gw / 2 : column * 366;
      const y = catalogGraph ? gy - 22 : row * 78;
      node.style.width = `${width}px`;
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
    document.getElementById("catalog-toggle").textContent = catalogGraph ? "← Show catalog" : "Show dependency graph →";
    document.getElementById("catalog-description").textContent = catalogGraph ? "Current dependency data · includes Cryptography" : "28 libraries · Draft / MVP / Usable";
    updatePosition();
  }

  function fitStage() {
    const controls = document.getElementById("deck-controls");
    const controlHeight = (document.body.classList.contains("audience-mode") || document.body.classList.contains("fullscreen-mode")) ? 0 : (controls.getBoundingClientRect?.().height || 100);
    const scale = Math.min(window.innerWidth / 1600, Math.max(1, (window.visualViewport?.height || window.innerHeight) - controlHeight) / 900);
    stageFit.style.width = `${1600 * scale}px`;
    stageFit.style.height = `${900 * scale}px`;
    stage.style.transform = `scale(${scale})`;
  }

  const timelineCaptions = [
    "Compiler launched. The slot owns the process and both read requests.",
    "Stdout reaches EOF. The process and stderr are still active.",
    "The exit callback fires. Stderr may still deliver data.",
    "Final stderr bytes arrive. Data is not EOF: keep the slot.",
    "Stderr reaches EOF. All three conditions hold; reuse the slot."
  ];
  const cursorPositions = [8, 38, 60, 74, 88];

  function renderTimeline() {
    document.querySelector(".timeline-cursor").style.left = `${cursorPositions[timelineStep]}%`;
    document.querySelectorAll(".timeline-diagram .event").forEach(event => {
      event.classList.toggle("seen", Number(event.dataset.reveal) <= timelineStep);
    });
    for (const [name, reached] of Object.entries({
      process: timelineStep >= 2,
      stdout: timelineStep >= 1,
      stderr: timelineStep >= 4
    })) {
      document.querySelector(`[data-gate="${name}"]`).classList.toggle("done", reached);
    }
    const slotState = document.getElementById("slot-state");
    slotState.classList.toggle("reusable", timelineStep === 4);
    slotState.textContent = timelineStep === 4 ? "REUSABLE SLOT" : "ACTIVE SLOT";
    document.getElementById("timeline-caption").textContent = timelineCaptions[timelineStep];
    document.getElementById("lifetime-retained-group").classList.toggle("reusable", timelineStep === 4);
    document.getElementById("lifetime-reuse-label").textContent = timelineStep === 4 ? "Reuse the whole group" : "Keep the whole group";
    document.getElementById("timeline-next").disabled = timelineStep === 4;
    document.dispatchEvent(new CustomEvent("deck:state"));
  }

  function showSlide(number) {
    if (!slides.has(number)) return;
    currentSlide = number;
    for (const [slideNumber, section] of slides) {
      section.hidden = slideNumber !== number;
      section.classList.toggle("is-current", slideNumber === number);
    }
    updatePosition();
    document.getElementById("previous-slide").disabled = number === slideNumbers[0];
    document.getElementById("next-slide").disabled = number === slideNumbers.at(-1);
    if (notesDialog?.open) updateNotes();
    document.dispatchEvent(new CustomEvent("deck:slide", {detail:{section:slides.get(number)}}));
  }

  function selectSlide(number) {
    if (location.hash !== `#${number}`) location.hash = String(number);
    showSlide(number);
  }

  function setScene(section, step) {
    if (!section.dataset.sceneSteps || step < 0 || step >= Number(section.dataset.sceneSteps)) return false;
    section.dataset.step = String(step);
    document.dispatchEvent(new CustomEvent("deck:scene", {detail:{section,step}}));
    updatePosition();
    return true;
  }

  function navigate(direction) {
    if (direction > 0 && window.SaneMedia?.forward()) return;
    const section = slides.get(currentSlide);
    if (setScene(section, Number(section.dataset.step || 0) + direction)) return;
    if (section.querySelector("[data-build]")) {
      if (selectBuild(section, Number(section.dataset.buildStep || 0) + direction)) return;
    }
    if (section.classList.contains("catalog-slide")) {
      if ((direction > 0 && !catalogGraph) || (direction < 0 && catalogGraph)) {
        catalogGraph = !catalogGraph; renderCatalog(); return;
      }
    }
    if (section.classList.contains("lifecycle")) {
      if (direction > 0 && timelineStep < 4) {
        timelineStep++;
        renderTimeline();
        return;
      }
      if (direction < 0 && timelineStep > 0) {
        timelineStep--;
        renderTimeline();
        return;
      }
    }
    const nextIndex = slideNumbers.indexOf(currentSlide) + direction;
    if (nextIndex >= 0 && nextIndex < slideNumbers.length) selectSlide(slideNumbers[nextIndex]);
  }

  function updateNotes() {
    notesText.textContent = slides.get(currentSlide).querySelector(".speaker-notes").textContent.trim();
  }

  function toggleNotes() {
    if (!notesDialog) return;
    if (notesDialog.open) notesDialog.close();
    else {
      updateNotes();
      notesDialog.showModal();
    }
  }

  // The plotted values are median fresh build plus each measured edit/relink,
  // copied from CompileBenchmark/async/edit-loop-{x86_64,arm64}.json.
  const benchmarkData = {
    intel: {
      fresh: { sane: 1.6057242969982326, asio: 4.322886547000962 },
      sane: [0.326263, 0.332603, 0.329600, 0.343712, 0.314032, 0.337605, 0.334743, 0.336941, 0.322718, 0.324721, 0.339820, 0.328163],
      asio: [1.663085, 1.735392, 1.728574, 1.782479, 1.682567, 1.739063, 1.771772, 1.739130, 1.717254, 1.761618, 1.738204, 1.752161],
      maxY: 26,
      ticks: [0, 5, 10, 15, 20, 25]
    },
    m1: {
      fresh: { sane: 0.46472104200000075, asio: 1.2496507909999996 },
      sane: [0.090870, 0.092694, 0.094685, 0.096571, 0.101754, 0.088231, 0.090315, 0.092198, 0.087469, 0.095458, 0.091730, 0.104842],
      asio: [0.528270, 0.524672, 0.522958, 0.529903, 0.535410, 0.557733, 0.533689, 0.529037, 0.514335, 0.516757, 0.518727, 0.530280],
      maxY: 8,
      ticks: [0, 2, 4, 6, 8]
    }
  };
  // September 27 all-three M1 run; original two-library machine records remain above.
  benchmarkData.m1uv = {
  "fresh": {
    "sane": 0.4632249160003994,
    "asio": 1.2540514999996049,
    "libuv": 4.952655084000071
  },
  "sane": [
    0.10026245800008837,
    0.09831599900007859,
    0.09848879099990882,
    0.09851437400038776,
    0.10255875100028788,
    0.10119612500011499,
    0.0953599170002235,
    0.10095383299994865,
    0.09952479299954575,
    0.09091391699985252,
    0.09976370799995493,
    0.10105629200052135
  ],
  "asio": [
    0.5394260420002865,
    0.5244922079996286,
    0.523502458999701,
    0.5292604159999428,
    0.5804071669999757,
    0.5287132500002372,
    0.5163611660000242,
    0.5806711250002081,
    0.5061115419998714,
    0.5383266670000921,
    0.5370390830003089,
    0.5256642080003076
  ],
  "libuv": [
    0.1247880000000805,
    0.1289790420000827,
    0.13198287500017614,
    0.12767870900006528,
    0.12753941699975258,
    0.1265062500001477,
    0.1285138749994985,
    0.12251391700010572,
    0.12239291700007016,
    0.12715699999989738,
    0.1261565410000003,
    0.12689266600000337
  ],
  "libuvConfigure": 2.2761501669997415
};
  benchmarkData.fanout = {
  "consumer_files": 100,
  "rounds": 3,
  "jobs": [
    1,
    4
  ],
  "summary": {
    "1": {
      "sane": {
        "fresh": {
          "median": 5.859447540999099,
          "min": 5.680454749999626,
          "max": 9.455050417003804,
          "samples": [
            9.455050417003804,
            5.859447540999099,
            5.680454749999626
          ]
        },
        "one_source_edit": {
          "median": 0.10283616699598497,
          "min": 0.09818962500139605,
          "max": 0.1252296250022482,
          "samples": [
            0.1252296250022482,
            0.09818962500139605,
            0.10283616699598497
          ]
        },
        "shared_header_edit": {
          "median": 5.503731543001777,
          "min": 5.352679916002671,
          "max": 6.598975624998275,
          "samples": [
            6.598975624998275,
            5.352679916002671,
            5.503731543001777
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 5.428266415998223,
            "link_seconds": 0.0494808750008815
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.058425584000360686,
            "link_seconds": 0.04554374999861466
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 5.4392460840026615,
            "link_seconds": 0.06448545899911551
          }
        }
      },
      "asio": {
        "fresh": {
          "median": 48.932001041997864,
          "min": 48.32763245799288,
          "max": 50.18887345799885,
          "samples": [
            50.18887345799885,
            48.32763245799288,
            48.932001041997864
          ]
        },
        "one_source_edit": {
          "median": 0.5402575420084759,
          "min": 0.5276092909989529,
          "max": 0.5499983749978128,
          "samples": [
            0.5402575420084759,
            0.5276092909989529,
            0.5499983749978128
          ]
        },
        "shared_header_edit": {
          "median": 46.64788616599981,
          "min": 46.213112458004616,
          "max": 48.721563207000145,
          "samples": [
            46.64788616599981,
            48.721563207000145,
            46.213112458004616
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 47.99349649999931,
            "link_seconds": 0.07258208299754187
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.48332158400444314,
            "link_seconds": 0.05697879099898273
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 46.56992983300006,
            "link_seconds": 0.07795633299974725
          }
        }
      },
      "libuv": {
        "fresh": {
          "median": 13.77408804200968,
          "min": 13.53264479101199,
          "max": 13.912939334004477,
          "samples": [
            13.53264479101199,
            13.77408804200968,
            13.912939334004477
          ]
        },
        "one_source_edit": {
          "median": 0.1332721670041792,
          "min": 0.12955754100403283,
          "max": 0.13626408399431966,
          "samples": [
            0.13626408399431966,
            0.12955754100403283,
            0.1332721670041792
          ]
        },
        "shared_header_edit": {
          "median": 8.518511458998546,
          "min": 8.124683999005356,
          "max": 8.545635665999725,
          "samples": [
            8.545635665999725,
            8.124683999005356,
            8.518511458998546
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 8.506317417006358,
            "link_seconds": 0.05049966700607911
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.08959462500206428,
            "link_seconds": 0.04367754200211493
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 8.42895654199674,
            "link_seconds": 0.048194666000199504
          }
        }
      }
    },
    "4": {
      "sane": {
        "fresh": {
          "median": 2.398287416996027,
          "min": 1.8608625829947414,
          "max": 4.015201832997263,
          "samples": [
            2.398287416996027,
            1.8608625829947414,
            4.015201832997263
          ]
        },
        "one_source_edit": {
          "median": 0.10781316700013122,
          "min": 0.10314362499775598,
          "max": 0.22494991600251524,
          "samples": [
            0.10781316700013122,
            0.10314362499775598,
            0.22494991600251524
          ]
        },
        "shared_header_edit": {
          "median": 1.8904367919967626,
          "min": 1.4857787500004633,
          "max": 2.175156457000412,
          "samples": [
            1.8904367919967626,
            1.4857787500004633,
            2.175156457000412
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 1.9066330419955193,
            "link_seconds": 0.049261374995694496
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.06013029199675657,
            "link_seconds": 0.04918912499852013
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 1.8384778339968761,
            "link_seconds": 0.05195895799988648
          }
        }
      },
      "asio": {
        "fresh": {
          "median": 13.962191917991731,
          "min": 13.855150831994251,
          "max": 16.8072020000036,
          "samples": [
            13.855150831994251,
            13.962191917991731,
            16.8072020000036
          ]
        },
        "one_source_edit": {
          "median": 0.5448453330027405,
          "min": 0.5386982500058366,
          "max": 0.5458044160041027,
          "samples": [
            0.5386982500058366,
            0.5448453330027405,
            0.5458044160041027
          ]
        },
        "shared_header_edit": {
          "median": 16.88214720799442,
          "min": 12.700563874997897,
          "max": 20.98449224900105,
          "samples": [
            20.98449224900105,
            12.700563874997897,
            16.88214720799442
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 13.020959791996574,
            "link_seconds": 0.06542395799624501
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.48614933300268603,
            "link_seconds": 0.05811662500491366
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 16.81115233300079,
            "link_seconds": 0.07099487499363022
          }
        }
      },
      "libuv": {
        "fresh": {
          "median": 5.966456290007045,
          "min": 5.7475161669935915,
          "max": 12.661535625004035,
          "samples": [
            12.661535625004035,
            5.7475161669935915,
            5.966456290007045
          ]
        },
        "one_source_edit": {
          "median": 0.1424599589954596,
          "min": 0.12740166599542135,
          "max": 0.25728974999219645,
          "samples": [
            0.25728974999219645,
            0.12740166599542135,
            0.1424599589954596
          ]
        },
        "shared_header_edit": {
          "median": 2.245917668005859,
          "min": 2.2212226249976084,
          "max": 4.349363000001176,
          "samples": [
            4.349363000001176,
            2.245917668005859,
            2.2212226249976084
          ]
        },
        "stage_medians": {
          "fresh": {
            "consumer_compile_wall_seconds": 2.2504484160017455,
            "link_seconds": 0.04603987500013318
          },
          "one_source_edit": {
            "consumer_compile_wall_seconds": 0.09013674999732757,
            "link_seconds": 0.05232320899813203
          },
          "shared_header_edit": {
            "consumer_compile_wall_seconds": 2.2007214590048534,
            "link_seconds": 0.04519620900100563
          }
        }
      }
    }
  }
};
  window.SANE_COMPILE_DATA = benchmarkData;
  const svgNS = "http://www.w3.org/2000/svg";
  function svgElement(name, attributes, parent, content) {
    const el = document.createElementNS(svgNS, name);
    for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
    if (content !== undefined) el.textContent = content;
    parent.appendChild(el);
    return el;
  }

  function createLibraryMap() {
    const nodes = document.getElementById("library-nodes");
    const edges = document.getElementById("dependency-edges");
    const byName = new Map(window.SANE_LIBRARY_GRAPH.map(lib => [lib.name, lib]));
    const depthCache = new Map();
    function dependencyDepth(name) {
      if (depthCache.has(name)) return depthCache.get(name);
      const deps = byName.get(name).dependencies;
      const depth = deps.length ? 1 + Math.max(...deps.map(dependencyDepth)) : 0;
      depthCache.set(name, depth);
      return depth;
    }
    const defs = svgElement("defs", {}, edges);
    const marker = svgElement("marker", { id: "dependency-arrow", viewBox: "0 0 10 10", refX: 10, refY: 5, markerUnits: "userSpaceOnUse", markerWidth: 10, markerHeight: 10, orient: "auto-start-reverse" }, defs);
    svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z" }, marker);
    const arrowStems = new Map();
    window.SANE_LIBRARY_GRAPH.forEach(library => {
      const node = document.createElement("div");
      node.className = `library-node ${["Process", "Async"].includes(library.name) ? "focus" : ""}`;
      node.id = `library-${library.name}`;
      node.dataset.depth = String(dependencyDepth(library.name));
      const badge = document.createElement("span");
      badge.className = `status ${library.status}`;
      badge.textContent = library.status === "mvp" ? "M" : library.status === "usable" ? "U" : "D";
      badge.title = library.status;
      const label = document.createElement("span"); label.textContent = library.label;
      node.append(badge, label); nodes.append(node);
      library.dependencies.forEach(name => {
        const target = byName.get(name);
        const [x1, cy1, w1] = library.position, [x2, cy2, w2] = target.position;
        let path, stem, side;
        if (cy1 === cy2) {
          const direction = x2 > x1 ? 1 : -1;
          const tip = x2 - direction * (w2 / 2 + 4);
          const base = tip - direction * 10;
          path = `M${x1 + direction * w1 / 2},${cy1} L${base},${cy2}`;
          stem = `M${base},${cy2} L${tip},${cy2}`;
          side = direction > 0 ? 'left' : 'right';
        } else {
          const direction = cy2 > cy1 ? 1 : -1;
          const y1 = cy1 + direction * 22, tip = cy2 - direction * 26;
          const base = tip - direction * 10, mid = (y1 + base) / 2;
          path = `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${base}`;
          stem = `M${x2},${base} L${x2},${tip}`;
          side = direction > 0 ? 'top' : 'bottom';
        }
        svgElement("path", { d: path, "data-dependency": `${library.name}:${name}` }, edges);
        // Incoming curves meet at one arrow base, never at its sides or tip.
        arrowStems.set(`${name}:${side}`, stem);
      });
    });
    arrowStems.forEach((d, target) => svgElement("path", {d, "data-arrow-target": target, "marker-end": "url(#dependency-arrow)"}, edges));
    renderCatalog();
  }

  function getState() {
    const section = slides.get(currentSlide);
    const title = el => {
      const heading=el.querySelector('h1,h2'),copy=heading.cloneNode(true);
      copy.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
      const value=copy.textContent.replace(/\s+/g,' ').trim();
      return heading.hasAttribute('data-no-translate') ? value : (window.SaneLanguage?.text(value) || value);
    };
    return {slide:currentSlide,slideId:section.getAttribute('aria-labelledby'),title:title(section),
      fullscreen:Boolean(document.fullscreenElement || document.webkitFullscreenElement),
      language:window.SaneLanguage?.language || 'en',
      ...(document.body.dataset.mode==='public'?{}:{notes:window.SaneLanguage?.text(section.querySelector('.speaker-notes')?.textContent.trim() || '') || section.querySelector('.speaker-notes')?.textContent.trim() || ''}),position:window.SaneLanguage?.text(position.textContent) || position.textContent,
      step:{scene:Number(section.dataset.step||0),build:Number(section.dataset.buildStep||0),
        timeline:section.classList.contains('lifecycle')?timelineStep:null,
        catalog:section.classList.contains('catalog-slide')?catalogGraph:null},
      nextTitle:slides.has(currentSlide+1)?title(slides.get(currentSlide+1)):null,
      slides:[...slides.values()].map(el=>({slide:Number(el.dataset.slide),id:el.getAttribute('aria-labelledby'),title:title(el)}))};
  }
  function restart() {
    window.SaneMedia?.reset();
    slides.forEach(section=>{
      if(section.dataset.sceneSteps)setScene(section,0);
      if(section.querySelector('[data-build]'))selectBuild(section,0);
    });
    timelineStep=0;renderTimeline();catalogGraph=false;renderCatalog();selectSlide(1);
  }
  function resetCurrent() {
    const section=slides.get(currentSlide);
    if(section.dataset.sceneSteps)setScene(section,0);
    else if(section.classList.contains('lifecycle')){timelineStep=0;renderTimeline();}
    else if(section.classList.contains('catalog-slide')){catalogGraph=false;renderCatalog();}
    else if(section.querySelector('[data-build]'))selectBuild(section,0);
  }
  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function syncFullscreen() {
    const active = Boolean(fullscreenElement());
    document.body.classList.toggle('fullscreen-mode', active);
    document.body.classList.remove('fullscreen-controls');
    document.getElementById('toggle-fullscreen').textContent = active ? 'Exit fullscreen' : 'Fullscreen';
    fitStage();
    if(document.getElementById('fullscreen-entry-prompt'))document.getElementById('fullscreen-entry-prompt').hidden=true;
    document.dispatchEvent(new CustomEvent('deck:fullscreen'));
  }
  async function toggleFullscreen({fromPresenter=false}={}) {
    try {
      if(fullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit.call(document);
      } else {
        const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
        if(!request)throw new Error('Fullscreen unavailable');
        await request.call(document.documentElement);
      }
      syncFullscreen();
      return true;
    } catch (_) {
      if(fromPresenter) { document.getElementById("fullscreen-entry-prompt").hidden=false; return false; }
      const message=document.getElementById('runtime-message');
      message.textContent='This browser cannot enter fullscreen. Swipe or use the navigation controls in the normal view.';
      message.hidden=false;setTimeout(()=>{message.hidden=true;},6500);
      return false;
    }
  }
  window.SaneDeck = {selectSlide,setScene,navigate,getState,restart,resetCurrent,fitStage,toggleFullscreen};
  createLibraryMap();
  document.querySelectorAll("[data-select-build]").forEach(button => {
    button.addEventListener("click", () => selectBuild(button.closest("section"), Number(button.dataset.selectBuild)));
  });
  slides.forEach(section => { if (section.querySelector("[data-build]")) selectBuild(section, 0); });
  document.getElementById("catalog-toggle").addEventListener("click", () => { catalogGraph = !catalogGraph; renderCatalog(); });
  renderTimeline();
  fitStage();
  showSlide(slides.has(Number(location.hash.slice(1))) ? Number(location.hash.slice(1)) : 1);

  window.addEventListener("resize", fitStage);
  window.visualViewport?.addEventListener("resize", fitStage);
  if (window.ResizeObserver) new window.ResizeObserver(fitStage).observe(document.getElementById("deck-controls"));
  window.addEventListener("hashchange", () => {
    const number = Number(location.hash.slice(1));
    if (slides.has(number)) showSlide(number);
  });
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("webkitfullscreenchange", syncFullscreen);
  document.getElementById("previous-slide").addEventListener("click", () => navigate(-1));
  document.getElementById("next-slide").addEventListener("click", () => navigate(1));
  document.getElementById("timeline-next").addEventListener("click", () => {
    if (timelineStep < 4) { timelineStep++; renderTimeline(); }
  });
  document.getElementById("timeline-reset").addEventListener("click", () => { timelineStep = 0; renderTimeline(); });
  document.getElementById("toggle-notes")?.addEventListener("click", toggleNotes);
  document.getElementById("close-notes")?.addEventListener("click", () => notesDialog.close());
  document.getElementById("toggle-fullscreen").addEventListener("click", toggleFullscreen);
  document.addEventListener("keydown", event => {
    if (document.querySelector("dialog[open]") || /INPUT|SELECT|TEXTAREA|BUTTON|VIDEO/.test(event.target?.tagName) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); navigate(1); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); navigate(-1); }
    else if (event.key === "Home") selectSlide(slideNumbers[0]);
    else if (event.key === "End") selectSlide(slideNumbers.at(-1));
    else if (event.key.toLowerCase() === "r") {
      const section = slides.get(currentSlide);
      if (section.dataset.sceneSteps) setScene(section, 0);
      else if (section.classList.contains("lifecycle")) { timelineStep = 0; renderTimeline(); }
      else if (section.classList.contains("catalog-slide")) { catalogGraph = false; renderCatalog(); }
      else if (section.querySelector("[data-build]")) selectBuild(section, 0);
    }
    else if (event.key.toLowerCase() === "n" && !document.body.classList.contains("audience-mode")) toggleNotes();
    else if (event.key.toLowerCase() === "f") toggleFullscreen();
  });
})();
