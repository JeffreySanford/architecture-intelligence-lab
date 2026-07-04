const fs = require('node:fs');
const path = require('node:path');

const generatedRoot = path.resolve(process.argv[2] ?? '');
if (!generatedRoot || !fs.existsSync(generatedRoot)) {
  console.error(`Generated root does not exist: ${generatedRoot}`);
  process.exit(1);
}

const gitPushPath = path.join(generatedRoot, 'git_push.sh');
if (fs.existsSync(gitPushPath)) {
  fs.rmSync(gitPushPath, { force: true });
}

const filesManifestPath = path.join(generatedRoot, '.openapi-generator', 'FILES');
if (fs.existsSync(filesManifestPath)) {
  const entries = fs
    .readFileSync(filesManifestPath, 'utf8')
    .split(/\r?\n/)
    .filter((entry) => entry && entry !== 'git_push.sh');
  fs.writeFileSync(filesManifestPath, `${entries.join('\n')}\n`);

  const expectedFiles = new Set(entries.map(normalizePath));
  for (const file of collectFiles(generatedRoot)) {
    const relativePath = normalizePath(path.relative(generatedRoot, file));
    if (!expectedFiles.has(relativePath)) {
      fs.rmSync(file, { force: true });
    }
  }
}

for (const file of collectFiles(generatedRoot)) {
  const text = fs
    .readFileSync(file, 'utf8')
    .replace(/[ \t]+(?=\r?\n)/g, '')
    .replace(/(\r?\n){2,}$/g, '\n');
  fs.writeFileSync(file, text);
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function collectFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }

    const shouldClean =
      entry.isFile() &&
      (fullPath.endsWith('.ts') ||
        fullPath.endsWith('.md') ||
        fullPath.endsWith('.json') ||
        entry.name === 'FILES' ||
        entry.name === 'VERSION' ||
        entry.name === '.openapi-generator-ignore');

    return shouldClean ? [fullPath] : [];
  });
}
