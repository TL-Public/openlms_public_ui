<script>
	import { _ } from 'svelte-i18n';
	export let traineeDetailsData= {}
	const sections = [
		{
			title: $_('Personal Information'),
			icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
			fields: [
				{ label: $_('Full Name'), key: 'candidateName' },
				{ label: $_('Age'), key: 'age' },
				{ label: $_('Gender'), key: 'sex' },
				{ label: $_('Father/Husband Name'), key: 'fatherNameOrHusbandName' },
				{ label: $_('Marital Status'), key: 'maritalStatus' },
				{ label: $_('Religion'), key: 'religion' },
				{ label: $_('Caste'), key: 'caste' },
				{ label: $_('Education'), key: 'education' },
				{
					label: $_('Person With Disability'),
					key: 'personWithDisability',
					format: (v) => (v ? $_('Yes') : $_('No'))
				},
				{ label: $_('Aadhar Card No'), key: 'aadharCardNo' }
			]
		}
	];
	const rightSections = [
		{
			title: $_('Contact Information'),
			icon: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z',
			fields: [
				{ label: $_('Mobile Number'), key: 'mobileNumber1' },
				{ label: $_('Alternate Mobile'), key: 'mobileNumber2' },
				{ label: $_('Email'), key: 'email' },
				{
					label: $_('Landline'),
					key: 'landlineNumber',
					format: (v, data) => (v ? `${data?.landlineStd || ''} ${v}` : '-')
				}
			]
		},
		{
			title: $_('Residential Information'),
			icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
			fields: [
				{ label: $_('Address'), key: 'candidateAddress' },
				{ label: $_('Village'), key: 'village' },
				{ label: $_('District'), key: 'district' },
				{ label: $_('Taluk'), key: 'taluk' },
				{ label: $_('Pincode'), key: 'pincode' }
			]
		}
	];
</script>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	<!-- Left Column: Personal Information -->
	<div>
		{#each sections as section}
			<h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-2 text-[#3DC2EE]"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d={section?.icon} />
				</svg>
				<span class="heading-L">{section?.title}</span>
			</h2>
			<div class="rounded-lg p-5 space-y-4 border border-gray-200">
				{#each section?.fields as field, index}
					<div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
						<div class="text-xs sm:text-sm font-medium text-gray-500 break-words">
							{field?.label}
						</div>
						<div class="text-xs sm:text-sm font-medium text-gray-500 text-center">:</div>
						<div class="text-xs sm:text-sm text-darkGray break-words break-all">
							{#if field?.format}
								{field?.format(traineeDetailsData[field?.key], traineeDetailsData)}
							{:else}
								{traineeDetailsData[field?.key] || '-'}
							{/if}
						</div>
					</div>
					{#if index !== section?.fields?.length - 1}
						<div class="border-b border-gray-200"></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
	<!-- Right Column: Contact + Residential (Stacked) -->
	<div class="space-y-8">
		{#each rightSections as section}
			<div>
				<h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 mr-2 text-[#3DC2EE]"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d={section?.icon} />
					</svg>
					<span class="heading-L">{section?.title}</span>
				</h2>
				<div class="rounded-lg p-5 space-y-4 border border-gray-200 break-words">
					{#each section?.fields as field, index}
						<div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
							<div class="text-xs sm:text-sm font-medium text-gray-500 break-words">
								{field?.label}
							</div>
							<div class="text-xs sm:text-sm font-medium text-gray-500 text-center">:</div>
							<div class="text-xs sm:text-sm text-darkGray break-words break-all">
								{#if field?.format}
									{field?.format(traineeDetailsData[field?.key], traineeDetailsData)}
								{:else}
									{traineeDetailsData[field?.key] || '-'}
								{/if}
							</div>
						</div>
						{#if index !== section?.fields?.length - 1}
							<div class="border-b border-gray-200"></div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>