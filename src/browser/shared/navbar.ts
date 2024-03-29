const navbar = document.getElementById('main_navbar');
const navbarToggleButton = document.getElementById('main_navbar_toggle');

let navbarToggled = false;

const toggleNavbar = () => {
	if (!navbar) return;
	navbarToggled = !navbarToggled;
	navbar.classList.toggle('h-16');
	console.log(navbarToggled);
};

navbarToggleButton?.addEventListener('click', (ev) => {
	toggleNavbar();
});

window.addEventListener('resize', (ev) => {
	if (navbarToggled) toggleNavbar();
});
