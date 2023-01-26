use std::fmt;

type Row = [bool; 5];

type Matrix = [Row; 5];

#[derive(Debug)]
struct Game {
    m: Matrix,
}

impl Game {
    fn new() -> Self {
        let mut m: Matrix = [[false; 5]; 5];
        for i in 1..4 {
            m[2][i] = true;
        }
        Game { m }
    }
}

impl fmt::Display for Game {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut res = fmt::Result::Ok(());
        for r in self.m {
            res = writeln!(f, "{:?}", r);
        }
        res
    }
}
fn main() {
    let game = Game::new();

    println!("{}", game);
}
