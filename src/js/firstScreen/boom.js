import * as h from './help'

export default function boom(element, id) {

    console.log(element);


    let cfg = h.cfg.boom,
        center = {
            x: h.clickPosition[0],
            y: h.clickPosition[1]
        },
        center2 = {
            x: h.imageBound.x + h.imageBound.width / 2,
            y: h.imageBound.y + h.imageBound.height / 2,
        },
        radius = getDistance(center2, h.imageBound);

    element.forEach((fragment) => {

        fragment = fragment.fragment.canvas;

        console.log('fragment ID: ' + id + '; imgID: ' + h.imageID);

        if (id === h.imageID) {


            let bbox = fragment.getBoundingClientRect(),
                dist = getDistance(bbox, center),
                delay = dist / radius * cfg.stagger,
                scalar = radius / dist,
                nt = {
                    signs: ['-=', '+=']
                };

            // console.log(dist);


            let tl0 = new TimelineMax();
            let tl1 = new TimelineMax();


            tl0.to(fragment, cfg.speed1, {
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
        }

    });

    // console.log(`boom(), clickX:${clickX}, clickY:${clickY}`);


}

function getDistance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
