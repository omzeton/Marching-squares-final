use wasm_bindgen::prelude::*;
use opensimplex_noise_rs::OpenSimplexNoise;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct MarchingSquares {
    width: u32,
    height: u32,
    simplex: OpenSimplexNoise,
    computed_field: Vec<Vec<f64>>,
}

impl MarchingSquares {
    fn create_noise_field(&mut self) {
        let mut field = Vec::new();
        for y in 0..self.height {
            let mut columns = Vec::new();
            for x in 0..self.width {
                let mut signal: f64 = 0.0;
                let mut a: f64 = 1.0;
                let mut f: f64 = 0.001;

                for _ in 0..16 {
                    let noise = self.simplex.eval_2d(x as f64 * f, y as f64 * f);
                    signal += a * &noise;
                    a *= 0.5;
                    f *= 2.0;
                }

                columns.push(signal);
            }
            field.push(columns);
        }
        for y in 0..self.height - 1 {
            for x in 0..self.width - 1 {
                self.process_rectangle(x as usize, y as usize, false, &field);
            }
        }
    }

    fn process_rectangle(&self, x: usize, y: usize, is_sea: bool, field: &Vec<Vec<f64>>) {
        let a = field[y][x];
        let b = field[y][x + 1];
        let c = field[y + 1][x + 1];
        let d = field[y + 1][x];

        let r = 1;

        let n = vec![x + r / 2, y];
        let e = vec![x + r, y + r / 2];
        let s = vec![x + r / 2, y + r];
        let w = vec![x, y + r / 2];

        let nw = vec![x, y];
        let ne = vec![x + r, y];
        let se = vec![x + r, y + r];
        let sw = vec![x, y + r];

        if is_sea {
            let threshold: f64 = -0.1;
            let id: usize = self.compute_id(a, b, c, d, threshold, false);
        }
    }

    fn compute_id(&self, a: f64, b: f64, c: f64, d: f64, th: f64, is: bool) -> usize {
        let t_a: usize = if is { if a > th { 8 } else { 0 } } else { if a < th { 8 } else { 0 } };
        let t_b: usize = if is { if b > th { 4 } else { 0 } } else { if b < th { 4 } else { 0 } };
        let t_c: usize = if is { if c > th { 2 } else { 0 } } else { if c < th { 2 } else { 0 } };
        let t_d: usize = if is { if d > th { 1 } else { 0 } } else { if d < th { 1 } else { 0 } };
        t_a + t_b + t_c + t_d
    }
}

#[wasm_bindgen]
impl MarchingSquares {
    #[wasm_bindgen(constructor)]
    pub fn new() -> MarchingSquares {
        let computed_field = Vec::new();
        MarchingSquares {
            width: 901,
            height: 601,
            simplex: OpenSimplexNoise::new(Some(883_279_212_983_182_319)),
            computed_field,
        }
    }
}
