<script>
	import LineDrawing from '$lib/landingPage/LineDrawing.svelte';
	import InputField from '$lib/Components/InputField.svelte';
	import ReapLogo from '$lib/svgComponents/ReapLogo.svelte';
	import ReapLogoMobile from '$lib/svgComponents/ReapLogoMobile.svelte';
	import CheckBox from '$lib/Components/CheckBox.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Filter from '$lib/Components/Filter.svelte';
	import { format } from 'svelte-i18n';
	export let data;

	const { centersData } = data;
	export let form;
	let showPassword = false;
	// extract the form details
	let error = form?.error;
	let formLoginDetails = form?.loginDetails;
	// let rsetiFilterOptionList = [{name: '--- Select RSETI ---', uuid: 0},...centersData]
	let rsetiFilterOptionList = [{ name: '--- Select RSETI ---', uuid: 0 }];
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

	function handleFormEnhance({ formData, action, cancel }) {
		formData.set('rseti', rsetiFilterValue);
		return async ({ result, update }) => {
			await result;
			console.log('result:', result);
			goto(`/`);
			// TODO handle form result validation and then navigate
		};
	}
	function toggleVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0 bg-white" aria-hidden="true">
		<div class="w-full flex h-full">
			<!-- Left side text and decoration -->
			<div class="sm:w-1/2 lg:flex flex-col bg-white80 relative hidden">
				<div class="sm:px-36 flex flex-col flex-1 justify-center">
					<h2 class="text-4xl font-extrabold text-primary mb-4 relative">
						<img
							src="/RSETI-text-decoration.svg"
							alt=""
							class="rotate-[270deg] absolute -top-7 -left-7"
						/> Infinite learning enhanced by diverse digital solutions
					</h2>
					<p class="text-primary">
						Our platform seamlessly blends traditional knowledge with innovative technology,
						creating a unique and effective educational experience for all.
					</p>
				</div>
				<LineDrawing />
			</div>
			<!-- Login Forms -->
			<div class="flex flex-col py-24 items-center flex-1 px-36">
				<div class="mb-4">
					<span class="sr-only">Reap Logo</span>
					<h2 class="hidden sm:block">
						<ReapLogo addClass="w-56 h-40" />
					</h2>
					<h2 class="sm:hidden">
						<ReapLogoMobile />
					</h2>
					<h2 class="text-2xl text-center text-primary font-bold leading-[3rem]">Login</h2>
				</div>

				<form method="post" action="/login" class="w-full" use:enhance={handleFormEnhance}>
					<div class="mb-4">
						<InputField
							label={'Enrollment ID'}
							placeholder={'Enter your Enrollment ID'}
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
					>
						<!-- Icon Slot -->
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
					</div>
					<div class="flex justify-between mb-4 text-sm">
						<CheckBox
							bind:checked={formObject.rememberMe}
							checkBoxDiscription="Remember me"
							name="rememberMe"
						/>

						<button type="button" class="text-gray-90 ml-auto">Forgot password?</button>
					</div>
					{#if error}
						<p class="text-red-500 text-sm mb-2">* {error}</p>
					{/if}
					<button
						class="w-full text-center py-2 text-white bg-primary rounded-md font-semibold"
						type="submit">Log in</button
					>
				</form>
				<a class="p-2 text-sm text-gray-90 mb-12" href="/">
					<h3>Continue as guest</h3>
				</a>

				<p class="text-center text-sm text-gray-90">
					Not registered yet? Please register with a training center to get your credentials. <a
						class="text-primary underline"
						href="/trainingCenters">View training centers</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
