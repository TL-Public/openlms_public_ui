<script>
	import { _ } from 'svelte-i18n';
	import PasswordresetPopUp from '$lib/Components/PasswordResetPopUp.svelte';
	import Toast from '$lib/Components/Toast.svelte';
	import SingleStats from '$lib/landingPage/loggedInView/SingleStats.svelte';
	import LanguagePreference from '$lib/landingPage/loggedInView/LanguagePreference.svelte';
	import { languageArray } from '/src/config/constants.js';

	export let traineeDetailsData = {};
	export let traineeStats = {};

	let showPasswordResetPopup = false;
	let showLanguagePreferencePopup = false;
	let showToast = false;
	let currentLanguage = null;
	let toastMessage = null

	$: firstLetter = traineeDetailsData?.candidateName
		? traineeDetailsData.candidateName.charAt(0).toUpperCase()
		: '?';

	const statsList = [
		{
			statValue: traineeStats?.numberOfVideosCompleted || null,
			statName: $_('Videos Watched'),
			iconSvg: '/coursesIcon.svg'
		},
		{
			statValue: traineeStats.totalWatchTime || null,
			statName: $_('Total Watch Time'),
			iconSvg: '/traineesEnrolledIcon.svg'
		},
		{
			statValue: 'N/A',
			statName: $_('Quiz Attended'),
			iconSvg: '/learningCentersIcon.svg'
		},
		{
			statValue: 'N/A',
			statName: $_('Domains'),
			iconSvg: '/domainIcon.svg'
		}
	];

	$: {
		if (!traineeDetailsData?.error)
			currentLanguage = {
				id: traineeDetailsData?.videoPreferredLanguage || null,
				name: findLanguageNameByCode(traineeDetailsData?.videoPreferredLanguage)
			};
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-UK', { year: 'numeric', month: '2-digit', day: '2-digit' });
	}

	function handlePasswordReset() {
		showPasswordResetPopup = true;
	}
	function handleCancel() {
		showPasswordResetPopup = false;
		showLanguagePreferencePopup = false;
	}
	function handleToast(e) {
		showToast = true;
		toastMessage=e.detail.message
	}

	function handleLanguagePreference() {
		showLanguagePreferencePopup = true;
	}

	function findLanguageNameByCode(code) {
		if (!languageArray) return null;

		const match = languageArray.find((l) => l.code === code);
		return match ? match.name : null;
	}
	function handlelanguageUpdation(e) {
		traineeDetailsData.videoPreferredLanguage = e.detail;
	}
</script>

<div class="flex flex-col bp-1050px:flex-row justify-between gap-6">
	<!-- Left: Profile Info -->
	<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
		<div
			class="w-32 h-32 rounded-md overflow-hidden flex items-center justify-center bg-gray-200 text-white text-[64px] font-bold"
		>
			{#if traineeDetailsData?.imageUrl}
				<img
					class="w-full h-full object-cover"
					src={traineeDetailsData.imageUrl}
					alt="Trainee thumbnail"
				/>
			{:else}
				{firstLetter}
			{/if}
		</div>
		<div>
			<h2 class="text-base text-primary font-bold leading-normal sm:leading-2 mb-3 capitalize">
				{traineeDetailsData?.candidateName || '-'}
			</h2>
			<div class="text-sm text-darkGray space-y-1">
				<div>
					<span class="font-medium">{$_('Enrollment ID')}:</span>
					<span>{traineeDetailsData?.enrollId || '-'}</span>
				</div>
				<div>
					<span class="font-medium">{$_('Date of Birth')}:</span>
					<span>{formatDate(traineeDetailsData?.dateOfBirth) || '-'}</span>
				</div>
				<div class="flex gap-2 items-center flex-wrap">
					<span class="font-medium">{$_('Preferred language of videos')}:</span>
					<div class="flex gap-2 flex-nowrap">
						<span>{findLanguageNameByCode(traineeDetailsData?.videoPreferredLanguage) || 'English'}</span
						>
						<span
							class="text-blue-500 underline hover:cursor-pointer"
							on:click={handleLanguagePreference}>{$_('Change')}</span
						>
					</div>
				</div>
				<div class="text-blue-500 underline hover:cursor-pointer" on:click={handlePasswordReset}>
					{$_('Change password')}
				</div>
			</div>
		</div>
	</div>

	<!-- Right: Stats -->
	<div
		class="grid grid-cols-1 sm:grid-cols-2 bp-900px:grid-cols-4 bp-1050px:grid-cols-2 gap-3 w-full lg:w-auto"
	>
		{#each statsList as stat}
			<SingleStats stats={stat} />
		{/each}
	</div>
</div>
{#if showPasswordResetPopup}
	<PasswordresetPopUp
		endPoint="apis/traineePasswordReset"
		on:closePopup={handleCancel}
		on:handleToast={handleToast}
	/>
{/if}

{#if showLanguagePreferencePopup}
	<LanguagePreference
		endPoint={`apis/userProfile/${traineeDetailsData?.uuid}`}
		{currentLanguage}
		on:closePopup={handleCancel}
		on:handleToast={handleToast}
		on:languageUpdate={handlelanguageUpdation}
	/>
{/if}

{#if showToast}
	<Toast
		message={toastMessage}
		viewModal={true}
		successMessage={true}
		on:handleToastClose={() => (showToast = false)}
	/>
{/if}
