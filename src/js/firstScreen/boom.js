import * as h from './help'

export default function boom(element, id) {

    let cfg = h.cfg.boom,
        clickPosition = {
            x: h.clickPosition[0],
            y: h.clickPosition[1]
        };

    element.forEach((fragment) => {

        fragment = fragment.fragment.canvas;

        // console.log('fragment ID: ' + id + '; imgID: ' + h.imageID);

        if (id === h.imageID) {

            let bbox = fragment.getBoundingClientRect(),
                dist = h.getDistance(bbox, clickPosition),
                delay = dist / h.radius * cfg.stagger,
                scalar = h.radius / dist,
                nt = {
                    signs: ['-=', '+=']
                };

            // console.log(dist);

            let tl0 = new TimelineMax();
            let tl1 = new TimelineMax();

            tl0.to(fragment, cfg.speed1, {
                autoAlpha: cfg.alpha,
                x: (bbox.x - clickPosition.x) * scalar,
                y: (bbox.y - clickPosition.y) * scalar,
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


