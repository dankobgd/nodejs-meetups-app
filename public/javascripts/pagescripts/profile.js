/* eslint-disable */

fetch(window.location.href, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
  })
    .then(response => response.json())
    .then((data) => {
      data.user.password = undefined;
      const email = document.getElementById('email');
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      const formInfo = document.getElementById('form-info');
      const formPassword = document.getElementById('form-password');
      const filePicker = document.getElementById('filePicker');
      const profileImage = document.getElementById('profile-image');
      const uploadImageButton = document.getElementById('btn-upload-avatar');


      if (username && filePicker) {
        uploadImageButton.onclick = function () {
          filePicker.click();
        };

        //  preview profile image
        filePicker.addEventListener('change', (e) => {
          profileImage.src = URL.createObjectURL(e.target.files[0]);
        });

        formInfo.addEventListener('submit', () => {
          localStorage.setItem('showToast', 'profile-info');
        });

        formPassword.addEventListener('submit', () => {
          localStorage.setItem('showToast', 'profile-password');
        });


        confirmPassword.addEventListener('blur', comparePasswords);
        confirmPassword.addEventListener('change', addCustomValidity);
        formPassword.addEventListener('submit', preventFormSubmit);

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


        //  Display the right toast message
        function showToastMessage() {
          const toast = localStorage.getItem('showToast');
          if (localStorage.length <= 0) return;
          if (data.shouldShowToast === false) return;

          switch (toast) {
            case 'profile-info':
              new Toast('Updated profile info');
              localStorage.removeItem('showToast');
              break;
            case 'profile-password':
              new Toast('Updated profile password');
              localStorage.removeItem('showToast');
              break;
            default:
              localStorage.removeItem('showToast');
          }
        }


        showToastMessage();
      }
    });
