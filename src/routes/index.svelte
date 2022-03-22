<script context="module">
	export async function load({ fetch }) {
		const response = await fetch('/api/users', {
			method: 'GET'
		});

		const { users } = await response.json();

		if (users) {
			return {
				props: {
					users
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
	import SideBar from '$lib/components/SideBar.svelte';

	export let users = [];
</script>

<div class="flex h-full space-x-1">
	<SideBar {users} />
	<div class="flex h-screen w-3/4 flex-col justify-center items-center">
		<div class="text-xl text-gray-400 font-light">Select a user to start chatting</div>
	</div>
</div>

<slot />
