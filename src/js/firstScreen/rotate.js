import * as h from './help'

export default function rotate(element) {

    let cfg = h.cfg.rotate;

    element.forEach(function (element) {

        element = element.canvas;

        let tl0 = new TimelineMax(),
            nt = {
                signs: ['-=', '+=']
            };

        tl0.to(element, cfg.speed * h.randomRange(cfg.speedRandomMin, cfg.speedRandomMax), {
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
        });

    });


    console.log('rotate()');


}
