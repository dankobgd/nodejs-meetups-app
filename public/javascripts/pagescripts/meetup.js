/* eslint-disable */

fetch(window.location.href, {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => {
    const {userIsCreator} = data;
    const isLoggedIn = data.user;

    if (data.meetupNotFound || data.castError) {
      return;
    }

    /**
     * Edit Meetup info
     */
    const editInfoHTML = `
          <div class="mat-div title">
              <label for="title" class="mat-label">Title</label>
              <input type="title" class="mat-input" id="title" name="title" value="${data.meetup.title}">
          </div>
          <div class="mat-div location">
              <label for="location" class="mat-label">Location</label>
              <input type="location" class="mat-input" id="location" name="location" value="${data.meetup.location}">
          </div>
          <div class="mat-div description">
              <label for="description" class="mat-label">Description</label>
              <input type="description" class="mat-input" id="description" name="description" value="${data.meetup.description}">
          </div>`;

    function saveInfo() {
      const modalTitle = document.querySelector('#title');
      const modalLocation = document.querySelector('#location');
      const modalDescription = document.querySelector('#description');

      if (modalTitle.value.trim() == '' || modalLocation.value.trim() == '' || modalDescription.value.trim() == '') {
        window.alert('All fields are required');
        return;
      }

      fetch(`${siteUrl}/meetup/${data.meetup._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newTitle: modalTitle.value,
          newLocation: modalLocation.value,
          newDescription: modalDescription.value,
        }),
      }).then(() => {
        const title = document.querySelector('.card-title.meetup')
        const loc = document.querySelector('p.location')
        const desc = document.querySelector('p.description')

        title.innerHTML = modalTitle.value
        loc.innerHTML = modalLocation.value
        desc.innerHTML = modalDescription.value
        new Toast('Updated Meetup Info');
      })
    }

    const modalInfo = new Modal({
      title: 'Edit Meetup Info',
      body: editInfoHTML,
      onSave: saveInfo,
    });

    if (isLoggedIn && userIsCreator) {
      document.querySelector('#editMeetupInfoBtn').addEventListener('click', () => modalInfo.open());
    }

    /**
     *  Edit Date and Time
     */

    const monthsList = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const fullDate = new Date(data.meetup.date);
    const dateValue = fullDate.getDate();
    const monthValue = monthsList[fullDate.getMonth()];
    const yearValue = fullDate.getFullYear();
    const hoursValue = fullDate.getHours();
    const minutesValue = fullDate.getMinutes();

    const dateOutput = `${dateValue} ${monthValue}, ${yearValue}`;
    let timeOutput = '';

    if (minutesValue < 10) {
      timeOutput = `${hoursValue}:0${minutesValue}`;
    } else {
      timeOutput = `${hoursValue}:${minutesValue}`;
    }

    const editDateTimeHTML = `
      <div class="mat-div dpicker">
          <label for="datepicker" class="mat-label">Choose Date</label>
          <input type="text" class="mat-input datepicker" id="datepicker" name="datepicker" value="${dateOutput}">
      </div>
      <div class="mat-div tpicker">
          <label for="timepicker" class="mat-label">Choose Time</label>
          <input type="text" class="mat-input timepicker" id="timepicker" name="timepicker" value="${timeOutput}">
      </div>`;

    function saveDateTime() {
      const dpicker = document.getElementById('datepicker');
      const tpicker = document.getElementById('timepicker');

      function validDateTimeEntry() {
        if (dpicker.value !== '' && tpicker.value !== '') {
          return true;
        }
        return false;
      }

      if (!validDateTimeEntry()) {
        window.alert("Date and Time fields can't be empty");
        return;
      }

      if (validDateTimeEntry()) {
        fetch(`${siteUrl}/meetup/${data.meetup._id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            editedDate: dpicker.value,
            editedTime: tpicker.value,
          }),
        }).then(res => res.json())
        .then(timestamp => {
          const formattedDate = moment(timestamp.newDate).format('dddd, D. MMMM YYYY - H:mm');
          document.querySelector('p.date').innerHTML = formattedDate;
          new Toast('Updated Date and Time');
        })
      }
    }

    const modalDateTime = new Modal({
      title: 'Edit Date & Time',
      body: editDateTimeHTML,
      onSave: saveDateTime,
    });

    if (isLoggedIn && userIsCreator) {
      document.querySelector('#editDateTimeBtn').addEventListener('click', () => {
        modalDateTime.open();
        removeDateTimePickerTextboxUnderline();
      });
    }

    /**
     * Register Unregister
     */

    const registerUnregisterButton = document.querySelector('#regUnreg');
    const userRegistered = data.userIsRegistered;

    let regToastMessage;
    let regModalTitle;
    let regBtnText;

    if (userRegistered) {
      regModalTitle = 'Unregister from meetup?';
      regToastMessage = 'Unregistered from meetup';
      regBtnText = 'Register';
    } else {
      regModalTitle = 'Register for meetup?';
      regToastMessage = 'Registered for meetup';
      regBtnText = 'Unregister';
    }


    if (registerUnregisterButton !== null) {
      function registerUserForMeetup() {
        fetch(`${siteUrl}/meetup/${data.meetup._id}`, {
            method: 'PATCH',
            credentials: 'include',
          }).then(() => {
            new Toast(regToastMessage);
            registerUnregisterButton.innerHTML = regBtnText;
          })
        }

        const modalReg = new Modal({
          title: regModalTitle,
          body: 'You can always change your mind later',
          onSave: registerUserForMeetup,
        });

        if (isLoggedIn) {
          registerUnregisterButton.addEventListener('click', () => modalReg.open());
        }
      }


    /**
     * Delete Meetup
     */

    const btnDeleteMeetup = document.querySelector('#deleteMeetup');

    const modalDeleteMeetup = new Modal({
      title: 'Delete Meetup?',
      body: 'The result of this action will be final!',
      onSave: deleteMeetup,
    });

    if (btnDeleteMeetup !== null && isLoggedIn && userIsCreator) {
      btnDeleteMeetup.addEventListener('click', () => modalDeleteMeetup.open());
    }

    function deleteMeetup() {
      fetch(`${siteUrl}/meetup/${data.meetup._id}`, {
        method: 'DELETE',
      })
      .then(() => {
        window.location.href = '/';
        localStorage.setItem('toast', 'deleteMeetup');
      });
    }

    /**
     * View Users List
     */

    const usersListHTML = `
    <ol class="users-list">
      ${data.registeredUsersList
        .map(
          (user, idx) =>
            `
            <div class="users-list-item">
            <div class="users-list-index">${idx + 1}</div>
              <img src="\\${user.avatar || 'public/images/site/placeholder.jpg'}" class="users-list-item-avatar" />
              <a href="${siteUrl}/profile/${user._id}">
                <li>${user.username}</li>
              </a>
            </div>
          `
        )
        .join('')}
    </ol`;

    const viewUsersListBtn = document.querySelector('#viewUsersListBtn');

    const usersListModal = new Modal({
      title: 'Registered users list',
      body: usersListHTML,
      cancelButtonText: 'Quit',
      noSave: true,
    });

    if (isLoggedIn && userIsCreator) {
      viewUsersListBtn.addEventListener('click', () => {
        if (data.registeredUsersList.length <= 0) {
          window.alert('No users registered');
        } else {
          usersListModal.open();
        }
      });
    }

    /**
     * Post new Comment
     */

    const postComment = document.querySelector('#postComment');
    const newComment = document.querySelector('#newComment');

    if (postComment !== null) {
      postComment.addEventListener('click', () => {
        const authorId = data.user._id;

        const hasSpanError = document.querySelector('.spanError');

        if (newComment.value.trim() === '' && !hasSpanError) {
          const divComment = document.querySelector('.div-comment.new-comment');
          const spanError = document.createElement('span');
          spanError.classList.add('spanError');
          spanError.innerHTML = 'Message needs to have actual content';
          divComment.parentNode.insertBefore(spanError, divComment.nextSibling);
        }

        if (authorId && newComment.value.trim() !== '') {
          fetch(`${siteUrl}/meetup/${data.meetup._id}/comments`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              newComment: newComment.value.trim(),
              authorId,
            }),
          }).then(() => {
            newComment.value = '';
            window.location.reload()
          });
        }
      });
    }

    /**
     * Edit Comment
     */

    const allEditButtons = document.querySelectorAll('.edit-comment');
    const allSaveButtons = document.querySelectorAll('.save-comment');
    const allcommentInputs = document.querySelectorAll('textarea.comment');

    allSaveButtons.forEach(btn => btn.classList.add('hidden'));
    allcommentInputs.forEach(field => field.setAttribute('disabled', 'true'));

    Array.from(allEditButtons).forEach(elm => {
      elm.addEventListener('click', function(e) {
        const commentId = this.getAttribute('data-commentId');

        const editBtnQuery = `.edit-comment[data-commentId='${commentId}']`;
        const saveBtnQuery = `.save-comment[data-commentId='${commentId}']`;
        const inputCommentQuery = `.comment[data-commentId='${commentId}']`;

        const saveBtn = document.querySelectorAll(saveBtnQuery)[0];
        const editBtn = document.querySelectorAll(editBtnQuery)[0];
        const inputComment = document.querySelectorAll(inputCommentQuery)[0];

        editBtn.setAttribute('disabled', true);

        saveBtn.classList.remove('hidden');
        inputComment.removeAttribute('disabled');
        inputComment.focus();

        saveBtn.addEventListener('click', () => {
          fetch(`${siteUrl}/meetup/${data.meetup._id}/comments`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              updatedComment: inputComment.value.trim(),
              commentId,
            }),
          }).then(() => {
            saveBtn.classList.add('hidden');
            editBtn.removeAttribute('disabled');
            new Toast('Comment updated')
          });

          inputComment.setAttribute('disabled', 'true');
        });
      });
    });


    /**
     * Delete Comment
     */

    const deleteCommentButton = document.querySelectorAll('.delete-comment');
    const commentSectionHeading = document.querySelector('span.comment-section-heading');
    const totalCommentsNum = document.querySelector('.total-comments-num');

    const modalDeleteComment = new Modal({
      title: 'Delete comment',
      body: 'Are you sure?',
    });

    Array.from(deleteCommentButton).forEach(elm => {
      elm.addEventListener('click', function(e) {
        const commentId = this.getAttribute('data-commentId');
        const meetupId = data.meetup._id;
        const wholeCommentElement = document.querySelector(`.div-comment.single-comment[data-commentId='${commentId}']`)

        modalDeleteComment.open();
        modalDeleteComment.onSave = () => removeComment();

        function removeComment() {
          fetch(`${siteUrl}/meetup/${data.meetup._id}/comments`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              commentId,
              meetupId,
            }),
          }).then(() => {
            wholeCommentElement.remove();
            new Toast('Comment deleted')
            let count = Number.parseInt(totalCommentsNum.innerHTML, 10);
            count--
            if (count === 0) {
              commentSectionHeading.innerHTML = 'No comments posted for this meetup'
            } else {
              totalCommentsNum.innerHTML = count
            }
          });
        }
      });
    });

    // Auto resize textarea to fit content

    function adjustSize(elm) {
      elm.setAttribute('style', `height: ${elm.scrollHeight}px; overflow-y: hidden;`);
      elm.addEventListener('input', OnInput, false);
    }

    function OnInput() {
      this.style.height = 'auto';
      this.style.height = `${this.scrollHeight}px`;
    }

    const commentTextareas = document.querySelectorAll('textarea.comment');
    commentTextareas.forEach(t => adjustSize(t));

    /**
     * Remove underline from date and time picker text fields
     */

    function removeDateTimePickerTextboxUnderline() {
      const dpickerDiv = document.querySelector('.dpicker');
      const tpickerDiv = document.querySelector('.tpicker');

      $('#datepicker').on('change', () => dpickerDiv.classList.remove('is-active'));
      $('#timepicker').on('change', () => tpickerDiv.classList.remove('is-active'));

      document.addEventListener('click', e => {
        const dtpDiv = document.querySelectorAll('div.dtp');
        const dtpBtnCancel = document.querySelectorAll('.dtp-btn-cancel');

        dtpDiv[0].addEventListener('click', () => dpickerDiv.classList.remove('is-active'));
        dtpDiv[1].addEventListener('click', () => tpickerDiv.classList.remove('is-active'));

        dtpBtnCancel[0].addEventListener('click', () => dpickerDiv.classList.remove('is-active'));
        dtpBtnCancel[1].addEventListener('click', () => tpickerDiv.classList.remove('is-active'));
      });
    }

    //  Date picker
    $('#datepicker').bootstrapMaterialDatePicker({
      format: 'YYYY-MM-DD',
      time: false,
      minDate: new Date(),
      clearButton: true,
      canceltext: 'Cancel',
      okText: 'OK',
      clearText: 'Clear',
    });

    //  Time picker
    $('#timepicker').bootstrapMaterialDatePicker({
      format: 'HH:mm',
      date: false,
      switchOnClick: false,
      clearButton: true,
      canceltext: 'Cancel',
      okText: 'OK',
      clearText: 'Clear',
    });

    /**
     * Google Maps and Geolocation API
     */

    function initMap() {
      const formatted_address = data.meetup.geolocation.formatted_address;
      const lat = data.meetup.geolocation.lat;
      const lng = data.meetup.geolocation.lng;
      const coords = {lat, lng};

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: coords,
      });

      const marker = new google.maps.Marker({
        position: coords,
        map,
        animation: google.maps.Animation.DROP,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<span>${formatted_address}</span>`,
      });

      marker.addListener('mouseover', () => infoWindow.open(map, marker));
      marker.addListener('mouseout', () => infoWindow.close(map, marker));
      marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    }

    if (data.meetup.geolocation !== null) {
      initMap();
    }
  })
  .catch(err => console.log(err));

/**
 * History go back on error output text click
 */
const errorBackLinks = document.querySelectorAll('.error-output-back-link');
errorBackLinks.forEach(link => {
  link.addEventListener('click', () => window.history.go(-1));
});
