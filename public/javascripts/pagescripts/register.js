/* eslint-disable */

// DOM elements
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');


// Event listeners
confirmPassword.addEventListener('blur', comparePasswords);
confirmPassword.addEventListener('change', addCustomValidity);
form.addEventListener('submit', preventFormSubmit);


function comparePasswords() {
  if (passwordsDontMatch()) {
    confirmPassword.classList.add('invalid');
  } else {
    confirmPassword.classList.remove('invalid');
  }
}

function addCustomValidity() {
  if (passwordsDontMatch()) {
    confirmPassword.setCustomValidity('Passwords do not match');
  } else {
    confirmPassword.setCustomValidity('');
  }
}

function preventFormSubmit(e) {
  if (passwordsDontMatch()) {
    e.preventDefault();
  }
}

function passwordsDontMatch() {
  return password.value !== confirmPassword.value;
}
