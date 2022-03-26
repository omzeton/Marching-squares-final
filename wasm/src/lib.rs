use wasm_bindgen::prelude::*;
use opensimplex_noise_rs::OpenSimplexNoise;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct ByteStream {
    offset: *const u8,
    size: usize,
}

#[wasm_bindgen]
impl ByteStream {
    pub fn new(bytes: &[u8]) -> ByteStream {
        ByteStream {
            offset: bytes.as_ptr(),
            size: bytes.len(),
        }
    }

    pub fn offset(&self) -> *const u8 {
        self.offset
    }

    pub fn size(&self) -> usize {
        self.size
    }
}

#[wasm_bindgen]
pub struct NoiseField {
    width: u32,
    height: u32,
    simplex: OpenSimplexNoise,
}

#[wasm_bindgen]
impl NoiseField {
    pub fn new() -> NoiseField {
        let canvas_width = 900;
        let canvas_height = 600;

        let width = canvas_width + 1;
        let height = canvas_height + 1;

        let simplex = OpenSimplexNoise::new(Some(883_279_212_983_182_319));

        NoiseField {
            width,
            height,
            simplex
        }
    }

    pub fn populate_noise_field(&self) -> ByteStream {
        let mut field = Vec::new();
        for y in 0..self.height {
            let mut columns = Vec::new();
            for x in 0..self.width {
                let mut signal = 0.0;
                let mut a = 1.0;
                let mut f = 0.001;

                for i in 0..16 {
                    let noise = self.simplex.eval_2d(x as f64 * f, y as f64 * f);
                    signal += a * noise;
                    a *= 0.5;
                    f *= 2.0;
                }

                columns.push(signal);
            }
            field.push(columns);
        }
        ByteStream::new(&field)
    }
}

#[wasm_bindgen]
pub fn process_sea() {}

#[wasm_bindgen]
pub fn process_mountains() {}