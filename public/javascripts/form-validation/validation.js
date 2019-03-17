//  Disable default validation
const forms = document.querySelectorAll('form.validate');
forms.forEach(form => form.setAttribute('novalidate', true));

// Validate the field
function hasError(field) {
  if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') {
    return;
  }

  const { validity } = field;

  if (validity.valid) return;
  if (validity.valueMissing) return 'Please fill out this field.';
  if (validity.badInput) return 'Please enter a number.';
  if (validity.stepMismatch) return 'Please select a valid value.';
  if (validity.tooShort) return `Requires at least ${field.getAttribute('minLength')} characters`;
  if (validity.tooLong) return `Can have a maximum of ${field.getAttribute('maxLength')} characters`;
  if (validity.rangeOverflow) return `Please select a value less than ${field.getAttribute('max')}`;
  if (validity.rangeUnderflow) return `Please select a value greater than ${field.getAttribute('min')}`;
  if (validity.patternMismatch) {
    if (field.hasAttribute('title')) return field.getAttribute('title');
    return 'Please match the requested format.';
  }
  if (validity.typeMismatch) {
    if (field.type === 'email') return 'Please enter an email address.';
    if (field.type === 'url') return 'Please enter a URL.';
  }

  if (validity.customError) {
    return field.validationMessage;
  }

  return 'Invalid entry';
}

// Show an error message
function showError(field, error) {
  field.classList.add('error');

  const id = field.id || field.name;
  if (!id) return;

  const lbl = document.querySelector(`label[for="${field.id}"]`);
  if (lbl) {
    lbl.parentNode.classList.add('invalid');
  }
  
  // document.querySelector(`label[for="${field.id}"]`).parentNode.classList.add('invalid');

  let message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) {
    message = document.createElement('div');
    message.className = 'error-message';
    message.id = `error-for-${id}`;
    field.parentNode.insertBefore(message, field.nextSibling);
  }

  field.setAttribute('aria-describedby', `error-for-${id}`);
  message.innerHTML = error;
  message.style.display = 'block';
  message.style.visibility = 'visible';
}

// Remove the error message
function removeError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-describedby');

  const id = field.id || field.name;
  if (!id) return;


  const lbl = document.querySelector(`label[for="${field.id}"]`)
  if (lbl) {
    lbl.parentNode.classList.remove('invalid');
  }
  // document.querySelector(`label[for="${field.id}"]`).parentNode.classList.remove('invalid');

  const message = field.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) return;

  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
}

forms.forEach((form) => {
  // Listen to all blur events
  form.addEventListener('blur', (event) => {
    if (!event.target.form.classList.contains('validate')) return;
    const error = hasError(event.target);

    if (error) {
      showError(event.target, error);
      return;
    }

    removeError(event.target);
  }, true);

  // Check all fields on submit
  form.addEventListener('submit', (event) => {
    if (!event.target.classList.contains('validate')) return;
    const fields = event.target.elements;

    let error;
    let hasErrors;

    for (let i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
        showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }

    if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
    }
  }, false);
});
