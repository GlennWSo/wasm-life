{

  description = "Minimal rust wasm32-unknown-unknown example";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
     nixpkgs.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let 
          overlays = [(import rust-overlay)];
          pkgs = import nixpkgs {
            inherit overlays system;
            config.allowUnfree= true; 
          }; 
          rust = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;
          inputs = [ 
            rust
            pkgs.wasm-pack
            pkgs.wasm-bindgen-cli
            pkgs.binaryen
            pkgs.nodePackages.npm
            ];
          devtools = [
            pkgs.nil
            pkgs.vscode-fhs
            pkgs.nodePackages.typescript-language-server
            pkgs.nodejs
          ];
      in
      {
        defaultPackage = pkgs.rustPlatform.buildRustPackage {
          pname = "nixwasm";
          version = "1.0.0";
          src = ./.;

          cargoLock = {
            lockFile = ./Cargo.lock;
          };

          nativeBuildInputs = inputs;

          buildPhase = ''
            cargo build --release --target=wasm32-unknown-unknown
            mkdir -p $out/src
            # cp ./package.json $out/;
            wasm-bindgen \
              --target nodejs \
              --out-dir $out/src \
              target/wasm32-unknown-unknown/release/nixwasm.wasm
          '';

          installPhase = "echo 'Skipping installPhase'";
        };

        devShell = pkgs.mkShell {
          packages = inputs ++ devtools;
          postShellHook = ''
          export NODE_OPTIONS=--openssl-legacy-provider
          '';
          };        
      }
    );
}
