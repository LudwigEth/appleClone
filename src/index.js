import { imageCarousel, sectionNavigationLinks } from './modules/domElements';
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
};

function setInitialScrollPosition() {
    const firstItemPosition = carouselValues.itemWidth * 2;
    const scrollPosition =
        firstItemPosition -
        carouselValues.carouselWidth / 2 +
        carouselValues.itemWidth / 2;
    imageCarousel.scrollLeft = scrollPosition;
}
