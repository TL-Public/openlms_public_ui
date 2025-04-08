<script>
	import LineDrawing from '$lib/landingPage/LineDrawing.svelte';
	import InputField from '$lib/Components/InputField.svelte';
	import GoogleMatrialIcon from '$lib/Components/GoogleMatrialIcon.svelte';
	import LogoFull from '$lib/svgComponents/LogoFull.svelte';
	import LogoHalf from '$lib/svgComponents/LogoHalf.svelte';
	import CheckBox from '$lib/Components/CheckBox.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Filter from '$lib/Components/Filter.svelte';
	import { format } from 'svelte-i18n';
	import EduReachHalfLogo from '$lib/svgComponents/EduReach-half-Logo.svelte';
	import { user } from '/src/stores';
	import Spinner from '$lib/Components/Spinner.svelte';

	export let centersData;
	export let form;
	export let displayLoginPopUp = false;

	let dropdownError = '';
	let error = null;
	let showPassword = false;
	let formLoginDetails = form?.loginDetails;
	let loggingIn = false;

	let rsetiFilterOptionList = [{ name: $format('SelectRSETI'), uuid: 0 }, ...centersData];


	let rsetiFilterValue = rsetiFilterOptionList[0]?.name;

	const optionListConfigObject = {
		optionNameKey: 'name',
		optionIdKey: 'uuid'
	};

	let formObject = {
		enrollmentId: formLoginDetails?.enrollmentId ?? '',
		uniqueId: formLoginDetails?.uniqueId ?? ''
		// rememberMe: formLoginDetails?.rememberMe ?? false
	};

	$: if (rsetiFilterValue && rsetiFilterValue !== $format('SelectRSETI')) {
		dropdownError = '';
		error = '';
	}

	function handleFormEnhance({ formData, action, cancel }) {
		error = null;
		dropdownError = '';
		if (!validateDropdown(rsetiFilterValue)) {
			dropdownError = $format('PleaseSelectValidRSETI');
			cancel(); // Prevent form submission
			return;
		}
		loggingIn = true;
		formData.set('rseti', rsetiFilterValue);
		return async ({ result, update }) => {
			await result;

			if (result?.type === 'failure') {
				if (result?.status === 500) {
					error = $format('UnexpectedErrorMessage');
				} else if (result?.status === 401) {
					error = $format('InvalidCredentials');
				} else {
					error = $format('UnexpectedErrorMessage'); // Handles unknown errors
				}
			}

			if (result.type === 'success') {
				const { data } = result;
				const userName = data.user?.candidateName;
				user.set({ isAuthenticated: true, name: userName, userUuid: data?.user?.uuid });
				displayLoginPopUp = false;
			}
			// handleDisplayLoginPopUp();
			// goto(`/`);
			// TODO handle form result validation and then navigate
			loggingIn = false;
		};
	}

	function validateDropdown(value) {
		return value && value !== $format('SelectRSETI');
	}
	function handleDisplayLoginPopUp() {
		displayLoginPopUp = !displayLoginPopUp;
	}
	function handleViewTrainingCenterPage() {
		handleDisplayLoginPopUp();
	}

	function handleForgotPassword() {
		error = $format('ForgotPinMessage');
	}

	function toggleVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true">
		<div class="lg:w-[800px] flex sm:mx-10 mx-4 lg:mx-auto mt-16 rounded-lg">
			<!-- Left side text and decoration -->
			<div class="sm:w-1/2 bp-900px:flex flex-col bg-white80 relative hidden pb-4 rounded-l-lg">
				<div class="sm:px-12 flex flex-col flex-1 justify-center">
					<h2 class="text-lg font-bold text-primary mb-4 relative">
						<span class="h-8 inline-block w-fit">
							<EduReachHalfLogo />
						</span>
						<!-- <img
							src="/RSETI-text-decoration.svg"
							alt=""
							class="rotate-[270deg] absolute -top-7 -left-7"
						/> -->

						{$format('LoginHeading')}
					</h2>

					<p class="text-primary text-sm">
						{$format('LoginPara')}
					</p>
					<button
						class=" mt-4 pt-2 sm:p-2 text-sm text-primary hover:font-medium underline underline-offset-2"
						on:click={handleDisplayLoginPopUp}
					>
						<h3>
							{$format('ContinueAsGuest')}
						</h3>
					</button>
				</div>

				<LineDrawing />
			</div>
			<!-- Login Forms -->
			<div
				class="flex flex-col py-4 items-center flex-1 sm:px-10 px-4 bg-white80 bp-900px:bg-white relative rounded-r-lg rounded-l-lg bp-900px:rounded-l-none"
			>
				<button class="absolute right-5 top-5" on:click={handleDisplayLoginPopUp}>
					<GoogleMatrialIcon iconName="cancel" addClass="text-primary" />
				</button>
				<div class="mb-4 flex flex-col items-center">
					<!-- <span class="sr-only">Reap Logo</span>
			<h2 class="hidden sm:block">
				<ReapLogoMobile />
			</h2>-->
					<h2 class="bp-900px:hidden">
						<EduReachHalfLogo />
					</h2>
					<h2 class="text-base text-center text-primary font-semibold mt-4">
						{$format('Login')}
					</h2>
				</div>

				<form method="post" action="/" class="w-full" use:enhance={handleFormEnhance}>
					<div class="mb-2">
						<InputField
							label={$format('EnrollmentID')}
							placeholder={$format('EnterEnrollmentID')}
							bind:value={formObject.enrollmentId}
							type="username"
							name="enrollmentId"
							required={true}	
						/>
					</div>

					<div class="mb-6">
						<InputField
						label={$format('UniquePin')}
						placeholder={$format('EnterUniquePin')}
						type={showPassword ? 'text' : 'password'}
						bind:value={formObject.uniqueId}
						name="password"
						required
						autocomplete="password"	
						><!-- Icon Slot -->
						<button
							type="button"
							class="flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
							on:click={toggleVisibility}
						>
							{#if showPassword}
								<span class="material-icons text-lg">visibility</span>
							{:else}
								<span class="material-icons text-lg">visibility_off</span>
							{/if}
						</button>
					</InputField>
					</div>
					<div class="mb-2">
						<Filter
							bind:itemSelected={rsetiFilterValue}
							optionList={rsetiFilterOptionList}
							{optionListConfigObject}
							addClass="w-full"
						/>
						{#if dropdownError}
							<p class="text-red-500 text-xs mt-1">{dropdownError}</p>
						{/if}
					</div>
					<div class="flex justify-between mb-2 text-sm">
						<!-- <CheckBox
					bind:checked={formObject.rememberMe}
					checkBoxDiscription="Remember me"
					name="rememberMe"
				/> -->

						<button
							type="button"
							class="text-gray-90 text-xs ml-auto"
							on:click={handleForgotPassword}>{$format('ForgotPin')}</button
						>
					</div>
					{#if error}
						<p class="text-red-500 text-xs mb-2">* {error}</p>
					{/if}
					<button
						class="w-full flex items-center gap-2 justify-center text-center py-2 text-white text-sm bg-primary rounded-md font-semibold hover:bg-primary-hover"
						type="submit">{$format('Login')}
						{#if loggingIn}
							<Spinner size={'20px'} borderWidth={'3px'} />
						{/if}</button
					>
				</form>
				<div class="flex flex-col sm:flex-row mb-6">
					<button
						class="text-sm sm:hidden pt-2 sm:p-2 sm:text-xs text-gray-90"
						on:click={handleDisplayLoginPopUp}
					>
						<h3 class="underline underline-offset-1 text-primary">{$format('ContinueAsGuest')}</h3>
					</button>
					<!-- <button class="pt-1 sm:p-2 text-xs text-gray-90 ">

					<h3>Administrator login</h3>
				</button> -->
				</div>

				<p class="text-center text-xs text-gray-90">
					{$format('NotRegisteredMessage')}<button
						class="text-primary underline"
						on:click={handleViewTrainingCenterPage}
						><a href="/trainingCenters"> {$format('ViewTrainingCenters')}</a></button
					>
				</p>
			</div>
		</div>
	</div>
</div>
