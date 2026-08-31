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
    [ "Motivation", "index.html#autotoc_md67", null ],
    [ "Status", "index.html#autotoc_md68", null ],
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
      [ "Small, medium, or big?", "page_building_user.html#autotoc_md26", [
        [ "Small: one standalone library", "page_building_user.html#autotoc_md27", null ],
        [ "Medium: the unity build", "page_building_user.html#autotoc_md28", null ],
        [ "Big: separate compilation", "page_building_user.html#autotoc_md29", null ]
      ] ],
      [ "Add one library to an existing program", "page_building_user.html#autotoc_md30", null ],
      [ "Use normal C++ around Sane C++", "page_building_user.html#autotoc_md31", null ],
      [ "Account for platform libraries", "page_building_user.html#autotoc_md32", null ],
      [ "Plugins need exported library symbols", "page_building_user.html#autotoc_md33", null ],
      [ "When to use SC::Build", "page_building_user.html#autotoc_md34", null ]
    ] ],
    [ "Coding Style", "page_coding_style.html", [
      [ "Start from the repository constraints", "page_coding_style.html#autotoc_md35", null ],
      [ "Let the formatter establish the baseline", "page_coding_style.html#autotoc_md36", null ],
      [ "Name by role", "page_coding_style.html#autotoc_md37", null ],
      [ "Make failure part of the type", "page_coding_style.html#autotoc_md38", null ],
      [ "Keep outputs and ownership explicit", "page_coding_style.html#autotoc_md39", null ],
      [ "Design public headers as boundaries", "page_coding_style.html#autotoc_md40", null ],
      [ "Prefer small, testable operations", "page_coding_style.html#autotoc_md41", null ],
      [ "Write tests as contract examples", "page_coding_style.html#autotoc_md42", null ],
      [ "Review checklist", "page_coding_style.html#autotoc_md43", null ]
    ] ],
    [ "Examples", "page_examples.html", [
      [ "Examples", "page_examples.html#autotoc_md44", [
        [ "See the examples in action", "page_examples.html#autotoc_md45", [
          [ "Applications and runtime behavior", "page_examples.html#autotoc_md46", null ],
          [ "SC::Build workflows", "page_examples.html#autotoc_md47", null ]
        ] ],
        [ "Quick start", "page_examples.html#autotoc_md48", null ],
        [ "HTTP and networking", "page_examples.html#autotoc_md49", null ],
        [ "Await cookbook", "page_examples.html#autotoc_md50", [
          [ "Task ownership and coordination", "page_examples.html#autotoc_md51", null ],
          [ "Networking", "page_examples.html#autotoc_md52", null ],
          [ "File I/O", "page_examples.html#autotoc_md53", null ],
          [ "System integration", "page_examples.html#autotoc_md54", null ],
          [ "Composed workflow", "page_examples.html#autotoc_md55", null ]
        ] ],
        [ "Fibers", "page_examples.html#autotoc_md56", null ],
        [ "Native integration and hot reload", "page_examples.html#autotoc_md57", null ],
        [ "More source-backed examples", "page_examples.html#autotoc_md58", null ]
      ] ]
    ] ],
    [ "FAQ", "page_faq.html", [
      [ "Can my application use the C++ standard library?", "page_faq.html#autotoc_md59", null ],
      [ "How do application containers interoperate?", "page_faq.html#autotoc_md60", null ],
      [ "What is strict no-standard-library mode?", "page_faq.html#autotoc_md61", null ],
      [ "Can standard headers be used without linking the C++ runtime?", "page_faq.html#autotoc_md62", null ],
      [ "Can exceptions and RTTI be disabled?", "page_faq.html#autotoc_md63", null ],
      [ "Which debugger visualizers are available?", "page_faq.html#autotoc_md64", null ],
      [ "Are API and ABI stable?", "page_faq.html#autotoc_md65", null ]
    ] ],
    [ "Libraries", "libraries.html", "libraries" ],
    [ "Platforms", "page_platforms.html", null ],
    [ "Principles", "page_principles.html", [
      [ "📖 Readability", "page_principles.html#autotoc_md69", null ],
      [ "✅ Correctness", "page_principles.html#autotoc_md70", null ],
      [ "🚀 Speed", "page_principles.html#autotoc_md71", null ]
    ] ],
    [ "Single File Amalgamation", "page_single_file_libs.html", null ],
    [ "Tests", "page_tests.html", null ],
    [ "Tools", "page_tools.html", [
      [ "Why tools are C++ programs", "page_tools.html#autotoc_md72", null ],
      [ "Invoke a built-in tool", "page_tools.html#autotoc_md73", null ],
      [ "Write a small custom tool", "page_tools.html#autotoc_md74", null ],
      [ "SC-build.cpp", "page_tools.html#autotoc_md75", null ],
      [ "SC-package.cpp", "page_tools.html#autotoc_md76", [
        [ "Think in recipes, receipts, and exports", "page_tools.html#autotoc_md77", null ],
        [ "Inspect before changing package state", "page_tools.html#autotoc_md78", null ],
        [ "Install, import, or repair", "page_tools.html#autotoc_md79", null ],
        [ "Record the resolved environment", "page_tools.html#autotoc_md80", null ]
      ] ],
      [ "SC-format.cpp", "page_tools.html#autotoc_md81", [
        [ "Format a working tree", "page_tools.html#autotoc_md82", null ],
        [ "Check without modifying files", "page_tools.html#autotoc_md83", null ]
      ] ],
      [ "How does it work", "page_tools.html#autotoc_md84", null ],
      [ "Know the boundary", "page_tools.html#autotoc_md85", null ]
    ] ],
    [ "HTTP Library Notes", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html", [
      [ "Architecture Overview", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md410", null ],
      [ "Core constraints", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md411", null ],
      [ "Hot paths", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md412", null ],
      [ "Benchmark workflow", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md413", null ],
      [ "Client-specific notes", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md414", null ],
      [ "Validation", "md__2home_2runner_2work_2pagghiu_8github_8io-source_2pagghiu_8github_8io-source_2SaneCppLibraries_2Libraries_2Http_2AGENTS.html#autotoc_md415", null ]
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
"group__group__serialization__text.html",
"library_plugin.html#autotoc_md303",
"structSC_1_1AsyncBuffersPool.html#a15c1c6422b009dc271f2d6c16c5fa03e",
"structSC_1_1AsyncFileWrite.html#ab0e1a4377a5e4ef7b009a0aa8d43e9c8",
"structSC_1_1AsyncSignal.html",
"structSC_1_1AwaitTaskRegistryWaitAllAwaiter.html",
"structSC_1_1FileDescriptor.html#a011bee61c7a59ed7997b6f2ca4ac736aa050759af7ddcc64ddb5380e7b05c44b1",
"structSC_1_1HttpAsyncFileServer.html#ac57087e387f58fc6ac756d0375207946",
"structSC_1_1HttpParser.html#ab90d16c284d13ca54c2c81a1e0e46b25ad64ed3e9c10229648e069f56e32f4c8e",
"structSC_1_1RWLock.html#ad0f6f1e8fee3d056f3db98d11596d0e1",
"structSC_1_1TestCase.html#a459de05ee277d86b3e6db5ef82f8d583a7a1920d61156abc05a60135aefe8bc67"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';