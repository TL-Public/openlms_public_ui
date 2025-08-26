import { error } from '@sveltejs/kit';

export async function load({ params, fetch, parent }) {
	const parentData = await parent();

	let pageTitle=''

	const fetchCenterDetails = async () => {
		let res;
		try {
			res = await fetch(`/apis/rseti/${params.id}`);
			if (!res.ok || res.status !== 200) {
				throw new Error('Failed to fetch RSETI details');
			}
			const centerDataJson = await res.json();

			//checking for a known field
			if (!centerDataJson?.uuid) {
				// no catch block as this should go to error page
				throw error(404, { message: 'Center Not found', status: 404 });
			}
			pageTitle = 'Training Center Details - ' + centerDataJson.name  ;
			return centerDataJson;
		} catch (err) {
			throw error(500, { message: err.message, status: 500 });
		}
	};

	const fetchRsetiStats = async () => {
		let res;
		try {
			res = await fetch(`/apis/rseti/${params.id}/stats`);

			if (!res.ok || res.status !== 200) {
				throw new Error('Failed to fetch RSETI details');
			}
			const stats = await res.json();

			return stats;
		} catch (err) {
			return {};
		}
	};

	const fetchCoursesForCenter = async () => {
		try {
			const res = await fetch(`/apis/rseti/${params.id}/courses`);

			if (!res.ok || res.status !== 200) {
				throw new Error('Failed to fetch RSETI courses');
			}
			const centerCourseUuidDataJson = await res.json();

			//checking for a known field
			if (!centerCourseUuidDataJson?.length) {
				// returning an empty array till error handling is finalized
				return [];
			}

			// console.log("this is course data at page: ", centerCourseUuidDataJson)
			let centerCoursesData = centerCourseUuidDataJson
				.map((element) => {
					const courseData = parentData?.allCoursesMap?.[element.courseUuid] ?? null;
					if (!courseData) {
						return;
					}
					// courseData.startDate = element.startMonth + '/' + element.startYear;
					courseData.startDate = new Date(element.startYear, element.startMonth - 1);
					return { ...courseData, startMonth: element.startMonth, startYear: element.startYear };
				})
				// .sort((courseA, courseB) => {
				// 	//rseti courses are sorted in descending order before displaying

				// 	// Ensure dates are valid before comparison
				// 	const dateA = new Date(courseA.startDate);
				// 	const dateB = new Date(courseB.startDate);

				// 	if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
				// 		console.warn('Invalid date encountered during sorting. Skipping comparison.');
				// 		return 0; // Maintain original order in case of invalid dates
				// 	}

				// 	// Sort in descending order based on timestamps
				// 	return dateB.getTime() - dateA.getTime();
				// });

			return centerCoursesData;
		} catch (error) {
			return [];
		}
	};
	return {
		centerData: await fetchCenterDetails(),
		centerCoursesData: await fetchCoursesForCenter(),
		rsetiStats: await fetchRsetiStats(),
		pageTitle: pageTitle || 'RSETI Details'
	};
}
