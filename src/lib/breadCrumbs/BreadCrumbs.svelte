<script>
	import { format } from 'svelte-i18n';
	export let route = '';
	export let params = [];
	export let searchParams=''

	let newRoute = route && route.slice('1');
	let breadCrumbsArr = [{ crumb: $format('home_route'), path: '/' }];
	let href = '';
	$: createBreadCrumbArray($format);

	function createBreadCrumbArray() {
		href=''
		newRoute = route && route.slice('1');
		newRoute = newRoute && newRoute.split('/');
		breadCrumbsArr = [{ crumb: $format('home_route'), path: '/' }];
		newRoute &&
			newRoute.forEach((element, index) => {
				if (element?.startsWith('[')) {
					let [paramValue] = Object.values(params);
					href = href + '/' + paramValue;
					breadCrumbsArr[index].path = href 
				} else {
					href = href + '/' + element;
					let elementLanguageKey = element + '_route';

					breadCrumbsArr?.push({
						crumb: $format(elementLanguageKey),
						path: href
					});
				
				}
			});
			
			if(searchParams){
				breadCrumbsArr[breadCrumbsArr.length-1].path=breadCrumbsArr[breadCrumbsArr.length-1].path+searchParams
			}

	}
</script>

<nav class="flex" aria-label="Breadcrumb">
	<ol role="list" class="flex items-center">
		{#if breadCrumbsArr?.length > 1}
			{#each breadCrumbsArr as breadCrumb, index}
				<li>
					<div class="flex items-end justify-center">
						<a
							href={breadCrumb?.path}
							class=" text-xs lg:text-sm hover:text-gray-700 capitalize {index ===
							breadCrumbsArr?.length - 1
								? 'text-darkGray font-semibold'
								: 'text-gray-90'} ">{breadCrumb?.crumb}</a
						>
						{#if index !== breadCrumbsArr?.length - 1}
							<svg
								class="h-4 w-4 flex-shrink-0 text-gray-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>
				</li>
			{/each}
		{/if}
	</ol>
</nav>
