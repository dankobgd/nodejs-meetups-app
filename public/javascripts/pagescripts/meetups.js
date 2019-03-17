/* eslint-disable */

const radioBtn = document.querySelectorAll('.per-page');
const pageNum = document.querySelectorAll('.pagination-link');
const arrowLeft = document.querySelector('.pagination-arrow.left');
const arrowRight = document.querySelector('.pagination-arrow.right');
const noMeetups = document.querySelector('.carousel-container.zero-meetups');

const offset = localStorage.getItem('offset');
const limit = localStorage.getItem('limit');

if (radioBtn !== 0 && pageNum.length !== 0) {
  switch (limit) {
    case '8':
      document.querySelector('#show8').checked = true;
      break;
    case '16':
      document.querySelector('#show16').checked = true;
      break;
    case '32':
      document.querySelector('#show32').checked = true;
      break;
    default:
      document.querySelector('#show32').checked = true;
      break;
  }
}


//  Radio buttons
if (radioBtn.length !== 0) {
  radioBtn.forEach((radio) => {
    radio.addEventListener('click', function () {
      updateQueryString('limit', this.value);
    });
  });
}


//  Page numbers
if (pageNum.length !== 0) {
  pageNum.forEach((num) => {
    num.addEventListener('click', function () {
      const val = this.getAttribute('data-page');
      updateQueryString('page', val);
    });
  });
}

if (arrowLeft !== null) {
  arrowLeft.addEventListener('click', () => {
    const cur = new URLSearchParams(window.location.search).get('page');
    const val = parseInt(cur, 10) - 1;
    updateQueryString('page', val);
  });
}

if (arrowRight !== null) {
  arrowRight.addEventListener('click', () => {
    const cur = new URLSearchParams(window.location.search).get('page');
    let val;
    (!cur) ? val = 2 : val = parseInt(cur, 10) + 1;
    updateQueryString('page', val);
  });
}


function updateQueryString(name, val) {
  const key = name.toString();
  const value = parseInt(val, 10);
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  window.location.search = searchParams.toString();
  localStorage.setItem(key, value);
}


function initializeSearchParams() {
  if (noMeetups) return;
  let url;
  if (window.location.search === '') {
    url = (limit === null)
      ? 'http://localhost:3000/meetups?limit=32&page=1'
      : `http://localhost:3000/meetups?limit=${limit}&page=1`;
    window.location = url;
  }
}

window.onload = initializeSearchParams;
