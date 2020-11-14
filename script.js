const body = document.querySelector('body')
const book = document.querySelector('.book')
const giftBox = document.querySelector('.gift')
const pages = document.querySelectorAll('.page')

const confirmDialog = document.querySelector('.confirm-dialog')
const confirmBtn = document.querySelector('.button--confirm')
const cancelBtn = document.querySelector('.button--cancel')
const tooltip = document.querySelector('.button__tooltip')

const popup = document.querySelector('.popup')
const closePopupBtn = document.querySelector('.popup__close')
const slides = document.querySelectorAll('.slider__item')
const prevSlideBtn = document.querySelector('.slider__button--prev')
const nextSlideBtn = document.querySelector('.slider__button--next')
const sliderListText = document.querySelector('.text-list__container')

const toggleAudioBtn = document.querySelector('.player__toggle')
const processCurrent = document.querySelector('.player__process--current')

let zIndex = pages.length - 1
let opening = false
let showTextDone = true
let slideIndex = 0
let slideshow
let firstHovered = false;

let audio = new Audio('music.mp3')
audio.play()

toggleAudioBtn.addEventListener('click', () => {
    if (!audio.paused) {
        audio.pause()
        toggleAudioBtn.classList.add('fa-play')
        toggleAudioBtn.classList.remove('fa-pause')
        audioPlaying = false
    } else {
        audio.play()
        toggleAudioBtn.classList.add('fa-pause')
        toggleAudioBtn.classList.remove('fa-play')
        audioPlaying = true
    }
})

audio.addEventListener('timeupdate', () => {
    processCurrent.style.width = audio.currentTime / audio.duration * 100 + '%'
})

audio.addEventListener('ended', () => {
    audio.currentTime = 0
    audio.play()
})

confirmBtn.addEventListener('click', unbox)
cancelBtn.addEventListener('click', handleCancelBtn)
cancelBtn.addEventListener('mouseover', handleCancelBtn)

nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', prevSlide);

closePopupBtn.addEventListener('click', () => {
    popup.classList.remove('showPopup')
    pages[pages.length - 1].classList.remove('tearThePage')
})

function handleCancelBtn() {
    tooltip.style.opacity = 0;
    let rdBtn = Math.floor(Math.random() * 100)
    // Replace or Move
    if (rdBtn > 50 && firstHovered === true) return replaceBtn()
    firstHovered = true
    moveBtn()
}

function replaceBtn() {
    let confirmStyle = getComputedStyle(confirmBtn)
    let topConfirm = confirmStyle.top
    let leftConfirm = confirmStyle.left

    let cancelStyle = getComputedStyle(cancelBtn)
    let topCancel = cancelStyle.top
    let leftCancel = cancelStyle.left

    // Set confirmBtn position based on cancelBtn position
    confirmBtn.style.top = topCancel
    confirmBtn.style.left = leftCancel
    // Set cancelBtn position based on confirmBtn position
    cancelBtn.style.top = topConfirm
    cancelBtn.style.left = leftConfirm
}

function moveBtn() {
    // Random position
    let rdTop = Math.floor(Math.random() * 100)
    let rdLeft = Math.floor(Math.random() * 100)

    rdTop = (rdTop > 90) ? rdTop - 10 : rdTop
    rdLeft = (rdLeft > 90) ? rdLeft - 10 : rdLeft

    cancelBtn.style.top = `${rdTop}%`
    cancelBtn.style.left = `${rdLeft}%`
}

function unbox() {
    body.classList.add('unbox')
}

for (let numberOfPages = 0; numberOfPages < pages.length; numberOfPages++) {
    pageArrangement(pages[numberOfPages])
    pages[numberOfPages].addEventListener('click', function (e) {
        if (showTextDone) {
            // Open book
            opening = true
            if (numberOfPages === 0 && book.classList.contains('book--open')) opening = false
            if (opening) {
                book.classList.remove('book--close')
                book.classList.add('book--open')
            } else {
                book.classList.remove('book--open')
                book.classList.add('book--close')
            }
            if (numberOfPages !== pages.length - 1) turnThePages(pages[numberOfPages])
            else {
                // Show popup
                pages[pages.length - 1].classList.add('tearThePage')
                setTimeout(() => {
                    popup.classList.add('showPopup')
                    setTimeout(() => {
                        slideshow = setInterval(nextSlide, 4000)
                    }, 10000)
                }, 4000);

            }
            pages[numberOfPages].setAttribute('data-clicked', true)
        }
    })
}

async function showText(page) {
    showTextDone = false
    let elements = page.nextElementSibling.querySelector('.page__front').children
    for (element of elements) {
        if (element.tagName === 'P') {
            await new Promise(resolve => {
                setTimeout(async () => {
                    await typingText(element)
                    resolve()
                }, 100)
            })
        }
    }

    showTextDone = true
}

async function typingText(element) {
    element.style.opacity = 1
    let elText = element.innerText
    element.innerText = ''
    for (let i = 0; i < elText.length; i++) {
        await new Promise(resolve => setTimeout(() => {
            element.innerHTML += elText.charAt(i)
            resolve()
        }, 30))

    }
}

async function turnThePages(page) {
    if (page.classList.contains('page--flip')) {
        page.classList.remove('page--flip')
        page.style.zIndex = pages.length - page.style.zIndex
    } else {
        page.classList.add('page--flip')
        page.style.zIndex = pages.length - page.style.zIndex
        if (!page.hasAttribute('data-clicked')) await showText(page)
        return true
    }
}

function pageArrangement(page) {
    page.style.zIndex = zIndex
    zIndex--
}

function hideAllSlide() {
    for (const slide of slides) {
        slide.style.opacity = 0
    }
}

function nextSlide() {
    hideAllSlide()
    if (slideIndex === slides.length - 1) slideIndex = -1
    slideIndex++
    if (slideIndex === slides.length - 1) clearInterval(slideshow)
    slides[slideIndex].style.opacity = 1
    sliderListText.style.transform = `translate(0, -${3 * slideIndex}rem)`
}

function prevSlide() {
    hideAllSlide()
    if (slideIndex === 0) slideIndex = slides.length
    slideIndex--
    slides[slideIndex].style.opacity = 1
    sliderListText.style.transform = `translate(0, -${3 * slideIndex}rem)`
}