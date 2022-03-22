import jwt from 'jsonwebtoken';
import redis from 'redis';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';


import { getUsersCollection } from '$lib/database';
import { PASSWORD_HASH_ROUNDS, WEB_TOKEN_EXPIRATION_SECONDS } from '$lib/settings';

export const generateWebToken = async tokenContent => {
    const token = jwt.sign(tokenContent, import.meta.env.VITE_TOKEN_SECRET, { expiresIn: `${WEB_TOKEN_EXPIRATION_SECONDS}s` });
    const client = redis.createClient();

    await client.connect();
    await client.set(`${tokenContent.username}_token`, token);

    console.log('GENERATED WEB TOKEN', token)

    return token;
}

export const expireWebToken = async request => {
    const token = parseWebToken(request);

    if (token) {
        const tokenContent = await jwt.verify(token, import.meta.env.VITE_TOKEN_SECRET);

        if (tokenContent) {
            const client = redis.createClient();
        
            await client.connect();

            await client.set(`${tokenContent.username}_token`, null);

            console.log('EXPIRED WEB TOKEN', token)

            return true;
        }
    }

    return false;
}

export const parseWebToken = request => {
    const cookie = request.headers.get('cookie');

    if (cookie) {
        return cookie.split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {}).jwt;
    }
}

export const getUsernameFromWebToken = async request => {
    const token = parseWebToken(request);

    if (token) {
        const tokenContent = await jwt.verify(token, import.meta.env.VITE_TOKEN_SECRET);

        if (tokenContent) {
            return tokenContent.username;
        }
    }
}

export const authenticateWebToken = async request => {
    const token = parseWebToken(request);

    if (token) {
        const tokenContent = await jwt.verify(token, import.meta.env.VITE_TOKEN_SECRET);

        if (tokenContent) {
            const client = redis.createClient();
        
            await client.connect();
            
            const storedToken = await client.get(`${tokenContent.username}_token`);

            if (token === storedToken)
                console.log('AUTHENTICATED WEB TOKEN', token)
        
            return token === storedToken;
        }
    }

    return false;
}

export const isUsernameOnline = async username => {
    const client = redis.createClient();

    await client.connect();

    const token = await client.get(`${username}_token`);

    if (token) {
        try {
            const tokenContent = jwt.verify(token, import.meta.env.VITE_TOKEN_SECRET);

            return !!tokenContent
        } catch {
            return false
        }
    } else {
        return false;
    }
}

export const login = async (username, password) => {
    const token = await generateWebToken({ username });
    const usersCollection = await getUsersCollection();
	// const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

	const user = await usersCollection.findOne({ username, password });

	if (user) {
        return {
            headers: {
                'Set-Cookie': serialize('jwt', token, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                    maxAge: WEB_TOKEN_EXPIRATION_SECONDS
                })
            },
            body: {
                success: true,
                user: {
                    username
                }
            }
        };
	} else {
		return {
			body: {
				success: false,
				reason: 'NoAccountFound'
			}
		};
	}
}