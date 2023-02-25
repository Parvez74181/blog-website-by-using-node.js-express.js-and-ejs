let nav = document.querySelector('nav');
let header = document.querySelector('header');
let menu_bar = document.querySelector('#menu-bar');
let menu_close = document.querySelector('#menu-close');
let menu_link = document.querySelectorAll('nav aside ul li a');
let profilepic = document.querySelector("#profilepic");
let user_menu = document.querySelector('#user-menu');
let body = document.querySelector('body')


menu_bar.addEventListener("click", () => {
    nav.style.transform = 'translateX(0%)';
    menu_bar.style.opacity = "0";
    menu_close.style.display = "inherit";
});

menu_close.addEventListener("click", () => {
    nav.style.transform = 'translateX(-150%)';
    menu_bar.style.opacity = "1";
    menu_close.style.display = "none";
});

// to indicate active pages
// let activePage = window.location.pathname;
// menu_link.forEach(link => {
//     if (link.href.includes(`${activePage}`)) {
//         link.classList.add('active');
//         console.log(link.href.includes('/'));
//     };
// });


profilepic.addEventListener("click", () => {
    user_menu.classList.toggle('active');
});

profilepic.addEventListener('blue', () => {
    user_menu.classList.remove('active');
    console.log('hello');
});





