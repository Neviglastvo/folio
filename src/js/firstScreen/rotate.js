import * as h from './help'

export default function rotate(element) {

    let cfg = h.cfg.rotate,
        center = {
            x: h.clickPosition[0],
            y: h.clickPosition[1]
        },
        radius = getDistance(center, h.imageBound);

    element.forEach(function (element) {

        element = element.canvas;

        let nt = {
                signs: ['-=', '+=']
            };

        let tl0 = new TimelineMax();

        tl0.to(element, cfg.speed, {
            css: {

                rotationY: nt.signs[h.rand2Number()] + 720 + "deg",
                rotationX: Math.random() * 360,
                z: 400,
                // left: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px",
                // top: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px"
            },
            ease: cfg.ease,
            repeat: cfg.repeat,
            yoyo: false,
            paused: false
        }, delay);

    });

    console.log('rotate()');

}

function getDistance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
