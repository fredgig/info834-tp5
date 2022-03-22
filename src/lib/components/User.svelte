<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { io } from "$lib/realtime";

	import UserImage from '$lib/components/UserImage.svelte';

	export let username = 'SomeUsername';
	export let online = false;
	export let lastChatText = null;

	$: isCurrentUsername = username === $page.params.user;

	onMount(async () => {
		io.on(`${username}_online`, _online => online = _online );
	});
</script>

<a
	href="/{username}"
	class="group flex items-center space-x-4 rounded p-2 transition {isCurrentUsername
		? 'bg-gray-200'
		: 'hover:bg-gray-100'}"
>
	<div class="flex h-full items-center">
		<UserImage {online} />
	</div>
	<div class="hidden w-full md:block">
		<div class="font-medium text-gray-800">
			{username}
		</div>
		{#if lastChatText}
			<div class="w-fit overflow-hidden text-ellipsis text-gray-400">
				{lastChatText}
			</div>
		{/if}
	</div>
</a>
