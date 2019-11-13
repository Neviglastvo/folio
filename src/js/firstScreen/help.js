
export let cfg = {
    shatteredEl: [ //used in triangulation, r=radius c=count
        { r: 100, c: 18 },
        { r: 250, c: 21 },
        { r: 500, c: 23 },
        { r: 1000, c: 15 },
        { r: 2000, c: 12 },
    ],
    variance: 0.5, //0.5 - 5 best. Variativity of fragments
    shatter: {
        delay: 0.1,
        speed: 0.1,
        fragmentDelay: 0.003,
        fragmentDelayRandomMin: 0.1,
        fragmentDelayRandomMax: 0.5,
        shatteredOpacityOfFragment: 0.9,
        shatteredOpacityDelayBefore: 0.01, // sec
        shatteredOpacitySpeed: 0.05, // sec
    },
    boom: {
        stagger: 1, //delay before next fragment boom()
        progress: 0.1,
        alpha: 0.5,
        ease: 'Expo.easeInOut',
        speed1: 1, // overall animation speed
        speed2: 0,

    },
    rotate: {
        ease: 'Linear.easeOut',
        speed: 20, // overall animation speed (lower - faster)
        speedRandomMin: 0.1, // minimum rotation speed
        speedRandomMax: 0.5, // maximum rotation speed
        repeat: 0, //0 - no repeat, -1 repeat

    },
}

export const TWO_PI = Math.PI * 2;

export let indices = [],
    vertices = [],
    fragments = [];

export let
    image,
    imageBound,
    container,
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


