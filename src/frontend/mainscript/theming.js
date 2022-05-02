if (localStorage.theme === 'light' ||
    window.matchMedia('(prefers-color-scheme: light)').matches) {
	document.documentElement.classList.remove('dark');
}
window.matchMedia('(prefers-color-scheme: light)')
	.addEventListener('change', (e) => {
		if (!localStorage.getItem('theme')) {
			e.matches && document.documentElement.classList.remove('dark');
			!e.matches && document.documentElement.classList.add('dark');
		}
	});
