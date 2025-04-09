<script>
	import LandingPageCourses from '$lib/landingPageCourses/LandingPageCourses.svelte';
	import MessageCarousel from '$lib/ministersMessage/messageCarousel.svelte';
	import HeroSection from '$lib/landingPage/HeroSection.svelte';
	import CollaborationsSection from '$lib/landingPage/CollaborationsSection.svelte';
	import AboutSection from '$lib/landingPage/AboutSection.svelte';
	import LifeCycleSection from '$lib/landingPage/LifeCycleSection.svelte';
	import TestimonialSection from '$lib/landingPage/TestimonialSection.svelte';
	import HowToUsePlatform from '$lib/landingPage/HowToUsePlatform.svelte';
	import NewHeroSection from '$lib/landingPage/NewHeroSection.svelte';
	export let data;

	const { allCoursesData, testimonialData, overAllStatsData, lang, carouselData } = data;
</script>

<NewHeroSection />
<CollaborationsSection endorsedBy="Empowering Top Brands" />
<AboutSection generalStats={overAllStatsData} token={data.token} />
<LandingPageCourses cardsData={allCoursesData} />
<HowToUsePlatform />
<!-- <TestimonialSection testimonials={testimonialData} {lang} /> -->
<div class="px-4 pr-0 md:px-16  md:pr-0 lg:px-16  w-full h-full 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 lg:pb-32">
	<TestimonialSection testimonials={testimonialData} {lang} />
</div>
