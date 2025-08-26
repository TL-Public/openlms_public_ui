<script>
	import GeneralStats from '$lib/landingPage/GeneralStats.svelte';
	import CommonLayoutPattern from '$lib/Components/CommonLayoutPattern.svelte';
	import { _ } from 'svelte-i18n';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import { extractYouTubeVideoId } from '$lib/data.js';

	export let generalStats = [];
	export let token;

	let error = generalStats?.error ? generalStats?.error : null;

	const videoId = import.meta.env.VITE_REAP_INTRO_GCC_ID;
	const aboutVideoUrl = 'https://youtu.be/nTjYUcAiiI8';
</script>

<div>
	<div class="w-full overflow-hidden">
		<CommonLayoutPattern />
	</div>

	<div class="px-4 sm:pb-8 md:px-16 md:pb-16 bg-primary h-auto">
		<!-- 65.5px is the height of Pattern Orange/2  -->
		<div
			class=" tranform -translate-y-[65.5px] p-4 sm:p-8 md:p-12 mx-auto bg-white50 shadow-md rounded-lg 2xl:max-w-7xl"
		>
			<h2
				class="text-base sm:text-2xl md:text-3xl pb-2 sm:pb-4 md:pb-8 text-primary font-bold leading-tight sm:leading-tight md:leading-tight"
			>
				{$_('LandingPageAboutTitle')}
			</h2>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-fit">
				<div class="flex flex-col justify-between">
					<p class="pb-4 sm:pb-6 text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed">
						{$_('LandingPageAboutContent')}
					</p>
					<div class="">
						<GeneralStats {generalStats} {error} />
					</div>
				</div>

				<div
					class="aspect-auto shadow-lg rounded-lg overflow-hidden items-center flex bg-accent"
				>
					<!-- <VideoPlayer {token} {videoId} /> -->
					<VideoPlayer
						videoId={extractYouTubeVideoId(aboutVideoUrl)}
						videoMetaData={{ videoUuid: videoId }}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
