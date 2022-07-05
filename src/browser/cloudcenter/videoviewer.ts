import {route} from '../shared/commonvars';

if (route.startsWith('/watch')) {
	const videoelem: HTMLVideoElement = document.getElementById(
		'the-video') as HTMLVideoElement;
	const controlsOverlay: HTMLDivElement = document.getElementById(
		'video-controls-wrapper') as HTMLDivElement;
	const playPauseBtn: HTMLButtonElement = document.getElementById(
		'btn-playpause') as HTMLButtonElement;
	const playPausePlay: HTMLSpanElement = document.getElementById(
		'playpause-play') as HTMLSpanElement;
	const playPausePause: HTMLSpanElement = document.getElementById(
		'playpause-pause') as HTMLSpanElement;
	const volumeContainer: HTMLDivElement = document.getElementById(
		'volume-container') as HTMLDivElement;
	const volumeCtlBtn: HTMLButtonElement = document.getElementById(
		'btn-volumectl') as HTMLButtonElement;
	const volumeCtlMuted: HTMLSpanElement = document.getElementById(
		'volumectl-muted') as HTMLSpanElement;
	const volumeCtlQuiet: HTMLSpanElement = document.getElementById(
		'volumectl-quiet') as HTMLSpanElement;
	const volumeCtlLoud: HTMLSpanElement = document.getElementById(
		'volumectl-loud') as HTMLSpanElement;
	const volumeSlider: HTMLInputElement = document.getElementById(
		'volumectl-slider') as HTMLInputElement;
	const fullscreenBtn: HTMLButtonElement = document.getElementById(
		'btn-fullscreen') as HTMLButtonElement;
	const fullscreenEnable: HTMLSpanElement = document.getElementById(
		'fullscreen-enable') as HTMLSpanElement;
	const fullscreenDisable: HTMLSpanElement = document.getElementById(
		'fullscreen-disable') as HTMLSpanElement;
	const videotimeContainer: HTMLDivElement = document.getElementById(
		'videotime-container') as HTMLDivElement;
	const videotimeCurrent: HTMLSpanElement = document.getElementById(
		'videotime-current') as HTMLSpanElement;
	const videotimeTotal: HTMLSpanElement = document.getElementById(
		'videotime-total') as HTMLSpanElement;
	const timelineContainer: HTMLDivElement = document.getElementById(
		'timeline-container') as HTMLDivElement;
	const timeline: HTMLDivElement = document.getElementById(
		'timeline') as HTMLDivElement;

	const updatePlayPauseBtn = () => {
		if (!videoelem.paused) {
			playPausePlay.classList.add('hidden');
			playPausePause.classList.remove('hidden');
		} else {
			playPausePlay.classList.remove('hidden');
			playPausePause.classList.add('hidden');
		}
	};

	const updateVolumeBtn = () => {
		if (videoelem.volume === 0) {
			volumeCtlMuted.classList.remove('hidden');
			volumeCtlQuiet.classList.add('hidden');
			volumeCtlLoud.classList.add('hidden');
		} else if (videoelem.volume < 0.5) {
			volumeCtlMuted.classList.add('hidden');
			volumeCtlQuiet.classList.remove('hidden');
			volumeCtlLoud.classList.add('hidden');
		} else {
			volumeCtlMuted.classList.add('hidden');
			volumeCtlQuiet.classList.add('hidden');
			volumeCtlLoud.classList.remove('hidden');
		}
		volumeSlider.value = `${videoelem.volume}`;
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			return;
		}
		document.documentElement.requestFullscreen();
	};

	const formatVideoTime = (time: number): string => {
		const lzf = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2});
		const seconds = lzf.format(Math.floor(time % 60));
		const minutes = lzf.format(Math.floor(time / 60) % 60);
		const hours = Math.floor(time / 3600);
		return `${hours === 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
	};

	const handleTimelineUpdate = (ev: MouseEvent) => {
		const rect = timelineContainer.getBoundingClientRect();
		const percent = Math.min(
			Math.max(0, ev.x - rect.x), rect.width) / rect.width;
		timelineContainer.style.setProperty('--preview-position', `${percent}`);
		if (isScrubbing) {
			timelineContainer.style.setProperty('--progress-position', `${percent}`);
		}
	};

	let wasPaused: boolean;
	let isScrubbing: boolean = false;
	let isPreviewing: boolean = false;
	const toggleScrubbing = (ev: MouseEvent) => {
		const rect = timelineContainer.getBoundingClientRect();
		const percent = Math.min(
			Math.max(0, ev.x - rect.x), rect.width) / rect.width;
		isScrubbing = (ev.buttons & 1) === 1;
		timelineContainer.classList.toggle('scrubbing', isScrubbing);
		if (isScrubbing) {
			wasPaused = videoelem.paused;
			videoelem.pause();
		} else {
			videoelem.currentTime = percent * videoelem.duration;
			if (!wasPaused) videoelem.play().catch();
		}
	};

	const togglePreview = (ev: MouseEvent) => {
		isPreviewing = !isPreviewing;
	};

	timelineContainer.addEventListener('click', (ev) => {
		ev.cancelBubble = true;
	});

	timelineContainer.addEventListener('mousedown', toggleScrubbing);
	document.addEventListener('mouseup', (ev) => {
		if (isScrubbing) toggleScrubbing(ev);
	});

	timelineContainer.addEventListener('mouseenter', togglePreview);
	timelineContainer.addEventListener('mouseleave', (ev) => {
		if (!isScrubbing && isPreviewing) togglePreview(ev);
	});

	timelineContainer.addEventListener('mousemove', handleTimelineUpdate);

	videoelem.addEventListener('pause', () => {
		updatePlayPauseBtn();
	});
	videoelem.addEventListener('play', () => {
		updatePlayPauseBtn();
	});

	videoelem.addEventListener('volumechange', () => {
		updateVolumeBtn();
		window.localStorage.setItem('video-volume', `${videoelem.volume}`);
	});

	let originalVolume = 1;
	volumeCtlBtn.addEventListener('click', (ev) => {
		if (videoelem.volume > 0) {
			originalVolume = videoelem.volume;
			videoelem.volume = 0;
		} else {
			videoelem.volume = originalVolume;
		}
	});

	const videoPlayPause = () => {
		if (!videoelem.paused) {
			videoelem.pause();
		} else {
			videoelem.play().catch();
		}
	};

	volumeContainer.addEventListener('click', (ev) => {
		ev.cancelBubble = true;
	});

	volumeSlider.addEventListener('input', (ev) => {
		videoelem.volume = volumeSlider.value as unknown as number;
	});

	window.addEventListener('dblclick', (ev: MouseEvent) => {
		ev.cancelBubble = true;
		toggleFullscreen();
	});

	videotimeContainer.addEventListener('click', (ev) => {
		ev.cancelBubble = true;
	});

	videoelem.addEventListener('loadeddata', (ev) => {
		videotimeTotal.textContent = formatVideoTime(videoelem.duration);
	});

	videoelem.addEventListener('timeupdate', (ev) => {
		videotimeCurrent.textContent = formatVideoTime(videoelem.currentTime);
		const percent = videoelem.currentTime / videoelem.duration;
		timelineContainer.style.setProperty('--progress-position', `${percent}`);
		if (!isScrubbing && !isPreviewing) {
			timelineContainer.style.setProperty('--preview-position', `${percent}`);
		}
	});

	window.addEventListener('fullscreenchange', () => {
		if (document.fullscreenElement) {
			fullscreenEnable.classList.add('hidden');
			fullscreenDisable.classList.remove('hidden');
			return;
		}
		fullscreenEnable.classList.remove('hidden');
		fullscreenDisable.classList.add('hidden');
	});

	fullscreenBtn.addEventListener('click', (ev) => {
		ev.cancelBubble = true;
		toggleFullscreen();
	});

	playPauseBtn.addEventListener('click', (ev: MouseEvent) => {
		ev.cancelBubble = true;
		videoPlayPause();
	});

	controlsOverlay.addEventListener('click', (ev: MouseEvent) => {
		ev.cancelBubble = true;
		videoPlayPause();
	});

	window.addEventListener('keydown', (ev: KeyboardEvent) => {
		if (ev.code === 'Space') {
			videoPlayPause();
		}
	});

	const setVolume = ((): number => {
		const savedVolume = window.localStorage.getItem(
			'video-volume') as unknown as number;
		if (isNaN(savedVolume)) {
			return 1;
		}
		if (savedVolume <= 0) return 0.1;
		return savedVolume;
	})();
	videoelem.volume = setVolume;
	originalVolume = setVolume;
	volumeSlider.value = `${setVolume}`;
}

