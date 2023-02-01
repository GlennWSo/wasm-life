//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate wasm_life;
use wasm_life::World;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[cfg(test)]
pub fn input_spaceship() -> World {
    let mut world = World::new(32, 32);
    world.set_size(6, 6);
    world.spawn_ship(0, 0);
    world
}

#[cfg(test)]
pub fn expected_spaceship() -> World {
    let mut universe = World::new(32, 32);
    universe.set_size(6, 6);
    universe.set_cells(&[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]);
    universe
}

#[wasm_bindgen_test]
fn test_spaceship() {
    let mut world = input_spaceship();
    world.tick();
    assert_eq!(world.get_cells(), expected_spaceship().get_cells());
}
