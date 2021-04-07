const drawLine = (p5, id, n, e, s, w) => {
    switch(id) {
        case 1:
        case 14:
            drawVectorLine(s, w, p5);
            break;
        case 2:
        case 13:
            drawVectorLine(e, s, p5);
            break;
        case 3:
        case 12:
            drawVectorLine(e, w, p5);
            break;
        case 4:
        case 11:
            drawVectorLine(n, e, p5);
            break;
        case 5:
            drawVectorLine(n, w, p5);
            drawVectorLine(e, s, p5);
            break;
        case 6:
        case 9:
            drawVectorLine(n, s, p5);
            break;
        case 7:
        case 8:
            drawVectorLine(n, w, p5);
            break;
        case 10:
            drawVectorLine(n, e, p5);
            drawVectorLine(s, w, p5);
            break;
    }
}

const drawArea = (p5, id, n, e, s, w, nw, ne, se, sw) => {
    p5.beginShape();
    switch(id) {
        case 1:
            drawVertex(s, p5);
            drawVertex(sw, p5);
            drawVertex(w, p5);
            break;
        case 2:
            drawVertex(s, p5);
            drawVertex(se, p5);
            drawVertex(e, p5);
            break;
        case 3:
            drawVertex(w, p5);
            drawVertex(e, p5);
            drawVertex(se, p5);
            drawVertex(sw, p5);
            break;
        case 4:
            drawVertex(n, p5);
            drawVertex(ne, p5);
            drawVertex(e, p5);
            break;
        case 5:
            drawVertex(n, p5);
            drawVertex(ne, p5);
            drawVertex(e, p5);
            drawVertex(s, p5);
            drawVertex(sw, p5);
            drawVertex(w, p5);
            break;
        case 6:
            drawVertex(n, p5);
            drawVertex(ne, p5);
            drawVertex(se, p5);
            drawVertex(s, p5);
            break;
        case 7:
            drawVertex(n, p5);
            drawVertex(ne, p5);
            drawVertex(se, p5);
            drawVertex(sw, p5);
            drawVertex(w, p5);
            break;
        case 8:
            drawVertex(w, p5);
            drawVertex(nw, p5);
            drawVertex(n, p5);
            break;
        case 9:
            drawVertex(n, p5);
            drawVertex(s, p5);
            drawVertex(sw, p5);
            drawVertex(nw, p5);
            break;
        case 10:
            drawVertex(n, p5);
            drawVertex(e, p5);
            drawVertex(se, p5);
            drawVertex(s, p5);
            drawVertex(w, p5);
            drawVertex(nw, p5);
            break;
        case 11:
            drawVertex(n, p5);
            drawVertex(e, p5);
            drawVertex(se, p5);
            drawVertex(sw, p5);
            drawVertex(nw, p5);
            break;
        case 12:
            drawVertex(w, p5);
            drawVertex(e, p5);
            drawVertex(ne, p5);
            drawVertex(nw, p5);
            break;
        case 13:
            drawVertex(nw, p5);
            drawVertex(ne, p5);
            drawVertex(e, p5);
            drawVertex(s, p5);
            drawVertex(sw, p5);
            break;
        case 14:
            drawVertex(w, p5);
            drawVertex(nw, p5);
            drawVertex(ne, p5);
            drawVertex(se, p5);
            drawVertex(s, p5);
            break;
        case 15:
            drawVertex(nw, p5);
            drawVertex(ne, p5);
            drawVertex(se, p5);
            drawVertex(sw, p5);
            break;
    }
    p5.endShape(p5.CLOSE);
}

const drawVectorLine = (v1, v2, p5) => { p5.line(v1.x, v1.y, v2.x, v2.y); };
const drawVertex = (v, p5) => { p5.vertex(v.x, v.y); };

export {
    drawLine,
    drawArea,
}