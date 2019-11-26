
export let cfg = {
    shatteredEl: [ //used in triangulation, r=radius c=count
        { r: 100, c: 10 },
        { r: 250, c: 14 },
        { r: 500, c: 18 },
        { r: 1000, c: 15 },
        { r: 2000, c: 20 },
    ],
    variance: 0.07, //0.5 - 5 best. Variativity of fragments 0.15
    shatter: {
        delay: 0.5,
        fragmentDelay: 0.005, // 0.007
        fragmentDelayRandomMin: 0.03,
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
    img,
    imgID,
    imgBound,
    imgCenter,
    radius,
    container,
    clickPosition = [];

export function prepareValues(imgToShatter, clickX, clickY) {

    img = imgToShatter;
    imgID = parseInt(imgToShatter.dataset.id);
    // console.log('ID: ' + imgID);

    imgBound = img.getBoundingClientRect();

    console.log(imgBound);


    imgCenter = {
        x: imgBound.x + imgBound.width / 2,
        y: imgBound.y + imgBound.height / 2,
    };

    radius = getDistance(imgCenter, imgBound);
    container = imgToShatter.parentNode;
    clickPosition[0] = clickX;
    clickPosition[1] = clickY;
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
    let result = Math.sqrt(dx * dx + dy * dy);

    if (result === 0)
    {
        result = 1000;
    }
    // console.log(result);
    return result;
}

export function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export function rand2Number() {
    return Math.round(Math.random(1));
};



