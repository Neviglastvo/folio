import * as h from './help'
import Delaunay from '../lib/delaunay'

export default function triangulate(clickX, clickY) {

    h.vertices.push([clickX, clickY]);

    h.cfg.shatteredEl.forEach(function (ring) {
        let x, y,
            radius = ring.r,
            count = ring.c,
            variance = radius * h.cfg.variance;

        for (let i = 0; i < count; i++) {
            x = Math.cos((i / count) * h.TWO_PI) * radius + clickX + h.randomRange(-variance, variance);
            y = Math.sin((i / count) * h.TWO_PI) * radius + clickY + h.randomRange(-variance, variance);
            h.vertices.push([x, y]);
        }
    });

    h.vertices.forEach(function (v) {
        v[0] = h.clamp(v[0], 0, h.imgBound.width);
        v[1] = h.clamp(v[1], 0, h.imgBound.height);
    });

    h.indices = Delaunay.triangulate(h.vertices);
    // console.log(`triangulate(), clickX:${clickX}, clickY:${clickY}`);

}

//Delaunay triangulation used (Тріангуляція Делоне)
