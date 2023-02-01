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
* panics if row or col is out of range
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
