<script>
	import { goto } from '$app/navigation';
	import { io } from "$lib/realtime";
	import { username } from '$lib/stores';

	import User from '$lib/components/User.svelte';
	import UserImage from '$lib/components/UserImage.svelte';

	export let users = [];

	const handleLogout = async () => {
		const response = await fetch('/api/logout', {
			method: 'POST',
			headers: { 'content-type': 'application/json' }
		});

		const { success } = await response.json();

		if (success) {
			io.emit('online', {
				username: $username,
				online: false
			});

			username.set(null);

			goto('/login')
		}
	};
</script>

<div
	class="flex justify-between h-screen max-h-full w-20 flex-col space-y-2 bg-gray-50 md:w-1/4"
>
	<div class="flex flex-col grow px-2 py-4 space-y-1.5 overflow-scroll">
		{#each users as user}
			<User username={user.username} lastChatText={user.lastChatText} online={user.online} />
		{/each}
	</div>
	<div class="flex justify-between items-center p-2 h-16 bg-gray-100 rounded-tr">
		<div class="flex items-center space-x-2">
			<UserImage online />
			<div class="text-gray-600 font-medium text-sm">{$username}</div>
		</div>
		<button on:click={handleLogout} class="text-indigo-500 hover:text-indigo-400 font-medium text-xs transition">Logout</button>
	</div>
</div>
