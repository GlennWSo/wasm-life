/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Dead,
  Alive,
}
/**
*/
export class World {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {World}
*/
  static new(width: number, height: number): World;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {number}
*/
  cells(): number;
/**
* @param {number} width
* @param {number} height
*/
  set_size(width: number, height: number): void;
/**
* @param {number} row
* @param {number} col
*/
  toggle_cell(row: number, col: number): void;
/**
* @param {number} row
* @param {number} col
*/
  spawn_ship(row: number, col: number): void;
/**
* @param {number} row
* @param {number} col
*/
  spawn_diehard1(row: number, col: number): void;
/**
*/
  clear(): void;
/**
*/
  tick(): void;
/**
* @returns {string}
*/
  render(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_world_free: (a: number) => void;
  readonly world_new: (a: number, b: number) => number;
  readonly world_width: (a: number) => number;
  readonly world_height: (a: number) => number;
  readonly world_cells: (a: number) => number;
  readonly world_set_size: (a: number, b: number, c: number) => void;
  readonly world_toggle_cell: (a: number, b: number, c: number) => void;
  readonly world_spawn_ship: (a: number, b: number, c: number) => void;
  readonly world_spawn_diehard1: (a: number, b: number, c: number) => void;
  readonly world_clear: (a: number) => void;
  readonly world_tick: (a: number) => void;
  readonly world_render: (a: number, b: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
