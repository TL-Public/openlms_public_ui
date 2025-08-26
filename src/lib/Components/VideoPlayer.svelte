<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import { format } from 'svelte-i18n';
	import { user } from '/src/stores';

	let playerContainer;
	let youtubePlayerInstance;
	let playerFailed = false;
	let currentVideoId;
	let videoLoaded = false;
	let dispatch = createEventDispatcher();

	export let videoId = '';
	export let analyticsUrl = import.meta.env.VITE_ANALYTICS_URL;
	export let videoMetaData = {};
	export let startTimeInSeconds=null
	export let autoplay = false

	let PlayerComponent;

	// Load YouTube Player script
	async function loadYouTubePlayerComponent() {
		if (window.Player) return window.Player;

		return new Promise((resolve) => {
			const tag = document.createElement('script');
			tag.src = '/youtube-player.iife.js';
			tag.onload = () => resolve(window.Player);
			tag.onerror = () => {
				console.error('Failed to load YouTubePlayerComponent script.');
				playerFailed = true;
				resolve(null);
			};
			document.body.appendChild(tag);
		});
	}

	// Create Player
	async function createPlayer(id) {
		if (!browser || !PlayerComponent || !playerContainer) return;

		// Destroy old player if any
		if (youtubePlayerInstance?.$destroy) {
			youtubePlayerInstance.$destroy();
			youtubePlayerInstance = null;
		}

		playerFailed = false;
		videoLoaded = false;

		try {
			
			const combinedVideoMetaData = {
				videoUuid: null,
				userUuid: $user && $user?.userUuid ? $user?.userUuid : 'public',
				courseUuid: null,
				chapterUuid: null,
				...videoMetaData // set some default values and overwrite with props given by consumer
			};

			youtubePlayerInstance = new PlayerComponent({
				target: playerContainer,
				props: {
					videoId: id,
					autoplay: autoplay,
					analyticsUrl,
					bufferingDelayThreshold: 1.5,
					videoUuid: combinedVideoMetaData.videoUuid,
					startTimeInSeconds: startTimeInSeconds,
					additionalInfo: {
						courseId: combinedVideoMetaData.courseUuid ? combinedVideoMetaData.courseUuid : null,
						userId: combinedVideoMetaData.userUuid,
						chapterId: combinedVideoMetaData.chapterUuid ? combinedVideoMetaData.chapterUuid : null
					}
				}
			});

			// Attach listeners
			youtubePlayerInstance.$on('ready', (e) => {
				console.log('YouTube player ready');
				dispatch('ready', true);
			});

			youtubePlayerInstance.$on('statechange', (e) => {
				// console.log('Player state:', e.detail.state);
				dispatch('statechange', e.detail);
			});

			youtubePlayerInstance.$on('error', (e) => {
				console.error('Player error:', e.detail);
				playerFailed = true;
				dispatch('error', e.detail);
			});

			youtubePlayerInstance.$on('like', (e) => {
				dispatch('like', e.detail);
			});

			youtubePlayerInstance.$on('metadata', (e) => {
				dispatch('metadata', e.detail);
			});

			videoLoaded = true;
		} catch (err) {
			console.error('Failed to create player', err);
			playerFailed = true;
		} finally {
			videoLoaded = !playerFailed;
		}
	}

	// Load component and create player on mount
	onMount(async () => {
		if (!browser) return;

		PlayerComponent = await loadYouTubePlayerComponent();
		if (videoId === null || videoId === '' || videoId === undefined) {
			playerFailed = true;
			videoLoaded = false;
			return;
		}
	});

	// Watch for videoId changes and recreate player
	$: if (
		PlayerComponent &&
		browser &&
		videoId !== currentVideoId &&
		videoId !== null &&
		videoId !== '' &&
		videoId !== undefined
	) {
		currentVideoId = videoId;
		createPlayer(videoId);
	}

	onDestroy(() => {
		if (youtubePlayerInstance?.$destroy) {
			youtubePlayerInstance.$destroy();
			youtubePlayerInstance = null;
		}
		videoLoaded = false;
		playerFailed = false;
	});
</script>

<div class="relative" style="width:100%; aspect-ratio: 16/9.5;">
	{#if !videoLoaded}
		<div class="absolute top-0 left-0 w-full bg-gray-50 animate-pulse z-40 h-[95%]"></div>
		<div
			class="w-20 h-20 border-8 border-gray-30 border-t-accent z-50 absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 round-loader origin-[0%_0%]"
		></div>
	{:else if playerFailed}
		<div
			class="absolute top-0 left-0 w-full bg-gray-50 z-40 h-[95%] flex items-center justify-center text-primary font-medium"
		>
			{$format('Sorry! Failed to load video')}
		</div>
	{/if}

	<div bind:this={playerContainer} style="width:100%; "></div>
</div>

<style>
	.round-loader {
		animation: spin 1s ease-out infinite;
	}

	@keyframes spin {
		0% {
			rotate: 0deg;
		}
		100% {
			rotate: 360deg;
		}
	}
</style>
