import {
    appleTvSection,
    buttonNextImage,
    buttonPrevImage,
    dotNavigation,
    imageCarousel,
    sectionNavigationLinks,
} from './modules/domElements'
import './styles.css'

document.addEventListener('DOMContentLoaded', runFunctionsAfterDomContentLoaded)

function runFunctionsAfterDomContentLoaded() {
    initializeEventListeners()
    initialPageLoadFunctions()
    setupCarouselVisibilityObserver()
}

function initializeEventListeners() {
    sectionNavigationLinks.addEventListener(
        'click',
        sectionNavigationLinksClickHandler
    )
    appleTvSection.addEventListener('click', imageCarouselClickHandler)
    window.addEventListener('resize', setInitialScrollPosition)
    window.addEventListener('resize', debouncedAdjustCarousel)
    window.addEventListener('resize', stopAutoScrollCarousel)
    window.addEventListener('resize', removeAppleTvAnimation)
}

function initialPageLoadFunctions() {
    setInitialScrollPosition()
}

function removeAppleTvAnimation() {
    appleTvSection.classList.add('no-animation')
}

// handles the animation for the dropdown expand or collapse svg indicator in small vw

function sectionNavigationLinksClickHandler(e) {
    const dropdown = e.target.closest('.navigation-dropdown')
    const linkGroup = e.target.closest('.navigation-link-group')

    if (dropdown && sectionNavigationLinks.contains(dropdown)) {
        linkGroup.classList.toggle('dropdown-expanded')
        dropDownSvgAnimation(dropdown, linkGroup)
    }
}

function dropDownSvgAnimation(dropdown, linkGroup) {
    const svgAnimateExpand = dropdown.querySelector(
        'animate[data-footer-animate="expand"]'
    )
    const svgAnimateCollapse = dropdown.querySelector(
        'animate[data-footer-animate="collapse"]'
    )

    if (linkGroup.classList.contains('dropdown-expanded')) {
        svgAnimateExpand.beginElement()
    } else {
        svgAnimateCollapse.beginElement()
    }
}

// functions for handling the apple-tv image-carousel

const carouselValues = {
    firstContainer: document.getElementById('first-carousel-container'),
    autoScrollInterval: null,
    get rootStyles() {
        return getComputedStyle(document.documentElement)
    },
    get scrollDistance() {
        return parseFloat(
            this.rootStyles.getPropertyValue('--scroll-distance').trim()
        )
    },
    set scrollDistance(distance) {
        document.documentElement.style.setProperty(
            '--scroll-distance',
            distance + 'px'
        )
    },
    get carouselItems() {
        return imageCarousel.querySelectorAll('.carousel-item-container')
    },
    get itemWidth() {
        return this.carouselItems[0].offsetWidth
    },
    get carouselWidth() {
        return imageCarousel.offsetWidth
    },
    get previousContainer() {
        return this.activeContainer.previousElementSibling
    },
    get nextContainer() {
        return this.activeContainer.nextElementSibling
    },
    get activeContainer() {
        return imageCarousel.querySelector('.image-carousel-container-active')
    },
    get activeContainerIndex() {
        return parseFloat(
            imageCarousel.querySelector('.image-carousel-container-active')
                .dataset.index
        )
    },
}

function setInitialScrollPosition() {
    const firstItemPosition = carouselValues.itemWidth * 2
    const scrollPosition =
        firstItemPosition -
        carouselValues.carouselWidth / 2 +
        carouselValues.itemWidth / 2
    imageCarousel.scrollLeft = scrollPosition
}

function updateScrollDistance(addedDistance) {
    const newScrollDistance =
        carouselValues.scrollDistance + parseFloat(addedDistance)
    carouselValues.scrollDistance = newScrollDistance
}

function scrollImageCarousel(directionToScrollTo) {
    if (
        directionToScrollTo !== 'left' &&
        directionToScrollTo !== 'right' &&
        directionToScrollTo !== 'first' &&
        directionToScrollTo !== 'last'
    ) {
        return
    }

    if (directionToScrollTo === 'left') {
        updateScrollDistance(carouselValues.itemWidth)
    }
    if (directionToScrollTo === 'right') {
        updateScrollDistance(-carouselValues.itemWidth)
    }
    if (directionToScrollTo === 'first') {
        appleTvSection.classList.add('no-animation')
        imageCarousel
            .querySelector('.carousel-item-container[data-index="1"]')
            .classList.add('image-carousel-container-active')
        updateScrollDistance(carouselValues.itemWidth * 10)
        imageCarousel
            .querySelector('.carousel-item-container[data-index="1c"]')
            .classList.remove('image-carousel-container-active')
    }
    if (directionToScrollTo === 'last') {
        appleTvSection.classList.add('no-animation')
        imageCarousel
            .querySelector('.carousel-item-container[data-index="10"]')
            .classList.add('image-carousel-container-active')
        updateScrollDistance(-carouselValues.itemWidth * 10)
        carouselValues.activeContainer.classList.remove(
            'image-carousel-container-active'
        )
    }
}

