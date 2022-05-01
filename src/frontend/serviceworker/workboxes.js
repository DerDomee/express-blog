import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';


// Cache JavaScript and CSS, but continously update in background for use at next page load
registerRoute(
	({ request }) => request.destination === 'script' || request.destination === 'style',
	new StaleWhileRevalidate(),
);


// Cache images and serve them from cache first when they are present.
registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			})
		]
	})
)


// Cache Navigation Requests (The actual content request, mostly html) as network-first, but serve from cache when offline.
registerRoute(
	({ request }) => request.destination === 'document',
	new NetworkFirst({
		networkTimeoutSeconds: 4,
		cacheName: 'navigations',
	}),
)
