import p5 from 'p5';
import * as tome from 'chromotome';
import SimplexNoise from 'simplex-noise';

import { drawLine, drawArea } from './drawingFunctions';

const sketch = p5 => {

    const palette = tome.getRandom();
    const bgC = palette.colors[0];
    const mtC = palette.colors[1];
    const seC = palette.colors.length <= 2 ? "#000" : palette.colors[2];
    const full = { p: 40, w: 900, h: 600, };
    const debug = { p: 2, w: 40, h: 40, };
    const padding = full.p;
    const canvasWidth = full.w;
    const canvasHeight = full.h;
    const width = canvasWidth + 1 - padding * 2;
    const height = canvasHeight + 1 - padding * 2;
    const r = 1;
    const noiseSeed = Date.now();

    let noise, nField;

    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(bgC);
        noise = new SimplexNoise(noiseSeed);
        console.log("seed: ", noiseSeed);
        console.log("palette: ", palette.name);
        createNoiseField();
        processField(true); // Sea
        processField(false); // Mountains
    };

    const createNoiseField = () => {
        nField = [];
        p5.push();
        p5.translate(padding, padding);
        for (let y = 0; y < height; y += r) {
            let cols = [];
            for (let x = 0; x < width; x += r) {
                /*
                    f 0.001
                    a 1
                    Najfajniejsze kombinacje:
                    1 :: a * noise.noise2D(x * f, y * f) * p5.sin(x + y)
                    2 :: a * noise.noise2D(x * f, y * f) * p5.sin(x * y)
                    3 :: a * noise.noise2D(x * f, y * f) * ((x + y) * 0.01 % p5.TWO_PI)
                    4 :: a * noise.noise2D(x * f, y * f) * ((p5.sin(x * 0.1) + p5.sin(y * 0.1)) * p5.TWO_PI)
                    5 :: final += p5.sin(x + y)
                */
                let signal = 0, a = 1, f = 0.001;
                for (let i = 0; i < 16; i++) {
                    signal += a * noise.noise2D(x * f, y * f);
                    a *= 0.5;
                    f *= 2;
                }
                cols.push(signal);
            }
            nField.push(cols);
        }
        p5.pop();
    };

    const processField = isSea => {
        p5.push();
        p5.translate(padding, padding);
        for (let y = 0; y < height - 1; y += r) {
            for (let x = 0; x < width - 1; x += r) {
                processRect(x / r, y / r, isSea);
            }
        }
        p5.pop();
    };

    const processRect = (x, y, isSea) => {
        /*
           n
         w   e
           s
        */
        const a = nField[y][x];
        const b = nField[y][x + 1];
        const c = nField[y + 1][x + 1];
        const d = nField[y + 1][x];

        const newX = x * r;
        const newY = y * r;

        const n = p5.createVector(newX + r / 2, newY);
        const e = p5.createVector(newX + r, newY + r / 2);
        const s = p5.createVector(newX + r / 2, newY + r);
        const w = p5.createVector(newX, newY + r /2);
        
        const nw = p5.createVector(newX, newY);
        const ne = p5.createVector(newX + r, newY);
        const se = p5.createVector(newX + r, newY + r);
        const sw = p5.createVector(newX, newY + r);


        if (isSea) {
            const threshold = -0.1;
            const id = getId(a, b, c, d, threshold, isSea);
        
            p5.stroke(seC);
            p5.fill(seC);
            drawArea(p5, id, n, e, s, w, nw, ne, se, sw);
        } else {
            const iterations = 10;
            for (let i = 0; i < iterations; i++) {
                const threshold = -1 + i / 10;
                const id = getId(a, b, c, d, threshold, isSea);
                
                p5.stroke(mtC);
                p5.strokeWeight(1);
                drawLine(p5, id, n, e, s, w);
            }
        }
    };

    const getId = (a, b, c, d, th, iS) => {
        const tA = iS ? (a > th ? 8 : 0) : (a < th ? 8 : 0);
        const tB = iS ? (b > th ? 4 : 0) : (b < th ? 4 : 0);
        const tC = iS ? (c > th ? 2 : 0) : (c < th ? 2 : 0);
        const tD = iS ? (d > th ? 1 : 0) : (d < th ? 1 : 0);
        return tA + tB + tC + tD;
    }

    p5.keyPressed = () => {
        if (p5.keyCode === 80) {
            p5.saveCanvas(`04.04.2021-${Date.now()}`, 'png');
        }
    };
};

new p5(sketch);

