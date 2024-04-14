// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

// Mobile menu
const burgerIcon = document.querySelector("#burger") as HTMLAnchorElement;
const navbarMenu = document.querySelector("#nav-links") as HTMLDivElement;

burgerIcon.addEventListener("click", () => {
    navbarMenu.classList.toggle("is-active");
});