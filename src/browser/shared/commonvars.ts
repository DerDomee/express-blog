export const route = location.pathname.replaceAll(/(?=\/$)\//g, '');
declare global {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	interface Window { derdomee: any; }
}
window.derdomee = window.derdomee || {};
