---
title: Why on earth are we developing a Node.js-like API in C++?
category: dev
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

I've been analyzing the path that has been shaping our technological stack back in 2013, leading us to re-create something close to the Node.js API in C++.

<!--more-->

**++it:**  Questo articolo è :it:[disponibile in italiano]({{ site.baseurl }}{% post_url 2016-05-14-A-Node-Like-Api-for-C++-it %}):it: .
{: .notice--primary}

{% include toc title="Table of Contents" icon="file-text" %}

## Introduction note

If you find interesting what I'm writing here maybe it's a good idea to visit at our company website...we're hiring! 
<figure>
	<a href="https://www.recognitionrobotics.com/careers" target="_new"><img src="https://recognitionrobotics.com/wp-content/uploads/2015/09/rob_logo-icon.png"></a>
	<figcaption><a href="https://recognitionrobotics.com/careers" title="recognitionrobotics.com/careers">recognitionrobotics.com/careers</a></figcaption>
</figure>


## Finding the right tool 

In 2013 we have been started re-thinking how to handle the technological stack of our company.
My field is automation and vision for robot guidance. We create software and hardware that uses image analysis techniques to measure or inspect objects in the industrial field and drive robots to do their automatic jobs.

We create software that enable robots to do this type of tasks (and many more):
<br><br><br>

<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/UrQcbeuGPlU?controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
<br>
<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/AwXJ0MW7zaM?controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>

<br><br>

This is a rough list of what we had in mind:

1. Multi platform, giving priority to the win/linux/macOS triad but also being able to work on lesser known OS in the robotics/controls field
2. Fast, with control over performance
3. Capable of easy native access to platform specific API as we often work with customized hardware
4. Simple and compact, with low number of lines of code
5. Code should be understandable by an average level developer
6. With great networking capabilities
7. Independent of any UI system, allowing to create desktop applications or small web-apps, sharing the majority of backend code
8. Being able to debug programs up to system kernel calls boundaries

