import routes from './_routes';

describe.each(routes)('Routes need a matcher', (route) => {
	it(`${route.routeMatcher ?? ''}`, () => {
		expect(route).toHaveProperty('routeMatcher');
	});
});
describe.each(routes)('Routes have at least one provider', (route) => {
	it(`${route.routeMatcher}`, () => {
		expect(route.get || route.connect || route.delete || route.head ||
				 route.post || route.put || route.patch || route.trace ||
				 route.options).toBeTruthy();
	});
});