/*
                                                                                                    
                                                                                                    
                                                             ###                                    
          ###     ###                                       ###                           ####      
          ###     #####                                ##############                     ###     
     #######################     ##############             ###                           ###      
          ###     ###    ####                ####          ###    ###########             ###       
           ###           ###                  ####         ###           ####             ###       
           ###     ########                   ###         ###                                       
           ###                             ######         ###    ###                      ###      
           ####                       ######             ###      ###########             ###          
                                           
           
           
                04.04.2021
                
                1. Stworzy?? dwu wymiarow?? tablic?? i zapisa?? w niej warto??ci Simplexa
                dla ka??dego piksela (razy resolution r) dla ka??dej kolumny i ka??dego rz??du.

                for (let y = 0; y < height; y += r) {
                    let yArr = [];
                    for (let x = 0; x < width; x += r) {
                            yArr.push(noise.noise2D(x, y));
                        }
                        nField.push(yArr);
                    }
                }
                
                2. Simplex jest jak fala audio, leci od -1 do 1 i ma amplitud?? i
                cz??stotliwo????. Poniewa?? jest jak sygna??, mo??na dodawa??
                do niego inne sygna??y aby stworzy?? co?? co ma wi??cej detali. Najlepiej
                dodawa?? szum do samego siebie z r????nymi cz??stotliwo??ciami i amplitud?? w for loopie.

                let signal = 0, a = 1, f = 0.001;
                for (let i = 0; i < 16; i++) {
                    signal += a * noise.noise2D(x * f, y * f);
                    a *= 0.5;
                    f *= 2;
                }
                
                3. Algorytm maszeruj??cych kwadrat??w wygl??da tak: zczytuje si?? warto????
                ka??dego punktu z tablicy na pocz??tku i trzech punkt??w: na lewo, d???? i
                lewo, d????. Odgradzamy -1 od 1 liniami. Najlepiej sprawdzi?? sobie na
                wykresie jak oddziela?? i kiedy bo mo??na si?? pomyli??.

                const a = nField[y][x];
                const b = nField[y][x + 1];
                const c = nField[y + 1][x + 1];
                const d = nField[y + 1][x];

                4. To jaka kombinacja zapalonych punkt??w i ciemnych idzie gdzie zale??y
                od indexu kt??ry mo??na wyliczy?? dodaj??c wszystkie punkty i konwertuj??c
                je na system binarny czyli a * 8 + b * 4 + c * 2 + d. Mo??na wyliczy?? index
                w inny spos??b, ten jest po prostu najwygodniejszy.

                const getId = (a, b, c, d, th, iS) => {
                    const tA = iS ? (a > th ? 8 : 0) : (a < th ? 8 : 0);
                    const tB = iS ? (b > th ? 4 : 0) : (b < th ? 4 : 0);
                    const tC = iS ? (c > th ? 2 : 0) : (c < th ? 2 : 0);
                    const tD = iS ? (d > th ? 1 : 0) : (d < th ? 1 : 0);
                    return tA + tB + tC + tD;
                }

                5. Mo??na odgrodzi?? si?? lini?? albo vertexami (czyli obszarem po????czonych
                wektor??w). Linie s?? dobre dla g??r, vertexy dla morza.

                const drawVectorLine = (v1, v2, p5) => { p5.line(v1.x, v1.y, v2.x, v2.y); };
                const drawVertex = (v, p5) => { p5.vertex(v.x, v.y); };

                6. Ustawi?? jaki?? pr??g powy??ej kt??rego b??d?? rysowa?? si?? linie (g??ry) a
                poni??ej vertexy (morze). Np 0, sprawi ??e b??dzie po??owicznie g??ry i
                po??owicznie morze bo 0 jest po??rodku mi??dzy -1 a 1.

                if (isSea) {
                    const threshold = -0.1;
                    ...
                    drawArea(p5, id, n, e, s, w, nw, ne, se, sw);
                } else {
                    const iterations = 10;
                    for (let i = 0; i < iterations; i++) {
                        const threshold = -1 + i / 10;
                        ...
                        drawLine(p5, id, n, e, s, w);
                    }
                }

                7. ??eby linie g??r rysowa??y si?? coraz bardziej do ??rodka w for loopie
                zmniejszamy ten pr??g troch?? po trochu np razy i / 10.

                const iterations = 10;
                for (let i = 0; i < iterations; i++) {
                    const threshold = -1 + i / 10;
                    ...
                    drawLine(p5, id, n, e, s, w);
                }

                8. Gdy wszystko dzia??a mo??na pododawa?? wi??cej dziwnych sygna????w do Simplexa,
                np sin, cos, 0.01 % TWO_PI itp, aby wygenerowa?? wi??cej ciekawych kszta??t??w.

                let signal = 0, a = 1, f = 0.001;
                for (let i = 0; i < 16; i++) {
                    signal += a * noise.noise2D(x * f, y * f) * ((p5.sin(x * 0.1) + p5.sin(y * 0.1)) * p5.TWO_PI);
                    a *= 0.5;
                    f *= 2;
                }

*/