The first 4 requisites are probably making "native" languages (C/C++/Rust etc.) more convenient a managed/jit-ted one (Java/C#/JS etc.).
Requirement 7 was also telling us to avoid being tied to a specific library/technology that also dictates the UI patterns (like Qt or wxWidgets).
The main reason is that in our company vision need to create desktop applications but also other products that are probably more similar to web-apps.
Additionally, the holy grail of re-using big chunks of backend code when moving to a new platform is needed big time in a world where platforms continue to diversify (desktop, server, mobile, iot etc.).

### C# / .net
The C# technology based on Mono (Xamarin) was our first choice but for a number of reasons it has not been a good fit for us. The reasons deserve an article/blog post on its own, but mainly they were due to the many bugs of the mono runtime, performance issues, and the continuous need to wrap and marshal things to and from C/C++.
Probably the open-sourcing of .NET has made things better from the state of things back in 2013.
Personally I like the C# language and its standard library but we've decided to move on.

### Javascript (Node.js)
We've studied other technologies becoming interested by the Node.js ecosystem. Strangely, even if it was not technically a native language, it was started being used in robotics and automation / embedded projects.
Node.js has a very capable networking stack, it's simple and relatively compact / fast, and doesn't come with a "default" UI system, thankfully, and integrates (relatively) easy with native C/C++ system api.
It solves a good number of concurrency problem using event loops and the reactor pattern in place of threads, making it (nearly) impossible to suffer typical multi-thread race conditions and bugs.
It's main use is of course server side web-apps, but also with the great advantage being able to work in a single language from the server to the browser.
One can also write desktop application, using projects like Electron (today) and Node-Webkit (already existing in 2013).
Some other communities are using it to do automation/system scripts. 
The idea of using a dynamic language wasn't without fear for a static-type-minded person like me, but we've been playing with Typescript enough to know that solutions o get optional static typing exists also in js.
Before taking any final decision, we've been taking some time to study in detail the inner workings of this technological stack.
The most relevant technology bits were written in C (libUV) and C++ (V8). The latter project was just too big for us to understand fully without spending too much time (remember our requirement 4!).
Additionally some mobile platforms were disallowing jit-ted languages like js on V8 and we had some plans of working on these platforms.

### Choosing the right tool
All of our tests and experience brought us to look for something simple, compact, stable and available but with a pleasant "base" library of the .NET style supporting async networking like Node.js.
The more we were thinking about it, the more we've started experimenting with some usage patterns in C++ that really allow this language to be used at a very "high" level, understanding that most issues are mainly as lack of a modern standard library.
C++ lacks a structured standard library, comparable with the runtime/frameworks that power Java/C#/Node.js and other major ecosystems. In C++ there's no out of the box support for tasks like networking and user interfaces, and only recently the bleeding edge of the standards (C++ 17 / C++ 20) are trying to make the situation better.
One can find many non-standard focused libraries solve specific problems in very efficient way.
At the other end one can find huge all-encompassing framework always striving to solve every possible problem and use case.
The problems start when you want to use multiple libraries together:
- No standard cross-platform package manager with good user base (I am thinking something npm style for js or similar to cargo for rust)
- Never-ending growing compile times
- Build systems becoming more complex than the software they're building
- Conversion between similar-behaving base types (std::string, folly::fbstring, QString). Too many projects like to redefine their own base types for string, vector, map etc.

We honestly couldn't see a reason why we could not express same C#/js concepts in C++ while keeping things simple.

### Shaping system achitecture

The vision then has became:

1. Create a library with an API similar to Node.js but entirely done in C++
2. Use RAII and C++ value semantics for the majority of objects, and only resort to reference counting when needed. Manual memory usage is disallowed with few limited exceptions (always for good reason)
3. Use static typing as much as possible. I've seen other projects on github trying to do something similar but replicating also the "dynamic typing" aspect in C++ and that's probably not efficient and not easy to use.
4. Pay attention to fast Compile/Iteration times
5. Use small, focused and simple open-source library, ideally [stb style](https://github.com/nothings/stb).
6. Use a cross platform UI library that is simple/fast for desktop applications
7. Allow the software to be accessed from network/web/remotely

Solutions:

1. We've used libraries used by node (libuv and zlib) of course ditching the V8 JS Interpreter, and studying Node.js source code. We also have some tests that "replicate" 1-to-1 the official tests of node 4.x
2. We've used "somewhat modern" C++, that is smart-pointers, ref-counting, lambda functions and delegates. The cyclic references are introduced mainly by events and are solved manually (as of today, but there are plans to play with [Herb Sutter Deferred Heaps](https://github.com/hsutter/gcpp)).
3. We've avoided using type erasure / dynamic typing excessively, trying to use value semantics when it's possible
4. We've used unity build techniques
5. We've been auditing third party libraries, discarding the ones that were not meeting our standard (simple/focused/compact/non-header-only)
6. We've used self contained bloat free immediate GUI libraries
7. We've implemented a websocket interface that pushes triangles directly into browsers using WebGL

## Implemented Node.js API

We've implemented the majority of Node.js api with the following exclusions

- Cluster
- Crypto
- Debugger
- Domain
- Punycode
- Readline
- Reply
- TLS/SSL
- Utilities
- V8
- VM

The http modules are missing the agent and childprocess doesn't create parent/child communication channels.
The streams classes have been ported one to one from nodejs implementation (of the 4.x range).

Some other general purpose modules that we've been developing:

- WebSockets (client and server)
- Redis Client
- Async sqlite wrapper, along the api of [https://www.npmjs.com/package/sqlite3](https://www.npmjs.com/package/sqlite3)

## Benchmarking

The http stack has never been realistically tested with thousands of connections, so we don't have data share comparing with stock Node.js in terms of speed and memory consumption.
Our target was not to create a new server side library to compete in the web/cloud field, but more something to have powerful network capability without headaches of typical multi-threaded code.
With some focused effort on scaling performance, our feeling is that the library can achieve decent results.

## Dependencies and self contained executable

All dependencies are included in source form inside the executable, so typically the output is a single .exe (windows) or .app (macOS) or ELF executable (linux) that runs out of the box without installing anything on the target machine.
Our default choice is also to statically link most standard libraries and the memory manager at the expense of a slightly bigger executable size (to avoid vcredist.exe in windows for example), but I assume this is personal preference.

{% include gallery caption="Self contained executables for **macOS, windows and linux**." %}

### Modules to the rescue

The secret dream of every coder is to reuse code. 
We've tried dividing code into structured libraries where it makes sense.
There are many ways to do it and the best one in our opinion was to use the "module" pattern.
This pattern is systematically used in the open source [JUCE framework](https://www.juce.com)
A module is basically a .cpp and a .h following some rules.

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Modules.jpg"><img src="{{ site.url }}/assets/images/2016-05-14/Modules.jpg"></a>
	<figcaption>The Module code-reusing pattern. Who needs C++ 20? :)</figcaption>
</figure>
<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Modules.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Modules.gif"></a>
	<figcaption>A quick tour of some of our modules and the relative file structure</figcaption>
</figure>

- Every module has its own directory
- A module defines a .h and a .cpp with the same name as the module and they are considered the "master (public) interface" of the module itself
- If the modules is complex, it will include  files needed _using relative paths_ referring them in the directory using #includes from inside the master .h and .cpp.
- Modules can depend from other modules if necessary, but avoiding cyclic dependencies because it would make sense to merge them in the same module.
- If third party libraries are needed, they should be included in source form inside some module, with their .h and .cpp #included inside the master .h and .cpp
- When a third party SDK is needed, prefer using dynamic loading of .dll, .so or .dylib if they have a C Interface api (using GetProcAddress, dlsym etc.) to static linking or load time linking.
- When binary only/pre-compiled SDK are absolutely necessary, then try to wrap them into a module
- If possible, avoid including third party libraries in master headers

An example master header and source file for a module called rrKernel:

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

### Trivial Build System

Creating new projects using modules is very simple.
Following the above mentioned rules, one will not need to link many external libraries in binary form, or add headers to search paths.
This also means that setting up a new PC to develop is straightforward, just clone your git repo (or whatever SCM you like) and start coding!
In the majority of cases one could manually add the master .cpp needed for the project inside the IDE or in the pre-existing build system.
The total number of files to add is equal to the number of modules, and that is a-lot-less than the total number of files in a project.
Additionally 90% of the time, when adding a new class you will just need to add one #include in the master .h and one #include in the master .cpp, not needing any changes to any build system.

Right now we are using JUCE software (called Introjucer, replaced recently by Projucer) that generates native project files for all IDE (Xcode, VS) and makefiles starting from simple handful-of-lines JSON module definition files.
<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Introjucer.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Introjucer.jpg"></a>
	<figcaption>Introjucer (recently replaced by Projucer), a simple software to generate cross platform native build files (part of JUCE framework)</figcaption>
</figure>

We are also keeping in parallel some qmake build files mainly because it's easy to cross-compile for ARM using Qt-Creator.

In either case build files are extremely simple and fast to write and easy to update.

Here is a sample module:
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

and a sample qmake module
```
HEADERS += $$PWD/rrSpreadsheet.h
SOURCES += $$PWD/rrSpreadsheet.cpp
SOURCES += $$PWD/rrSpreadsheet_externals.c
```
The [new JUCE module format](https://github.com/julianstorer/JUCE/blob/master/modules/JUCE%20Module%20Format.txt) format used by the Projucer software is even simpler, because you can specify it inside the header files as regular C++ comments and uses a naming convention that will automatically include the right files if they're properly named.

The above rrKernel module master header file would become:

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

### Compile Times and dependency hygiene

One of the main arguments against using C++ is sometimes the extremely long compile times.
Unfortunately this is often true, many C++ projects feature build times lasting minutes or hours for complex ones.
The reason of most of it is poor dependency hygiene and lack of attention in optimizing for "build time".

Getting a decent compile times in C++ is relatively easy following some tips:

- Avoiding using libraries that have themselves already very long build times or that cause long build time (boost-like)
- Avoid including huge libraries using just a fraction of what they do. If licensing allows it, it's better to extract only what's needed.
- Try always to look for libraries that are focused on one single thing, doing it very well rather than one-shop-stop frameworks
- Move as much as possible implementations from headers to implementation files. Ideally headers will only have definitions and templates (when needed...)
- Include system headers only in the master source file and never in the master / public header file
- Move inside the implementation file everything that doesn't need to be public
- Use forward declarations and PIMPL / Compilation firewall like schemes to minimize header dependencies

One of the main advantages of the "modules" structure is that the single module needs much less time to compile compared to compiling all the single .cpp composing it.
This is also called "Unity Build" pattern and is often used to reduce build time.
The reason is quite simple, in the modules / unity build case the compiler needs to parse less lines of code, for example all headers are included only once and then filtered with the #pragma once or header guards, compared to including them N times where N is the number of files composing the module.
There's also less disk I/O involved and this is important especially on non-SSD drives nowadays.

Some benchmarks on compilation time:

For a non trivial project, using for example all the node-like library, using websocket, the user interface remoting, the database library, some automation specific network protocols models, the GUI and external camera drivers we have a total of about 80K lines of code.
Using this approach compile times are:

- Clean build compile times: ~6-8 Seconds
- Iterative build times (small modifications): ~1 second

This data is referring to a debug build using XCode on a 2012 Macbook Pro Retina.

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Full Recompile.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Full Recompile.gif"></a>
	<figcaption>XCode spending ~7 seconds to do a full recompile of a 80K LOC project on a 2012 macbook</figcaption>
</figure>
<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/Partial Recompile.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Partial Recompile.gif"></a>
	<figcaption>XCode spending ~1 second to do a partial recompile of a 80K LOC project on a 2012 macbook</figcaption>
</figure>

## User Interface


<figure class="third">
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana MacOS.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana MacOS.jpg"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana Windows.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana Windows.jpg"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/Lucana Linux.jpg" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/Lucana Linux.jpg"></a>
	<figcaption>The beauty of being multi platform</figcaption>
</figure>

For the user interface we heavily invested into dear IMGUI (that we support with some donations, and I suggest everyone to do so!). This library is simply amazing. The original author doesn't always agree on our usage as a general purpose User Interface, but in all the products we've made, it works really really well :)
For the uninitiated, the imgui pattern for creating user interface works by traversing application data structures and generating controls using a procedural/stateless approach rather than an OOP/retained based one.
This topic surely deserves a more in depth article (that may follow), but conceptually instead of creating some sort of object graph describing the user interface and all parent/child relations between them, one simply calls ImGui:: functions.
These functions take care of generating the graphics for the ui control immediately (hence the immediate mode).
Additionally they modify whatever data you pass on the fly as well, so there's no need to convert/proxy/marshal your data (string,numbers,lists,etc.) in the format that is understood by the UI.

The cool thing about the user interface is that we've integrated it with the node-like I/O event loop library, and the UI gets redrawn every time there's either some user input (mouse/keyboard etc.) or when some async event happens (network message, file being read from disk etc.).

By doing this the gui only renders when it's needed,differently from the typical usage pattern in 3D games. It keeps CPU usage at 0% when there's no input and no events. For us this is very important when we deploy software in the embedded devices world.

Pros:

- Multi platform by design, can be used on every platform that can compile a .cpp file
- Super fast to integrate thanks to the "Bloat-Free Zero Dependency" mission
- Superb performance
- Makes code simpler because when something changes, one can simply redraw everything
- Quite easy to customize, you can change default colors / fonts very easily
- Helps keeping your backend / logic code separated from the user interface
- Library is so simple that fits in 2 files. Most average level programmers can figure out what's going wrong when there's a problem, differently from what's happening in much bigger projects
- Can work headless, on a server, without desktop UI or even a graphics card because you can transfer triangles over network!

Cons:

- Non native look on all platforms
- Needs some customization work to look nicer than the default themes/colors
- No easy way of doing animations (can be done but it's on your own, there's no official support from the library itself)
- Things like loading and displaying images are outside of the scope of the library (and that's probably a good thing in my opinion, I should move this in the Pro's ;-)

### User Interface Remoting

This type of customized user interface lends itself very easily to be remoted, as one is rendering using OpenGL/DirectX triangles and textures. With some effort we've implemented a few remote backends that allow us to remote this user interface inside all major browsers, also with multi users support.

We've also created a single executable self contained software that is able to connect to these remote-ui ports and rendering everything locally, without the need of a browser.

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/UIRemoting.gif" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/UIRemoting.gif"></a>
	<figcaption>Remoting User interface using webgl on 4 different browsers (Chrome,Firefox,Safari,IE) plus the real native software (running in a windows VM on a macOS host)</figcaption>
</figure>

<figure>
	<a href="{{ site.url }}/assets/images/2016-05-14/SensorBrowserResize.mp4" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/SensorBrowserResize.jpg"></a>
	<figcaption>Custom native app remoting software that resizes the (virtual) window on the remote host (Click to start video)</figcaption>
</figure>

### Integrating with other User Interface frameworks

Before marrying dear IMGUI, we've been using Qt for the User Interface only.
We were not particularly happy with the LGPL / Commercial nature of this library and with the excessive bloat to get even a simple hello world application to render, the difficulties in deploying an app without static linking (windeployqt is constantly broken in my experience) and a few annoyances here and there.
That being said, Qt is still our preferred library if we exclude IMGUI or if for some reasons limitations of the immediate mode gui become more prevalent than all the goodness it brings.

For example to deploy a very nice-looking software that makes great use of , or to have a more standard "desktop native look", I would probably prefer Qt.

Being able to keep the same backend / logic code, independent of the UI Library makes this choice easy and easily reversible in the future if requirements change.

<figure class="third">
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration1.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration1.png"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration2.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration2.png"></a>
	<a href="{{ site.url }}/assets/images/2016-05-14/QtIntegration3.png" target="_new"><img src="{{ site.url }}/assets/images/2016-05-14/QtIntegration3.png"></a>
	<figcaption>A screenshot of one of our software utilities the async networking library a-la node.js on QtQuick</figcaption>
</figure>

## Where can you get this library?

Unfortunately nowhere, while it would be great to share, current company policy does not support open-source.
I am available for questions on reddit, twitter or here!

## Some code extracted from our test-suite

**Note:**  All examples suffer from callback-hell but production code carefully uses delegates and pointer to member functions to make code more readable than what you see below.
{: .notice--warning}

### HTTP Server and client test

Node.js Code

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


C++ Equivalent
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

### HTTP File streaming server
A static file web server streaming  files directly from disk using node stream, without loading them entirely in memory.

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

### Zip Streaming test

Another example that creates streams from zip files:
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

### Custom Stream test
A small test to implement a custom read/write stream:

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

### Child-process test

Here is how you use child processes:

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
## Fin
There's much more to say but hey, this will not be my last article!
