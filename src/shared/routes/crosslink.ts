import options from '../../options';

export const getUrl = (
	subapp: 0|1|2,
	route: string,
	developmentMode: boolean,
	blogEnabled: boolean | null | undefined,
	blogHostname: string | null | undefined,
	blogPort: number,
	cmsEnabled: boolean | null | undefined,
	cmsHostname: string | null | undefined,
	cmsPort: number,
	cloudcenterEnabled: boolean | null | undefined,
	cloudcenterHostname: string | null | undefined,
	cloudcenterPort: number,

): string => {
	// Leading Slash removal
	route = route.replaceAll(/^\/+/, '');

	if (developmentMode) {
		switch (subapp) {
		case 0:
			if (!blogEnabled) return '#';
			return `http://localhost:${blogPort}/${route}`;
		case 1:
			if (!cmsEnabled) return '#';
			return `http://localhost:${cmsPort}/${route}`;
		case 2:
			if (!cloudcenterEnabled) return '#';
			return `http://localhost:${cloudcenterPort}/${route}`;
		default: throw new TypeError('subapp type must be 0, 1 or 2');
		}
	}
	switch (subapp) {
	case 0:
		if (!blogEnabled) return '#';
		return `${blogHostname}/${route}`;
	case 1:
		if (!cmsEnabled) return '#';
		return `${cmsHostname}/${route}`;
	case 2:
		if (!cloudcenterEnabled) return '#';
		return `${cloudcenterHostname}/${route}`;
	default: throw new TypeError('subapp type must be 0, 1 or 2');
	}
};

export default (
	subapp: 0 | 1 | 2,
	route: string,
): string => {
	if (options.nodeEnv === 'production') {
		return getUrl(
			subapp,
			route,
			false,
			options.blogEnabled,
			options.blogHostname,
			options.blogPort,
			options.cmsEnabled,
			options.cmsHostname,
			options.cmsPort,
			options.cloudcenterEnabled,
			options.cloudcenterHostname,
			options.cloudcenterPort,
		);
	} else {
		return getUrl(
			subapp,
			route,
			true,
			options.blogEnabled,
			null,
			options.blogPort,
			options.cmsEnabled,
			null,
			options.cmsPort,
			options.cloudcenterEnabled,
			null,
			options.cloudcenterPort,
		);
	}
};
