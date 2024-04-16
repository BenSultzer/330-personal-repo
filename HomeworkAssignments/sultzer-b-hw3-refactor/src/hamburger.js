// Overview: Homework 3
// Author: Ben Sultzer <bms3902@rit.edu>

// Mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

burgerIcon.addEventListener("click", () => {
    navbarMenu.classList.toggle("is-active");
});