import { Splide } from '@splidejs/splide';

export function initTeamSlider() {
    const splide = new Splide('.team__splide', {
        type: 'slide',
        rewind: false,
        fixedWidth: 783,
        fixedHeight: 560,
        perMove: 1,
        arrows: false,
        pagination: false,
        trimSpace: false,
        gap: '-400px',
        classes: {
            slide: 'team__splide-slide splide__slide',
            active: 'is-active',
            visible: 'is-visible',
        },


        breakpoints: {
            1300: {
                fixedWidth: 300,
                fixedHeight: 470,
                gap: '-200px',
            },
        }
    });

    function updateSlideStates() {
        const slides = document.querySelectorAll('.team__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            const activeInner = slide.querySelector('.slide-inner--active');
            const deactiveInner = slide.querySelector('.slide-inner--deactive');

            if (!activeInner || !deactiveInner) return;

            if (index === activeIndex) {
            activeInner.classList.add('is-active');
            activeInner.classList.remove('is-hidden');

            deactiveInner.classList.add('is-hidden');
            deactiveInner.classList.remove('is-active');
            } else {
            activeInner.classList.remove('is-active');
            activeInner.classList.add('is-hidden');

            deactiveInner.classList.remove('is-hidden');
            deactiveInner.classList.add('is-active');
            }
        });
    }
    

    function updateSlidePositions() {
        const slides = document.querySelectorAll('.team__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            slide.classList.remove('slide-offset', 'slide-previous');

            if (index < activeIndex) {
                slide.classList.add('slide-previous');
            } else if (index > activeIndex) {
                slide.classList.add('slide-offset');
            }
        });
    }

    function updateSlideTransforms() {
        const slides = document.querySelectorAll('.team__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            const offset = index - activeIndex;

            const scaleX = offset === 0 ? 1 : 0.410;
            const scaleY = offset === 0 ? 1 : 0.786;
            const translate = 0;

            inner.style.setProperty('--scale-x', scaleX);
            inner.style.setProperty('--scale-y', scaleY);

            const inner = slide.querySelector('.slide-inner--deactive');
            if (inner) {
                inner.style.transform = `translateX(${translate}px) scaleX(${scaleX}) scaleY(${scaleY})`;
                //inner.style.transform = `translateX(${translate}px)`;
                inner.style.zIndex = 100 - Math.abs(offset);
            }
        });
    }

    function initCustomControls() {
        const prevButton = document.getElementById('teamBtnPrev');
        const nextButton = document.getElementById('teamBtnNext');
        const currentIndicator = document.querySelector('.team__controls-current');

        if (prevButton) {
            prevButton.addEventListener('click', () => splide.go('<'));
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => splide.go('>'));
        }

        if (currentIndicator) {
            updateCurrentIndicator();
            splide.on('moved', updateCurrentIndicator);
        }
    }

    function updateCurrentIndicator() {
        const currentIndicator = document.querySelector('.team__controls-current');
        if (currentIndicator) {
            currentIndicator.innerHTML = `0${splide.index + 1} / <span>0${splide.length}</span>`;
        }
    }


    splide.on('mounted move', () => {
        updateSlidePositions();
        updateSlideTransforms();
        // updateSlideStates();
    });

    splide.on('mounted moved', () => {
        updateSlideStates();
    });

    splide.mount();

    initCustomControls();

    return splide;
}