let hide_password = document.querySelectorAll('.fa-eye-slash');
let show_password = document.querySelectorAll('.fa-eye');
let password_input = document.querySelectorAll('.password');

// show and hide password
for (let i = 0; i < show_password.length; i++) {
    show_password[i].addEventListener('click', ()=>{
        password_input[i].type = 'text';
        show_password[i].style.display='none';
        hide_password[i].style.display='block';
    })  
}
for (let i = 0; i < hide_password.length; i++) {
    hide_password[i].addEventListener('click', ()=>{
        password_input[i].type = 'password';
        show_password[i].style.display='block';
        hide_password[i].style.display='none';
    })  
}