import { Splide } from '@splidejs/splide';

export function initHeroSlider() {
    const splide = new Splide('.hero__splide', {
        type: 'slide',
        rewind: false,
        fixedWidth: 322,
        fixedHeight: 504,
        perMove: 1,
        arrows: false,
        pagination: false,
        trimSpace: false,
        gap: '-150px',
        classes: {
            slide: 'hero__splide-slide splide__slide',
            active: 'is-active',
            visible: 'is-visible',
        },


        breakpoints: {
            1300: {
                fixedWidth: 300,
                fixedHeight: 470,
                gap: '-140px',
            },
        }
    });

    function updateSlidePositions() {
        const slides = document.querySelectorAll('.hero__splide-slide');
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

    function playActiveVideo() {
        const allVideos = document.querySelectorAll('.hero__splide-slide video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        const activeSlide = splide.Components.Slides.getAt(splide.index).slide;
        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
            activeVideo.play();
        }
    }

    function updateSlideTransforms() {
        const slides = document.querySelectorAll('.hero__splide-slide');
        const activeIndex = splide.index;

        slides.forEach((slide, index) => {
            const offset = index - activeIndex;

            const scaleY = offset === 0 ? 1 : 0.873;
            const translate = offset * 170;

            const inner = slide.querySelector('.hero__splide-slide-inner');
            if (inner) {
                inner.style.transform = `translateX(${translate}px) scaleY(${scaleY})`;
                inner.style.zIndex = 100 - Math.abs(offset);
            }
        });
    }

    function initCustomControls() {
        const prevButton = document.getElementById('heroBtnPrev');
        const nextButton = document.getElementById('heroBtnNext');
        const currentIndicator = document.querySelector('.hero__controls-current');

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
        const currentIndicator = document.querySelector('.hero__controls-current');
        if (currentIndicator) {
            currentIndicator.innerHTML = `0${splide.index + 1} / <span>0${splide.length}</span>`;
        }
    }


    splide.on('mounted move', () => {

        updateSlidePositions();
        playActiveVideo();
        updateSlideTransforms();
    });

    splide.mount();

    initCustomControls();

    return splide;
}