function handleScrollToLast() {
    scrollImageCarousel('last')
    carouselValues.firstContainer.removeEventListener(
        'transitionend',
        handleScrollToLast
    )
}

function handleScrollToFirst() {
    scrollImageCarousel('first')
    carouselValues.firstContainer.removeEventListener(
        'transitionend',
        handleScrollToFirst
    )
}

function handleScrollToRight() {
    const oldActiveContainer = carouselValues.activeContainer
    carouselValues.activeContainer.nextElementSibling.classList.add(
        'image-carousel-container-active'
    )
    oldActiveContainer.classList.remove('image-carousel-container-active')
    if (carouselValues.activeContainer.dataset.index.includes('c')) {
        carouselValues.firstContainer.addEventListener(
            'transitionend',
            handleScrollToFirst
        )
        console.log('first handle left')
    }
    updateDotNavigation()
}

function handleScrollToLeft() {
    const oldActiveContainer = carouselValues.activeContainer
    carouselValues.activeContainer.previousElementSibling.classList.add(
        'image-carousel-container-active'
    )
    oldActiveContainer.classList.remove('image-carousel-container-active')
    if (carouselValues.activeContainer.dataset.index.includes('c')) {
        carouselValues.firstContainer.addEventListener(
            'transitionend',
            handleScrollToLast
        )
        console.log('first handle left')
    }
    updateDotNavigation()
}

function imageCarouselClickHandler(e) {
    appleTvSection.classList.remove('no-animation')
    if (e.target === buttonPrevImage) {
        debounceCarouselClickHandler()
        scrollImageCarousel('left')
        handleScrollToLeft()
    }
    if (e.target === buttonNextImage) {
        debounceCarouselClickHandler()
        scrollImageCarousel('right')
        handleScrollToRight()
    }
    if (dotNavigation.contains(e.target) && e.target !== dotNavigation) {
        const index = parseFloat(e.target.dataset.index)
        handleDotClick(index, e)
    }
    stopAutoScrollCarousel()
}

function debounceCarouselClickHandler() {
    appleTvSection.removeEventListener('click', imageCarouselClickHandler)
    setTimeout(() => {
        appleTvSection.addEventListener('click', imageCarouselClickHandler)
    }, 1001)
}

function updateDotNavigation() {
    const currentActiveDot = dotNavigation.querySelector('.active-item')
    const currentActiveContainerIndex =
        carouselValues.activeContainer.dataset.index
    const dotToActivate = dotNavigation.querySelector(
        `.dot[data-index="${currentActiveContainerIndex}"]`
    )
    currentActiveDot.classList.remove('active-item')
    if (currentActiveContainerIndex === '1c') {
        dotNavigation
            .querySelector('.dot[data-index="1"]')
            .classList.add('active-item')
    } else if (currentActiveContainerIndex === '10c') {
        dotNavigation
            .querySelector('.dot[data-index="10"]')
            .classList.add('active-item')
    } else {
        dotToActivate.classList.add('active-item')
    }
}

function handleDotClick(index, e) {
    const currentActiveDot = dotNavigation.querySelector('.active-item')
    const dotIndex = parseFloat(index)
    const containerIndex = parseFloat(carouselValues.activeContainerIndex)
    const travelDistance =
        (containerIndex - dotIndex) * parseFloat(carouselValues.itemWidth)
    currentActiveDot.classList.remove('active-item')
    carouselValues.activeContainer.classList.remove(
        'image-carousel-container-active'
    )
    e.target.classList.add('active-item')
    imageCarousel
        .querySelector(`.carousel-item-container[data-index="${index}"]`)
        .classList.add('image-carousel-container-active')
    updateScrollDistance(travelDistance)
}

function startAutoScrollCarousel() {
    if (carouselValues.autoScrollInterval === null) {
        carouselValues.autoScrollInterval = setInterval(() => {
            debounceCarouselClickHandler()
            scrollImageCarousel('right')
            handleScrollToRight()
            appleTvSection.classList.remove('no-animation')
        }, 4500)
    }
}

function stopAutoScrollCarousel() {
    if (carouselValues.autoScrollInterval !== null) {
        clearInterval(carouselValues.autoScrollInterval)
        carouselValues.autoScrollInterval = null
    }
}

function adjustImageCarouselOnResize() {
    if (carouselValues.activeContainerIndex > 1) {
        carouselValues.scrollDistance = -(
            carouselValues.itemWidth *
            (carouselValues.activeContainerIndex - 1)
        )
    }
    appleTvSection.classList.remove('no-animation')
    startAutoScrollCarousel()
}

const debouncedAdjustCarousel = debounce(adjustImageCarouselOnResize, 250)

function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

function setupCarouselVisibilityObserver() {
    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                startAutoScrollCarousel()
            } else {
                stopAutoScrollCarousel()
            }
        })
    }

    const observerOptions = {
        root: null,
        threshold: 0.5,
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    observer.observe(imageCarousel)
}
