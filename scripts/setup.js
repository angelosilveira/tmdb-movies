#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const root    = path.resolve(__dirname, '..');
const example = path.join(root, '.env.example');
const target  = path.join(root, '.env');

if (fs.existsSync(target)) {
  console.log('✅  .env já existe — nenhuma alteração feita.');
  console.log('    Para resetar: delete o .env e rode yarn setup novamente.');
  process.exit(0);
}

fs.copyFileSync(example, target);

console.log('');
console.log('✅  Ambiente configurado com sucesso!');
console.log('');
console.log('   O .env foi criado com todas as variáveis necessárias.');
console.log('   Sentry e Google Analytics estão desabilitados por padrão.');
console.log('   A aplicação já funciona — não é necessário criar contas.');
console.log('');
console.log('   Próximo passo:  yarn dev');
console.log('');
