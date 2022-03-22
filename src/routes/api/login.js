import { login } from '$lib/auth';

export async function post({ request }) {
	const { username, password } = await request.json();

	return await login(username, password);
}
