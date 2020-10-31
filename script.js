const pages = document.querySelectorAll('.page')
const book = document.querySelector('.book')
const giftBox = document.querySelector('.gift')
const body = document.querySelector('body')
const confirmDialog = document.querySelector('.confirm-dialog')
const confirmBtn = document.querySelector('.button--confirm')
const cancelBtn = document.querySelector('.button--cancel')

let zIndex = pages.length - 1
let opening = false
let showTextDone = true

confirmBtn.addEventListener('click', unbox)
cancelBtn.addEventListener('click', handleCancelBtn)
cancelBtn.addEventListener('mouseover', handleCancelBtn)

function handleCancelBtn() {
    let rdBtn = Math.floor(Math.random() * 100)
    // Replace or Move
    if (rdBtn > 50) return replaceBtn()
    moveBtn()
    console.log(rdBtn)
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
            console.log(pages[numberOfPages])
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
                }, 200)
            })
        }
    }

    showTextDone = true
}

async function typingText(element) {
    element.style.opacity = 1
    let elText = element.innerText
    console.log(elText)
    element.innerText = ''
    for (let i = 0; i < elText.length; i++) {
        await new Promise(resolve => setTimeout(() => {
            element.innerHTML += elText.charAt(i)
            resolve()
        }, 50))

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