import * as h from './help'

export default function boom(element, clickX, clickY) {

    let bounds = h.container.getBoundingClientRect(),
        center = {
            x: clickX,
            y: clickY,
        },
        cfg = h.cfg.boom,
        stagger = cfg.stagger,
        radius = getDistance(center, bounds);

    element.forEach(function (element) {

        element = element.canvas;

        let bbox = element.getBoundingClientRect();
        let dist = getDistance(bbox, center);
        let delay = dist / radius * stagger;
        let scalar = radius / dist;

        let tl0 = new TimelineMax();
        let tl1 = new TimelineMax();


        tl0.to(element, cfg.speed1, {
            autoAlpha: cfg.alpha,
            x: (bbox.x - center.x) * scalar,
            y: (bbox.y - center.y) * scalar
        }, delay);

        tl1.to(tl1, cfg.speed2, {
            progress: cfg.progress,
            ease: cfg.ease,
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
