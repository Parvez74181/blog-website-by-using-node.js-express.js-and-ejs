let hide_password = document.querySelector('.fa-eye-slash');
let show_password = document.querySelector('.fa-eye');

let password_input = document.querySelector('.password');
let confirm_password_input = document.querySelector('.confirm-password');

hide_password.addEventListener('click', () => {
    password_input.type = 'password';
    show_password.style.display = 'block';
    hide_password.style.display = 'none';
})
show_password.addEventListener('click', () => {
    password_input.type = 'text';
    hide_password.style.display = 'block';
    show_password.style.display = 'none';
})