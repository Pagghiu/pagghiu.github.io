---
title: Perchè mai dovremmo sviluppare un'api alla Node.js in C++?
category: dev
hidden: true
tags: [C++, C++11, Node.js]
excerpt_separator: <!--more-->
gallery:
  - url: /assets/images/2016-05-14/Single App.jpg
    image_path: /assets/images/2016-05-14/Single App.jpg
    alt: "Single App"
    title: "Single App"
  - url: /assets/images/2016-05-14/Single App Dependencies.jpg
    image_path: /assets/images/2016-05-14/Single App.jpg
    alt: "Single App Dependencies"
    title: "Single App Dependencies"
  - url: /assets/images/2016-05-14/Single Exe.jpg
    image_path: /assets/images/2016-05-14/Single Exe.jpg
    alt: "Single Exe"
    title: "Single Exe"
  - url: /assets/images/2016-05-14/Single Exe Dependencies.jpg
    image_path: /assets/images/2016-05-14/Single Exe Dependencies.jpg
    alt: "Single Exe Dependencies"
    title: "Single Exe Dependencies"
  - url: /assets/images/2016-05-14/Single ELF.jpg
    image_path: /assets/images/2016-05-14/Single ELF.jpg
    alt: "Single ELF"
    title: "Single ELF"
  - url: /assets/images/2016-05-14/Single ELF Dependencies.jpg
    image_path: /assets/images/2016-05-14/Single ELF Dependencies.jpg
    alt: "Single ELF Dependencies"
    title: "Single ELF Dependencies"
---

In questo articolo analizzo il percorso che ha portato nel 2013 alla definizione dello stack tecnologico  dell'azienda per la quale lavoro, portandoci a reimplementare le API di Node.js in C++.

<!--more-->

**--it:**  This article is :us:[available in another language]({{ site.baseurl }}{% post_url 2016-05-14-A-Node-Like-Api-for-C++-en %}):gb: .
{: .notice--primary}

{% include toc title="Table of Contents" icon="file-text" %}

## Nota Introduttiva

Se trovate interessante il contenuto di questo articolo, date un'occhiata al sito web della mia azienda...stiamo assumendo! 
<figure>
	<a href="https://www.recognitionrobotics.com/careers" target="_new"><img src="https://recognitionrobotics.com/wp-content/uploads/2015/09/rob_logo-icon.png"></a>
	<figcaption><a href="https://recognitionrobotics.com/careers" title="recognitionrobotics.com/careers">recognitionrobotics.com/careers</a></figcaption>
</figure>

## Alla ricerca dello strumento giusto

Nel 2013 mi sono trovato a dover ri-pensare come gestire lo stack tecnologico di alcuni prodotti della mia azienda.
Il mio campo è quello dell'automazione e della visione per robotica industriale. Creiamo software ed hardware che usa tecniche di analisi immagine per misurare o ispezionare oggetti su linee automatiche e guidare i robot nelle loro lavorazioni sulle line automatiche.


Creiamo software che permettono ai robot di fare questo tipo di cose (e molto altro):
<br><br><br>
<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/UrQcbeuGPlU?controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
<br>
<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/AwXJ0MW7zaM?controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
<br><br>

I vincoli che ci siamo posti per questo stack sono stati:

1) Multi Piattaforma, non pensando solo alla triade win/linux/osx ma anche ad altri OS sconosciuti ai più, del tipo domain-specific (Realtime etc/)
2) Veloce ed efficiente
3) Capace di accedere alle risorse del sistema operativo in modo semplice, in quanto spesso dobbiamo usare driver/sdk di terzi per accedere a dispositivi hardware di vario tipo (camere,PLC,attuatori etc.)
4) Semplice e Compatto, con un basso numero di righe di codice
5) Codice sia studiabile da un coder c++ di medio livello
6) In grado di usare molti protocolli di rete in parallelo mantenendo il codice semplice
7) Indipendente dalla interfaccia utente, ma facilmente integrabile. Che permetta di creare applicazioni desktop oppure web-app condividendo la maggior parte del codice "dietro le quinte"
8) Che permettesse di fare debug del software fino alle chiamate kernel

