#!/usr/bin/env fish
echo running debug mode
wasm-pack build --debug --target web
echo redirecting server msg to server.log
nohup python -m http.server > server.log