let alert = document.querySelector('.alert');
let alert_close = document.querySelector('.fa-x');
let progress = document.querySelector('.progress');

alert.style.transform = 'translateX(0)';
progress.classList.add('active');
progress.style.backgroundColor=null;

setTimeout(() => {
    progress.style.backgroundColor='#fff';
    progress.classList.remove('active');
    alert.style.transform = 'translateX(150%)';
}, 5000);


alert_close.addEventListener('click', () => {
    progress.style.backgroundColor='#fff';
    progress.classList.remove('active');
    alert.style.transform = 'translateX(150%)';

})


