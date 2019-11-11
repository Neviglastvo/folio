
export let cfg = {
    shatteredEl: [ //used in triangulation, r=radius c=count
        { r: 100, c: 15 },
        { r: 200, c: 25 },
        { r: 500, c: 20 },
        { r: 1000, c: 20 },
        { r: 2000, c: 10 } // very large in case of corner clicks
    ],
    variance: 3, //0.5 - 5 variativity of fragments
    shatter: {
        delay: 0.03,
        speed: 0.001,
        fragmentDelay: 0.001,
        fragmentDelayRandomMin: 0.3,
        fragmentDelayRandomMax: 0.8,
        shatteredOpacityOfFragment: 0.8,
        shatteredOpacityDelayBefore: 0.01, // sec
        shatteredOpacitySpeed: 0.05, // sec
    },
    boom: {
        stagger: 0.6, //delay before next fragment boom()
        progress: 1,
        alpha: 0.5,
        ease: 'Expo.easeInOut',
        speed1: 2, // overall animation speed
        speed2: 1,

    },
}

export const TWO_PI = Math.PI * 2;

export let indices = [],
    vertices = [],
    fragments = [];

export let
    image,
    container,
    containerBound,
    imageWidth,
    imageHeight,
    clickPosition = [];
    // clickPosition = [imageWidth * 0.5, imageHeight * 0.5];

export function randomRange(min, max) {
    return min + (max - min) * Math.random();
}

export function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}

export function sign(x) {
    return x < 0 ? -1 : 1;
}



export function rand2Number() {
    return Math.round(Math.random(1));
};

console.log(` Viewport w: ${window.innerWidth}, h: ${window.innerHeight}`);


