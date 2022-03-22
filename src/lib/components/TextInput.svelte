<script>
	export let value = '';
    export let type = 'text';
	export let name;
	export let invalidText = '';

    const handleInputType = (e) => {
        e.target.type = type;
    };
</script>

<div class="w-full space-y-0.5">
	<label for={name} class="w-full text-sm text-gray-500">{name}</label>
	<input
		id={name}
		bind:value
        on:input={handleInputType}
		class="w-full appearance-none rounded bg-gray-100 p-1 ring-2 {invalidText
			? 'ring-red-300 ring-opacity-100 focus:ring-red-500'
			: 'ring-indigo-500 ring-opacity-0 focus:ring-opacity-100'} transition focus:outline-none"
	/>
	<div class="text-xs text-red-500 {invalidText ? 'text-opacity-100' : 'text-opacity-0'}">
		{invalidText || '.'}
	</div>
</div>
