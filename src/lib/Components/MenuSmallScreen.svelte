<script>
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import { setCookie } from '$lib/utils/helper.js';
	import { createEventDispatcher } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { user } from '/src/stores';
	import SideMenuItem from '$lib/Components/SideMenuItem.svelte';
	import CoursesIcon from '$lib/svgComponents/CoursesIcon.svelte';
	import TrainingCentersIcon from '$lib/svgComponents/TrainingCentersIcon.svelte';
	import FaqIcon from '$lib/svgComponents/FAQIcon.svelte';
	import LoginIcon from '$lib/svgComponents/LoginIcon.svelte';
	import DashboardIcon from '$lib/svgComponents/DashboardIcon.svelte';


	export let burgerMenuOpen;
	export let menuItemClicked;
	export let loggedIn;
	export let languageSelected = 'English';
	export let languageOptionList;
	export let displayLoginPopUp = false

	const dispatch = createEventDispatcher();

	function handleMenuItemClick(e) {
		menuItemClicked = true;
		if (e.target.closest('li')?.classList?.contains('languagePicker')) {
			burgerMenuOpen = true;
		} else {
			burgerMenuOpen = false;
		}
	}

	function handleLocaleChange(event) {
		dispatch('selectLang', event.detail);
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

<!-- Menu items on smaller screen -->

<!-- top-20 comes from the height of header + its padding -->
<div
	class=" md:hidden fixed w-full top-20 z-20 mx-0 flow-root h-full bg-white transition-all ease-in-out duration-500"
	class:translate-x-0={burgerMenuOpen}
	class:translate-x-full={!burgerMenuOpen}
>
	<nav class="-my-6 divide-y divide-gray-500/10 bg-white">
		<div class="space-y-2 py-2">
			<ul
				class="flex flex-col gap-2 mt-6 lg:gap-4 text-sm"
				on:click={handleMenuItemClick}
				on:keypress={handleMenuItemClick}
			>
				{#if $user?.name}
					<li class=" w-full flex gap-4 items-center mt-auto h-16 border-b pl-4">
						<div
							class="flex items-center justify-center w-8 h-8 bg-orange-100 font-medium text-white capitalize text-xl rounded-full leading-none m-0 p-0"
						>
							{$user?.name ? $user.name[0] : ''}
						</div>
						<span>
							Hi, <span class="font-medium">
								{$user?.name}
							</span>
						</span>
					</li>
				{/if}
				<SideMenuItem id="courses">
					<CoursesIcon slot="icon" addClass="h-8 w-8 " />
					<a href="/courses" id="courses" class="block w-full h-full" slot="link">{$_('Courses')}</a
					>
				</SideMenuItem>
				<SideMenuItem id="trainingCenters">
					<TrainingCentersIcon addClass="h-8 w-8 " slot="icon" />
					<a href="/trainingCenters" class="block w-full h-full" slot="link"
						>{$_('TrainingCntrs')}</a
					>
				</SideMenuItem>
				<SideMenuItem id="faq">
					<FaqIcon addClass="h-8 w-8 " slot="icon" />
					<a href="/faq" class="block w-full h-full" slot="link">{$_('FAQ')}</a>
				</SideMenuItem>
				<SideMenuItem id="public-dashboard">
					<DashboardIcon addClass="h-8 w-8 " slot="icon" />
					<a href="/public-dashboard" class="block w-full h-full" slot="link">{$_('Dashboard')}</a>
				</SideMenuItem>
				<SideMenuItem addClass="w-full p-2" id="login">
					<LoginIcon addClass="h-8 w-8 " slot="icon" />
					<button href="#" class="block" on:click={handleDisplayLoginPopUp} slot="link"
						>{loggedIn ? $_('Logout') : $_('Login')}
					</button>
				</SideMenuItem>
				<SideMenuItem class="p-2 flex items-center gap-4 languagePicker pl-4">
					<img src="/language.svg" alt="language-select-icon" class="languagePicker" slot="icon" />
					<SelectInput
						showFieldName={false}
						bind:itemSelected={languageSelected}
						on:itemSelection={handleLocaleChange}
						optionList={languageOptionList}
						addClass="min-w-24"
						slot="link"
					/>
				</SideMenuItem>
			</ul>
		</div>
	</nav>
</div>
