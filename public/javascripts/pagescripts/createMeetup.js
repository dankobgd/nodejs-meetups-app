/* eslint-disable */

// DOM elements
const txtTitle = document.getElementById('title');
const txtLocation = document.getElementById('location');
const txtDescription = document.getElementById('description');
const uploadImageButton = document.getElementById('uploadImageButton');
const filePicker = document.getElementById('filePicker');
const dropzone = document.getElementById('dropzone');
const imagePreview = document.getElementById('preview');
const form = document.getElementById('form');
const btnSubmit = document.getElementById('btnSubmit');
const datepicker = document.getElementById('datepicker');
const timepicker = document.getElementById('timepicker');


uploadImageButton.onclick = function () {
  filePicker.click();
};

function formIsValid() {
  return txtTitle.value !== '' &&
    txtLocation.value !== '' &&
    txtDescription.value !== '' &&
    filePicker.files.length !== 0 &&
    datepicker.value.length !== 0 &&
    timepicker.value.length !== 0;
}

function showButton() {
  if (formIsValid()) {
    btnSubmit.disabled = false;
  } else {
    btnSubmit.disabled = true;
  }
}

// Event listeners
window.addEventListener('load', showButton);
window.addEventListener('input', showButton);
window.addEventListener('change', showButton);
$('.datepicker').change(() => showButton());
$('.timepicker').change(() => showButton());

// get preview from file input
filePicker.addEventListener('change', (e) => {
  imagePreview.src = URL.createObjectURL(e.target.files[0]);
  const span = document.querySelector('.preview-image-info');
  const imgName = e.target.files[0].name;

  if (filePicker.files.length < 1) {
    span.innerHTML = '';
    dropzone.classList.add('hidden');
    dropzone.classList.remove('visible');
  } else {
    span.innerHTML = imgName;
    dropzone.classList.add('visible');
    dropzone.classList.remove('hidden');
  }
});


/**
 * Remove is-active class when clicking outside of the picker or on cancel btn
 * Triggers the animation that disables underline of the text field
 */
function removeDateTimePickerTextboxUnderline() {
  const dpickerDiv = document.querySelector('.dpicker');
  const tpickerDiv = document.querySelector('.tpicker');

  $('#datepicker').on('change', () => dpickerDiv.classList.remove('is-active'));
  $('#timepicker').on('change', () => tpickerDiv.classList.remove('is-active'));

  document.addEventListener('click', (e) => {
    const dtpDiv = document.querySelectorAll('div.dtp');
    const dtpBtnCancel = document.querySelectorAll('.dtp-btn-cancel');

    dtpDiv[0].addEventListener('click', () => dpickerDiv.classList.remove('is-active'));
    dtpDiv[1].addEventListener('click', () => tpickerDiv.classList.remove('is-active'));

    dtpBtnCancel[0].addEventListener('click', () => dpickerDiv.classList.remove('is-active'));
    dtpBtnCancel[1].addEventListener('click', () => tpickerDiv.classList.remove('is-active'));

    if (document.querySelector('.datepicker').value === '') {
      dtpDiv[0].addEventListener('click', () => dpickerDiv.classList.remove('is-completed'));
    }

    if (document.querySelector('.timepicker').value === '') {
      dtpDiv[1].addEventListener('click', () => tpickerDiv.classList.remove('is-completed'));
    }
  });
}

removeDateTimePickerTextboxUnderline();


$('#datepicker').bootstrapMaterialDatePicker({
  format: 'YYYY-MM-DD',
  time: false,
  minDate: new Date(),
  clearButton: true,
  canceltext: 'Cancel',
  okText: 'OK',
  clearText: 'Clear',
});

$('#timepicker').bootstrapMaterialDatePicker({
  format: 'HH:mm',
  date: false,
  switchOnClick: false,
  clearButton: true,
  canceltext: 'Cancel',
  okText: 'OK',
  clearText: 'Clear',
});
