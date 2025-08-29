import { String_Constants } from '/src/config/constants';
import { browser } from '$app/environment';
import '$lib/locals/i18n.js';
import { locale, waitLocale } from 'svelte-i18n';
export async function load({ fetch, data }) {
	const { session } = data;

	const language = session?.language;
	let unauthorized = false;

	await waitLocale();

	if (browser) {
		locale.set(language ? language : 'en');
	}
	const fetchCoursesDetails = async () => {
		try {
			const coursesData = await fetch(`/apis/courses`);

			if (!coursesData.ok || coursesData.status !== 200) {
				if (coursesData.status === 401) {
					unauthorized = true;
				}
				return { allCoursesData: [], allCoursesMap: {} };
			}

			const coursesDataJson = await coursesData.json();
			//checking for a known field
			if (coursesDataJson.error) {
				// if something is wrong with api this wont block the whole page
				// Just courses section will not have any courses
				return { allCoursesData: [], allCoursesMap: {} };
			}

			// filter for language
			let languageFilteredData = [];
			coursesDataJson.forEach((elem) => {
				const translationData = elem?.translations?.find(
					(translation) => translation.languageCode === language
				);
				languageFilteredData.push({ ...elem, ...translationData });
			});
			const courseDataMap = {};

			// create a map for efficient uuid serach
			for (let i = 0; i < languageFilteredData.length; i++) {
				courseDataMap[languageFilteredData[i].uuid] = languageFilteredData[i];
			}
			return { allCoursesData: languageFilteredData, allCoursesMap: courseDataMap };
		} catch (err) {
			console.log(err);
			return { allCoursesData: [], allCoursesMap: {}, error: err.message };
		}
	};

	const fetchCenters = async () => {
		try {
			let centersDataJson;
			const resp = await fetch(`/apis/rseti`);

			if (!resp.ok) {
				if (resp.status === 401) {
					unauthorized = true;
				}
				return [];
			}
			if (resp.status == 200) {
				centersDataJson = await resp.json();
			}

			//checking if its empty
			if (!centersDataJson?.length) {
				// returning empty array till error handling is finalized
				return [];
			}
			const centerDataMap = {};

			// create a map for efficient uuid serach
			for (let i = 0; i < centersDataJson.length; i++) {
				if (centersDataJson[i].uuid) {
					// console.log('inidvidual value', centersDataJson[i].uuid, '---', i);
					const uuid = centersDataJson[i]?.uuid;
					if (!centerDataMap[uuid] && uuid) {
						centerDataMap[uuid] = centersDataJson[i];
					}
				}
			}
			return { centersData: centersDataJson, allCentersMap: centerDataMap };
		} catch (err) {
			console.log('err in layout.js', err.message);
			return [];
		}
	};

	const fetchStateList = async () => {
		let allStates;
		
		try {
			let statesMap = {};
			
			if (language === 'en') {
				allStates = String_Constants.ALL_STATES;
			}
			if (language === 'hi') {
				allStates = String_Constants.ALL_STATES_HI;
			}

			const res = await fetch(` /apis/states`);
	
			if (!res.ok || res.status !== 200) {
				if (res.status === 401) {
					unauthorized = true;
				}
				return {
					stateData: [
						{
							name: allStates,
							extId: '-1'
						}
					],
					statesMap: {}
				};
			}
			let statesDataJson = await res.json();

			if (statesDataJson?.length > 0) {
				// adding all states option to the list
				statesDataJson = statesDataJson.filter((state) => state.languageCode === language);

				statesDataJson = [
					{
						name: allStates,
						extId: '-1'
					},
					...statesDataJson
				];
				statesDataJson.forEach((state) => {
					if (state.languageCode === language) {
						statesMap[state.extId] = state.name;
					}
				});
			} else {
				// return an option list with no state found
				statesDataJson = [
					{
						name: allStates,
						extId: '-1'
					}
				];
			}

			return { stateData: statesDataJson, statesMap };
			// return statesDataJson;
		} catch (err) {
			console.log('err', err.message);
			return [
				{
					name: allStates,
					extId: '-1'
				}
			];
		}
	};

	return {
		...(await fetchCoursesDetails()),
		...(await fetchCenters()),
		...(await fetchStateList()),
		lang: session?.language || 'en',
		user: session.user,
		unauthorized,
		openLMS:true
	};
}
