/* eslint-disable */


window.addEventListener('load', () => {
  moment.updateLocale('sr');

  const toast = localStorage.getItem('toast');
  if (toast === 'deleteMeetup') {
    new Toast('Meetup deleted!');
    localStorage.removeItem('toast');
  }
});
