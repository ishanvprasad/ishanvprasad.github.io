import './style.scss';

let num = 0;

setInterval(() => {
  num += 1;

  document.getElementById('main').textContent = `You've been on this page for ${num} seconds.`;
}, 1000);
