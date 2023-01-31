mod utils;

use fixedbitset::FixedBitSet;
use std::fmt;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct World {
    width: u32,
    height: u32,
    cells: FixedBitSet,
}

impl World {
    fn get_row_col(&self, idx: usize) -> (u32, u32) {
        let w = self.width as usize;
        let row = idx / w;
        let col = idx % w;
        (row as u32, col as u32)
    }

    fn get_idx(&self, row: usize, col: usize) -> usize {
        let w = self.width as usize;
        col + row * w
    }
    fn get_size(&self) -> usize {
        (self.width * self.height) as usize
    }

    fn get_cell(&self, row: u32, col: u32) -> bool {
        let idx = (row * self.width + col) as usize;
        self.cells[idx]
    }

    fn count_live_neighbor(&self, row: u32, col: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter() {
            for delta_col in [self.width - 1, 0, 1].iter() {
                if *delta_row == 0 && *delta_col == 0 {
                    continue;
                }
                let nb_row = (row + delta_row) % self.height;
                let nb_col = (col + delta_col) % self.width;
                count += self.get_cell(nb_row, nb_col) as u8;
            }
        }
        count
    }

    fn cell_rules(cell: bool, live_nbs: u8) -> bool {
        let lives = match live_nbs {
            2 => cell,
            3 => true,
            // cells cant live if nb<2
            // cells die from overpopulation if nb>3
            _ => false,
        };
        lives
    }
}

#[wasm_bindgen]
impl World {
    pub fn new(width: u32, height: u32) -> World {
        let mut cells = FixedBitSet::with_capacity((width * height) as usize);

        for (idx, life) in (0..width * height).map(|_| rand::random()).enumerate() {
            cells.set(idx, life);
        }

        World {
            width,
            height,
            cells,
        }
    }
    pub fn space_ship(width: u32, height: u32) -> World {
        let size = (width * height) as usize;
        let cells = FixedBitSet::with_capacity(size);
        let mut world = World {
            width,
            height,
            cells,
        };

        let ship_rc = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
        for [r, c] in ship_rc {
            let idx = world.get_idx(r, c);
            world.cells.set(idx, true);
        }
        world
    }

    pub fn width(&self) -> u32 {
        self.width
    }
    pub fn height(&self) -> u32 {
        self.height
    }
    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    pub fn tick(&mut self) {
        let mut next_gen = self.cells.clone();
        for idx in 0..self.get_size() {
            let (r, c) = self.get_row_col(idx);
            let live_nbs = self.count_live_neighbor(r, c);
            let alive = World::cell_rules(self.cells[idx], live_nbs);
            next_gen.set(idx, alive);
        }

        self.cells = next_gen;
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for World {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let cells: Vec<bool> = (0..self.get_size()).map(|idx| self.cells[idx]).collect();
        for line in cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            writeln!(f, "")?;
        }
        Ok(())
    }
}
