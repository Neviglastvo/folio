import * as h from './help'

export default function boom(element) {

    let center = {
        x: h.clickPosition[0],
        y: h.clickPosition[1]
    },
        cfg = h.cfg.boom,
        radius = getDistance(center, h.imageBound);

    console.log(center);


    element.forEach(function (element) {

        element = element.canvas;

        let bbox = element.getBoundingClientRect(),
            dist = getDistance(bbox, center),
            delay = dist / radius * cfg.stagger,
            scalar = radius / dist,
            nt = {
                signs: ['-=', '+=']
            };

        // console.log(dist);


        let tl0 = new TimelineMax();
        let tl1 = new TimelineMax();


        tl0.to(element, cfg.speed1, {
            autoAlpha: cfg.alpha,
            x: (bbox.x - center.x) * scalar,
            y: (bbox.y - center.y) * scalar,
            rotationY: nt.signs[h.rand2Number()] + 720 + "deg",
            rotationX: Math.random() * 360,
            z: Math.random() * 400,
        }, delay);

        tl1.to(tl0, cfg.speed2, {
            progress: cfg.progress,
            ease: cfg.ease,
            repeat: 0,
        });

    });

    // console.log(`boom(), clickX:${clickX}, clickY:${clickY}`);


}

function getDistance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
