
export let cfg = {
    shatteredEl: [ //used in triangulation, r=radius c=count
        { r: 100, c: 50 },
        { r: 300, c: 40 },
        { r: 500, c: 20 },
        { r: 1000, c: 20 },
        { r: 3000, c: 10 },
    ],
    variance: 4, //0.5 - 5 best. Variativity of fragments
    shatter: {
        delay: 0.03,
        speed: 0.001,
        fragmentDelay: 0.001,
        fragmentDelayRandomMin: 0.3,
        fragmentDelayRandomMax: 0.8,
        shatteredOpacityOfFragment: 0.9,
        shatteredOpacityDelayBefore: 0.01, // sec
        shatteredOpacitySpeed: 0.05, // sec
    },
    boom: {
        stagger: 0.5, //delay before next fragment boom()
        progress: 1,
        alpha: 0.5,
        ease: 'Expo.easeInOut',
        speed1: 1, // overall animation speed
        speed2: 0,

    },
    rotate: {
        ease: 'Linear.easeOut',
        speed: 2, // overall animation speed (lower - faster)
        speedRandomMin: 0.5, // minimum rotation speed
        speedRandomMax: 1.5, // maximum rotation speed
        repeat: 0, //0 - no repeat, -1 repeat

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


