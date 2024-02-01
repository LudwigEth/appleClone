import { sectionNavigationLinks } from './modules/domElements';
import './styles.css';

document.addEventListener('DOMContentLoaded', initializeEventListeners);

function initializeEventListeners() {
    sectionNavigationLinks.addEventListener(
        'click',
        sectionNavigationLinksClickHandler
    );
}

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
