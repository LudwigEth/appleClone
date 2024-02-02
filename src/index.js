import {
    appleTvSection,
    buttonNextImage,
    buttonPrevImage,
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
    if (directionToScrollTo !== 'left' || directionToScrollTo !== 'right')
        return;
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
}
