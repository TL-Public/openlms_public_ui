import { _ } from 'svelte-i18n';
const fallbackStats = [
	{
		statName: 'ProgrammeCategories',
		statValue: '-',
		iconSvg: '/domainIcon.svg'
	},
	{
		statName: 'Courses',
		statValue: '-',
		iconSvg: '/coursesIcon.svg'
	},
	{
		statName: 'TrainingCenters',
		statValue: '-',
		iconSvg: '/learningCentersIcon.svg'
	},
	{
		statName: 'traineesEnrolled',
		statValue: '-',
		iconSvg: '/traineesEnrolledIcon.svg'
	}
];

export async function load({ fetch, parent, cookies }) {
	const parentData = await parent();
	const langCode = parentData.lang ? parentData.lang : 'en';
	let unauthorized = parentData.unauthorized ?? false;

	// async function generateToken() {
	// 	try {
	// 		let payload = {};
	// 		const resp = await fetch('/apis/kpoint/token', {
	// 			method: 'POST',
	// 			body: JSON.stringify(payload),
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		});

	// 		if (resp.ok && resp.status === 200) {
	// 			const { result } = await resp.json();

	// 			return result;
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }

	const fetchOfficialTestimonials = async () => {
		try {
			const res = await fetch(`/apis/testimonials/official`);
			if (!res.ok) {
				if (res.status === 401) {
					unauthorized = true;
				}
				throw new Error('Data not found');
			}
			const data = await res.json();
			if (!data || !data?.length) {
				throw new Error('Data not found');
			}

			data?.sort((a, b) => {
				// If orderNo is missing, push it to the end
				if (a?.orderNo == null) return 1;
				if (b?.orderNo == null) return -1;

				// Sort in ascending order
				return a?.orderNo - b?.orderNo;
			});

			return data;
		} catch (err) {
			return { error: err.message };
		}
	};

	const fetchTraineeTestimonials = async () => {
		try {
			const res = await fetch(`/apis/testimonials`);
			if (!res.ok) {
				if(res?.status === 401){
					unauthorized=true
				}
				throw new Error('Data not found');
			}
			const data = await res.json();

			if (!data?.length) {
				throw new Error('Data not found');
			}

			const filteredData = data.filter((item) => item != null);
			return filteredData;
		} catch (err) {
			return { error: err.message };
		}
	};

	const fetchOverAllStats = async () => {
		try {
			let generalStats = [];
			const res = await fetch(`/apis/overallStats`);

			if (!res.ok || res.status !== 200) {
				// throw new Error('Data not found');
				generalStats = fallbackStats;
				return generalStats;
			}

			const data = await res.json();

			if (!Object.keys(data)?.length) {
				generalStats = fallbackStats;
				return generalStats;
			}
			// -------- NOTE ------------
			// The stateName is just a key that is used to get the corresponding state name in the selected language
			// see lib/locals/en.json for actual value
			generalStats = [
				{
					statName: 'ProgrammeCategories',
					statValue: data?.totalCategories,
					iconSvg: '/domainIcon.svg'
				},
				{
					statName: 'Courses',
					statValue: data?.totalCourses,
					iconSvg: '/coursesIcon.svg'
				},
				{
					statName: 'TrainingCenters',
					statValue: data?.totalTrainingCenters,
					iconSvg: '/learningCentersIcon.svg'
				},
				{
					statName: 'traineesEnrolled',
					// statValue: data?.totalTrainees,
					statValue: 'N/A',
					iconSvg: '/traineesEnrolledIcon.svg'
				}
			];
			return generalStats;
		} catch (err) {
			return { error: err.message };
		}
	};

	const fetchProfile = async () => {
		let res;
		try {
			res = await fetch(`/apis/userProfile`);
			if (!res.ok) {
				if (res.status === 401) {
					unauthorized = true;
				}
				throw new Error('Failed to fetch profile data');
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('Profile data not found');
			}
			return data;
		} catch (err) {
			return { error: err.message, status: res?.status };
		}
	};
	const fetchTraineeCourses = async () => {
		let res;
		try {
			res = await fetch(`/apis/userProfile/courses`);
			if (!res.ok) {
				if (res.status === 401) {
					unauthorized = true;
				}
				throw new Error('Failed to fetch trainee courses');
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('courses data not found');
			}
			return data;
		} catch (err) {
			return { error: err.message, status: res?.status };
		}
	};

	return {
		carouselData: await fetchOfficialTestimonials(),
		testimonialData: await fetchTraineeTestimonials(),
		overAllStatsData: await fetchOverAllStats(),
		traineeProfile: await fetchProfile(),
		traineeCourses: await fetchTraineeCourses(),
		unauthorized,
		openLMS: true
	};
}
