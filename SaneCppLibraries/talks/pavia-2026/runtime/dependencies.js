// Current SC/Support/Dependencies/Dependencies.json; minimal edges omit transitive redundancy.
window.SANE_LIBRARY_GRAPH = [
  {
    "name": "Async",
    "label": "Async",
    "status": "mvp",
    "dependencies": [
      "File",
      "FileSystem",
      "Socket",
      "Threading"
    ],
    "position": [
      370,
      150,
      180
    ]
  },
  {
    "name": "AsyncFibers",
    "label": "Async Fibers",
    "status": "draft",
    "dependencies": [
      "Async",
      "Fibers"
    ],
    "position": [
      630,
      28,
      195
    ]
  },
  {
    "name": "AsyncStreams",
    "label": "Async Streams",
    "status": "mvp",
    "dependencies": [],
    "position": [
      120,
      150,
      200
    ]
  },
  {
    "name": "Await",
    "label": "Await",
    "status": "mvp",
    "dependencies": [
      "Async"
    ],
    "position": [
      370,
      28,
      175
    ]
  },
  {
    "name": "Containers",
    "label": "Containers",
    "status": "mvp",
    "dependencies": [
      "Memory"
    ],
    "position": [
      900,
      440,
      175
    ]
  },
  {
    "name": "ContainersReflection",
    "label": "Containers Reflection",
    "status": "mvp",
    "dependencies": [
      "Containers",
      "Reflection"
    ],
    "position": [
      620,
      440,
      245
    ]
  },
  {
    "name": "Cryptography",
    "label": "Cryptography",
    "status": "draft",
    "dependencies": [],
    "position": [
      1260,
      28,
      310
    ]
  },
  {
    "name": "Fibers",
    "label": "Fibers",
    "status": "draft",
    "dependencies": [],
    "position": [
      630,
      150,
      170
    ]
  },
  {
    "name": "File",
    "label": "File",
    "status": "usable",
    "dependencies": [],
    "position": [
      820,
      350,
      160
    ]
  },
  {
    "name": "FileSystem",
    "label": "File System",
    "status": "usable",
    "dependencies": [],
    "position": [
      90,
      350,
      170
    ]
  },
  {
    "name": "FileSystemIterator",
    "label": "File System Iterator",
    "status": "usable",
    "dependencies": [],
    "position": [
      1260,
      89,
      310
    ]
  },
  {
    "name": "FileSystemWatcher",
    "label": "File System Watcher",
    "status": "usable",
    "dependencies": [],
    "position": [
      1260,
      150,
      310
    ]
  },
  {
    "name": "Foundation",
    "label": "Foundation",
    "status": "usable",
    "dependencies": [],
    "position": [
      1260,
      211,
      310
    ]
  },
  {
    "name": "Hashing",
    "label": "Hashing",
    "status": "usable",
    "dependencies": [],
    "position": [
      1260,
      272,
      310
    ]
  },
  {
    "name": "Http",
    "label": "Http",
    "status": "draft",
    "dependencies": [
      "Async",
      "AsyncStreams"
    ],
    "position": [
      120,
      28,
      180
    ]
  },
  {
    "name": "HttpClient",
    "label": "Http Client",
    "status": "draft",
    "dependencies": [],
    "position": [
      1260,
      333,
      310
    ]
  },
  {
    "name": "Memory",
    "label": "Memory",
    "status": "usable",
    "dependencies": [],
    "position": [
      900,
      525,
      175
    ]
  },
  {
    "name": "Plugin",
    "label": "Plugin",
    "status": "mvp",
    "dependencies": [
      "Process"
    ],
    "position": [
      900,
      28,
      160
    ]
  },
  {
    "name": "Process",
    "label": "Process",
    "status": "usable",
    "dependencies": [
      "File"
    ],
    "position": [
      900,
      150,
      170
    ]
  },
  {
    "name": "Reflection",
    "label": "Reflection",
    "status": "usable",
    "dependencies": [],
    "position": [
      360,
      525,
      180
    ]
  },
  {
    "name": "SerialPort",
    "label": "SerialPort",
    "status": "mvp",
    "dependencies": [
      "File"
    ],
    "position": [
      1000,
      250,
      170
    ]
  },
  {
    "name": "SerializationBinary",
    "label": "Serialization Binary",
    "status": "mvp",
    "dependencies": [
      "Reflection"
    ],
    "position": [
      115,
      440,
      220
    ]
  },
  {
    "name": "SerializationText",
    "label": "Serialization Text",
    "status": "mvp",
    "dependencies": [
      "Reflection"
    ],
    "position": [
      360,
      440,
      205
    ]
  },
  {
    "name": "Socket",
    "label": "Socket",
    "status": "mvp",
    "dependencies": [],
    "position": [
      330,
      350,
      160
    ]
  },
  {
    "name": "Strings",
    "label": "Strings",
    "status": "usable",
    "dependencies": [],
    "position": [
      1260,
      394,
      310
    ]
  },
  {
    "name": "Testing",
    "label": "Testing",
    "status": "mvp",
    "dependencies": [],
    "position": [
      1260,
      455,
      310
    ]
  },
  {
    "name": "Threading",
    "label": "Threading",
    "status": "usable",
    "dependencies": [],
    "position": [
      570,
      350,
      180
    ]
  },
  {
    "name": "Time",
    "label": "Time",
    "status": "mvp",
    "dependencies": [],
    "position": [
      1260,
      516,
      310
    ]
  }
];
