import { error } from '@sveltejs/kit';
import { String_Constants } from '../../../../config/constants';
import { formatDateMMMYYYY } from '$lib/utils/helper.js';
import { format } from 'svelte-i18n';

export async function load({ params, fetch, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang ? parentData.lang : 'en';
	const statesMap = parentData.statesMap ? parentData.statesMap : {};

	let unauthorized = false;
	let centersData = [];
	let statesData = [];

	let courseTitle = '';
	async function fetchRsetisOfCourse() {
		let allStatesDisplayText = '';
		if (lang === 'en') {
			allStatesDisplayText = String_Constants.ALL_STATES;
		}
		if (lang === 'hi') {
			allStatesDisplayText = String_Constants.ALL_STATES_HI;
		}
		try {
			const rsetisOfCourseResp = await fetch(`/apis/courses/details/${params.id}/rsetis`);

			if (!rsetisOfCourseResp.ok) {
				if (rsetisOfCourseResp.status === 401) {
					unauthorized = true;
				}
				return { centersData: [], statesData: [{ extId: -1, name: allStatesDisplayText }] };
			}

			if (rsetisOfCourseResp.status == 200) {
				let restiUUIDs = await rsetisOfCourseResp.json();
				const allCentersMap = parentData.allCentersMap;

				//checking for a known field
				if (!restiUUIDs?.rsetiCourses?.length) {
					return { centersData, statesData: [{ extId: -1, name: allStatesDisplayText }] };
				}

				centersData =
					restiUUIDs?.rsetiCourses
						?.filter((elem) => elem && elem.rsetiUuid && elem.startDate) // Ensure elem and required properties exist
						?.map((elem) => {
							const center = allCentersMap?.[elem.rsetiUuid] || {}; // Fallback to an empty object if the center is not found
							return {
								...center,
								startDateObj: new Date(elem.startDate),
								plannedDate: formatDateMMMYYYY(elem.startDate) || null
							};
						})
						?.map((rseti) => {
							if (!rseti || !rseti.stateId) return { ...rseti, stateName: '' };
							return {
								...rseti,
								stateName: statesMap?.[rseti.stateId] || ''
							};
						})
						?.sort((a, b) => {
							// Ensure valid dates for comparison
							const dateA = a.startDateObj.getTime() || 0;
							const dateB = b.startDateObj.getTime() || 0;
							return dateB - dateA; // Sort descending (latest first)
						}) || [];

				// extract all unique state names from the data
				let uniqueStateIds = [
					...new Set(
						centersData.map((element) => {
							return element.stateId;
						})
					)
				];
				// Add all states option to the list
				// uniqueStateIds = [String_Constants.ALL_STATES, ...uniqueStateIds];
				statesData = uniqueStateIds.map((element) => {
					return {
						name: statesMap[element],
						extId: element
					};
				});
				statesData = [{ extId: -1, name: allStatesDisplayText }, ...statesData];
				return { centersData, statesData };
			}
			return { centersData, statesData };
		} catch (err) {
			return { centersData, statesData: [{ extId: -1, name: allStatesDisplayText }] };
		}
	}

	async function fetchCourseDetails() {
		let courseDetailsResp;
		let languageFilteredcourseDetails = {};
		try {
			courseDetailsResp = await fetch(`/apis/courses/details/${params.id}`);
			if (courseDetailsResp?.status !== 200 && !courseDetailsResp.ok) {
				if (courseDetailsResp.status === 401) {
					unauthorized = true;
				}
				return languageFilteredcourseDetails;
			}
			//when promise is fulfilled, then only value property will be returned in response
			const courseDetails = await courseDetailsResp.json();

			// extract the language data and make it top level in data

			const translationData = courseDetails?.translations?.find(
				(translation) => translation.languageCode === lang
			);
			courseTitle = translationData?.title ? `${translationData?.title}` : 'Course Details';

			languageFilteredcourseDetails = { ...courseDetails, ...translationData };

			return languageFilteredcourseDetails;
		} catch (err) {
			// throw error(courseDetailsResp.status, {
			// 	message: 'Failed to fetch course details',
			// 	status: courseDetailsResp.status
			// });
			return languageFilteredcourseDetails;
		}
	}

	async function fetchCourseStats() {
		let res;
		try {
			res = await fetch(`/apis/courses/details/${params.id}/stats`);
			if (res?.status !== 200 && !res.ok) {
				throw new Error('Failed to fetch course stats');
			}
			const courseStats = await res.json();

			return courseStats;
		} catch (err) {
			return {};
		}
	}

	return {
		courseDetails: await fetchCourseDetails(),
		rsetiOfCourse: await fetchRsetisOfCourse(),
		courseStats: await fetchCourseStats(),
		lang,
		unauthorized,
		courseTitle
	};
}
