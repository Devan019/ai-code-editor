// Text-based MIME types
export const textMimeTypes = [
  'text/plain', 'text/html', 'text/css', 'text/javascript',
  'application/javascript', 'application/json', 'application/xml',
  'application/typescript', 'text/markdown', 'text/x-python',
  'text/x-php', 'text/x-java-source', 'text/x-c', 'text/x-c++src',
  'text/x-csharp', 'text/x-ruby', 'text/x-go', 'text/x-rust',
  'text/x-swift', 'text/x-kotlin', 'text/x-shellscript',
  'application/x-sh', 'application/x-bash', 'application/x-zsh',
  'application/x-powershell', 'application/x-sql',
  'application/x-yaml', 'application/x-toml', 'application/x-ini',
  'application/graphql', 'text/x-vue', 'text/x-svelte'
];

// Extensions
export const textExtensions = [
  'txt', 'html', 'htm', 'css', 'scss', 'less',
  'js', 'jsx', 'mjs', 'cjs',
  'ts', 'tsx',
  'json', 'xml', 'md', 'markdown',
  'py', 'php', 'java', 'c', 'cpp', 'cc', 'h', 'hpp',
  'cs', 'rb', 'go', 'rs', 'swift', 'kt', 'kts',
  'm', // Objective-C
  'sh', 'bash', 'zsh', 'fish',
  'ps1', 'bat', 'cmd',
  'yml', 'yaml', 'toml', 'ini', 'cfg', 'conf', 'config',
  'log', 'csv', 'tsv', 'sql',
  'graphql', 'gql',
  'vue', 'svelte',
  'dockerfile', 'env', 'gitignore', 'editorconfig'
];

export const extensionToMime: Record<string, string> = {
  txt: 'text/plain',
  log: 'text/plain',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  scss: 'text/x-scss',
  less: 'text/x-less',
  js: 'application/javascript',
  jsx: 'text/javascript',
  mjs: 'application/javascript',
  cjs: 'application/javascript',
  ts: 'application/typescript',
  tsx: 'application/typescript',
  json: 'application/json',
  xml: 'application/xml',
  md: 'text/markdown',
  markdown: 'text/markdown',
  py: 'text/x-python',
  php: 'text/x-php',
  java: 'text/x-java-source',
  c: 'text/x-c',
  h: 'text/x-c',
  cpp: 'text/x-c++src',
  cc: 'text/x-c++src',
  hpp: 'text/x-c++src',
  cs: 'text/x-csharp',
  rb: 'text/x-ruby',
  go: 'text/x-go',
  rs: 'text/x-rust',
  swift: 'text/x-swift',
  kt: 'text/x-kotlin',
  kts: 'text/x-kotlin',
  m: 'text/x-objectivec',
  sh: 'text/x-shellscript',
  bash: 'application/x-bash',
  zsh: 'application/x-zsh',
  fish: 'text/x-shellscript',
  ps1: 'application/x-powershell',
  bat: 'application/x-bat',
  cmd: 'application/x-msdos-program',
  yml: 'application/x-yaml',
  yaml: 'application/x-yaml',
  toml: 'application/x-toml',
  ini: 'application/x-ini',
  cfg: 'application/x-ini',
  conf: 'application/x-ini',
  config: 'application/x-ini',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  sql: 'application/x-sql',
  graphql: 'application/graphql',
  gql: 'application/graphql',
  vue: 'text/x-vue',
  svelte: 'text/x-svelte',
  dockerfile: 'text/x-dockerfile',
  env: 'text/plain',
  gitignore: 'text/plain',
  editorconfig: 'text/plain'
};

export const mimeToExtension: Record<string, string> = {};
for (const [ext, mime] of Object.entries(extensionToMime)) {
  if (!(mime in mimeToExtension)) {
    mimeToExtension[mime] = ext;
  }
}


