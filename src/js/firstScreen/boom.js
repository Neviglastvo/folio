import * as h from './help'

export default function boom(element, id) {

    let cfg = h.cfg.boom,
        clickPosition = {
            x: h.clickPosition[0],
            y: h.clickPosition[1]
        };

    console.log(element);


    element.forEach((fragment, i) => {

        fragment = fragment.fragment.canvas;

        // console.log('fragment ID: ' + id + '; imgID: ' + h.imgID);

        if (id === h.imgID) {

            let bbox = fragment.getBoundingClientRect(),
                dist = h.getDistance(bbox, clickPosition),
                delay = dist / h.radius * cfg.stagger,
                scalar = h.radius / dist,
                nt = {
                    signs: ['-=', '+=']
                };

            let tl0 = new TimelineMax();
            let tl1 = new TimelineMax();

            tl0.to(fragment, cfg.speed1, {
                autoAlpha: cfg.alpha,
                x: (bbox.x - clickPosition.x) * scalar,
                y: (bbox.y - clickPosition.y) * scalar,
                rotationX: Math.random() * 360,
                rotationY: nt.signs[h.rand2Number()] + 720 + "deg",
                rotationZ: Math.random() * 400,
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


