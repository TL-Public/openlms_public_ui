<script>
	import LandingPageCourses from '$lib/landingPageCourses/LandingPageCourses.svelte';
	import MessageCarousel from '$lib/ministersMessage/messageCarousel.svelte';
	import HeroSection from '$lib/landingPage/HeroSection.svelte';
	import CollaborationsSection from '$lib/landingPage/CollaborationsSection.svelte';
	import AboutSection from '$lib/landingPage/AboutSection.svelte';
	import LifeCycleSection from '$lib/landingPage/LifeCycleSection.svelte';
	import TestimonialSection from '$lib/landingPage/TestimonialSection.svelte';
	import { setAuthStatus } from '$lib/utils/helper';
	import { onMount } from 'svelte';
	import LandingPageLoggedInView from '$lib/landingPage/loggedInView/LandingPageLoggedInView.svelte';

	// ------------------ Open LMS Imports -------------------------
	import HeroSectionOLMS from '$lib/landingPage/edureach/HeroSectionOLMS.svelte';
	import CollaborationsSectionOLMS from '$lib/landingPage/edureach/CollaborationsSectionOLMS.svelte';
	import AboutSectionOLMS from '$lib/landingPage/edureach/AboutSectionOLMS.svelte';
	import LifeCycleSectionOLMS from '$lib/landingPage/edureach/LifeCycleSectionOLMS.svelte';
	import TestimonialSectionOLMS from '$lib/landingPage/edureach/TestimonialSectionOLMS.svelte';
	import LandingPageCoursesOLMS from '$lib/landingPage/edureach/LandingPageCoursesOLMS.svelte';

	export let data;

	const {
		allCoursesData,
		testimonialData,
		overAllStatsData,
		lang,
		carouselData,
		user,
		traineeProfile,
		traineeCourses,
		centersData,
		openLMS
	} = data;
	
	onMount(() => {
		setAuthStatus(data?.unauthorized);
	});
</script>

{#if !user?.isAuthenticated}
{#if !openLMS}
<HeroSection />
<CollaborationsSection />
<AboutSection generalStats={overAllStatsData} token={data.token} />
<LandingPageCourses cardsData={allCoursesData} />
<LifeCycleSection />
<MessageCarousel {carouselData} {lang} />
<div
	class="px-4 pr-0 md:px-16 md:pr-0 lg:px-16 bg-ivory w-full h-full 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 lg:pb-32"
>
	<TestimonialSection testimonials={testimonialData} {lang} />
</div>
{:else}
	<HeroSectionOLMS />
	<CollaborationsSectionOLMS />
	<AboutSectionOLMS generalStats={overAllStatsData} token={data.token} />
	<LandingPageCoursesOLMS cardsData={allCoursesData} />
	<LifeCycleSectionOLMS />
	<div
	class="px-4 pr-0 md:px-16 md:pr-0 lg:px-16 bg-white50 w-full h-full 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 lg:pb-32"
>
	<TestimonialSectionOLMS testimonials={testimonialData} {lang} />
</div>
{/if}
{:else}

	<LandingPageLoggedInView
		traineeDetailsData={traineeProfile}
		cardsData={allCoursesData}
		{traineeCourses}
		{centersData}
		{lang}
	/>
{/if}
