import { getUsersCollection, getChatsCollection } from '$lib/database';
import { authenticateWebToken, getUsernameFromWebToken, isUsernameOnline } from '$lib/auth';

export async function get({ request }) {
	const authenticated = await authenticateWebToken(request);
	const username = await getUsernameFromWebToken(request);

	if (authenticated) {
		const usersCollection = await getUsersCollection();
		const chatsCollection = await getChatsCollection();
		const users = await usersCollection.find().toArray();

		for (const user of users) {
			user.online = await isUsernameOnline(user.username),
			user.lastChatText = (await chatsCollection.findOne({
				$and: [{
					$or: [
						{
							username,
							otherUsername: user.username
						},
						{
							username: user.username,
							otherUsername: username
						}
					]
				},
				{
					text: /(.|\s)*\S(.|\s)*/
				}]
			}, { sort: {_id: -1}, limit: 1 }))?.text;
		}
	
		return {
			body: {
				users
			}
		};
	} else {
		return {
			status: 301
		}
	}
}
