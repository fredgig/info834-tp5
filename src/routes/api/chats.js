import { getChatsCollection } from '$lib/database';
import { authenticateWebToken, getUsernameFromWebToken } from '$lib/auth';
import { io } from "$lib/realtime";

export async function get({ request, url }) {
	const otherUsername = url.searchParams.get('otherUsername');
	const authenticated = await authenticateWebToken(request);
	const username = await getUsernameFromWebToken(request);

	if (authenticated && username && otherUsername) {
		const chatsCollection = await getChatsCollection();
		const chats = await chatsCollection.find({
			$and: [{
				$or: [
					{
						username,
						otherUsername
					},
					{
						username: otherUsername,
						otherUsername: username
					}
				]
			},
			{
				text: /(.|\s)*\S(.|\s)*/
			}]
		}).toArray();
	
		return {
			body: {
				chats
			}
		};
	} else {
		return {
			status: 301
		}
	}
}

export async function post({ request }) {
	const { otherUsername, text } = await request.json();
	const authenticated = await authenticateWebToken(request);
	const username = await getUsernameFromWebToken(request);

	if (authenticated && username && otherUsername) {
		const chatsCollection = await getChatsCollection();

		await chatsCollection.insertOne({
			username,
			otherUsername,
			text
		});
	
		return {
			success: true
		};
	} else {
		return {
			status: 301
		}
	}
}
