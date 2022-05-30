import routes from './_routes';

describe.each(routes)('Blog routes need a mandatory matcher', (route) => {
	it(`${route.routeMatcher ?? ''}`, () => {
		expect(route).toHaveProperty('routeMatcher');
	});
});
describe.each(routes)(
	'Blog routes need to provide at least one HTTP method handler',
	(route) => {
		it(`${route.routeMatcher}`, () => {
			expect(route.get || route.connect || route.delete || route.head ||
				 route.post || route.put || route.patch || route.trace ||
				 route.options).toBeTruthy();
		});
	},
);
