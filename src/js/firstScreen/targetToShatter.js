import { TweenMax } from 'gsap/TweenMax'

import * as h from './help'
import triangulate from './triangulate'
import shatter from './shatter'
import boom from './boom'
import rotate from './rotate'


export default function targetToShatter(imgToShatter, clickX, clickY) {

    h.image = imgToShatter;
    h.container = imgToShatter.parentNode;
    h.containerBound = h.container.getBoundingClientRect();
    // h.imageWidth = window.getComputedStyle(h.image).width;
    // h.imageHeight = window.getComputedStyle(h.image).height;
    h.clickPosition[0] = clickX;
    h.clickPosition[1] = clickY;
    h.imageWidth = imgToShatter.offsetWidth
    h.imageHeight = imgToShatter.offsetHeight

    TweenMax.defaultEase = Linear.easeNone;
    TweenMax.set(h.container, { perspective: 600 });

    console.log(`targetToShatter(${h.image}(w:${h.imageWidth}, h:${h.imageHeight}), clickX:${clickX}, clickY:${clickY}`);

    h.container.removeEventListener('click', targetToShatter);

    triangulate(h.clickPosition[0], h.clickPosition[1]);
    shatter(shatterToPiecesBoom);



}

function shatterToPiecesBoom() {


    // h.fragments.forEach(function (fragment) {

    boom(h.fragments, h.clickPosition[0], h.clickPosition[1])
        // rotate(fragment.canvas)
    // });

    console.log('shatterToPiecesBoom()');
}



