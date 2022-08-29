import fs from 'fs';
import path from 'path';
import {load as cheerioLoad} from 'cheerio';
import {HeroIcon} from './types';
import {NextFunction, Request, Response} from 'express';

export const readHeroIcon = (icon: HeroIcon): string => {
	if (!icon.icon) icon.icon = 'null';
	// Set icon specification defaults for style and classes to prevent undefined
	icon.style = icon.style ?? 'outline';
	icon.classes = icon.classes ?? '';
	// Generate subpaths within heroicon for svg location depending on
	// the icon style of the icon specification
	let iconPath = '';
	switch (icon.style) {
	case 'outline':
		iconPath = '24/outline';
		break;
	case 'solid-24':
	case 'solid':
		iconPath = '24/solid';
		break;
	case 'solid-20':
	case 'small':
		iconPath = '20/solid';
		break;
	}

	// Read svg file from node_modules folder of heroicons,
	// Return the svg file contents when icon was found,
	// Return error string when icon wasn't found.
	const filepath = path.join(
		'node_modules',
		'heroicons',
		iconPath,
		`${icon.icon}.svg`,
	);
	try {
		const svgString = fs.readFileSync(filepath).toString();
		return svgString.trim();
	} catch (err) {
		return `{{heroicon:${icon.style}/${icon.icon}\
			        ${icon.classes ? `; ${icon.classes}` : ''}}}`;
	}
};

/**
 *
 * @param {string} svg a heroicon SVG file
 * @param {HeroIcon} icon the heroicon specification
 * @return {string} the heroicon SVG with added css-classes from icon
 *                  specification
 */
export const populateClasses = (svg: string, icon: HeroIcon) => {
	const $ = cheerioLoad(svg, {}, false);
	$('svg').addClass(icon.classes);
	return $.html();
};

export default (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.locals.heroicon = (icon: HeroIcon) => {
		const heroIconString = readHeroIcon(icon);
		return populateClasses(heroIconString, icon);
	};
	next();
};