export  const extensionToLanguage = {
  txt: "Plain Text",
  html: "HTML",
  htm: "HTML",
  css: "CSS",
  scss: "SCSS",
  less: "LESS",

  js: "JavaScript",
  jsx: "JavaScript (React JSX)",
  mjs: "JavaScript (ES Modules)",
  cjs: "JavaScript (CommonJS)",

  ts: "TypeScript",
  tsx: "TypeScript (React TSX)",

  json: "JSON",
  xml: "XML",
  md: "Markdown",
  markdown: "Markdown",

  py: "Python",
  php: "PHP",
  java: "Java",
  c: "C",
  cpp: "C++",
  cc: "C++",
  h: "C/C++ Header",
  hpp: "C++ Header",

  cs: "C#",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  swift: "Swift",
  kt: "Kotlin",
  kts: "Kotlin Script",

  m: "Objective-C",

  sh: "Shell Script",
  bash: "Bash",
  zsh: "Zsh",
  fish: "Fish Shell",

  ps1: "PowerShell",
  bat: "Batch File",
  cmd: "Command Script",

  yml: "YAML",
  yaml: "YAML",
  toml: "TOML",
  ini: "INI",
  cfg: "Configuration",
  conf: "Configuration",
  config: "Configuration",

  log: "Log File",
  csv: "CSV",
  tsv: "TSV",
  sql: "SQL",

  graphql: "GraphQL",
  gql: "GraphQL",

  vue: "Vue.js",
  svelte: "Svelte",

  dockerfile: "Dockerfile",
  env: "Environment Variables",
  gitignore: "Git Ignore File",
  editorconfig: "EditorConfig"
};

export const languageToExtensions = {
  "Plain Text": ["txt"],

  HTML: ["html", "htm"],
  CSS: ["css"],
  SCSS: ["scss"],
  LESS: ["less"],

  JavaScript: ["js"],
  "JavaScript (React JSX)": ["jsx"],
  "JavaScript (ES Modules)": ["mjs"],
  "JavaScript (CommonJS)": ["cjs"],

  TypeScript: ["ts"],
  "TypeScript (React TSX)": ["tsx"],

  JSON: ["json"],
  XML: ["xml"],
  Markdown: ["md", "markdown"],

  Python: ["py"],
  PHP: ["php"],
  Java: ["java"],
  C: ["c"],
  "C++": ["cpp", "cc"],
  "C/C++ Header": ["h"],
  "C++ Header": ["hpp"],

  "C#": ["cs"],
  Ruby: ["rb"],
  Go: ["go"],
  Rust: ["rs"],
  Swift: ["swift"],
  Kotlin: ["kt", "kts"],

  "Objective-C": ["m"],

  "Shell Script": ["sh"],
  Bash: ["bash"],
  Zsh: ["zsh"],
  "Fish Shell": ["fish"],

  PowerShell: ["ps1"],
  "Batch File": ["bat"],
  "Command Script": ["cmd"],

  YAML: ["yml", "yaml"],
  TOML: ["toml"],
  INI: ["ini"],
  Configuration: ["cfg", "conf", "config"],

  "Log File": ["log"],
  CSV: ["csv"],
  TSV: ["tsv"],
  SQL: ["sql"],

  GraphQL: ["graphql", "gql"],

  "Vue.js": ["vue"],
  Svelte: ["svelte"],

  Dockerfile: ["dockerfile"],
  "Environment Variables": ["env"],
  "Git Ignore File": ["gitignore"],
  EditorConfig: ["editorconfig"]
};

