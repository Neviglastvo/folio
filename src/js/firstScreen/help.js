
export let cfg = {
    shatteredEl: [ //used in triangulation, r=radius c=count
        { r: 100, c: 16 },
        { r: 250, c: 12 },
        { r: 500, c: 10 },
        { r: 1000, c: 15 },
        { r: 2000, c: 20 },
    ],
    variance: 0.15, //0.5 - 5 best. Variativity of fragments 0.15
    shatter: {
        delay: 0.5,
        fragmentDelay: 0.001, // 0.007
        fragmentDelayRandomMin: 0.05,
        fragmentDelayRandomMax: 0.43,
        shatteredOpacityOfFragment: 0.9,
        shatteredOpacityDelayBefore: 0.01, // sec
        shatteredOpacitySpeed: 0.05, // sec
    },
    boom: {
        stagger: 0.3, //delay before next fragment boom()
        progress: 0.1, // linarity of overall animation
        alpha: 1,
        ease: 'Expo.easeIn',
        speed1: 2, // overall animation speed
        speed2: 1,

    },
    // rotate: {
    //     ease: 'Linear.easeOut',
    //     speed: 10, // overall animation speed (lower - faster)
    //     speedRandomMin: 0.1, // minimum rotation speed
    //     speedRandomMax: 1, // maximum rotation speed
    //     repeat: 0, //0 - no repeat, -1 repeat

    // },
}

export const TWO_PI = Math.PI * 2;

export let indices = [],
    vertices = [],
    fragments = [];

export let
    image,
    imageID,
    imageBound,
    imageCenter,
    radius,
    container,
    imageWidth,
    imageHeight,
    clickPosition = [];

export function prepareValues(imgToShatter, clickX, clickY) {

    image = imgToShatter;
    imageID = parseInt(imgToShatter.dataset.id);
    console.log('ID: ' + imageID);

    imageBound = image.getBoundingClientRect();

    imageCenter = {
        x: imageBound.x + imageBound.width / 2,
        y: imageBound.y + imageBound.height / 2,
    };

    radius = getDistance(imageCenter, imageBound);
    container = imgToShatter.parentNode;
    clickPosition[0] = clickX;
    clickPosition[1] = clickY;
    imageWidth = imgToShatter.offsetWidth
    imageHeight = imgToShatter.offsetHeight
}

export function randomRange(min, max) {
    return min + (max - min) * Math.random();
}

export function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

export function sign(x) {
    return x < 0 ? -1 : 1;
}

export function getDistance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function rand2Number() {
    return Math.round(Math.random(1));
};



