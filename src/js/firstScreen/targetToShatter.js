import { TweenMax } from 'gsap'

import * as h from './help'
import triangulate from './triangulate'
import shatter from './shatter'
import boom from './boom'
import rotate from './rotate'


export default function targetToShatter(imgToShatter, clickX, clickY) {

    h.image = imgToShatter;
    h.imageBound = h.image.getBoundingClientRect();
    h.container = imgToShatter.parentNode;
    h.clickPosition[0] = clickX;
    h.clickPosition[1] = clickY;
    h.imageWidth = imgToShatter.offsetWidth
    h.imageHeight = imgToShatter.offsetHeight

    TweenMax.defaultEase = Linear.easeNone;
    TweenMax.set(h.container, { perspective: 600 });

    console.log(`targetToShatter(${h.image}(w:${h.imageWidth}, h:${h.imageHeight}), clickX:${clickX}, clickY:${clickY}`);

    h.container.removeEventListener('click', targetToShatter);

    triangulate(clickX, clickY);
    shatter(shatterToPiecesBoom);

}

function shatterToPiecesBoom() {

    boom(h.fragments, h.clickPosition[0], h.clickPosition[1])
    // rotate(h.fragments)

    // h.fragments.forEach(function (f) {
    //     h.container.removeChild(f.canvas);
    // });
    // h.fragments.length = 0;
    // h.vertices.length = 0;
    // h.indices.length = 0;

    console.log('end');


}



