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
	import { user } from '/src/stores';
	import { locale } from 'svelte-i18n';

	// varibale to track loading state
	let loading = true;
	let displayLoginPopUp = false;
	$: loading = !!$navigating;

	$: route = $page.url.pathname;
	export let data;

	onMount(() => {
		user.set(data?.user)
		if (route === '/') {
			displayLoginPopUp = !data?.user?.isAuthenticated
		}
	});
</script>

<!-- Componet to render when loading state is true -->

<div class="">
	{#if loading}
		<WormLoader wormColor="#2E5ED4" />
	{/if}
	<Header lang={data.lang} bind:displayLoginPopUp />
	{#if displayLoginPopUp}
		<Login centersData={data?.centersData ?? []} bind:displayLoginPopUp />
	{/if}

	{#if route === '/'}
		<div class=" 2xl:m-auto">
			<slot />
		</div>
	{:else if route === '/login'}
		<slot />
	{:else}
		<div class=" 2xl:max-w-7xl 2xl:m-auto">
			<slot />
		</div>
	{/if}

	<Footer />
</div>
