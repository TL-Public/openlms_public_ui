<script>
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { languageArray } from '/src/config/constants.js';
	import { setAuthStatus } from '$lib/utils/helper';
	import LineLoader from '$lib/Components/LineLoader.svelte';
	import Dropdown from '$lib/Components/Dropdown.svelte';
	import Button from '$lib/Components/Button.svelte';
	import Portal from '$lib/Components/Portal.svelte';

	export let endPoint = null;
	export let currentLanguage = { id: 'en', name: 'English' };
	let selectedLanguage = currentLanguage;
	let isSubmitting = false;
	let errorMessage = '';

	const dispatch = createEventDispatcher();

	// Cancel handler
	function handleCancel() {
		errorMessage = '';
		selectedLanguage = currentLanguage;
		dispatch('closePopup', true);
	}

	// Submit handler
	async function handleSubmit() {
		try {
			errorMessage = '';
			isSubmitting = true;

			if (!selectedLanguage || selectedLanguage === currentLanguage) {
				errorMessage = $_('Please select a different language.');
				return;
			}

			const response = await fetch(endPoint, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ videoPreferredLanguage: selectedLanguage?.id })
			});
			let responseData;
			try {
				responseData = await response?.json();
			} catch {
				responseData = { error: $_('Failed to update language preference.') };
			}

			if (response?.status === 400 || response?.status === 500) {
				errorMessage = responseData?.error || $_('Failed to update preference.');
				return;
			}

			if (response?.status === 401) {
				setAuthStatus(true);
			}

			if (!response?.ok) {
				errorMessage = responseData?.error || $_('Failed to update preference.');
				return;
			}

			dispatch('handleToast', { message: $_('Successfully updated language preference.') });
			dispatch('languageUpdate', responseData?.videoPreferredLanguage);
			handleCancel();
		} catch (error) {
			console.error('Language Update Error:', error);
			errorMessage = $_('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	onDestroy(() => {
		// to restore scroll
		document.body.style.overflow = '';
	});
</script>

<Portal>
		<form
			class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4"
			on:submit|preventDefault={handleSubmit}
		>
			{#if isSubmitting}
				<div class="mb-4">
					<LineLoader />
				</div>
			{/if}

			{#if errorMessage}
				<div class="rounded-md bg-red-50 p-2 mb-2">
					<span class="text-sm font-medium text-red-800">{errorMessage}</span>
				</div>
			{/if}

			<h2 class="text-base font-semibold text-primary mb-4">{$_('Change Language Preference')}</h2>

			<!-- Dropdown -->
			<Dropdown
				id="language-select"
				items={languageArray.map((l) => ({ id: l.code, name: l.name }))}
				placeholder="Select a language"
				bind:selectedItem={selectedLanguage}
			/>

			<div class="flex justify-end gap-2 mt-4">
				<Button type="button" btnType="secondary" on:click={handleCancel} disabled={isSubmitting}>
					{$_('Cancel')}
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{$_('Submit')}
				</Button>
			</div>
		</form>
</Portal>

