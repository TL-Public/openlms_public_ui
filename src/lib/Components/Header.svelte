<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { setCookie, getCookie } from '$lib/utils/helper.js';
	import { _, locale } from 'svelte-i18n';

	import LogoFull from '$lib/svgComponents/LogoFull.svelte';
	import EduReachLogo from '$lib/svgComponents/EduReach-Logo.svelte';
	import EduReachHalfLogo from '$lib/svgComponents/EduReach-half-Logo.svelte';
	import LogoHalf from '$lib/svgComponents/LogoHalf.svelte';
	import MenuSmallScreen from '$lib/Components/MenuSmallScreen.svelte';
	import SelectInput from './SelectInput.svelte';
	import LanguageIcon from '$lib/svgComponents/LanguageIcon.svelte';
	import { user } from '/src/stores';

	export let lang = 'en';
	export let displayLoginPopUp = false;
	let dispatch = createEventDispatcher();
	let loggedIn = false;
	let showProfilePopup = false;
	let burgerMenuOpen = false;
	let menuItemClicked = false;
	// need to get this from the local storage and default to english if not there
	let languageSelected = 'English';

	let languageOptionList = [
		{ id: 1, name: 'English', value: 'en' }
		// { id: 2, name: 'हिंदी', value: 'hi' }
	];


	onMount(() => {
		setLangFromProps(lang);
		const unsubscribe = user.subscribe((value) => {
			loggedIn = value?.isAuthenticated ?? false;
		});
		return () => {
			unsubscribe();
		};
	});

	function setLangFromProps() {
		if (browser) {
			const selectedLangDetails = languageOptionList?.find((item) => item?.value === lang);

			if (selectedLangDetails) {
				languageSelected = selectedLangDetails?.name;
			}

			locale.set(selectedLangDetails?.value);
			setCookie('language', selectedLangDetails?.value, 365);
		}
	}

	// Dispatcher is created for conditionally hiding the page content when menu is open.
	function handleClick() {
		menuItemClicked = false;
		burgerMenuOpen = !burgerMenuOpen;
		dispatch('burgerMenuOpen', burgerMenuOpen);
	}

	function handleLogoClick() {
		burgerMenuOpen = false;
	}

	function handleLocaleChange(event) {
		const languageItem = event.detail;
		//abort when the same language is selected
		if ($locale == languageItem?.value) return;
		if (languageItem?.value) {
			locale.set(languageItem?.value);
			setCookie('language', languageItem?.value, 365);
			window.location.reload();
		}
	}

	async function logout() {
		try {
			const resp = await fetch('/apis/auth/logout', { method: 'POST' });
			const logoutResp = await resp.json();
			// loggedIn = false;
			user.set({ isAuthenticated: false });
		} catch (err) {}
	}
	function handleDisplayLoginPopUp() {
		if (!loggedIn) {
			displayLoginPopUp = !displayLoginPopUp;
		} else {
			//logout
			logout();
		}
	}
</script>

<header
	class=" h-16 sticky md:relative md:h-20 py-2 px-4 flex justify-between lg:py-2 lg:px-20 items-center bg-blue-10 text-darkGray shadow-md w-full z-50 top-0"
>
	<div on:click={handleLogoClick} on:keypress={handleLogoClick} role="button" tabindex="0">
		<a href="/">
			<span class="sr-only">Edureach Logo</span>
			<h1 class="hidden md:block h-12">
				<EduReachLogo />
			</h1>
		</a>
	</div>
	<!-- Desktop Header Menu Items -->
	<div class="hidden md:flex justify-between md:gap-4">
		<ul class="flex gap-1 lg:gap-4 text-sm items-center">
			<li class="p-2"><a href="/courses">{$_('Courses')}</a></li>
			<li class="p-2"><a href="/trainingCenters">{$_('TrainingCntrs')}</a></li>
			<li class="p-2"><a href="/faq">{$_('FAQ')}</a></li>
			<li class="p-2"><a href="/public-dashboard">{$_('Dashboard')}</a></li>
			<li class="p-1 flex items-center gap-1">
				<!-- <img src="/language.svg" alt="language-select-icon" /> -->
				<LanguageIcon fillColor={'#2E5ED4'} />
				<SelectInput
					showFieldName={false}
					bind:itemSelected={languageSelected}
					on:itemSelection={handleLocaleChange}
					optionList={languageOptionList}
					addClass="min-w-24"
				/>
			</li>
			<li class="p-2 relative">
				{#if loggedIn}
					<button
						class="flex items-center gap-2 justify-center cursor-pointer"
						on:click={() => (showProfilePopup = !showProfilePopup)}
					>
						<div
							class="flex items-center justify-center w-8 h-8 bg-orange-100 font-medium text-white capitalize text-xl rounded-full leading-none m-0 p-0"
						>
							{$user?.name ? $user?.name[0] : ''}
						</div>
					</button>
					{#if showProfilePopup}
						<div
							class="absolute right-0 top-16 z-10 min-w-48 p-4 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="menu-button"
							tabindex="-1"
						>
							<div class="flex flex-col text-left items-start">
								<span class="text-sm font-medium flex gap-2 mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class=" w-1/5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
									</svg>
									<span class="w-4/5">
										{$user.name ? $user.name : ''}
									</span>
								</span>
							</div>
							<button class="w-full primary-btn" on:click={logout}>{$_('Logout')}</button>
						</div>
					{/if}
				{:else}
					<button on:click={handleDisplayLoginPopUp}>{$_('Login')}</button>
					<!-- <button on:click={handleDisplayLoginPopUp}>{loggedIn ? $_('Logout') : $_('Login')}</button> -->
				{/if}
			</li>
		</ul>
		
	</div>

	<!-- Mobile Header Button -->

	<div class="md:hidden">
		{#if burgerMenuOpen}
			<!-- Button on Menu open state -->

			<button
				type="button"
				class=" rounded-md text-gray-700 absolute right-4 top-5"
				on:click={handleClick}
			>
				<span class="sr-only">Close menu</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{:else}
			<!-- Button on menu closed state -->
			<button
				type="button"
				class=" rounded-md text-gray-700 absolute right-4 top-5"
				on:click={handleClick}
			>
				<span class="sr-only">Open menu</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		{/if}
	</div>
</header>

<!-- Mobile Menu Items -->

<MenuSmallScreen
	bind:burgerMenuOpen
	bind:menuItemClicked
	bind:loggedIn
	bind:languageSelected
	bind:displayLoginPopUp
	{languageOptionList}
	on:selectLang={handleLocaleChange}
/>
