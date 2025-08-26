import { states } from '$lib/data.js';
import { error } from '@sveltejs/kit';
import { String_Constants } from '../../config/constants';

export const load = async ({ fetch, parent, locals }) => {
	const parentData = await parent();

	const lang = parentData.lang || 'en';

	// fetch the course details form the /apis route
	const fetchCourses = async () => {
		let displayText=''
		try {
			let data = parentData?.allCoursesData ?? [];
			
			if(lang === 'en'){
				displayText = String_Constants.ALL_COURSES
			} else{
				displayText = String_Constants.ALL_COURSES_HI
			}
		

			// Adding all courses option to the list
			if (data?.length > 0) {
				data = [
					{
						title: displayText,
						uuid: 0
					},
					...data
				];
			} else {
				// return an option list with no course found
				return [
					{
						title: displayText,
						uuid: 0
					}
				];
			}

			return data;
		} catch (err) {
			return [
				{
					title: displayText,
					uuid: 0
				}
			];
		}
	};

	return {
		courseData: await fetchCourses()
	};
};
