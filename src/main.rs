use std::thread::sleep;
use std::time::Duration;
use wasm_life::World;

fn clear() {
    print!("\x1B[2J\x1B[1;1H");
}

fn main() {
    let mut game = World::new(32, 32);

    clear();
    println!("{}", game);
    for _ in 0..10000 {
        game.tick();
        let nap = Duration::from_millis(10);
        clear();
        sleep(nap);
        println!("{}", game);
    }
}
