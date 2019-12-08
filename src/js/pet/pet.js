export default function pet() {

    let pet = {
        item: document.getElementsByClassName('js-pet'),
        body: document.getElementsByClassName('js-pet-body'),
        eye: document.getElementsByClassName('js-pet-eye'),
        eyeDot: document.getElementsByClassName('js-pet-eye-dot'),
        mouth: document.getElementsByClassName('js-pet-mouth'),
        message: document.getElementsByClassName('js-pet-message'),
    },
    vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    status = 0,
// 0 - chill in the right bot corner
// 1 - exploring elements
// 2 - following cursor
// 3 - rage
cursorCoord,
exploreEl,
message = '',
phrases = ['oooh', 'boring...', 'wow'];

if (pet.item.length) {

    init()

    floating()
    eyeTrack()
    // moveOnClick()
    test()

}

console.log(vw);
console.log(vh);


function test(){
    pet.body[0].addEventListener('click', (e) => {
        changeStatus(0)
    });
}

function changeStatus(status){
    let item = pet.item[0];

    switch (status) {
        case 0:
        console.log('status: ' + status);

        item.style.left = (vw - 180) + 'px';
        item.style.top = (vh - 130) + 'px';

        localStorage.setItem('petCoordsX', item.style.left)
        localStorage.setItem('petCoordsY', item.style.top)
        break;
        case 1:
        console.log('status: ' + status);
        break;
        case 2:
        console.log('status: ' + status);
        break;
        case 3:
        console.log('status: ' + status);
        break;
        default:
        console.log('status: ' + status);
    }

}

function init(){
    let item = pet.item[0];
    let coords = pet.item[0].getBoundingClientRect();

    item.style.left = localStorage.getItem('petCoordsX');
    item.style.top = localStorage.getItem('petCoordsY');
}

function talking(phrase) {
    pet.message.innerHTML = phrase;
}

function floating() {

    TweenMax.to(pet.item, 2, {
        bezier: getBezier(2, 5, 3, 4, false),
        repeat: -1,
        ease: Linear.easeNone
    });

    TweenMax.to(pet.message, 2, {
        bezier: getBezier(-2, -5, -3, -4, false),
        repeat: -1,
        ease: Linear.easeNone
    });

}

function eyeTrack() {
    document.addEventListener('mousemove', (e) => {
        let eyes = pet.eye;

        for (let eye of eyes) {
            const x = eye.getBoundingClientRect().left + (eye.clientWidth / 2);
            const y = eye.getBoundingClientRect().top + (eye.clientHeight / 2);
            const radian = Math.atan2(e.pageX - x, e.pageY - y);
            const rot = (radian * (180 / Math.PI) * -1) - 140;

            eye.style.transform = `rotate(${rot}deg)`;

            localStorage.setItem(`petEyesRotating${[eye]}`, eye.style.transform = `rotate(${rot}deg)`)
        }
    });
}

function moveOnClick() {
    pet.body[0].addEventListener('mousedown', (e) => {


        let item = pet.item[0],
        coords = offset(item),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop,
        shiftX = (e.pageX - coords.left) + scrollLeft,
        shiftY = (e.pageY - coords.top) + scrollTop;

        console.log(item.getBoundingClientRect());

        moveAt(e);

        function moveAt(e) {
            item.style.left = e.pageX - shiftX + 'px';
            item.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        item.onmouseup = function () {
            document.onmousemove = null;
            item.onmouseup = null;

            localStorage.setItem('petCoordsX', item.style.left)
            localStorage.setItem('petCoordsY', item.style.top)
        };

    });

    pet.item.ondragstart = function () {
        return false;
    };
}



function offset(element) {
    let rect = element.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    }
}

function getBezier(cx, cy, rx, ry, autoRotate) {

    ry = ry || rx;

    let k = 0.551915024494;
    let x = k * rx;
    let y = k * ry;

    return {
        autoRotate: autoRotate || false,
        type: "cubic",
        values: [
        { x: cx + rx, y: cy },
        { x: cx + rx, y: cy + y }, { x: cx + x, y: cy + ry }, { x: cx, y: cy + ry },
        { x: cx - x, y: cy + ry }, { x: cx - rx, y: cy + y }, { x: cx - rx, y: cy },
        { x: cx - rx, y: cy - y }, { x: cx - x, y: cy - ry }, { x: cx, y: cy - ry },
        { x: cx + x, y: cy - ry }, { x: cx + rx, y: cy - y }, { x: cx + rx, y: cy }
        ]
    };
}

}
