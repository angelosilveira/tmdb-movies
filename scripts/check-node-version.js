#!/usr/bin/env node
// Executado automaticamente antes de `npm install` (via preinstall)
// Avisa o dev se estiver usando uma versão do Node fora do range suportado.

const [major] = process.versions.node.split('.').map(Number);
const MIN = 18;
const RECOMMENDED = 22;

if (major < MIN) {
  console.error(`
╔══════════════════════════════════════════════════════════════╗
║  ❌  Node.js incompatível                                    ║
║                                                              ║
║  Versão atual:     v${process.version.padEnd(38)}║
║  Versão mínima:    v${String(MIN).padEnd(38)}║
║  Versão recomend.: v${String(RECOMMENDED).padEnd(38)}║
║                                                              ║
║  nvm install ${RECOMMENDED}   (instala e já usa)                        ║
║  fnm install ${RECOMMENDED}   (instala e já usa)                        ║
║  volta install node@${RECOMMENDED}                                      ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

if (major < RECOMMENDED) {
  console.warn(`
╔══════════════════════════════════════════════════════════════╗
║  ⚠️   Node.js funciona, mas versão recomendada é diferente   ║
║                                                              ║
║  Versão atual:     v${process.version.padEnd(38)}║
║  Versão recomend.: v${String(RECOMMENDED).padEnd(38)}║
║                                                              ║
║  nvm use    →  usa a versão do .nvmrc automaticamente        ║
║  fnm use    →  usa a versão do .node-version                 ║
╚══════════════════════════════════════════════════════════════╝
`);
}
