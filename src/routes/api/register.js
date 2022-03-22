import bcrypt from 'bcrypt';

import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, PASSWORD_HASH_ROUNDS } from '$lib/settings.js';
import { getUsersCollection } from '$lib/database';
import { login } from '$lib/auth';

export async function post({ request }) {
	const { username, password } = await request.json();
	const usersCollection = await getUsersCollection();
	const user = await usersCollection.findOne({ username });

	if (user) {
		return {
			body: {
				success: false,
				reason: 'UsernameAlreadyTaken'
			}
		};
	} else if (username.length >= MIN_USERNAME_LENGTH && password.length >= MIN_PASSWORD_LENGTH) {
		// const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

		await usersCollection.insertOne({
			username,
			password
		});

		return await login(username, password);
	}
}
