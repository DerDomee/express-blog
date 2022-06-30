declare const tvShowData: any;

(() => {
	if (!window.hasOwnProperty('tvShowData') || !tvShowData) return;
	const seasonSelector = document.getElementById(
		'seasonSelector') as HTMLSelectElement;
	const episodeWrapper = document.getElementById(
		'episodeWrapper') as HTMLDivElement;

	if (!seasonSelector || !episodeWrapper) return;

	console.log('TV Show Viewer ready!');

	let currentSeason = null ?? tvShowData.seasons.find(
		(season: any) => season.seasonNumberInShow == 1,
	);

	const renderCurrentSeason = (
		tvShow: any, season: any, episodeWrapper: HTMLDivElement,
	) => {
		episodeWrapper.innerHTML = '';

		const generateEpisodeList = (
			tvShow: any, currentSeason: any, episode: any,
		): HTMLDivElement => {
			const episodeDiv = document.createElement('div');
			const episodeAnchor = document.createElement('a');
			episodeAnchor.setAttribute(
				'href',
				`/watch/${tvShow.tvShowId}/${currentSeason.seasonId}/` +
				`${episode.episodeId}`);
			episodeAnchor.classList.add('flex', 'gap-2');
			const episodeSpan = document.createElement('span');
			const episodeTitle = document.createElement('h2');
			const episodeSlug = document.createElement('p');
			episodeSlug.innerHTML = episode.slug;
			episodeTitle.innerHTML = episode.name;
			episodeSpan.innerHTML =
				`S${currentSeason.seasonNumberInShow}E${episode.episodeNumberInSeason}`;

			episodeAnchor.appendChild(episodeSpan);
			episodeAnchor.appendChild(episodeTitle);
			episodeAnchor.appendChild(episodeSlug);
			episodeDiv.appendChild(episodeAnchor);
			return episodeDiv;
		};
		season.episodes.forEach((episode: any) => {
			episodeWrapper.appendChild(generateEpisodeList(
				tvShow, currentSeason, episode));
		});
	};

	seasonSelector.addEventListener('change', (ev) => {
		currentSeason = tvShowData.seasons.find((season: any) => {
			return (season.seasonId == (ev.target as HTMLSelectElement).value);
		});
		renderCurrentSeason(tvShowData, currentSeason, episodeWrapper);
	});

	renderCurrentSeason(tvShowData, currentSeason, episodeWrapper);
})();
