/*
 @licstart  The following is the entire license notice for the JavaScript code in this file.

 The MIT License (MIT)

 Copyright (C) 1997-2020 by Dimitri van Heesch

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 @licend  The above is the entire license notice for the JavaScript code in this file
*/
var NAVTREE =
[
  [ "Sane C++ Libraries", "index.html", [
    [ "Motivation", "index.html#autotoc_md64", null ],
    [ "Status", "index.html#autotoc_md65", null ],
    [ "Dependencies", "page_dependencies.html", [
      [ "Dependencies", "page_dependencies.html#autotoc_md0", null ],
      [ "Dependencies (automatically generated)", "page_dependencies.html#autotoc_md1", null ],
      [ "Dependencies (interactive visualization)", "page_dependencies.html#autotoc_md2", null ]
    ] ],
    [ "SC::Build", "page_build.html", [
      [ "The build model", "page_build.html#autotoc_md3", null ],
      [ "Build and run a target", "page_build.html#autotoc_md4", null ],
      [ "Read a build definition", "page_build.html#autotoc_md5", null ],
      [ "Native and generated workflows", "page_build.html#autotoc_md6", null ],
      [ "Choose the integration size", "page_build.html#autotoc_md7", null ],
      [ "Cross builds are three decisions", "page_build.html#autotoc_md8", null ],
      [ "Continue from here", "page_build.html#autotoc_md9", null ]
    ] ],
    [ "SC::Build (External use)", "page_build_external.html", [
      [ "What the external launcher does", "page_build_external.html#autotoc_md10", null ],
      [ "Create the smallest project", "page_build_external.html#autotoc_md11", null ],
      [ "Choose where the libraries live", "page_build_external.html#autotoc_md12", [
        [ "Vendored checkout", "page_build_external.html#autotoc_md13", null ],
        [ "Shared checkout", "page_build_external.html#autotoc_md14", null ],
        [ "Standalone launcher and cache", "page_build_external.html#autotoc_md15", null ]
      ] ],
      [ "Pin the revision", "page_build_external.html#autotoc_md16", null ],
      [ "Keep paths project-relative", "page_build_external.html#autotoc_md17", null ],
      [ "Troubleshooting by layer", "page_build_external.html#autotoc_md18", null ]
    ] ],
    [ "Building (Contributor)", "page_building_contributor.html", [
      [ "Prepare the checkout", "page_building_contributor.html#autotoc_md19", null ],
      [ "Use the focused feedback loop", "page_building_contributor.html#autotoc_md20", null ],
      [ "Expand validation deliberately", "page_building_contributor.html#autotoc_md21", null ],
      [ "Format and inspect the change", "page_building_contributor.html#autotoc_md22", null ],
      [ "Generate IDE projects only when useful", "page_building_contributor.html#autotoc_md23", null ],
      [ "Debug a failing test", "page_building_contributor.html#autotoc_md24", null ],
      [ "Build documentation", "page_building_contributor.html#autotoc_md25", null ]
    ] ],
    [ "Building (User)", "page_building_user.html", [
      [ "Choose an integration form", "page_building_user.html#autotoc_md26", null ],
      [ "Add one library to an existing program", "page_building_user.html#autotoc_md27", null ],
      [ "Use normal C++ around Sane C++", "page_building_user.html#autotoc_md28", null ],
      [ "Account for platform libraries", "page_building_user.html#autotoc_md29", null ],
      [ "Plugins need exported library symbols", "page_building_user.html#autotoc_md30", null ],
      [ "When to use SC::Build", "page_building_user.html#autotoc_md31", null ]
    ] ],
    [ "Coding Style", "page_coding_style.html", [
      [ "Start from the repository constraints", "page_coding_style.html#autotoc_md32", null ],
      [ "Let the formatter establish the baseline", "page_coding_style.html#autotoc_md33", null ],
      [ "Name by role", "page_coding_style.html#autotoc_md34", null ],
      [ "Make failure part of the type", "page_coding_style.html#autotoc_md35", null ],
      [ "Keep outputs and ownership explicit", "page_coding_style.html#autotoc_md36", null ],
      [ "Design public headers as boundaries", "page_coding_style.html#autotoc_md37", null ],
      [ "Prefer small, testable operations", "page_coding_style.html#autotoc_md38", null ],
      [ "Write tests as contract examples", "page_coding_style.html#autotoc_md39", null ],
      [ "Review checklist", "page_coding_style.html#autotoc_md40", null ]
    ] ],
    [ "Examples", "page_examples.html", [
      [ "Examples", "page_examples.html#autotoc_md41", [
        [ "See the examples in action", "page_examples.html#autotoc_md42", [
          [ "Applications and runtime behavior", "page_examples.html#autotoc_md43", null ],
          [ "SC::Build workflows", "page_examples.html#autotoc_md44", null ]
        ] ],
        [ "Quick start", "page_examples.html#autotoc_md45", null ],
        [ "HTTP and networking", "page_examples.html#autotoc_md46", null ],
        [ "Await cookbook", "page_examples.html#autotoc_md47", [
          [ "Task ownership and coordination", "page_examples.html#autotoc_md48", null ],
          [ "Networking", "page_examples.html#autotoc_md49", null ],
          [ "File I/O", "page_examples.html#autotoc_md50", null ],
          [ "System integration", "page_examples.html#autotoc_md51", null ],
          [ "Composed workflow", "page_examples.html#autotoc_md52", null ]
        ] ],
        [ "Fibers", "page_examples.html#autotoc_md53", null ],
        [ "Native integration and hot reload", "page_examples.html#autotoc_md54", null ],
        [ "More source-backed examples", "page_examples.html#autotoc_md55", null ]
      ] ]
    ] ],
    [ "FAQ", "page_faq.html", [
      [ "Can my application use the C++ standard library?", "page_faq.html#autotoc_md56", null ],
      [ "How do application containers interoperate?", "page_faq.html#autotoc_md57", null ],
      [ "What is strict no-standard-library mode?", "page_faq.html#autotoc_md58", null ],
      [ "Can standard headers be used without linking the C++ runtime?", "page_faq.html#autotoc_md59", null ],
      [ "Can exceptions and RTTI be disabled?", "page_faq.html#autotoc_md60", null ],
      [ "Which debugger visualizers are available?", "page_faq.html#autotoc_md61", null ],
      [ "Are API and ABI stable?", "page_faq.html#autotoc_md62", null ]
    ] ],
    [ "Libraries", "libraries.html", "libraries" ],
    [ "Platforms", "page_platforms.html", null ],
    [ "Principles", "page_principles.html", [
      [ "📖 Readability", "page_principles.html#autotoc_md66", null ],
      [ "✅ Correctness", "page_principles.html#autotoc_md67", null ],
      [ "🚀 Speed", "page_principles.html#autotoc_md68", null ]
    ] ],
    [ "Single File Amalgamation", "page_single_file_libs.html", null ],
    [ "Tests", "page_tests.html", null ],
    [ "Tools", "page_tools.html", [
      [ "Why tools are C++ programs", "page_tools.html#autotoc_md69", null ],
      [ "Invoke a built-in tool", "page_tools.html#autotoc_md70", null ],
      [ "Write a small custom tool", "page_tools.html#autotoc_md71", null ],
      [ "SC-build.cpp", "page_tools.html#autotoc_md72", null ],
      [ "SC-package.cpp", "page_tools.html#autotoc_md73", [
        [ "Think in recipes, receipts, and exports", "page_tools.html#autotoc_md74", null ],
        [ "Inspect before changing package state", "page_tools.html#autotoc_md75", null ],
        [ "Install, import, or repair", "page_tools.html#autotoc_md76", null ],
        [ "Record the resolved environment", "page_tools.html#autotoc_md77", null ]
      ] ],
      [ "SC-format.cpp", "page_tools.html#autotoc_md78", [
        [ "Format a working tree", "page_tools.html#autotoc_md79", null ],
        [ "Check without modifying files", "page_tools.html#autotoc_md80", null ]
      ] ],
      [ "How does it work", "page_tools.html#autotoc_md81", null ],
      [ "Know the boundary", "page_tools.html#autotoc_md82", null ]
    ] ],
    [ "HTTP Library Notes", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html", [
      [ "Architecture Overview", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md385", null ],
      [ "Core constraints", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md386", null ],
      [ "Hot paths", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md387", null ],
      [ "Benchmark workflow", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md388", null ],
      [ "Client-specific notes", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md389", null ],
      [ "Validation", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md390", null ]
    ] ],
    [ "Topics", "topics.html", "topics" ],
    [ "Namespaces", "namespaces.html", [
      [ "Namespace List", "namespaces.html", "namespaces_dup" ],
      [ "Namespace Members", "namespacemembers.html", [
        [ "All", "namespacemembers.html", null ],
        [ "Typedefs", "namespacemembers_type.html", null ],
        [ "Enumerations", "namespacemembers_enum.html", null ]
      ] ]
    ] ],
    [ "Classes", "annotated.html", [
      [ "Class List", "annotated.html", "annotated_dup" ],
      [ "Class Index", "classes.html", null ],
      [ "Class Hierarchy", "hierarchy.html", "hierarchy" ],
      [ "Class Members", "functions.html", [
        [ "All", "functions.html", "functions_dup" ],
        [ "Functions", "functions_func.html", "functions_func" ],
        [ "Variables", "functions_vars.html", "functions_vars" ],
        [ "Typedefs", "functions_type.html", null ],
        [ "Enumerations", "functions_enum.html", null ],
        [ "Enumerator", "functions_eval.html", null ],
        [ "Related Symbols", "functions_rela.html", null ]
      ] ]
    ] ],
    [ "Files", "files.html", [
      [ "File List", "files.html", "files_dup" ]
    ] ]
  ] ]
];

var NAVTREEINDEX =
[
"ArenaMapKey_8h_source.html",
"group__group__strings.html#ga4b7aa03fde5e693b29c03a9991208574",
"library_serial_port.html#autotoc_md320",
"structSC_1_1AsyncEventLoop.html#a10f7a7f846c5879a2ad6c66e77e1d56a",
"structSC_1_1AsyncPipeline.html#a0ae8314ea088465274c880bb816f8667",
"structSC_1_1AsyncSocketReceive_1_1CompletionData.html",
"structSC_1_1FiberAsyncFileSendOptions.html",
"structSC_1_1FileSystemStat.html#a9d9073ef12d8d3a33c85eaf52a888b73",
"structSC_1_1HttpConnectionsPool.html#ab56d14aa10eed5cfe6cbd4f85146bace",
"structSC_1_1PluginDefinition.html#aeb4c3a5a534463353ecd144f928bdb50",
"structSC_1_1StringFormatOutput.html"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';