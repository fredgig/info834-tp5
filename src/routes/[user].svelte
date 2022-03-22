<script context="module">
	export async function load({ fetch, params }) {
		let response = await fetch('/api/users', {
			method: 'GET'
		});

		const { users } = await response.json();

		response = await fetch(`/api/chats?otherUsername=${params.user}`);

		const { chats } = await response.json();

		if (users) {
			return {
				props: {
					users,
					chats
				}
			};
		} else {
			return {
				status: 301,
				redirect: '/login'
			};
		}
	}
</script>

<script>
	import { page } from '$app/stores';
	import { username } from '$lib/stores';
	import { io } from "$lib/realtime";

	import SideBar from '$lib/components/SideBar.svelte';
	import ChatBubble from '$lib/components/ChatBubble.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';

	export let users = [];
	export let chats = [];

	const onChatSubmitted = text =>
		chats = [ ...chats, {
			username: $username,
			otherUsername: $page.params.user,
			text
		}]

		io.on(`${$page.params.user}_${$username}`, text => {
			if ($page.params.user !== $username) {
				chats = [ ...chats, {
					username: $page.params.user,
					otherUsername: $username,
					text
				}];
			}
		});
</script>

<div class="flex h-full space-x-1">
	<SideBar {users} />
	<div class="flex h-screen w-3/4 flex-col justify-between">
		<div class="flex w-full grow flex-col space-y-1.5 p-4 overflow-scroll">
			{#each chats as chat}
				<ChatBubble text={chat.text} isFromMe={$username === chat.username} />
			{/each}
		</div>
		<div class="h-14 w-full p-2">
			<ChatInput {chats} {onChatSubmitted} />
		</div>
	</div>
</div>

<slot />
