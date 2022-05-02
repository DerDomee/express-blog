if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/serviceworker.js').then(((reg) => {
			console.log(
				`Service worker successfully registered with scope ${reg.scope}`,
			);
		})).catch((err) => {
			console.log(`Service worker registration failed with error: ${err}`);
		});
}
