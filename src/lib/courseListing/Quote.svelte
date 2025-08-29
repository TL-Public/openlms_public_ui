<script>
	import QuoteSvg from '$lib/svgComponents/QuoteSVG.svelte';
	import {_} from "svelte-i18n"
</script>
<div>


<blockquote class="border-[1.5px] border-accent  bg-white p-4 lg:p-6 rounded-md flex flex-col lg:max-w-80 gap-2">
	<QuoteSvg fillColor={'fill-accent'} />
	<p class="text-base sm:text-sm text-darkGray">
		{$_('Quote')}
	</p>
	<cite class="text-darkGray text-sm font-semibold text-end">-{$_("MahathmaGandhi")}</cite>
</blockquote>
</div>