export const languageToJDoodleConfig = {
  "python": {
    name: "Python",
    versions: {
      "3": "python3",
      "2": "python2"
    },
    defaultVersion: "3"
  },
  "java": {
    name: "Java",
    versions: {
      "4": "java",
      "3": "java",
      "2": "java",
      "1": "java"
    },
    defaultVersion: "0"
  },
  "c": {
    name: "C",
    versions: {
      "5": "c",
      "4": "c"
    },
    defaultVersion: "0"
  },
  "cpp": {
    name: "C++",
    versions: {
      "5": "cpp",
      "4": "cpp14",
      "3": "cpp"
    },
    defaultVersion: "0"
  },
  "c++": {
    name: "C++",
    versions: {
      "5": "cpp",
      "4": "cpp14",
      "3": "cpp"
    },
    defaultVersion: "0"
  },
  "csharp": {
    name: "C#",
    versions: {
      "3": "csharp",
      "2": "csharp"
    },
    defaultVersion: "0"
  },
  "php": {
    name: "PHP",
    versions: {
      "3": "php",
      "2": "php"
    },
    defaultVersion: "0"
  },
  "ruby": {
    name: "Ruby",
    versions: {
      "3": "ruby",
      "2": "ruby"
    },
    defaultVersion: "0"
  },
  "go": {
    name: "Go",
    versions: {
      "4": "go",
      "3": "go"
    },
    defaultVersion: "0"
  },
  "scala": {
    name: "Scala",
    versions: {
      "4": "scala",
      "3": "scala"
    },
    defaultVersion: "0"
  },
  "bash": {
    name: "Bash",
    versions: {
      "1": "bash"
    },
    defaultVersion: "0"
  },
  "sql": {
    name: "SQL",
    versions: {
      "3": "mysql",
      "2": "mysql"
    },
    defaultVersion: "0"
  },
  "javascript": {
    name: "JavaScript",
    versions: {
      "4": "nodejs",
      "3": "nodejs"
    },
    defaultVersion: "0"
  },
  "typescript": {
    name: "TypeScript",
    versions: {
      "1": "typescript"
    },
    defaultVersion: "0"
  },
  "perl": {
    name: "Perl",
    versions: {
      "3": "perl",
      "2": "perl"
    },
    defaultVersion: "0"
  },
  "rust": {
    name: "Rust",
    versions: {
      "4": "rust",
      "3": "rust"
    },
    defaultVersion: "0"
  },
  "swift": {
    name: "Swift",
    versions: {
      "4": "swift",
      "3": "swift"
    },
    defaultVersion: "0"
  },
  "kotlin": {
    name: "Kotlin",
    versions: {
      "3": "kotlin",
      "2": "kotlin"
    },
    defaultVersion: "0"
  },
  "lua": {
    name: "Lua",
    versions: {
      "2": "lua"
    },
    defaultVersion: "0"
  },
  "r": {
    name: "R",
    versions: {
      "4": "r",
      "3": "r"
    },
    defaultVersion: "0"
  },
  "dart": {
    name: "Dart",
    versions: {
      "2": "dart"
    },
    defaultVersion: "0"
  },
  "haskell": {
    name: "Haskell",
    versions: {
      "2": "haskell"
    },
    defaultVersion: "0"
  },
  "elixir": {
    name: "Elixir",
    versions: {
      "1": "elixir"
    },
    defaultVersion: "0"
  },
  "erlang": {
    name: "Erlang",
    versions: {
      "2": "erlang"
    },
    defaultVersion: "0"
  },
  "clojure": {
    name: "Clojure",
    versions: {
      "3": "clojure",
      "2": "clojure"
    },
    defaultVersion: "0"
  },
  "fsharp": {
    name: "F#",
    versions: {
      "3": "fsharp",
      "2": "fsharp"
    },
    defaultVersion: "0"
  },
  "groovy": {
    name: "Groovy",
    versions: {
      "3": "groovy",
      "2": "groovy"
    },
    defaultVersion: "0"
  },
  "objective-c": {
    name: "Objective-C",
    versions: {
      "2": "objc"
    },
    defaultVersion: "0"
  },
  "pascal": {
    name: "Pascal",
    versions: {
      "3": "pascal",
      "2": "pascal"
    },
    defaultVersion: "0"
  },
  "vb.net": {
    name: "VB.NET",
    versions: {
      "2": "vbn"
    },
    defaultVersion: "0"
  }
};
