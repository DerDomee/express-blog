import fs from 'fs';
import path from 'path';
import {load as cheerioLoad} from 'cheerio';
import {HeroIcon} from './types';
import {NextFunction, Request, Response} from 'express';

export const readHeroIcon = (icon: HeroIcon): string => {
	if (!icon.icon) icon.icon = 'null';
	icon.style = icon.style ?? 'outline';
	icon.classes = icon.classes ?? '';
	const filepath = path.join(
		'node_modules',
		'heroicons',
		icon.style,
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
