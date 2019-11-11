import * as h from './help'

export default function boom(element, clickX, clickY) {

    let bounds = h.image.getBoundingClientRect(),
        center = {
            x: clickX,
            y: clickY,
        },
        cfgBoom = h.cfg.boom,
        cfgRotate = h.cfg.rotate,
        radius = getDistance(center, bounds);

    element.forEach(function (element = element.canvas) {

        element = element.canvas;

        let bbox = element.getBoundingClientRect(),
            dist = getDistance(bbox, center),
            delay = dist / radius * cfgBoom.stagger,
            scalar = radius / dist,
            nt = {
                signs: ['-=', '+=']
            };

        let tl0 = new TimelineMax();
        let tl1 = new TimelineMax();


        tl0.to(element, cfgBoom.speed1, {
            autoAlpha: cfgBoom.alpha,
            x: (bbox.x - center.x) * scalar,
            y: (bbox.y - center.y) * scalar,
            css: {

                rotationY: nt.signs[h.rand2Number()] + 720 + "deg",
                rotationX: Math.random() * 360,
                z: 400,
                // left: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px",
                // top: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px"
            },
            ease: cfgRotate.ease,
            // repeat: cfgRotate.repeat,
        }, delay);

        tl1.to(tl1, cfgBoom.speed2, {
            progress: cfgBoom.progress,
            ease: cfgBoom.ease,
            repeat: 0,
        });

    });

    console.log(`boom(), clickX:${clickX}, clickY:${clickY}`);


}

function getDistance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
