<script>
	import { _ } from 'svelte-i18n';
	import PasswordresetPopUp from '$lib/components/PasswordResetPopUp.svelte';
	import Toast from '$lib/components/Toast.svelte';
	export let traineeDetailsData = {};
	export let displayImage;
	let showPasswordResetPopup = false;
	let showToast = false;
	$: firstLetter = traineeDetailsData?.candidateName
		? traineeDetailsData.candidateName.charAt(0).toUpperCase()
		: '?';
	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-UK', { year: 'numeric', month: 'long', day: 'numeric' });
	}
	function handleToast() {
		showToast = true;
	}
	function formatFieldName(field) {
		// Special case for 'username'
		if (field === 'username') {
			return $_('EnrollmentID');
		}
		// Acronyms mapping
		const acronyms = {
			secc: 'SECC',
			sgsy: 'SGSY',
			shg: 'SHG',
			mnerga: 'MNERGA'
		};
		// Replace acronyms with their uppercase equivalents
		let formatted = field.replace(
			new RegExp(Object.keys(acronyms).join('|'), 'gi'),
			(match) => acronyms[match.toLowerCase()]
		);
		// Add a space after acronyms if they are followed by a word
		formatted = formatted.replace(/(SECC|SGSY|SHG|MNERGA)([A-Z][a-z]+)/g, '$1 $2');
		// Add a space before the last numeral if the field ends with a number
		formatted = formatted.replace(/(\d+)$/, ' $1');
		// Capitalize the first letter of the string and add spaces before uppercase letters
		formatted = formatted
			.replace(/([a-z])([A-Z])/g, '$1 $2') // Insert spaces between lowercase and uppercase letters
			.replace(/^[a-z]/, (match) => match.toUpperCase()); // Capitalize the first letter
		return $_(formatted) || formatted;
	}
	function handlePasswordReset() {
		showPasswordResetPopup = true;
	}
	function handleCancel() {
		showPasswordResetPopup = false;
	}
</script>
<div
	class="flex flex-col text-sm rounded-lg gap-4 shadow bg-blue-10 px-4 pt-4 pb-4 sm:px-9 sm:py-6 sm:pt-6 mb-6"
>
	<div class="flex flex-col bp-420px:flex-row gap-6 mb-4">
		<div
			class="w-32 h-32 rounded-lg border overflow-hidden flex items-center justify-center bg-blue-100 self-center"
		>
			{#if traineeDetailsData?.displayImage}
				<img
					class="w-full h-full object-cover"
					src={traineeDetailsData.displayImage}
					alt="Trainee thumbnail"
				/>
			{:else}
				<span class="text-[80px] font-bold text-white">{firstLetter}</span>
			{/if}
		</div>
		<div>
			<div class="flex gap-2 items-center mb-2">
				<div class="heading-L">
					{traineeDetailsData?.candidateName || '-'}
				</div>
				<!-- <a href={`/trainees/${traineeDetailsData?.uuid}/details/edit`}>
            <Edit stroke="#FF6A1F" />
          </a> -->
			</div>
			<div class="space-y-1 text-xs sm:text-sm text-darkGray">
				{#each ['username', 'dateOfBirth'] as field}
					<div class="flex gap-2">
						<span class="text-xs sm:text-sm text-darkGray font-medium"
							>{formatFieldName(field)}:</span
						>
						<span class="font-normal">
							{#if field === 'enrolledOn'}
								{formatDate(traineeDetailsData[field])}
							{:else}
								{traineeDetailsData[field] || '-'}
							{/if}
						</span>
					</div>
				{/each}
				<div
					class="text-sm mb-4 text-blue-500 underline hover:cursor-pointer hover:text-blue-600"
					on:click={handlePasswordReset}
				>
					{$_('PasswordReset')}
				</div>
			</div>
		</div>
	</div>
</div>
{#if showPasswordResetPopup}
	<PasswordresetPopUp
		endPoint={'apis/traineePasswordReset'}
		on:closePopup={handleCancel}
		on:handleToast={handleToast}
	/>
{/if}
{#if showToast}
	<Toast
		message={$_('Password reset successful.')}
		viewModal={true}
		successMessage={true}
		on:handleToastClose={() => (showToast = false)}
	/>
{/if}