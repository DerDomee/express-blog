import * as heroicon from './heroicon';
import {HeroIcon} from './types';

describe('readHeroIcon reads icon file from node_modules', () => {
	it('Returns a svg for known icons no matter what', () => {
		const validSvgRegex = /^<svg [\s\S]*<\/svg>$/;
		expect(heroicon.readHeroIcon(
			{icon: 'academic-cap'},
		)).toMatch(validSvgRegex);
		expect(heroicon.readHeroIcon(
			{icon: 'academic-cap', style: 'solid'},
		)).toMatch(validSvgRegex);
		expect(heroicon.readHeroIcon(
			{icon: 'academic-cap', style: 'outline', classes: 'foo'},
		)).toMatch(validSvgRegex);
		expect(heroicon.readHeroIcon(
			{icon: 'academic-cap', style: 'outline', classes: 'foo bar'},
		)).toMatch(validSvgRegex);
	});

	it('Returns a escaped, render-ready string representation of input', () => {
		const invalidIconRegex = /^{{heroicon:((outline)|(solid))\/.+(;.+)?}}$/;
		expect(heroicon.readHeroIcon(
			{icon: ''},
		)).toMatch(invalidIconRegex);
		expect(heroicon.readHeroIcon(
			{icon: null},
		)).toMatch(invalidIconRegex);
		expect(heroicon.readHeroIcon(
			{icon: undefined},
		)).toMatch(invalidIconRegex);
		expect(heroicon.readHeroIcon(
			{icon: 1 as unknown as string},
		)).toMatch(invalidIconRegex);
	},
	);
});

describe.each([
	{icon: 'academic-cap'},
	{icon: 'academic-cap', classes: 'foo'} as HeroIcon,
	{icon: 'academic-cap', classes: 'bar baz'} as HeroIcon,
	{icon: 'academic-cap', classes: null} as HeroIcon,
	{icon: 'academic-cap', classes: undefined} as HeroIcon,
	{icon: 'academic-cap', classes: 1 as unknown as string} as HeroIcon,
],
)('populateClasses adds html+css classes to any svg string', (icon) => {
	it(`with iconclass ${icon.classes}`, () => {
		const validSvgRegex = /^<svg [\s\S]*<\/svg>$/;
		const heroIconString1 = heroicon.readHeroIcon(icon);
		const finalSvg = heroicon.populateClasses(heroIconString1, icon);
		expect(finalSvg).toMatch(validSvgRegex);
		expect(finalSvg).toContain(icon.classes.toString());
	});
});
