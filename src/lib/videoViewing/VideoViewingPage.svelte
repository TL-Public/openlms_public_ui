<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { videoInfo } from '$lib/data.js';
	import { getLocalStoreData } from '$lib/utils/helper.js';
	import Videos from '$lib/courses/Videos.svelte';
	import VideoDetails from '$lib/videoViewing/VideoDetails.svelte';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	import VideoDetailsSkeleton from '$lib/videoViewing/VideoDetailsSkeleton.svelte';
	import VideoPodSkeleton from '$lib/VideoPodSkeleton.svelte';
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import { format } from 'svelte-i18n';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import QuizModal from '$lib/videoViewing/QuizModal.svelte';
	import Modal from '../Components/Modal.svelte';
	import { user } from '/src/stores';
	import { setAuthStatus } from '$lib/utils/helper';
	import { CLIENT_KEY, QMS_FE_URL, HOST_URL } from '/src/config/constants';
	import { extractYouTubeVideoId } from '$lib/data.js';

	export let route;
	export let params;
	export let searchParams = '';
	export let languageCode = 'en';
	export let courseDetails = [];
	export let videoUuid = '';
	export let lang = '';
	export let testimonials = [];
	export let serviceToken;

	let chapterUuid = '';
	let videoDetails = {};
	let errorInVideoDetails = null;
	let errorInPlayList = null;
	let videoDetailsLoading = true;
	let playListLoading = true;
	let dummyVideoPodDetails = new Array(4);
	let playListId;
	let error = null;
	let videoEnded = false;

	let player;
	let videoLoaded = false;
	let isQuizAvailable = false;
	let courseUuid = $page.url.searchParams.get('courseUuid');
	let languageCodeFromParams = $page.url.searchParams.get('languageCode');
	let courseDetailsLoading = false;
	let quizIframeUrl = '';
	let showQuiz = false;
	let iframeRef;
	let configData = { clientId: null, clientKey: null };
	const allowedOriginsInReap = ['http://localhost:5174', QMS_FE_URL];

	// const QMS_FE_URL = 'http://localhost:5174';
	$: courseTitle = courseDetails?.translations?.find(
		(translation) => translation.languageCode === lang
	)?.title;
	$: fetchTokenAndVideoDetails(videoUuid);
	$: fetchLinkedQuiz(videoUuid);

	async function fetchTokenAndVideoDetails() {
		if (videoUuid === null) return;
		if (browser) {
			await fetchVideoDetails(videoUuid);
		}
	}

	async function fetchLinkedQuiz() {
		if (videoUuid === null) return;
		if (browser) {
			const qpDetails = await fetchQuizLinkedtoContent(videoUuid);

			if (qpDetails) {
				const { questionPaper, questionPaperUuid } = qpDetails;
				if (questionPaper && questionPaper.examUuids && questionPaper.examUuids?.length > 0) {
					isQuizAvailable = true;
				}
				const examUuid = isQuizAvailable ? questionPaper.examUuids[0] : null;
				const traineeUuid = $user.userUuid;

				quizIframeUrl = `${QMS_FE_URL}/Quizzes/${questionPaperUuid}/attempt?embedded=true&examUuid=${examUuid}&contentUuid=${videoUuid}&traineeUuid=${traineeUuid}&serviceToken=${serviceToken}&clientKey=${CLIENT_KEY}&showHeader=${false}`;
			} else {
				quizIframeUrl = '';
			}
		}
	}

	async function fetchVideoDetails(videoUuid) {
		errorInVideoDetails = null;
		if (videoUuid === null) return;
		try {
			videoDetailsLoading = true;
			const res = await fetch(`/apis/courses/details/${courseUuid}/videos/${videoUuid}`);
			if (!res.ok || res.status !== 200) {
				if (res.status === 401) {
					setAuthStatus(res.status);
				}
				throw new Error('Failed to fetch video details');
			}

			const data = await res.json();
			if (data?.length === 0 || Object.keys(data)?.length === 0) {
				throw new Error('No Data Found');
			}

			videoDetails = data;
			chapterUuid = videoDetails?.chapters?.find((item) => item.courseUuid === courseUuid)?.uuid;
		} catch (err) {
			errorInVideoDetails = err.message;
		} finally {
			videoDetailsLoading = false;
		}
	}

	let checkReadyTimeout;

	async function initHandshake() {
		if (!iframeRef || !isQuizAvailable) return;

		console.log('serviceToken in init', serviceToken);
		let checkReadyCounter = 0;
		// Get the service token
		if (!serviceToken) {
			// const data = await getServiceToken();
			// if (!data || !data.serviceToken) {
			// 	console.error('Failed to get service token');
			// 	return;
			// }
			// serviceToken = data.serviceToken;
		}

		// Start sending CHECK_READY messages until QMS_READY is received
		const sendCheckReady = () => {
			console.log('Sending CHECK_READY...');
			iframeRef?.contentWindow?.postMessage(
				{ type: 'CHECK_READY', payload: { hostUrl: HOST_URL } },
				quizIframeUrl
			);
			// Continue sending every second unless handshake completes
			checkReadyTimeout = setTimeout(sendCheckReady, 1000);
			// ====== to avoid infinite check ready calls when anything fails====
			checkReadyCounter++;
			if (checkReadyCounter > 10) {
				clearTimeout(checkReadyTimeout);
			}
		};

		sendCheckReady();
	}

	onMount(async () => {
		try {
			const response = await fetch('/apis/config');
			if (response.ok) {
				configData = await response.json();
			} else {
				console.error('Failed to fetch configuration:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching configuration:', error);
		}
	});

	function sendToken(serviceToken) {
		iframeRef?.contentWindow?.postMessage(
			{
				type: 'SERVICE_TOKEN',
				payload: {
					serviceToken: serviceToken,
					clientKey: configData.clientKey,
					userUuid: $user.userUuid ? $user.userUuid : null,
					hostUrl: HOST_URL
				}
			},
			quizIframeUrl
		);
	}

	function messageHandler(event) {
		// Validate the origin of the message for security
		if (!allowedOriginsInReap.includes(event.origin)) {
			return;
		}

		const { type, payload } = event.data;

		switch (type) {
			case 'QMS_READY':
				console.log('QMS is ready!');
				clearTimeout(checkReadyTimeout);
				sendToken(serviceToken);
				break;

			case 'HANDSHAKE_COMPLETE':
				console.log('Handshake completed successfully');
				clearTimeout(checkReadyTimeout);
				break;
			case 'HANDSHAKE_ERROR':
				console.log('Handshake FAILED');
				clearTimeout(checkReadyTimeout);
				break;

			default:
				break;
			// console.warn('Unknown message type:', type);
		}
	}

	function handlePlayerLoaded(event) {
		videoLoaded = event.detail;
	}

	async function showQuizModal() {
		showQuiz = true;
		await tick();
	}

	function handleIframeLoad() {
		if (iframeRef) {
			initHandshake();
		}
	}

	function handleVideoStateChange(e) {
		if (Number(e.detail.data) == 0) {
			videoEnded = true;
			if ($user.userUuid && isQuizAvailable) {
				showQuizModal();
			}
		}
	}

	function handleCancelSubmission() {
		videoEnded = false;
		// videoEnded = !videoEnded;
	}

	async function fetchQuizLinkedtoContent(videoUuid) {
		try {
			const response = await fetch(`/apis/quizzes/linkedContent/${videoUuid}`, {
				method: 'GET'
			});

			if (!response.ok) {
				return null;
			}
			if (response.status === 200) {
				const qpDetails = await response.json();

				return qpDetails;
			}
		} catch (err) {
			return null;
		} finally {
		}
	}

	function findResumePlaybackTime(videoDetails){
		if(!videoDetails || videoDetails?.error) return null
		if(videoDetails?.progressStatus ==='IN_PROGRESS'){
			if(videoDetails?.watchedDuration === videoDetails?.duration ) return null
			return videoDetails?.watchedDuration ?? null
		}
		 return null
	}

	onMount(() => {
		if (browser) window.addEventListener('message', messageHandler);
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('message', messageHandler);
		clearTimeout(checkReadyTimeout);
	});
</script>

<div>
	<div class="lg:flex gap-4 mb-4">
		<div class="lg:w-3/4">
			<div class="bg-white rounded-lg h-fit">
				<div class="px-4 py-3">
					<BreadCrumbs {route} {params} {searchParams} />
				</div>
				<div class="aspect-auto p-4 pt-0 relative h-fit">
					<!-- <VideoPlayer
						videoId={videoDetails.extId}
						on:playerLoaded={handlePlayerLoaded}
						on:handleVideoStateChange={handleVideoStateChange}
					/> -->
					<VideoPlayer
						videoMetaData={{ videoUuid: videoDetails.extId, courseUuid, chapterUuid }}
						videoId={extractYouTubeVideoId(videoDetails?.url)}
						startTimeInSeconds = {findResumePlaybackTime(videoDetails)}
						on:ready={handlePlayerLoaded}
						on:statechange={handleVideoStateChange}
					/>
				</div>
			</div>
			<div class="lg:hidden">
				{#if videoDetailsLoading}
					<div class="mb-4 bg-white p-4 rounded-lg">
						<VideoDetailsSkeleton />
					</div>
				{/if}
				{#if errorInVideoDetails === null}
					<div class="mb-4 bg-white p-4 rounded-lg">
						<VideoDetails
							key={params.id}
							{videoDetails}
							{videoInfo}
							{params}
							{courseTitle}
							{testimonials}
						/>
					</div>
				{:else}
					<div class="mb-4 bg-white p-4 rounded-lg">
						<ErrorMessage error={errorInVideoDetails} />
					</div>
				{/if}
			</div>

			<div class="w-full">
				<p class=" text-base mb-4 mt-4 font-semibold leading-6 flex gap-2 text-primary">
					<!-- <Book stroke="#3DC2EE" />
					{$format('CourseContent')} -->
					&nbsp;
				</p>
				<Videos
					showSearchBar={false}
					isLoading={playListLoading}
					selectedLang={languageCodeFromParams}
					chapters={courseDetails?.chapters}
					showAvailableLanguages={false}
					courseUuid={courseDetails?.uuid}
					{courseDetails}
					{videoUuid}
					{courseTitle}
				/>
			</div>
		</div>
		<div class="hidden lg:block lg:w-1/4">
			{#if videoDetailsLoading}
				<div class="mb-4 bg-white p-4 rounded-lg">
					<VideoDetailsSkeleton />
				</div>
			{/if}

			{#if !videoDetailsLoading}
				{#if errorInVideoDetails === null}
					<div class="mb-4 bg-white p-4 rounded-lg">
						<VideoDetails
							key={params.id}
							{videoDetails}
							{videoInfo}
							{params}
							{courseTitle}
							{testimonials}
						/>
					</div>
				{:else}
					<div class="mb-4 bg-white p-4 rounded-lg">
						<ErrorMessage error={errorInVideoDetails} />
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<!-- <div id="quiz-modal h-[90vh] mt-8 ">
			<QuizModal on:handleCancelSubmission={handleCancelSubmission} iframeUrl={quizIframeUrl} />
		</div> -->
	<!-- <div id="quiz-modal h-[90vh] mt-8 ">
		</div> -->
	<Modal isOpen={showQuiz} title={'Attempt Quiz'} closeModal={() => (showQuiz = false)}>
		<!-- <QuizUi {questions} {quizSettings} on:close={closePreviewModal} /> -->
		<!-- <QuizModal on:handleCancelSubmission={handleCancelSubmission} iframeUrl={quizIframeUrl} /> -->
		<iframe
			on:load={handleIframeLoad}
			src={quizIframeUrl}
			bind:this={iframeRef}
			title="quiz Preview"
			style="border: none;width:100%; height:400px;"
			id="iframeForQuiz"
		></iframe>
	</Modal>
</div>
