if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/serviceworker.js').then((registration => {
		console.log(`Service worker successfully registered with scope ${registration.scope}`);
	})).catch((err) => {
		console.log(`Service worker registration failed width error: ${err}`);
	});
}
