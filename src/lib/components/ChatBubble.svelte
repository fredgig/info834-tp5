<script>
	export let text = 'Lorem ipsum sdfgj sdfg sdfg sdfg sdfg sdfg sdfg sdfg sdfg.';
	export let isFromMe = false;
</script>

<div
	class="w-fit rounded-xl px-4 py-2 {isFromMe
		? 'rounded-tr text-white bg-indigo-500 self-end ml-8'
		: 'rounded-tl text-black bg-gray-200 mr-8'}"
>
	{text}
</div>
