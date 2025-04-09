<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

	export let videoId;
	// let videoLoadError = false;
	let player;
	let mounted = false;
	let videoLoaded = false;
	let scriptLoaded = false;
	let divId = 'player_' + parseInt(Math.random() * 109999);
	const dispatch = createEventDispatcher();

	function loadScript(src) {
		return new Promise((resolve, reject) => {
			const existingScript = document?.querySelector(`script[src="${src}"]`);

			if (existingScript) {
				resolve();
				return;
			}
			const script = document?.createElement('script');
			if (script) {
				script.type = 'text/javascript';
				script.src = src;
				script.onload = () => {
					resolve();
				};
				script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
				document.head.appendChild(script);
			}
		});
	}

	onMount(() => {
		mounted = true;
	});

	onDestroy(() => {
		if (player) {
			player.destroy();
			player = null;
			console.log('Player instance destroyed');
		}
	});

	function playerIsReady() {
		dispatch('Ready');
		// console.log()
		setInterval(() => {
			// dispatch('currentPlayTime', player?.getCurrentTime());
		}, 1000);
	}

	export function play() {
		if (player) {
			player.playVideo();
			setInterval(() => {
				// dispatch('currentPlayTime', player?.getCurrentTime());
			}, 1000);
		}
	}

	$: createPlayer(videoId, mounted);
	async function createPlayer() {
		if (browser && mounted) {
			dispatch('playerLoaded', false);
			videoLoaded = false;
			if (!videoId) {
				// if (videoId === null) {
					videoLoaded = true;
					// videoLoadError = true;
					dispatch('error', 'Invalid Url');
				// }
				return;
			}

			if (typeof YT === 'undefined') {
				console.log('YT is UNDEFINED');
				// Load the YouTube API script if it's not already loaded
				await loadScript('https://www.youtube.com/iframe_api');

				// Wait for the API to be ready
				await new Promise((resolve) => {
					window.onYouTubeIframeAPIReady = resolve;
				});
			}
			// await loadScript('https://www.youtube.com/iframe_api');
			scriptLoaded = true;

			try {
				const interval = setInterval(async () => {
					if (typeof YT != 'undefined') {
						console.log('videoId B4', videoId);
						clearInterval(interval);

						// await new Promise((resolve) => {
						// 	console.log('Inside promise');
						// 	window.onYouTubeIframeAPIReady = resolve;
						// 	console.log('after resolution');
						// });

						try {
							const playerDiv = document.getElementById(divId);
							const playerWidth = playerDiv.offsetWidth;
							const playerHeight = (playerWidth * 9) / 16;

							player = new YT.Player(divId, {
								height: playerHeight,
								width: playerWidth,
								videoId,
								events: {
									onReady: playerIsReady,
									onStateChange: playerStateChange
								}
							});
							console.log('player', player);
						} catch (err) {
							console.log('yt player error', err);
						}
					}
				}, 150);
			} catch (err) {
				console.log('error is', err);
			} finally {
				dispatch('playerLoaded', true);
				videoLoaded = true;
			}
		}
	}

	function playerStateChange({ data }) {
		dispatch('PlayerStateChange', data);
		console.log('Player state changed');

		let strReturn = '';
		if (data === -1) strReturn = '(unstarted)';
		if (data === 0) strReturn = '(ended)';
		if (data === 1) strReturn = '(playing)';
		if (data === 2) strReturn = '(paused)';
		if (data === 3) strReturn = '(buffering)';
		if (data === 5) strReturn = '(video cued)';

		dispatch('PlayerStateChangeString', strReturn);
	}
</script>

<div class="w-full relative shadow-sm">
	{#if !videoLoaded}
		<div class="absolute top-0 left-0 w-full bg-gray-50 animate-pulse z-40 h-[95%]"></div>
		<div
			class="w-20 h-20 border-8 border-gray-30 border-t-blue-100 z-50 absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 round-loader origin-[0%_0%]"
		></div>
	{/if}
	<!-- {#if videoLoadError}
		<div
			class="absolute top-0 left-0 w-full bg-gray-50 z-40 h-[95%] flex items-center justify-center"
		>
			<h2 class="text-primary font-medium">Oops.Something went wrong! Failed to load video.</h2>
		</div>
	{/if} -->
	<div id={divId} class="w-full aspect-video" />
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
