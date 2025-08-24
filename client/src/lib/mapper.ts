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
