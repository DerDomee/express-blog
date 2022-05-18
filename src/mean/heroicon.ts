import fs from 'fs';
import path from 'path';
import {load as cheerioLoad} from 'cheerio';
import {HeroIcon} from './types';
import {IncomingMessage} from 'http';

export default (
	_req: IncomingMessage,
	res: any,
	next: (err?: unknown) => void,
) => {
	res.locals.heroicon = (icon: HeroIcon): string => {
		icon.style = icon.style ?? 'outline';
		icon.classes = icon.classes ?? '';
		const filepath = path.join(
			'node_modules',
			'heroicons',
			icon.style,
			`${icon.icon}.svg`,
		);
		let svg = '';
		try {
			svg = fs.readFileSync(filepath).toString();
		} catch (err) {
			return `{{heroicon:${icon.style}/${icon.icon}\
			        ${icon.classes ? `; ${icon.classes}` : ''}}}`;
		}
		const $ = cheerioLoad(svg, {}, false);
		$('svg').addClass(icon.classes);
		return $.html();
	};
	next();
};