I primi quattro requisiti rendono i linguaggi nativi (stile C/C++/Rust) più convenienti rispetto a quelli basati su jit/ bytecode (Java/C#/JS).
Il requisito 7 invece era quello che suggeriva di evitare di legarsi mani e piedi ad una liberia/tecnologia che dettasse anche l'interfaccia utente (ad esempio Qt o wxWidgets). La ragione era che nella visione dell'azienda c'era quella di creare sia prodotti che fossero classiche applicazioni desktop che altri più simili a web/browser app.
L'idea era quella di poter riutilizzare la maggior parte del codice "backend" senza doverlo riscrivere, ovvero di trovare il sacro-graal del riutilizzo del codice muovendosi di piattaforma in piattaforma (desktop, server, mobile, iot etc.).

### C#/NET
La tecnologia C# basata su Mono (xamarin) era stata la nostra precedente scelta ma non ci ha mai soddisfatto pianamente. Le ragioni meriterebbero un articolo dedicato, ma erano principalmente legate a innumerevoli bug del runtime di mono e problemi nelle perfomance, ed altri problemi nel debugging di pezzi di applicazione che erano necessariamente scritte in C/C++.
Probabilmente con l'apertura del codice di .net e l'acquisizione di xamarin la situazione è oggi migliore di quanto non lo fosse nel 2013.
Personalmente apprezzo il linguaggio C# e la sua libreria standard ma abbiamo deciso di andare avanti e valutare altre soluzioni

### Javascript (Node.js)
Abbiamo provato a studiare le tecnologie disponibili rimanendo molto colpiti dall'accoppiata Javascript e Node.js. Stranamente, pur essendo basato su un linguaggio non nativo abbiamo visto che era usato per scrivere sempre più progetti in ambito embedded e  robotica / automazione.
Node.js ha delle grandi capacità di rete, è semplice e compatto, abbastanza veloce, e non è accoppiato ad alcuna interfaccia utente e si integra abbastanza facilemnte con API C/C++. 
Risolve in modo intelligente il problema della concorrenza sulle operazioni di I/O con l'utilizzo di un event loop al posto dei thread, rendendo molto difficile soffire di problemi legati a race conditions etc.
Il suo utilizzo principe è quello di creare ovviamente web-app, usando javascript partendo dal server ed arrivando al browser.
Si possono però anche scrivere applicazioni desktop, usando alcuni fantastici progetti come Electron (oggi) e Node-Webkit (che esisteva già nel 2013). Altre community lo usano per fare automazione/script di sistema.
Il fatto che fosse un linguaggio dinamico ci preoccupava dato il nostro background saldamente static typed, però avavamo giocato abbastanza con Typescript per poter essere confidenti che c'era una soluzione a quel problema.
Prima di prendere decisioni definitive abbiamo tuttavia approfondito il funzionamento all'interno della tecnologia.
I pezzi di tecnologia più interessanti erano scritti in C (libuv) e c++ (V8).
Quest'ultimo in particolare è un progetto veramente troppo grande per noi da poter comprendere (ricordiamo il requisito 4.!).
Inoltre alcune piattaforme mobili non autorizzano l'uso di linguaggi basati su jit come js (v8) e avevamo alcuni progetti che prevedevano di lavorare su queste piattaforme.

### Scegliere lo strumento giusto
Tutto i nostri test e la nostra esperienza ci hanno portato a cercare qualcosa che fosse semplice, veloce, compatto e disponibile su tante piattaforme ma che avesse una grandiosa libreria come .NET e capacità di gestione semplice della rete/concorrenza come in Node.js.
Riflettendoci a fondo abbiamo iniziato a sperimentare uno stile di scrittura del C++ che fosse veramente ad "alto" livello e ci siamo resiconto che la maggior parte dei problemi sono sostanzialemente la mancanza di una libreria standard moderna.
Il ++ non ha una libreria standard comparabile a quella dei framework/runtime che accompagnano Java/C#/Node.JS ed altri grandi ecosistemi. In C++ non c'e supporto nella libreria stndard per compiti come la gestione della rete (multipiattaforma) o le interfacce utente. Solo recentemente, gli ultimissimi standard (C++ 17/ C++ 20) stanno cercando di migliorare la situazione in questi campi.
Si possono trovare molte librei non standard focalizzate a risolvere un problema specifico in modo molto efficiente. Dall'altro lato si possono trovare framework abnormi che spesso impongono un "prendi tutto o rinuncia" in quanto cercano di risolvere ogni possibile problema e caso d'uso.
I problemi cominciano qundi quando si voglion usare varie librerie insieme:
- Mancanza di un package manager multi piattaforma largamente utilizzato con una buona base di utilizzatori (stile npm per in js o cargo in Rust per intenderci)
- Tempi di compilazione infiniti
- Build system che diventano più complicati dei software stessi che devono compilare
- Incompatibilità tra tipi/oggetti similari (esempio stringhe/vettori std::string, folly::fbstring, QString). Troppi  progetti ridefiniscono i tipi base per le stringhe, i vettori, le mappe etc.

Non abbiamo visto ragioni teoriche per le quali non si potessero esprimere gli stessi concetti di usati in tutte queste librerie C#/JS, ri-adattandole al C++ e mantenendo il tutto abbastanza semplice.

### Costruzione di un'architettura

La nostra missione diventa quindi:

1. Creare una libreria con potente capacità di rete simile a Node.js ma in c++
2. Utilizzare RAII e la semantica valore per la maggior parte degli oggetti, ricorrendo al reference counting solo quando necessario. L'utilizzo manuale della memoria è vietato con alcune eccezioni limitate (sempre per buone ragioni)
3. Usare lo static e strong typing ovunque possibile. Ho visto altri progetti su github the provavano a fare qualcosa di simile ma cercando di replicare anche l'aspetto di linguaggi dinamici in C++ e probabilemente questa non è la cosa più efficiente o facile da usare che si potesse pensare
4. Prestare attenzione ai tempi di compilazione
5. Usare (poche) librerie open source che siano semplici, focalizzate su un aspetto, idealmente [stile stb](https://github.com/nothings/stb)
6. Usare una libraria di interfaccia utente cross platform che fosse semplice e veloce per applicaizoni desktop
7. Permettere alle applicazioni desktop th essere accessibili da rete/web o remotabili in generale

Soluzioni:

1. Abbiamo usato le librerie alla base di node esclusa V8 (libuv e zlib) e studiare il codice di Node.js. Ho anche scritto dei test che ricalcano alcuni test ufficiali di node 4.x
2. Abbiamo usato il "quasi-moderno" c++, ovvero smart-pointers con ref-counting e lambda e delegati cum grano salis. I riferimenti ciclici tra oggetti sono risolti manualmente (per ora), ma ci sono piani per provare il fantastico [Herb Sutter Deferred Heaps](https://github.com/hsutter/gcpp).
3. Non abbiamo ceduto alla tentazione di usare troppa type erasure, e abbiamo sfruttato la semantica di valore del C++ ogni volta che fosse possibile
4. Abbiamo usato molto unity build
5. Abbiamo effettuato un rigoroso auditing delle librerie di rezi, provandole e scartando quelle che non soddisfano i requisiti di semplicitá/compattezza/non-header-only.
6. Abbiamo usato la libreria open source priva di dipendenze dear IMGUI
7. Abbiamo implementato una interfaccia websocket che invia direttamente i triangoli generati da dear imgui al browser per poi renderizzarli con webGL

## Cosa abbiamo implementato di Node.js

Sono stati implementati un buon numero di moduli, esclusi quelli che non hanno senso in C++ ed alcuni che non erano necessari per i nostri progetti (ad oggi):

Esclusioni:

- Cluster
- Crypto
- Debugger
- Domain
- Punycode
- Readline
- Repl
- TLS/SSL
- Utilities
- V8
- VM

I moduli http non hanno la gestione agent e childprocess non crea il canale di comunicazione tra processi padre/figli.
Le classi stream sono state convertite uno a uno dall'implementazione node.js (release 4.x)

Alcuni altri moduli di uso abbastanza comune che abbiamo sviluppato

- Websockets (client e server)
- Client di redis
- Astrazione asincrona non bloccante di SQLite, sulla scia di [https://www.npmjs.com/package/sqlite3](https://www.npmjs.com/package/sqlite3)

## Benchmarking

Lo stack http non è stato mai testato con migliaia di connessioni, quindi non abbiamo dati da mostrare per comparare con lo  Node.js in termini di velocità e consumo memoria. Il nostro obiettivo non è di creare una nuova libreria server per competere nel campo web/cloud, ma più di poter sfruttare capacità di rete in campo embedded senza le complicazioni tipice del codice multi-thread.
Pensiamo che se un giorno fosse necessario, spendendo un po' di tempo in profiling, potremmo ottenere dei buoni risultati in questo senso.

## Dipendenze e eseguibili portabili

Tutte le librerie dipendenti sono incluse come sorgenti all'interno dell'eseguibile, quindi tipicamente i programmi compilati sono dei singoli .exe (windows) o .app (macOS) o eseguibili ELF (linux) che è possibile avviare senza necessità di installare nulla sulla computer target.
A volte effettuiamo anche il link statico alcune librerie standard ed il memory manager a costo di avere un eseguibile più grande per evitare di dover redistribuire runtime come vcredist.exe su windows, ma probabilemente ognuno ha una opinione diversa sull'argomento.

### Moduli

Il sogno segreto di ogni coder è di riutilizzare codice.
Ci sono molti approcci per farlo e quello che ci è sembrato migliore è la suddivisione in "moduli" che ho visto usata in modo sistematico nel framework open source [JUCE framework](https://www.juce.com).
Un modulo non è altro che un insieme di file .cpp e .h che seguono certe regole.

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Modules.jpg"><img src="{{ site.url }}/assets/images/2016-05-14/Modules.jpg"></a>
	<figcaption>Il sistema di riutilizzo del codice basato su moduli. Chi ha bisogno del C++ 20? :)</figcaption>
</figure>
<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Modules.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Modules.gif"></a>
	<figcaption>Un veloce giro della struttura directory di alcuni dei nostri moduli</figcaption>
</figure>

- Ogni modulo ha una sua directory
- Il modulo definisce un .h e un .cpp che hanno lo stesso nome del modulo è che sono l'interfaccia pubblica di utilizzo del modulo stesso
- Se il modulo è complesso, includerà lui stesso gli altri file  necessari al suo funzionamento _usando percorsi relativi_ all'interno della sua directory, aggiungendo delle #include nei file .h e .cpp pubblici
- I moduli possono dipendere da altri moduli se necessario, ma cercando di evitare dipendenze cicliche. Se ci sono dipendenze cicliche tra moduli, bisogna spezzarle dividendolo in altri moduli.
- Se ci sono delle dipendenze da librerie di terzi, esse dovrebbero essere possibilmente incluse in forma sorgente e i rispettivi .h e .cpp inclusi fisicamente dentro i file .h e .cpp pubblici.
- Quando bisogna usare degli SDK terzi preferibilmente bisogna cercare di includere solo gli header ed usare dynamic loading delle .dll o .so o .dylib (usando GetProcAddress, dlsym, etc.)
- Quando l'utilizzo di un sdk disponibile solo binario/pre-compilato è inevitabile allora cercare di limitarlo ad un singolo modulo
- Se possibile, evitare di includere gli header di terzi all'interno degli header pubblici

Un esempio di header e sorgente pubblico per un modulo chiamato rrKernel:
```cpp
//-------------------------------------------------------------------------------------
// Name:        rrKernel.h
// Purpose:     Public include file for rrKernel module
// Author:      Stefano Cristiano <....>
// Created:     2014/01/08
// Copyright:   Recognition Robotics S.r.l.
//-------------------------------------------------------------------------------------
#ifndef __rrKernel__module__included__
#define __rrKernel__module__included__

#define RR_KERNEL_VERSION "1.0.0.0"

#include <rrCore/rrCore.h>

//namespace rrNode.kernel
#include "sources/kernelState.h"
#include "sources/kernelPath.h"
#include "sources/kernelData.h"
#include "sources/kernelReference.h"
#include "sources/kernelMessage.h"
#include "sources/kernelLibrary.h"
#include "sources/kernelReplication.h"
#include "sources/kernelLibraryBinaryResolver.h"  //needed for library.resolver


#endif
```

```cpp
//-------------------------------------------------------------------------------------
// Name:        rrKernel.cpp
// Purpose:     Public source file for rrKernel module
// Author:      Stefano Cristiano <....>
// Created:     2014/01/08
// Copyright:   Recognition Robotics S.r.l.
//-------------------------------------------------------------------------------------

#include "rrKernel.h"

// namespace rrNode.kernel
#include "sources/kernelPrivate.h"
#include "sources/kernelReference.cpp"
#include "sources/kernelPath.cpp"
#include "sources/kernelState.cpp"
#include "sources/kernelReplication.cpp"
#include "sources/kernelLibrary.cpp"
```

### Sistema di Build Semplice

Creare un nuovo progetto con la struttura a moduli è molto semplice
Seguendo le regolette che ci siamo dati non abbiamo bisogno di linkare librerie esterne o di aggiungere percorsi esterni degli header.
Un altro vantaggio è la velocità nel prepare un nuovo PC di sviluppo: basta semplicemente clonare il repository di git (o di qualunque altro SCM sia di gradimento) e cominciare.
Nella maggior parte dei casi si potrebbe aggiugnere manualmente i file .cpp pubblici necessari al proprio progetto nel proprio IDE o sistema di build pre-esistente.
Il numero di files da aggiungere è uguale al numero di moduli che sono enormemente di meno del numero totale di files di un progetto.
Inoltre il 90% del tempo si agganciano nuovi file ai moduli esistenti,aggiungendo le relative #include nel file .h pubblico e .cpp pubblico, rendendo non necessario dover modificare alcun file di build.

Personalmente al momento sto usando il software di JUCE (chiamato Introjucer, sostituito dal recente Projucer) che genera a partire da dei semplici file di definizione dei moduli, i files di progetto nativi per tutti i maggiori IDE (Xcode, VStudio) e non (makefile etc.).

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Introjucer.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Introjucer.jpg"></a>
	<figcaption>Introjucer (recentemente rimpiazato da Projucer), un software che genera i file degli ide e di compilazione nativi della piattaforma (parte della libreria JUCE)</figcaption>
</figure>

In parallelo manteniamo alcuni file di qmake principalmente per gestire alcune casistiche di cross-compile su ARM usando Qt-Creator.

In entrambi i casi i files di build sono estremamente semplici e veloci da aggiornare.

Ecco un esempio di definizione modulo:
```json
{
  "id":             "rrSpreadsheet",
  "name":           "Recognition Robotics Software for creating a Spreadsheet",
  "version":        "1.0.0",
  "description":    "Recognition Robotics Software for creating a Spreadsheet",
  "website":        "http://www.recognitionrobotics.com",
  "license":        "No License. Software under copyright. Any usage is not allowed",
  "dependencies":   [],
  "include":        "rrSpreadsheet.h",
  "compile":        [{ "file": "rrSpreadsheet.cpp"},
                      { "file": "rrSpreadsheet_externals.c"}],
  "browse":         [ "sources/*",
                      "external/tinyexpr/tinyexpr.c",
                      "external/tinyexpr/tinyexpr.h" ]
}
```

E un esempio del relativo file qmake:
```
HEADERS += $$PWD/rrSpreadsheet.h
SOURCES += $$PWD/rrSpreadsheet.cpp
SOURCES += $$PWD/rrSpreadsheet_externals.c
```
Il [nuovo formato moduli](https://github.com/julianstorer/JUCE/blob/master/modules/JUCE%20Module%20Format.txt) di JUCE usato da Projucer è persino più semplice, perchè si possono specificare alcune direttive dentro il file header come normalissimi commenti c++ e usa una convenzione sui nomi dei file che li include automaticamente nel modo sensato.

Il file header pubblico del modulo rrKernel di sopra diventa:

```cpp
//-------------------------------------------------------------------------------------
// Name:        rrKernel.h
// Purpose:     Public include file for rrKernel module
// Author:      Stefano Cristiano <....>
// Created:     2014/01/08
// Copyright:   Recognition Robotics S.r.l.
//-------------------------------------------------------------------------------------
/**************************************************************************************

 BEGIN_JUCE_MODULE_DECLARATION

  ID:               rrKernel
  vendor:           rr
  version:          1.0.0
  name:             Recognition Robotics Software C++ Kernel Classes
  description:      Recognition Robotics Software C++ Kernel Classes.
  website:          http://www.recognitionrobotics.com
  license:          Software under copyright. Any usage from third parties is not allowed.

  dependencies:     rrCore
 END_JUCE_MODULE_DECLARATION

**************************************************************************************/

//...
```

### Tempi di compilazione e dipendenze

Uno degli argomenti principali a sfavore dell'utilizzo del C++ è il tempo di compilazione.
Non è inusuale avere tempi di compilazione di svariati minuti o addirittura ore per progetti molto complessi.
La ragione, oltre quella della normale complessità del software che si sta sviluppando, sta nella scarsa attenzione alle librerie usate dal progetto e nel fatto che non si presta attenzione ad ottimizzare il "build time".

Per ottenere un tempo di compilazione accettabile bisogna prestare attenzione alle seguenti cose:

- Evitare di usare librerie che hanno di loro tempi di compilazione molto lunghi o che causano tempi di compilazione lunghi (stile boost)
- Evitare di usare librerie enormi delle quali si sfruttano solo piccoli pezzi. Se la licenza lo permette meglio estrarre solo quello che serve
- Spostare il più possibile le implementazioni dagli header ai files .cpp. Idealmente nel file .h ci saranno solo le definizioni e i template (dove servono...).
- Includere gli header di sistema sempre solo nei file .cpp e mai nei .h pubblici
- Spostare nei files privati tutto quello che non ha senso sia pubblico
- Usare patterns tipo PIMPL / compilation firewall per minimizzare le dipedenze esposte negli header.


Uno dei principali vantaggi della struttura a "moduli" è che il singolo modulo impiega molto meno tempo a compilare rispetto a compilare singolarmente tutti i files .cpp da esso inclusi.
Questo schema è comunemente chiamato "Unity Build" ed è usato spesso proprio per ridurre i tempi di compilazione.
Il motivo è abbastanza semplice, a parità di tutto si compilano meno righe di codice in quanto gli header di sistema sono inclusi una sola volta per modulo invece che N volte dove N è il numero di files che compongono il modulo stesso. Si fa anche meno I/O e questo soprattutto sui dischi non SSD è abbastanza rilevante.

Alcuni benchmark sul tempo di compilazione:

Per un progetto non banalecon integrata tutta la libreria simil-node, con websocket, remoting, alcuni protocolli robot, la GUI e driver per alcune periferiche esterne abbiamo un totale di circa 80.000 righe di codice.
Usando l'approccio descritto i tempi di compilazione sono:

- Tempo di compilazione da clean: ~6-8 secondi
- Tempo di compilazione con piccole modifiche: ~ 1 secondo

Questi dati si riferisono ad una build di debug su XCode usando un Macbook pro retina 2012


<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Full Recompile.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Full Recompile.gif"></a>
	<figcaption>XCode ci mette circa 7 secondi per fare una ricompilazione da zero di un progetto di 80.000 righe di codice su un Macbook pro 2012</figcaption>
</figure>
<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Partial Recompile.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Partial Recompile.gif"></a>
	<figcaption>XCode impiega circa 1 secondo a fare una ricompilazione parziale di un progetto di 80.000 righe di codice su un Macbook pro 2012</figcaption>
</figure>

## Interfaccia Utente

<figure class="third">
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana MacOS.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana MacOS.jpg"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana Windows.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana Windows.jpg"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana Linux.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana Linux.jpg"></a>
	<figcaption>Il bello di essere multi piattaforma</figcaption>
</figure>

Per l'interfaccia utente abbiamo investito molto su una libreria chiamata dear IMGUI (della quale siamo backers/supporters e suggeriamo a tutti di fare lo stesso). Questa libreria è semplicemente fantastica. L'autore non è sempre è daccordo con il nostro approccio di usarla come libreria general purpose per le interfacce utente, ma in tutti i prodotti fatti fin'ora l'impressione che ci siamo fatti è che funzioni estremamente bene :)
Per chi non lo conoscesse, il pattern imgui per la creazione di interfacce utente consiste nel generare la grafica per i controlli utente con approccio in parte procedurale minimizzando i cambi di stato al posto dei classici approcci orientati agli oggetti.
Questo argomento sicuramente merita un articolo più di dettaglio (che potrebbe arrivare in futuro), ma concettualmente invece di creare un grafo ad oggetti che descriva l'interfaccia utente e tutte le relazioni padre/figlio tra i vari controlli, bisogna chiamare le funzioni all'interno del namespace ImGui.
Queste funzioni generano al volo, o "immediatamente" la grafica per quel particolare controllo di interfaccia utente, sulla base dei parametri in input. È per questo motivo che prende il nome di "immediate mode" user interface.
Infine essi modificano i dati dell'applicazione al volo, quindi non c'è necessità di mantenere due copie dei dati da convertire tra il vostro formato e quello compreso dal framework di interfaccia utente (questo vale per stringhe, numeri, liste, strutture personalizzate etc).

Una cosa che abbiamo fatto quasi subito è stata integrare tale libreria insieme all'event loop che gestisce l'I/O simil Node.js.
L'interfaccia utente viene ridisegnata ogni volta che c'è input da parte dell'utente (mouse/tastiera etc.) oppure quando arriva qualche messaggio asincrono (messaggio di rete, file letto da disco etc.).

In questo modo a differenza dei tipici schemi di utilizzo nei quali questa libreria viene inclusa nei videogiochi 3D, la GUI è ridisegnata solo quando è necessario, lasciando quindi la CPU a 0% di utilizzo in assenza di input o di eventi esterni.
Questo è molto importante per noi in quanto spesso ci capita di usare questo framework su sistemi embedded.

Pro:
	- Multi piattaforma per definizione, può essere usata ovunque si ha a disposizione un compulatore C++
    - Molto veloce da integrare grazie alla missione "Bloat-Free Zero Dependency"
    - Molto efficiente 
    - Rende il codice di interazione UI / Modello estramente semplice in quanto basta ridisegnare tutta la UI quando cambia qualcosa
    - Semplice da personalizzare, si possono cambiare i colori e font/caratteri predefiniti molto facilemtne
    - Aiuta a sviluppare l'abitudine di mantenere il proprio codice dell'applicazione e modello logico, separato dalla interfaccia utente
    - La libreria è cosí semplice che viene distribuita in 2 files. Molti coder di livello medio possono capire dove mettere il naso quando c'è un problema, differentemente da quanto accade se si usano framework complessi.
    - Può funzionare in modalità headles, senza una interfaccia desktop o una scheda grafica, in quanto si possono trasmettere i triangoli generati dalla libreria via rete!

Contro: 
    - L'aspetto dei controlli non è nativo sulle varie piattaforme
    - Necessita di lavoro di personalizzazione per migliorare i temi predefiniti
    - Non c'è un modo semplice per fare animazioni (possono essere fatte ma si è lasciati a se stessi, non ci sono supporti ufficiali nella librerie)
    - Task del tipo caricare e mostrare immagini sono a carico dell'utilizzatore in quanto fuori dal perimetro della libreria (ed è un'ottima cosa secondo me...forse bisognerebbe muovere questo elemento tra i Pro :-)

### Remotazione dell'interfaccia utente

Questo tipo di interfaccia utente "personalizzata" si presta molto facilmente ad essere remotata su dispositivi in rete, in quanto alla fine è una lista di triangoli e texture da disegnare ogni frame. Con un po' di ingegno abbiamo implementato alcuni protocolli remoti che ci permettono di vedere queste interfacce utente all'interno di tutti i browser più utilizzati, anche in multi-utenza.

Abbiamo anche creato alcuni viewer compatti in singolo file eseguibile che riescono a collegarsi a queste porte remote e disegnare il contenuto dell'interfaccia utente remota sul computer locale, senza avere la necessità di usare un browser.

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/UIRemoting.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/UIRemoting.gif"></a>
	<figcaption> Remoting dell'interfaccia utente usando webgl su 5 diversi browser (Chrome, Firefox, Safari, IE) oltre alla vera applcazione nativa che gira su una virtual machine windows all'interno di host macOS</figcaption>
</figure>

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/SensorBrowserResize.mp4" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/SensorBrowserResize.jpg"></a>
	<figcaption> Software di remotazione personalizzato che ridimensiona la finestra (virtuale) di un software che gira su un host remoto (clicca per avviare il video)</figcaption>
</figure>

### Integrazione con altri framework per interfacce utente

Prima della scelta di usare dear IMGUI, abbiamo usato Qt per le interfacce utente.
Non siamo mai stati particolarmente felici della natura LGPL / Commerciale di questa libreria, dell'eccessiva complessità (bloat) necessaria per semplici applicazioni, delle difficoltà per capire le .dll da ridistribuire quando non si vuole usare lo static linking (windeployqt non funziona molto bene nella mia esperienza) e alcune noie varie minori.
Ciò detto, Qt è ancora la nostra libreria preferita se si escludono le imgui o se per alcuni ragioni, le limitazioni intrinseche dell'approccio imgui dovessero essere preponderanti in qualche progetto.

Per esempio se volessimo fare qualche software che sia più integrato sul look e feel delle piattaforme o se volessimo usare animazioni con QtQuick, probabilmente Qt sarebbe una scelta migliore.

Poter mantenere lo stesso codice backend / logico tra le varie soluzioni, indipendentemente dalla libreria di interfaccia utente usata rende questa scelta facile e facilmente reversibile se in futuro cambiassero dei vincoli di progetto.


<figure class="third">
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration1.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration1.png"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration2.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration2.png"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration3.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration3.png"></a>
	<figcaption>UNo screenshot di una utility che utiliza la libreria asincrona di rete simil node.js su QtQuick</figcaption>
</figure>

## Dove posso ottenere questo codice?

Da nessuna parte, sfortunatamente il modello di business della mia azienda non è quello di vendere librerie o di fare open-source, quindi questa libreria rimarrà proprietaria e closed-source.

## Codice estratto dalla nostra test-suite

**Note:**  Tutti gli esempi soffrono di problemi di innestamento eccessivo delle callback (callback hell) ma il codice di produzione fa un uso saggio dei delegati e puntatori a funzioni membro per prendere il codice molto più leggibile di quanto non sia qui sotto.
{: .notice--warning}

### Test http

Codice Node

```js
'use strict';
var common = require('../common');
var assert = require('assert');
var http = require('http');
var msg = 'Hello';
var readable_event = false;
var end_event = false;
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(msg);
}).listen(common.PORT, function() {
  http.get({port: common.PORT}, function(res) {
    var data = '';
    res.on('readable', function() {
      console.log('readable event');
      readable_event = true;
      data += res.read();
    });
    res.on('end', function() {
      console.log('end event');
      end_event = true;
      assert.strictEqual(msg, data);
      server.close();
    });
  });
});

process.on('exit', function() {
  assert(readable_event);
  assert(end_event);
});
```


Codice C++
```cpp
#include "AppConfig.h"
#include "modules/rrCore/rrCore.h"
#include "modules/rrNode/rrNode.h"

namespace rrNode { namespace test { struct stream2HttpClientResponseEnd; } }

struct rrNode::test::stream2HttpClientResponseEnd : public testing::unit
{
    stream2HttpClientResponseEnd() :  unit("test-stream2-httpclient-response-end"){}

    bool readable_event = false;
    bool end_event = false;
    string msg = "Hello";
    string data;
    
    virtual void run() override
    {
        begin("default");
        {
            loop mainLoop;
            auto server = http::createServer([=](http::Server::data data)
            {
                data.response.writeHead(200, arr$("Content-Type", "text/plani"));
                data.response.end(msg);
            }).listen(COMMON_PORT);
            server->onListening += [=]()mutable
            {
                http::GET(COMMON_PORT, [=](http::IncomingMessage res)mutable
                {
                    res->onReadable += [=]()mutable
                    {
                        console::log("readable event");
                        readable_event = true;
                        data += res.read().view();
                    };
                    res->onEnd += [=]()mutable
                    {
                        console::log("end event");
                        end_event = true;
                        expectEquals(msg, data, "Received data is uncorrect");
                        server.close();
                    };
                });
            };
        }
        expect(readable_event, "Readable event has not fired");
        expect(end_event, "End event has not fired");
        end();
    }
};
```

### Test di file server http

Uno static file web server che usa gli stream alla node per rendere disponibili files su un browser remoto senza caricarli interamente in memoria

```cpp
namespace httpTests
{
using namespace rrNode;
struct httpWebServerExample
{
    static int run()
    {
        loop defaultLoop;
        auto server = http::Server::create();
        server->onRequest += bindFunLast(&httpWebServerExample::onRequest, server);
        server.listen(8097);
        logINFO("Webserver is running at http://127.0.0.1:8097...");
		int loopRes = defaultLoop.run();
        logINFO("Exiting main loop");
        return loopRes;
    }

    static void onRequest(http::Server::data data, http::Server server)
    {
        auto request  = data.request;
        auto response = data.response;

        string filePath = "./data/";
        logINFO("%s \"%s\" received! ", request.method(), request.url());
        if(request.url() == "/")
        {
            filePath += "index.html";
        }
        else
        {
            filePath += request.url();
        }
        
        if(request.method() == "GET")
        {        
            identifier extID(path::extname(filePath));
            auto response = data.response;
            auto fileReadStream = fs::createReadStream(filePath);
            if(mimeTypes()[extID].isUndefinedOrVoid())
                response.writeHead(200, arr$());
            else
                response.writeHead(200, arr$("Content-Type", mimeTypes()[extID].view()));
            fileReadStream->onError += [response, fileReadStream](error err) mutable
            {
                response.writeHead(404, arr$("Content-Type", "text/html"));
                response.end("<h1>File not found</h1>");
            };
            response->onUnpipe += bindMem(&fs::readStream::close, fileReadStream);
            fileReadStream->pipe(response.asWritable());
        }
        else
        {
            response.writeHead(405, arr$("Content-Type", "text/html"));
            response.end("<h1>Method not allowed</h1>");
        }
    }

    static var mimeTypes()
    {
       static var types = $o(
        "js",  "text/javascript",
        "css", "text/css",
        "gif", "image/gif",
        "htm", "text/html",
        "html", "text/html",
        "ico", "image/x-icon",
        "png", "image/png",
        "jpg", "image/jpeg",
        "jpeg", "image/jpeg",
        "bmp", "image/bmp",
        "woff", "application/x-font-woff"
        );
        return types;
    }
};
}
```

### Test di stream di file zip

Un altro esempio che crea degli stream alla node da file zip:

```cpp

namespace rrNode { namespace test { struct compressionZipTest; } }

struct rrNode::test::compressionZipTest : rrNode::testing::unit
{
    typedef compressionZipTest this_class;
    compressionZipTest() : unit("compression zip"){}
    
    string content;
    virtual void run() override
    {
        begin("validate zip file");
        {
            createContent(content, 500);
            fs::writeToFileSync("___TEST_500.TXT", content);
            createContent(content, 5000);
            fs::writeToFileSync("___TEST_5000.TXT", content);
            createContent(content, 10000);
            fs::writeToFileSync("___TEST_10000.TXT", content);
            addAllFilesToZipArchive("__TEST.ZIP");
            fs::removeFileSync("___TEST_500.TXT");
            fs::removeFileSync("___TEST_5000.TXT");
            fs::removeFileSync("___TEST_10000.TXT");
            extractFilesFromArchive("__TEST.ZIP");
            fs::removeFileSync("__TEST.ZIP");
            content.clear();
            fs::readFromFileSync("___TEST_500.TXT", &content);
            expect(validateContent(content, 500), "___TEST_500.TXT corrupted");
            content.clear();
            fs::readFromFileSync("___TEST_5000.TXT", &content);
            expect(validateContent(content, 5000), "___TEST_5000.TXT corrupted");
            content.clear();
            fs::readFromFileSync("___TEST_10000.TXT", &content);
            expect(validateContent(content, 10000), "___TEST_10000.TXT corrupted");
            fs::removeFileSync("___TEST_500.TXT");
            fs::removeFileSync("___TEST_5000.TXT");
            fs::removeFileSync("___TEST_10000.TXT");
        }
        end();
    }
    
    void addAllFilesToZipArchive(stringView archivePath)
    {
        typedef compression::zip::builder zipBuilder;
        zipBuilder archive;
        loop defaultLoop;
        
        auto destinationFile = archivePath;
        auto addToArchive = [&](stringView filename)
        {
            zipBuilder::entry e;
            e.compressionLevel  = stream::zlib::DEFAULT_COMPRESSION;
            e.fileModificationTime = absoluteTime::getCurrentTime();
            // Any readable stream would work
            e.streamToRead = fs::createReadStream(filename);
            e.storedPathName = path::basename(filename);
            archive.entries.push_back(e);
        };
        addToArchive("___TEST_500.TXT");
        addToArchive("___TEST_5000.TXT");
        addToArchive("___TEST_10000.TXT");

        auto destinationStream = fs::createWriteStream(destinationFile, "w");
        auto numFiles = archive.entries.size();
        archive.writeTo(destinationStream, [&](int progress)
        {
            logINFO("Written file %d of %d...", progress, numFiles);
        });
    }
    
    void extractFilesFromArchive(stringView archivePath)
    {
        typedef compression::zip::archive archive;
        archive arc;
        loop defaultLoop;
        fs::readStream::options opt;
        opt.autoClose = false;  // we must not autoclose otherwise all file
                                // entries become invalid
        opt.path = archivePath;
        auto archiveFS = fs::createReadStream(opt);
        archiveFS->pause();
        archiveFS->onOpen.once(bindMemLast(&archive::fromFsReadStream, &arc, archiveFS));
        arc.entriesReady += [&arc]()
        {
            for(auto& entry : arc)
            {
                logINFO(entry.filename);
                if (entry.compressedSize == 0)
                    continue; // directory entry

                // Let's create a reading stream from the archive
                auto r = arc.createStreamFromEntry(entry);

                // And a backing file to uncompress it
                auto w = fs::createWriteStream(entry.filename, "w");

                // Go uncompress!
                r->pipe(w);
            }
        };
    }

    template<typename StringType>
    static void createContent(StringType& content, int howManyLines)
    {
        content.clear();
        content << "LINE 1";
        for(int i = 2; i <= howManyLines; i++)
        {
            content << newLine << "LINE " << i;
        }
    }
    
    static bool validateContent(string& content, int howManyLines)
    {
        stringSplitter s = content.splitOnString(newLine);
        int curr =  1;
        do
        {
            stringView sv = s.next();
            stringBuffer10 test;
            test << "LINE " << curr;
            if(sv != test)
                break;
            curr++;
        }while(curr < howManyLines + 2);
        return curr - 1 == howManyLines;
    }
};

```
### Test di stream personalizzato

Un piccolo test per implementare un read/write stream personalizzato:

```cpp

namespace rrNode { namespace test { struct streamTest; } }

struct rrNode::test::streamTest :   public rrNode::testing::unit,
                                    public rrNode::stream::readable,
                                    public rrNode::stream::writable
{
    RR_LOG_DECLARE;
    typedef streamTest this_class;
public:
    referenceCounter references;
    streamTest() :  unit("stream"),
                    readable(references), writable(references),
                    reader(*this), writer(*this)
    {
        references.increment(); // we don't want to be destroyed by the smart pointers
    }
        
    ~streamTest()
    {
        references.decrement();
    }
        
    virtual void run() override
    {
        using namespace rrNode;
        begin("pipe");
        {
            runPipeTest();
        }
        writable::end();
    }

    readable& reader;
    writable& writer;
    int writeCalled;
    int readCalled;
    int onEndCalled;
    int onPipeCalled;
    int onUnpipeCalled;
    void runPipeTest()
    {
        onEndCalled = 0;
        writeCalled = 0;
        readCalled = 0;
        onPipeCalled = 0;
        onUnpipeCalled = 0;
        loop defaultLoop;

        auto onPipe     = writer.onPipe  += [this](readable*)  { onPipeCalled++;    };
        auto onUnpipe   = writer.onUnpipe+= [this](readable*)  { onUnpipeCalled++;  };;
        auto onEnd      = reader.onEnd   += [this]             { onEndCalled++;     };;
        reader.pipe(&writer);

        defaultLoop.run();

        writer.onPipe   -= onPipe;
        writer.onUnpipe -= onUnpipe;
        reader.onEnd    -= onEnd;

        expect(reader.onData.isEmpty(),    "reader.onData.isEmpty()");
        expect(reader.onClose.isEmpty(),   "reader.onClose.isEmpty()");
        expect(reader.onEnd.isEmpty(),     "reader.onEnd.isEmpty()");
        expect(reader.onError.isEmpty(),   "reader.onError.isEmpty()");
        expect(reader.onPause.isEmpty(),   "reader.onPause.isEmpty()");
        expect(reader.onReadable.isEmpty(),"reader.onReadable.isEmpty()");
        expect(reader.onResume.isEmpty(),  "reader.onResume.isEmpty()");
            
        expect(writer.onClose.isEmpty(),   "writer.onClose.isEmpty()");
        expect(writer.onDrain.isEmpty(),   "writer.onDrain.isEmpty()");
        expect(writer.onError.isEmpty(),   "writer.onError.isEmpty()");
        expect(writer.onFinish.isEmpty(),  "writer.onFinish.isEmpty()");
        expect(writer.onPipe.isEmpty(),    "writer.onPipe.isEmpty()");
        expect(writer.onPrefinish.isEmpty(),"writer.onPrefinish.isEmpty()");
        expect(writer.onUnpipe.isEmpty(),  "writer.onUnpipe.isEmpty()");
        expectEquals(readCalled, 3, "Read callback has not been called");
        expectEquals(writeCalled, 2, "Write callback has not been called");
        expectEquals(onEndCalled, 1, "onEnd must be called only once");
        expectEquals(onPipeCalled, 1, "onPipe must be called only once");
        expectEquals(onUnpipeCalled, 1, "onUnpipe must be called only once");
    }
        
    void _read(int64 /*howmuch*/) override
    {
        if(readCalled++ > 1)
        {
            reader.push();
            return;
        }
        buffer b = buffer::create(6);
        if(readCalled==1)
            b.write("asdf");
        else
            b.write("second");
        reader.push(b);
    }
        
    void _write(buffer data, encoding::type /*encodingType*/, writable::WriteCb* cb) override
    {
        writeCalled++;
        stringBuffer10 ss;
        if(writeCalled == 1)
        {
            stringView sv=data.view(0, 4);
            expectEquals(sv, "asdf");
        }
        else
        {
            stringView sv=data.view(0, 6);
            expectEquals(sv, "second");
        }
        (*cb)();
    }
public:
	streamTest& operator=(const streamTest&);
	streamTest(const streamTest&);
};

RR_LOG_DEFINE(rrNode::test::streamTest);
TEST_REGISTER(rrNode::test, streamTest);
```

### Test sub-processi

Qui invece è come si possono usare e lanciare sub-processi:

```cpp
struct processExample
{
    static int run()
    {
        using namespace rrNode;
        loop defaultLoop;

        console::log("Process ID:      %d", process::pid);
        console::log("Process execPath:%s", process::execPath);
        console::log("Process cwd:     %s", process::cwd());

        int i = 0;
        if(process::argv[1] == "child")
        {
            while(i++ < 3)
            {
                console::log("[CHILD %d] ABCDEFGHILMOPQRSTUVZ", i);
            }
        }
        else
        {
            stringViewArray args;
            args.push_back("child");
            spawn(process::execPath, args);
            spawn(process::execPath, args);
            spawn(process::execPath, args);
            spawn(process::execPath, args);
            while(i++ < 3)
            {
                console::log("[MASTER %d] ZVUTSRQPOMLIHGFEDCBA", i);
            }
        }

        int loopRes = defaultLoop.run();
        logINFO("Exiting main loop");
        return loopRes;
    }
};
```

##Fine
Ci sarebbe molto altro da dire ma dopotutto questo non sarà l'ultimo articolo che scrivo!

