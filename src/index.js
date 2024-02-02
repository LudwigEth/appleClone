import {
    appleTvSection,
    buttonNextImage,
    buttonPrevImage,
    dotNavigation,
    imageCarousel,
    sectionNavigationLinks,
} from './modules/domElements';
import './styles.css';

document.addEventListener(
    'DOMContentLoaded',
    runFunctionsAfterDomContentLoaded
);

function runFunctionsAfterDomContentLoaded() {
    initializeEventListeners();
    initialPageLoadFunctions();
}

function initializeEventListeners() {
    sectionNavigationLinks.addEventListener(
        'click',
        sectionNavigationLinksClickHandler
    );
    appleTvSection.addEventListener('click', imageCarouselClickHandler);
    window.addEventListener('resize', setInitialScrollPosition);
}

function initialPageLoadFunctions() {
    setInitialScrollPosition();
}

// handles the animation for the dropdown expand or collapse svg indicator in small vw

function sectionNavigationLinksClickHandler(e) {
    const dropdown = e.target.closest('.navigation-dropdown');
    const linkGroup = e.target.closest('.navigation-link-group');

    if (dropdown && sectionNavigationLinks.contains(dropdown)) {
        linkGroup.classList.toggle('dropdown-expanded');
        dropDownSvgAnimation(dropdown, linkGroup);
    }
}

function dropDownSvgAnimation(dropdown, linkGroup) {
    const svgAnimateExpand = dropdown.querySelector(
        'animate[data-footer-animate="expand"]'
    );
    const svgAnimateCollapse = dropdown.querySelector(
        'animate[data-footer-animate="collapse"]'
    );

    if (linkGroup.classList.contains('dropdown-expanded')) {
        svgAnimateExpand.beginElement();
    } else {
        svgAnimateCollapse.beginElement();
    }
}

// functions for handling the apple-tv image-carousel

const carouselValues = {
    get carouselItems() {
        return imageCarousel.querySelectorAll('.carousel-item-container');
    },
    get itemWidth() {
        return this.carouselItems[0].offsetWidth;
    },
    get carouselWidth() {
        return imageCarousel.offsetWidth;
    },
    firstContainer: document.getElementById('first-carousel-container'),
    get previousContainer() {
        return this.activeContainer.previousElementSibling;
    },
    get nextContainer() {
        return this.activeContainer.nextElementSibling;
    },
    get activeContainer() {
        return imageCarousel.querySelector('.image-carousel-container-active');
    },
    get activeContainerIndex() {
        return imageCarousel.querySelector('.image-carousel-container-active')
            .dataset.index;
    },
};

function setInitialScrollPosition() {
    const firstItemPosition = carouselValues.itemWidth * 2;
    const scrollPosition =
        firstItemPosition -
        carouselValues.carouselWidth / 2 +
        carouselValues.itemWidth / 2;
    imageCarousel.scrollLeft = scrollPosition;
}

function scrollImageCarousel(directionToScrollTo) {
    if (
        directionToScrollTo !== 'left' &&
        directionToScrollTo !== 'right' &&
        directionToScrollTo !== 'first' &&
        directionToScrollTo !== 'last'
    ) {
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const scrollDistance = parseFloat(
        rootStyles.getPropertyValue('--scroll-distance').trim()
    );

    if (directionToScrollTo === 'left') {
        document.documentElement.style.setProperty(
            '--scroll-distance',
            `${scrollDistance + carouselValues.itemWidth}px`
        );
    }
    if (directionToScrollTo === 'right') {
        document.documentElement.style.setProperty(
            '--scroll-distance',
            `${scrollDistance - carouselValues.itemWidth}px`
        );
    }
    if (directionToScrollTo === 'first') {
        appleTvSection.classList.add('no-animation');
        imageCarousel
            .querySelector('.carousel-item-container[data-index="1"]')
            .classList.add('image-carousel-container-active');
        document.documentElement.style.setProperty('--scroll-distance', '0px');
        imageCarousel
            .querySelector('.carousel-item-container[data-index="1c"]')
            .classList.remove('image-carousel-container-active');
    }
    if (directionToScrollTo === 'last') {
        appleTvSection.classList.add('no-animation');
        imageCarousel
            .querySelector('.carousel-item-container[data-index="10"]')
            .classList.add('image-carousel-container-active');
        document.documentElement.style.setProperty(
            '--scroll-distance',
            `${scrollDistance - carouselValues.itemWidth * 10}px`
        );
        carouselValues.activeContainer.classList.remove(
            'image-carousel-container-active'
        );
    }
}

function handleScrollToLast() {
    scrollImageCarousel('last');
    carouselValues.firstContainer.removeEventListener(
        'transitionend',
        handleScrollToLast
    );
}

function handleScrollToFirst() {
    scrollImageCarousel('first');
    carouselValues.firstContainer.removeEventListener(
        'transitionend',
        handleScrollToFirst
    );
}

function handleScrollToRight() {
    const oldActiveContainer = carouselValues.activeContainer;
    carouselValues.activeContainer.nextElementSibling.classList.add(
        'image-carousel-container-active'
    );
    oldActiveContainer.classList.remove('image-carousel-container-active');
    if (carouselValues.activeContainer.dataset.index.includes('c')) {
        carouselValues.firstContainer.addEventListener(
            'transitionend',
            handleScrollToFirst
        );
        console.log('first handle left');
    }
    updateDotNavigation();
}

function handleScrollToLeft() {
    const oldActiveContainer = carouselValues.activeContainer;
    carouselValues.activeContainer.previousElementSibling.classList.add(
        'image-carousel-container-active'
    );
    oldActiveContainer.classList.remove('image-carousel-container-active');
    if (carouselValues.activeContainer.dataset.index.includes('c')) {
        carouselValues.firstContainer.addEventListener(
            'transitionend',
            handleScrollToLast
        );
        console.log('first handle left');
    }
    updateDotNavigation();
}

function imageCarouselClickHandler(e) {
    appleTvSection.classList.remove('no-animation');
    if (e.target === buttonPrevImage) {
        debounceCarouselClickHandler();
        scrollImageCarousel('left');
        handleScrollToLeft();
    }
    if (e.target === buttonNextImage) {
        debounceCarouselClickHandler();
        scrollImageCarousel('right');
        handleScrollToRight();
    }
}

function debounceCarouselClickHandler() {
    appleTvSection.removeEventListener('click', imageCarouselClickHandler);
    setTimeout(() => {
        appleTvSection.addEventListener('click', imageCarouselClickHandler);
    }, 1001);
}

function updateDotNavigation() {
    const currentActiveDot = dotNavigation.querySelector('.active-item');
    const currentActiveContainerIndex =
        carouselValues.activeContainer.dataset.index;
    const dotToActivate = dotNavigation.querySelector(
        `.dot[data-index="${currentActiveContainerIndex}"]`
    );
    currentActiveDot.classList.remove('active-item');
    if (currentActiveContainerIndex === '1c') {
        dotNavigation
            .querySelector('.dot[data-index="1"]')
            .classList.add('active-item');
    } else if (currentActiveContainerIndex === '10c') {
        dotNavigation
            .querySelector('.dot[data-index="10"]')
            .classList.add('active-item');
    } else {
        dotToActivate.classList.add('active-item');
    }
}
