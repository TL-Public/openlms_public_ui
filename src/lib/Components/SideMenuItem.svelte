<script>
	export let addClass = '';
</script>

<li class="w-full p-2 border-b pl-4 flex gap-4 items-center{addClass}" {...$$restProps}>
	<slot name="icon" />
	<slot name="link" />
</li>