// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavLinks();
    initParallax();
    initMapSwitcher();
    initFAQ();
});

// ============================================
// ПЕРЕКЛЮЧАТЕЛЬ КАРТЫ
// ============================================

function initMapSwitcher() {
    const mapBtns = document.querySelectorAll('.map-btn');
    const locationItems = document.querySelectorAll('.location-item');
    
    // Координаты для двух мест (широта, долгота, масштаб)
    const locations = {
        ceremony: {
            coords: [53.709562, 91.697518],
            zoom: 16,
            title: 'ЗАГС',
            address: 'ЗАГС',
            fullAddress: 'Минусинск, ул. Октябрьская, 67',
            time: '13:00'
        },
        restaurant: {
            coords: [53.664850, 91.680251],
            zoom: 16,
            title: 'Ресторан "В Лесу',
            address: 'Ресторан "В Лесу"',
            fullAddress: 'Пос. Топольки, ул. Есенина 1',
            time: '16:00'
        }
    };
    
    // Инициализация карты Яндекс
    if (document.getElementById('map-frame')) {
        ymaps.ready(function() {
            // Создаем карту с первой локацией
            window.myMap = new ymaps.Map('map-frame', {
                center: locations.ceremony.coords,
                zoom: locations.ceremony.zoom,
                controls: ['geolocationControl', 'searchControl', 'routeButtonControl', 'trafficControl', 'typeSelector', 'fullscreenControl', 'zoomControl']
            });
            
            // Создаем метки для обоих мест
            var placemarks = [];
            
            // Метка для ЗАГСА
            var placemarkCeremony = new ymaps.Placemark(
                locations.ceremony.coords,
                {
                    balloonContent: '<strong>⛪ ' + locations.ceremony.title + '</strong><br>' + locations.ceremony.address + '<br>' + locations.ceremony.fullAddress + '<br>Время: ' + locations.ceremony.time,
                    hintContent: locations.ceremony.title
                },
                {
                    preset: 'islands#redDotIcon'
                }
            );
            
            // Метка для ресторана
            var placemarkRestaurant = new ymaps.Placemark(
                locations.restaurant.coords,
                {
                    balloonContent: '<strong>🍽️ ' + locations.restaurant.title + '</strong><br>' + locations.restaurant.address + '<br>' + locations.restaurant.fullAddress + '<br>Время: ' + locations.restaurant.time,
                    hintContent: locations.restaurant.title
                },
                {
                    preset: 'islands#blueDotIcon'
                }
            );
            
            window.myMap.geoObjects.add(placemarkCeremony);
            window.myMap.geoObjects.add(placemarkRestaurant);
            
            // Обработчики кнопок переключения
            mapBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const location = this.getAttribute('data-location');
                    
                    // Обновить активную кнопку
                    mapBtns.forEach(b => b.classList.remove('map-btn-active'));
                    this.classList.add('map-btn-active');
                    
                    // Обновить карту
                    window.myMap.setCenter(locations[location].coords);
                    window.myMap.setZoom(locations[location].zoom);
                    
                    // Обновить информацию о локации
                    locationItems.forEach(item => {
                        if (location === 'ceremony' && item.classList.contains('ceremony-info')) {
                            item.style.display = 'block';
                        } else if (location === 'restaurant' && item.classList.contains('restaurant-info')) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        });
    }
}

// ============================================
// FAQ ФУНКЦИОНАЛ
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Закрыть все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Открыть/закрыть текущий элемент
            item.classList.toggle('active');
            
            // Добавить анимацию
            animateOpen(item);
        });
    });
}

function animateOpen(item) {
    const answer = item.querySelector('.faq-answer');
    const content = answer.querySelector('p');
    
    if (item.classList.contains('active')) {
        answer.style.maxHeight = content.scrollHeight + 20 + 'px';
    } else {
        answer.style.maxHeight = '0';
    }
}

// ============================================
// SCROLL АНИМАЦИИ (Intersection Observer)
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс для активации анимации
                entry.target.classList.add('animate-in');
                
                // Если элемент уже был виден, останавливаем наблюдение
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдать за всеми элементами которые должны анимироваться
    const elementsToAnimate = document.querySelectorAll(
        'section, ' +
        '.invitation-card, ' +
        '.detail-card, ' +
        '.venue-card, ' +
        '.menu-card, ' +
        '.schedule-item, ' +
        '.faq-item, ' +
        '.map-container, ' +
        '.rings-container, ' +
        '.calendar, ' +
        '.photos-content'
    );
    
    elementsToAnimate.forEach(element => {
        // Проверяем, что элемент существует
        if (element) {
            // Устанавливаем начальное состояние
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            observer.observe(element);
        }
    });
}

// ============================================
// НАВИГАЦИЯ
// ============================================

function initNavLinks() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================
// PARALLAX ЭФФЕКТ
// ============================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            if (distance > -window.innerHeight && distance < window.innerHeight) {
                element.style.backgroundPosition = `center ${distance * 0.5}px`;
            }
        });
    });
}

// ============================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ============================================

// Добавить класс при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Анимация счетчика для чисел (если нужна)
function animateCounter(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Добавить стили для анимаций, которые использованы в HTML
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(styleSheet);

// ============================================
// ОБРАБОТЧИК ОШИБОК
// ============================================

window.addEventListener('error', (e) => {
    console.error('Ошибка:', e.error);
});

// ============================================
// ПОДДЕРЖКА ФОРМ
// ============================================

// Получить данные из inputs при изменении
document.addEventListener('change', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        // Можно добавить валидацию в реальном времени здесь
        if (e.target.classList.contains('required')) {
            e.target.style.borderColor = e.target.value ? '#4CAF50' : '#f44336';
        }
    }
});

// ============================================
// МОДУЛЬ КАЛЕНДАРЯ
// ============================================

class Calendar {
    constructor() {
        this.init();
    }
    
    init() {
        const highlightDay = document.querySelector('.day.highlight');
        if (highlightDay) {
            highlightDay.addEventListener('click', () => {
                this.selectDate(highlightDay);
            });
        }
    }
    
    selectDate(dayElement) {
        const previousSelected = document.querySelector('.day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        dayElement.classList.add('selected');
    }
}

// Инициализировать календарь
new Calendar();

// ============================================
// LAZY LOADING ИЗОБРАЖЕНИЙ
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// ОБРАБОТКА ССЫЛОК НА СОЦСЕТИ
// ============================================

document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // e.preventDefault(); // Раскомментируйте, если нужно обработать клик
        console.log('Ссылка на соцсеть:', link.textContent);
    });
});

// ============================================
// ОТСЛЕЖИВАНИЕ АКТИВНОГО РАЗДЕЛА
// ============================================

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

console.log('✨ Сайт свадьбы загружен успешно!');
