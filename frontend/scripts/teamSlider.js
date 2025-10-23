import { Splide } from '@splidejs/splide';
import '@splidejs/splide/css';

export function initTeamSlider() {
    const splideElement = document.querySelector('.team__splide');
    
    if (!splideElement) return;

    const splide = new Splide('.team__splide', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        gap: 0, // Меняем на 0 чтобы не было margin-right
        arrows: false,
        pagination: false,
        trimSpace: false,
        updateOnMove: true,
        autoWidth: false,
        autoHeight: false,
        fixedWidth: null,
        fixedHeight: null,
        height: null,
        rewind: false,
        classes: {
            slide: 'team__splide-slide splide__slide',
        },
        breakpoints: {
            768: {
                destroy: true
            }
        }
    });

    function updateSlider() {
        const current = splide.index + 1;
        const total = splide.length;
        const counter = document.querySelector('.team__controls-current');
        
        if (counter) {
            counter.textContent = `${current.toString().padStart(2, '0')}/${total.toString().padStart(2, '0')}`;
        }

        // Убираем is-visible у всех
        document.querySelectorAll('.team__splide-slide').forEach(slide => {
            slide.classList.remove('is-visible');
        });
        
        // Добавляем is-visible активному слайду
        const activeSlide = document.querySelector('.team__splide-slide.is-active');
        if (activeSlide) {
            activeSlide.classList.add('is-visible');
        }
    }

    // Убираем inline стили после инициализации
    splide.on('mounted', () => {
        updateSlider();
        removeInlineStyles();
        startStyleObserver(); // Запускаем наблюдатель
    });

    splide.on('moved', () => {
        updateSlider();
        removeInlineStyles();
    });

    // Функция для удаления inline стилей
    function removeInlineStyles() {
        document.querySelectorAll('.team__splide-slide').forEach(slide => {
            slide.style.width = '';
            slide.style.marginRight = '';
            slide.style.height = '';
        });
    }

    // Наблюдатель за изменениями стилей
    function startStyleObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const slide = mutation.target;
                    if (slide.classList.contains('team__splide-slide')) {
                        // Ждем немного и убираем стили
                        setTimeout(() => {
                            slide.style.width = '';
                            slide.style.marginRight = '';
                        }, 10);
                    }
                }
            });
        });

        // Наблюдаем за всеми слайдами
        document.querySelectorAll('.team__splide-slide').forEach(slide => {
            observer.observe(slide, { 
                attributes: true, 
                attributeFilter: ['style'] 
            });
        });
    }

    splide.mount();

    // Кастомные стрелки
    const btnPrev = document.getElementById('teamBtnPrev');
    const btnNext = document.getElementById('teamBtnNext');

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => splide.go('-1'));
        btnNext.addEventListener('click', () => splide.go('+1'));
    }

    return splide;
}