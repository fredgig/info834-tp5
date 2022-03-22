<script>
	import { goto } from '$app/navigation';

	import { username as _username } from '$lib/stores';
	import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '$lib/settings.js';
	import TextInput from '$lib/components/TextInput.svelte';

	let username = '';
	let password = '';
	let confirmedPassword = '';
	let attemptedSubmit = false;
	let takenUsernames = [];

	$: getUsernameInvalidText = () => {
		if (attemptedSubmit || username.length) {
			if (username.length < MIN_USERNAME_LENGTH) {
				return `Must contain at least ${MIN_USERNAME_LENGTH} characters`;
			} else if (takenUsernames.includes(username)) {
				return 'Username already taken';
			}
		}

		return '';
	}

	$: getPasswordInvalidText = () => {
		if ((attemptedSubmit || password.length) && password.length < MIN_PASSWORD_LENGTH) {
			return `Must contain at least ${MIN_PASSWORD_LENGTH} characters`;
		}

		return '';
	}

	$: getConfirmedPasswordInvalidText = () => {
		if ((attemptedSubmit || confirmedPassword.length) && confirmedPassword !== password) {
			return 'Must be identical to the password';
		}

		return '';
	}

	$: invalidUsernameText = getUsernameInvalidText();
	$: invalidPasswordText = getPasswordInvalidText();
	$: invalidConfirmedPasswordText = getConfirmedPasswordInvalidText();
	
	const handleSubmit = async () => {
		if (
			username.length >= MIN_USERNAME_LENGTH &&
			password.length >= MIN_PASSWORD_LENGTH &&
			password === confirmedPassword
		) {
			const response = await fetch('/api/register', {
				method: 'POST',
				body: JSON.stringify({
					username,
					password
				}),
				headers: { 'content-type': 'application/json' }
			});

			const status = await response.json();

			if (!status.success && status.reason === 'UsernameAlreadyTaken') {
				problemText = 'No account with matching username and password found'
			} else if (status.success) {
				_username.set(status.user.username);

				goto('/')
			}
		} else {
			attemptedSubmit = true;
		}
	};
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
	<div class="w-96 space-y-8 rounded-lg bg-white p-4">
		<h2 class="w-full text-center text-xl text-gray-600">Create an account</h2>

		<form
			on:submit|preventDefault={handleSubmit}
			method="post"
			class="w-full flex flex-col items-center space-y-10"
		>
			<div class="flex flex-col items-center space-y-5">
				<TextInput
					name="Username"
					bind:value={username}
					invalidText={invalidUsernameText}
				/>
				<TextInput
					name="Password"
					type="password"
					bind:value={password}
					invalidText={invalidPasswordText}
				/>
				<TextInput
					name="Confirm password"
					type="password"
					bind:value={confirmedPassword}
					invalidText={invalidConfirmedPasswordText}
				/>
			</div>
			<div class="flex w-full items-center justify-between">
				<a
					href="/login"
					class="text-sm font-medium text-indigo-500 transition hover:text-indigo-400"
					>Already have an account?</a
				>
				<button
					type="submit"
					class="rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400"
					>Register</button
				>
			</div>
		</form>
	</div>
</div>
