import { authenticateWebToken, expireWebToken } from '$lib/auth';

export async function post({ request }) {
	const authenticated = await authenticateWebToken(request);

	if (authenticated) {
        const success = await expireWebToken(request);

        return {
			body: {
				success
			}
        };
    } else {
        return {
            status: 301
        };
    }
}
