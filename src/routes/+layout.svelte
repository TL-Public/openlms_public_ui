<script>
	import WormLoader from '$lib/Components/WormLoader.svelte';
	import '../app.css';
	import Header from '$lib/Components/Header.svelte';
	import CommonLayoutPattern from '$lib/Components/CommonLayoutPattern.svelte';
	import Footer from '$lib/Components/Footer.svelte';
	import LineDrawing from '$lib/landingPage/LineDrawing.svelte';
	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import Login from '$lib/Components/Login.svelte';
	import { user, showLoginModal } from '/src/stores';
	import { locale } from 'svelte-i18n';
	import Analytics from '$lib/analytics/Analytics.svelte';
	import HeaderOLMS from '$lib/Components/edureach/HeaderOLMS.svelte';
	import FooterOLMS from '$lib/Components/edureach/FooterOLMS.svelte';
	import LoginOLMS from '$lib/Components/edureach/LoginOLMS.svelte';
	import EdureachLayoutPattern from '$lib/svgComponents/edureach/EdureachLayoutPattern.svelte';

	export let data;

	// varibale to track loading state
	let loading = true;
	let displayLoginPopUp = false;
	let { openLMS } = data;
	let title;

	$: loading = !!$navigating;
	$: route = $page.url.pathname;

	const staticRouteTitles = {
		'/': 'Home',
		'/courses': 'Courses',
		'/trainingCenters': 'Training Centers',
		'/faq': 'FAQ',
		'/public-dashboard': 'Dashboard'
	};

$: {
		const brand = openLMS ? 'Edureach' : 'REAP';
		const path = $page.url.pathname;

		if (Object.keys(staticRouteTitles).includes(path)) {
			title = `${brand} | ${staticRouteTitles[path]}`;
		} else if ($page.data.pageTitle) {
			title = `${brand} | ${$page.data.pageTitle}`;
		} else {
			title = brand; // fallback
		}
	}

	onMount(() => {
		user.set(data?.user);

		if (!data?.user?.isAuthenticated && route === '/') {
			showLoginModal.set(true);
		}
	});

	function handleSetDisplayLoginPopUpState(event) {
		showLoginModal.update((value) => event.detail);
	}

</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<!-- Componet to render when loading state is true -->
<Analytics />

{#if !openLMS}
	<div class="bg-ivory">
		{#if loading}
			<WormLoader />
		{/if}
		<Header lang={data.lang} on:setDisplayLoginPopUpState={handleSetDisplayLoginPopUpState} />
		{#if $showLoginModal === true}
			<Login
				centersData={data?.centersData ?? []}
				on:setDisplayLoginPopUpState={handleSetDisplayLoginPopUpState}
			/>
		{/if}

		{#if route === '/'}
			<div class=" 2xl:m-auto">
				{#if data?.user?.isAuthenticated}
					<div class="">
						<CommonLayoutPattern />
					</div>
				{/if}
				<slot />
				<LineDrawing />
			</div>
		{:else if route === '/login'}
			<slot />
		{:else}
			<!-- pt to account for the fixed height of header in mobile screen -->
			<div class="">
				<CommonLayoutPattern />
			</div>
			<div class="tranform -translate-y-[65.5px] 2xl:max-w-7xl 2xl:m-auto">
				<slot />
			</div>
			<LineDrawing />
		{/if}
		<Footer />
	</div>
{:else}
	<div class="bg-white50">
		{#if loading}
			<WormLoader />
		{/if}

		<HeaderOLMS lang={data.lang} on:setDisplayLoginPopUpState={handleSetDisplayLoginPopUpState} />

		{#if $showLoginModal === true}
			<LoginOLMS
				centersData={data?.centersData ?? []}
				on:setDisplayLoginPopUpState={handleSetDisplayLoginPopUpState}
			/>
		{/if}

		{#if route === '/'}
			<div class=" 2xl:m-auto">
				{#if data?.user?.isAuthenticated}
					<div class="">
						<EdureachLayoutPattern />
					</div>
				{/if}
				<slot />
			</div>
		{:else if route === '/login'}
			<slot />
		{:else}
			<!-- pt to account for the fixed height of header in mobile screen -->
			 <div class="">
				<EdureachLayoutPattern />
			</div>

			<div class="tranform -translate-y-[65.5px] pb-10 sm:pb-16 2xl:max-w-7xl 2xl:m-auto">
				<slot />
			</div>
		{/if}

		<FooterOLMS />
	</div>
{/if}
