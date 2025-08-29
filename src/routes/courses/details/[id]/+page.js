export async function load({ fetch, params, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang ? parentData.lang : 'en';
	const courseTitle = parentData?.courseTitle ? parentData.courseTitle : '';
	let unauthorized = parentData?.unauthorized ?? false;
	const id = params.id;
	let res;
	const fetchTestimonials = async () => {
		try {
			res = await fetch(`/apis/testimonials?courseUuid=${id}`);
			if (!res.ok) {
				if (res.status === 401) {
					unauthorized = true;
				}
				throw new Error('Failed to fetch testimonials');
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('Testimonials not found');
			}
			if (!data?.error) {
				const filteredData = data?.filter((item) => item != null);
				return filteredData;
			}
			return { error: data?.error, status: res?.status };
		} catch (err) {
			return { error: err.message, status: res?.status };
		}
	};
	const fetchIntroVideos = async () => {
		try {
			res = await fetch(`/apis/courses/details/${id}/introVideos`);
			if (!res.ok) {
				if (res.status === 401) {
					unauthorized = true;
				}
				throw new Error('Failed to fetch introductory videos');
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('Introductory videos not found');
			}
			if (!data?.error) {
				const filteredData = data?.filter((item) => item != null);
				return filteredData;
			}
			return { error: data?.error, status: res?.status };
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

	return {
		testimonials: await fetchTestimonials(),
		unauthorized,
		pageTitle: `${courseTitle} - Course Details`,
		introVideos: await fetchIntroVideos(),
		traineeCourses : await fetchTraineeCourses(),
		traineeDetailsData : await fetchProfile()
	};
}
