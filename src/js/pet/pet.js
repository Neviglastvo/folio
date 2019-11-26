export default function pet() {
    let pet = {
        item: document.getElementsByClassName('js-pet'),
        body: document.getElementsByClassName('js-pet-body'),
        eye: document.getElementsByClassName('js-pet-eye'),
        eyeDot: document.getElementsByClassName('js-pet-eye-dot'),
        mouth: document.getElementsByClassName('js-pet-mouth'),
        message: document.getElementsByClassName('js-pet-message'),
    },
        status = 0,
        // 0 - chill in the right bot corner
        // 1 - exploring elements
        // 2 - following cursor
        // 3 - rage
        cursorCoord,
        exploreEl;

    function floating() {

        TweenMax.to(pet.item, 2, {
            bezier: getBezier(2, 5, 3, 4, false),
            repeat: -1,
            ease: Linear.easeNone
        });

    }

    if (pet.item.length) {

        floating()

        // document.addEventListener('mousemove', (e) => {
        //     pet.eye.each(eye => {
        //         const x = eye.getBoundingClientRect().left + (eye.clientWidth / 2);
        //         const y = eye.getBoundingClientRect().top + (eye.clientHeight / 2);
        //         const radian = Math.atan2(e.pageX - x, e.pageY - y);
        //         const rot = (radian * (180 / Math.PI) * -1) - 140;

        //         eye.style.transform = `rotate(${rot}deg)`;
        //     });
        // });



        pet.item.onmousedown = function (e) {

            console.log(e);


            var coords = offset(pet.item),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop,
                shiftX = (e.pageX - coords.left) + scrollLeft,
                shiftY = (e.pageY - coords.top) + scrollTop;

            moveAt(e);

            function moveAt(e) {
                pet.item.style.left = e.pageX - shiftX + 'px';
                pet.item.style.top = e.pageY - shiftY + 'px';
            }

            document.onmousemove = function (e) {
                moveAt(e);
            };

            pet.item.onmouseup = function () {
                document.onmousemove = null;
                pet.item.onmouseup = null;

                localStorage.setItem('petCoordsX', pet.item.style.left)
                localStorage.setItem('petCoordsY', pet.item.style.top)
            };

        }

        pet.item.ondragstart = function () {
            return false;
        };
    }




    // pet.item.style.css.left = localStorage.getItem('petCoordsX');
    // pet.item.style.css.top = localStorage.getItem('petCoordsY');





    function offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    function getBezier(cx, cy, rx, ry, autoRotate) {

        ry = ry || rx;

        var k = 0.551915024494;
        var x = k * rx;
        var y = k * ry;

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
