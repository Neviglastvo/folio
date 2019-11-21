import { TweenMax } from 'gsap'

import * as h from './help'
import triangulate from './triangulate'
import shatter from './shatter'
// import rotate from './rotate'

export default function targetToShatter(imgToShatter, clickX, clickY) {

    return new Promise(function (resolve, reject) {

        h.prepareValues(imgToShatter, clickX, clickY)

    }).then(function () {

        TweenMax.defaultEase = Linear.easeNone;
        TweenMax.set(h.container, { perspective: 600 });
        h.container.removeEventListener('click', targetToShatter);

    })
    .then(triangulate(clickX, clickY))
    .then(shatter());

}






