<script>
	import { goto } from '$app/navigation';
	import { username as _username } from '$lib/stores';
	import { io } from "$lib/realtime";
	import TextInput from '$lib/components/TextInput.svelte';

	let username = '';
	let password = '';
	let problemText = '';

	const handleSubmit = async () => {
		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password
			}),
			headers: { 'content-type': 'application/json' }
		});

		const status = await response.json();

		if (!status.success && status.reason === 'NoAccountFound') {
			problemText = 'No account with matching username and password found'
		} else if (status.success) {
			_username.set(status.user.username);

			io.emit('online', {
				username: status.user.username,
				online: true
			});

			goto('/')
		}
	};
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
	<div class="w-96 space-y-8 rounded-lg bg-white p-4">
		<h2 class="w-full text-center text-xl text-gray-600">Log into an account</h2>

		<form
			on:submit|preventDefault={handleSubmit}
			method="post"
			class="w-full flex flex-col items-center space-y-10"
		>
			<div class="w-full flex flex-col items-center space-y-5">
				<TextInput name="Username" bind:value={username} />
				<TextInput name="Password" type="password" bind:value={password} />
			</div>
			<div class="w-full text-xs text-red-500 text-center {problemText ? 'opacity-100' : 'opacity-0'} transition">
				{problemText || '.'}
			</div>
			<div class="flex w-full items-center justify-between">
				<a
					href="/register"
					class="text-sm font-medium text-indigo-500 transition hover:text-indigo-400"
					>Don't have an account?</a
				>
				<button
					type="submit"
					class="rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400"
					>Log in</button
				>
			</div>
		</form>
	</div>
</div>
