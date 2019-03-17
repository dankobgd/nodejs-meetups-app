/* #########################################################################
                        CAROUSEL SLIDESHOW
######################################################################### */

let slideIndex = 0;
let slides;
let dots;

function plusSlides(position) {
  slideIndex += position;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].className += ' active';
}

function currentSlide(index) {
  if (index > slides.length) {
    index = 1;
  } else if (index < 1) {
    index = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[index - 1].style.display = 'block';
  dots[index - 1].className += ' active';
}

function showSlides() {
  let i;
  slides = document.getElementsByClassName('carousel-item');
  dots = document.getElementsByClassName('dot');

  if (slides.length !== 0 && dots.length !== 0) {
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
    setTimeout(showSlides, 8000);
  }
}

showSlides();

/* #########################################################################
                        MATERIAL TEXT FIELDS
######################################################################### */
function animateTextFields() {
  document.querySelectorAll('.mat-input').forEach(field => {
    field.addEventListener('focus', function() {
      this.parentNode.classList.add('is-active', 'is-completed');
    });

    field.addEventListener('focusout', function() {
      if (this.value === '') {
        this.parentNode.classList.remove('is-completed');
      }
      this.parentNode.classList.remove('is-active');
    });

    if (field.value !== '') {
      field.parentNode.classList.add('is-completed');
    }
  });
}

animateTextFields();
document.addEventListener('click', animateTextFields);
/* #########################################################################
                            MODAL WINDOW
######################################################################### */
class Modal {
  constructor(options) {
    const defaults = {
      headerColor: '#9ec2dd',
      bodyColor: '#fff',
      footerColor: '#9ec2dd',
      title: 'Title',
      body: 'Modal content',
      cancelButtonText: 'Cancel',
      saveButtonText: 'Save',
      noSave: false,
      onSave: () => {},
    };

    //  Set constructor to use default values
    const populated = Object.assign(defaults, options);
    for (const key in populated) {
      if (defaults.hasOwnProperty(key)) {
        this[key] = populated[key];
      }
    }

    //  Initialize creating modal
    this.createModal();
    window.addEventListener('click', this.outsideClick.bind(this));
  }

  createModal() {
    //  Modal div
    this.modal = document.createElement('div');
    this.modal.className = 'modal';

    //  Modal content
    this.modalContent = document.createElement('div');
    this.modalContent.className = 'modal-content';
    this.modalContent.style.backgroundColor = this.bodyColor;

    //  Modal header
    this.modalHeader = document.createElement('div');
    this.modalHeader.className = 'modal-header';
    this.modalHeader.style.backgroundColor = this.headerColor;
    // h2
    this.modalTitle = document.createElement('h2');
    this.modalTitle.innerHTML = this.title;

    //  Modal body
    this.modalBody = document.createElement('div');
    this.modalBody.className = 'modal-body';
    this.modalBody.style.backgroundColor = this.bodyColor;
    // span (content)
    this.span = document.createElement('span');
    this.span.innerHTML = this.body;

    //  Modal footer
    this.modalFooter = document.createElement('div');
    this.modalFooter.className = 'modal-footer';
    this.modalFooter.style.backgroundColor = this.footerColor;

    // btn cancel
    this.btnCancel = document.createElement('button');
    this.btnCancel.classList.add('btn-cancel', 'btn', 'btn-sm', 'btn-flat');
    this.btnCancel.innerHTML = this.cancelButtonText;
    this.btnCancel.addEventListener('click', this.close.bind(this));

    // btn save
    this.btnSave = document.createElement('button');
    this.btnSave.classList.add('btn-save', 'btn', 'btn-sm', 'btn-flat');
    this.btnSave.innerHTML = this.saveButtonText;
    this.btnSave.addEventListener('click', this.successCallback.bind(this));

    //  Append all to the DOM with document fragment
    const fragment = document.createDocumentFragment();
    this.modal.appendChild(this.modalContent);
    this.modalContent.appendChild(this.modalHeader);
    this.modalHeader.appendChild(this.modalTitle);
    this.modalContent.appendChild(this.modalBody);
    this.modalBody.appendChild(this.span);
    this.modalContent.appendChild(this.modalFooter);
    this.modalFooter.appendChild(this.btnCancel);

    if (this.noSave === false) {
      this.modalFooter.appendChild(this.btnSave);
    }

    fragment.appendChild(this.modal);
    document.body.appendChild(fragment);
  }

  successCallback() {
    this.onSave();
    this.close();
  }

  open() {
    this.modal.classList.add('modal-open');
  }

  close() {
    this.modal.classList.remove('modal-open');
  }

  outsideClick(e) {
    if (e.target == this.modal) {
      this.close();
    }
  }
}

/* #########################################################################
                                TOAST
######################################################################### */
class Toast {
  constructor(msg = 'your msg here...', delay = 3000, bgcolor = '#2dd240') {
    this.toast = document.createElement('div');
    this.span = document.createElement('span');
    this.span.innerHTML = msg;

    this.toast.classList.add('toast');
    this.toast.classList.add('showToast');
    this.toast.style.backgroundColor = bgcolor;

    this.toast.appendChild(this.span);
    document.body.appendChild(this.toast);

    const cstyle = window.getComputedStyle(this.toast);
    const animationDelay = cstyle.getPropertyValue('animation-delay');
    const animationDuration = cstyle.getPropertyValue('animation-duration');

    const msDuration = animationDuration.split(',')[0].replace('s', '') * 1000;
    this.toast.style.animationDelay = `0s, ${(delay - msDuration) / 1000}s`;

    setTimeout(() => {
      this.toast.classList.remove('showToast');
      document.body.removeChild(this.toast);
    }, delay);
  }
}

/* #########################################################################
                            Navigation
######################################################################### */

document.querySelector('.menu-icon').onclick = () => {
  if (document.getElementById('menu-toggle').checked) {
    document.body.classList.remove('no-scroll');
  } else {
    document.body.classList.add('no-scroll');
  }
};
