const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const workspaceRoot = join(__dirname, '..');
const envPath = join(workspaceRoot, '.env');
const outputPath = join(workspaceRoot, 'apps', 'architecture-dashboard', 'public', 'env.js');

function parseEnvFile(contents) {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((values, line) => {
      const separator = line.indexOf('=');
      if (separator === -1) {
        return values;
      }

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
      values[key] = value;
      return values;
    }, {});
}

const env = parseEnvFile(readFileSync(envPath, 'utf8'));
const config = {
  primeuiLicense: env.PRIMEUI_LICENSE_KEY ?? '',
};

writeFileSync(
  outputPath,
  `window.__ARCHITECTURE_LAB_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`,
);
