<script>
	import SingleAccordionSlider from '$lib/landingPage/SingleAccordionSlider.svelte';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { _ } from 'svelte-i18n';

	let innerWidth;
	let screenSize900pxAbove = false;

	function findScreenSize() {
		screenSize900pxAbove = innerWidth >= 900 ? true : false;
	}

	onMount(() => {
		innerWidth = window.innerWidth;
		window.addEventListener('resize', () => {
			innerWidth = window.innerWidth;
			findScreenSize();
		});
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', () => {
				innerWidth = window.innerWidth;
				findScreenSize();
			});
		}
	});
</script>

<div class="bg-primary">
	<div
		class=" flex w-full box-border h-[50vh] md:h-[65vh] max-h-[550px] overflow-hidden bg-white80 sm:mt-0 2xl:max-w-7xl 2xl:mx-auto"
	>
		<SingleAccordionSlider
			img={{
				mob: '/heroSection/agriEDP_mob.webp',
				primary: '/heroSection/agriEDP.webp',
				fallback: '/heroSection/agriEDP.png'
			}}
			btnText={$_('Agricultural') + ' ' + $_('Programme')}
			btnTextMobile={$_('Agricultural')}
			courseCategory={1}
			altText={'Person engaged in agricultural activities'}
			{screenSize900pxAbove}
		>
			<svg
				width="192"
				height="192"
				viewBox="0 0 192 192"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="size-20 bp-900px:size-36 fill-orange-100 group-hover:fill-white80 group-hover:opacity-50"
			>
				<path
					d="M35 174.961V22.5288H74.3561V40.3733C85.8608 26.1481 102.207 18 121.886 18C135.811 18 147.606 21.3289 157 28.5867L137.031 63.0756C131.88 58.237 123.106 54.3082 112.221 54.3082C89.8312 54.3082 74.3754 73.3719 74.3754 99.3837V175H35.0194L35 174.961Z"
				/>
			</svg>
		</SingleAccordionSlider>
		<SingleAccordionSlider
			img={{
				mob: '/heroSection/productEDP_mob.webp',
				primary: '/heroSection/productEDP.webp',
				fallback: '/heroSection/productEDP.png'
			}}
			btnText={$_('Product') + ' ' + $_('Programme')}
			btnTextMobile={$_('Product')}
			courseCategory={3}
			altText={'Person engaged in production activities'}
			{screenSize900pxAbove}
		>
			<svg
				width="192"
				height="192"
				viewBox="0 0 192 192"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="size-20 bp-900px:size-36 fill-orange-100 group-hover:fill-white80 group-hover:opacity-50"
			>
				<path
					d="M58.2638 108.902C63.1764 127.665 79.0408 140.076 100.113 140.076C115.701 140.076 127.816 133.446 135.61 123.048L163.035 145.266C149.184 164.03 125.507 175 98.3772 175C51.3382 175 19 142.385 19 96.2137C19 50.0427 51.3197 18 97.5092 18C143.699 18 173.137 53.2193 173.137 91.8921C173.137 97.6727 172.565 103.435 171.401 108.92H58.2638V108.902ZM135.905 80.6079C131.583 64.1526 118.009 52.6098 98.1002 52.6098C78.1912 52.6098 64.0444 63.8571 58.8548 80.6079H135.924H135.905Z"
				/>
			</svg>
		</SingleAccordionSlider>
		<SingleAccordionSlider
			img={{
				mob: '/heroSection/processEDP_mob.webp',
				primary: '/heroSection/processEDP.webp',
				fallback: '/heroSection/processEDP.png'
			}}
			btnText={$_('Process') + ' ' + $_('Programme')}
			btnTextMobile={$_('Process')}
			courseCategory={2}
			altText={'Person engaged in process related activities'}
			{screenSize900pxAbove}
		>
			<svg
				width="192"
				height="192"
				viewBox="0 0 192 192"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="size-20 bp-900px:size-36 fill-orange-100 group-hover:fill-white80 group-hover:opacity-50"
			>
				<path
					d="M94.1294 18C115.254 18 131.103 25.6237 142.257 38.5428V22.394H180.413V170.306H142.257V154.758C131.103 167.677 115.254 175 94.1294 175C51.5793 175 19 141.839 19 96.6408C19 51.443 51.5793 18 94.1294 18ZM99.7064 140.674C124.643 140.674 142.257 122.178 142.257 96.9413C142.257 71.7041 124.643 52.9264 99.7064 52.9264C74.7697 52.9264 57.1562 71.4224 57.1562 96.9413C57.1562 122.46 74.7697 140.674 99.7064 140.674Z"
				/>
			</svg>
		</SingleAccordionSlider>
		<SingleAccordionSlider
			img={{
				mob: '/heroSection/generalEDP_mob.webp',
				primary: '/heroSection/generalEDP.webp',
				fallback: '/heroSection/generalEDP.png'
			}}
			btnText={$_('General') + ' ' + $_('Programme')}
			btnTextMobile={$_('General')}
			courseCategory={4}
			altText={'Person engaged in general activities'}
			{screenSize900pxAbove}
		>
			<svg
				width="192"
				height="240"
				viewBox="0 0 192 240"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="size-20 bp-900px:size-36 fill-orange-100 group-hover:fill-white80 group-hover:opacity-50"
			>
				<path
					d="M105.597 175.256C84.3955 175.256 68.4895 167.901 57.295 154.978V222H19V22.4017H57.295V38.5787C68.4895 25.6371 84.3955 18 105.597 18C148.302 18 181 51.2194 181 96.7784C181 142.337 148.302 175.275 105.597 175.275V175.256ZM100 52.9687C74.9726 52.9687 57.295 71.4971 57.295 97.0606C57.295 122.624 74.9726 140.87 100 140.87C125.028 140.87 142.705 122.342 142.705 97.0606C142.705 71.7793 125.028 52.9687 100 52.9687Z"
				/>
			</svg>
		</SingleAccordionSlider>
	</div>
</div>
