#!/usr/bin/env fish
echo hello
wasm-pack build
rm -rf www/node_modules/wasm-life
cd www
npm install wasm-life
npm run build
npm run start