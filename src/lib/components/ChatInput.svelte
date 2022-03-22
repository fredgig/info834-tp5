<script>
	import { page } from '$app/stores';
	import { io } from "$lib/realtime";
	import { username } from '$lib/stores';

	export let onChatSubmitted;

	let text = '';

	const onSubmit = () => {
		text = text.trim();

		if (text.length > 0) {
			io.emit('chat', {
				username: $username,
				otherUsername: $page.params.user,
				text
			});

			fetch('/api/chats', {
				method: 'POST',
				body: JSON.stringify({
					otherUsername: $page.params.user,
					text
				}),
				headers: { 'content-type': 'application/json' }
			});

			onChatSubmitted(text);

			text = '';
		}
	}
</script>

<form class="flex space-x-1.5 h-full" on:submit|preventDefault={onSubmit}>
	<input
		bind:value={text}
		placeholder="Type here"
		class="h-full w-full resize-none appearance-none rounded bg-gray-100 p-2 ring-2 ring-indigo-500 ring-opacity-0 transition focus:outline-none focus:ring-opacity-100"
	/>
	<button disabled={text.trim().length === 0} type="submit" class="px-6 py-1 h-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded transition ring-2 ring-indigo-500 ring-opacity-0 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-opacity-100 disabled:bg-indigo-300 disabled:hover:bg-indigo-300 disabled:cursor-default">Send</button>
</form>
