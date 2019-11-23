export default function pet() {
    console.log('asd');
    let pet = {
        body: document.querySelector('.js-pet'),
    },
        status = 0,
        // 0 - chill in the right bot corner
        // 1 - exploring elements
        // 2 - following cursor
        // 3 - rage
        cursorCoord,
        exploreEl;

    // document.addEventListener('mousemove', function (e) {
    //     let viewport = {
    //         x: e.pageX,
    //         y: e.pageY,
    //     };
    //     console.log(viewport.x);
    //     console.log(viewport.y);
    // });

    const eyes = document.querySelectorAll('.js-eye');

    document.addEventListener('mousemove', (e) => {
        eyes.forEach(eye => {
            const x = eye.getBoundingClientRect().left + (eye.clientWidth / 2);
            const y = eye.getBoundingClientRect().top + (eye.clientHeight / 2);
            const radian = Math.atan2(e.pageX - x, e.pageY - y);
            const rot = (radian * (180 / Math.PI) * -1) - 140;
            eye.style.transform = `rotate(${rot}deg)`;

            console.log(rot);
        });
    });

}

