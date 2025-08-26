<script>
	import { _ } from 'svelte-i18n';
	import InfoTable from '$lib/Components/InfoTable.svelte';

	export let traineeDetailsData = {};

	const sections = [
		{
			title: $_('Personal Information'),
			icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
			fields: [
				{ label: $_('Full Name'), key: 'candidateName', value: traineeDetailsData?.candidateName },
				{ label: $_('Age'), key: 'age', value: traineeDetailsData?.age },
				{ label: $_('Gender'), key: 'sex', value: traineeDetailsData?.sex },
				{
					label: $_('Father/Husband Name'),
					key: 'fatherNameOrHusbandName',
					value: traineeDetailsData?.fatherNameOrHusbandName
				},
				{
					label: $_('Marital Status'),
					key: 'maritalStatus',
					value: traineeDetailsData?.maritalStatus
				},
				{ label: $_('Religion'), key: 'religion', value: traineeDetailsData?.religion },
				{ label: $_('Caste'), key: 'caste', value: traineeDetailsData?.caste },
				{ label: $_('Education'), key: 'education', value: traineeDetailsData?.education },
				{
					label: $_('Person With Disability'),
					key: 'personWithDisability',
					value: traineeDetailsData?.personWithDisability ? $_('Yes') : $_('No')
				},
				{ label: $_('Aadhar Card No'), key: 'aadharCardNo', value: traineeDetailsData?.aadharCardNo }
			]
		}
	];

	const rightSections = [
		{
			title: $_('Contact Information'),
			icon: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z',
			fields: [
				{
					label: $_('Mobile Number'),
					key: 'mobileNumber1',
					value: traineeDetailsData?.mobileNumber1
				},
				{
					label: $_('Alternate Mobile'),
					key: 'mobileNumber2',
					value: traineeDetailsData?.mobileNumber2
				},
				{ label: $_('Email'), key: 'email', value: traineeDetailsData?.email },
				{
					label: $_('Landline'),
					key: 'landlineNumber',
					value: traineeDetailsData?.landlineNumber
						? `${traineeDetailsData?.landlineStd || ''} ${traineeDetailsData?.landlineNumber}`
						: '-'
				}
			]
		},
		{
			title: $_('Residential Information'),
			icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z',
			fields: [
				{
					label: $_('Address'),
					key: 'candidateAddress',
					value: traineeDetailsData?.candidateAddress
				},
				{ label: $_('Village'), key: 'village', value: traineeDetailsData?.village },
				{ label: $_('District'), key: 'district', value: traineeDetailsData?.district },
				{ label: $_('Taluk'), key: 'taluk', value: traineeDetailsData?.taluk },
				{ label: $_('Pincode'), key: 'pincode', value: traineeDetailsData?.pincode }
			]
		}
	];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	<div>
		{#each sections as section}
			<InfoTable info={section} />
		{/each}
	</div>

	<div class="space-y-8">
		{#each rightSections as section}
			<InfoTable info={section}  />
		{/each}
	</div>
</div>
