import * as h from './help'

export default function rotate(element) {

    let tl0 = new TimelineMax(),
        nt = {
            signs: ['-=', '+=']
        };

    tl0.to(element, 1 * h.randomRange(0.9, 1.1), {
        css: {

            rotationY: nt.signs[h.rand2Number()] + 720 + "deg",
            rotationX: Math.random() * 360,
            z: 400,
            left: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px",
            top: nt.signs[h.rand2Number()] + (Math.random() * 400) + "px"
        },
        ease: Linear.easeOut,
        repeat: 0,
        yoyo: false,
        paused: false
    });

    console.log('rotate()');


}
