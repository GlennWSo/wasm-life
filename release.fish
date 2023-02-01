#!/usr/bin/env fish
echo building for release
wasm-pack build --target web
rm -rf docs
mkdir docs
cp index.* docs/
cp -r pkg docs/
rm docs/pkg/.gitignore
python -m http.server -d docs
