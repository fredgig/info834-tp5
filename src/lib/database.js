import { MongoClient } from 'mongodb';

let mongoClient = null;

export const getMongoClient = async () => {
	if (!mongoClient) {
		mongoClient = new MongoClient(import.meta.env.VITE_MONGODB_URI);
		await mongoClient.connect();
	}

	return mongoClient;
};

export const getDb = async () => (await getMongoClient()).db(import.meta.env.VITE_MONGODB_DATABASE);

export const getUsersCollection = async () => (await getDb()).collection('users');

export const getChatsCollection = async () => (await getDb()).collection('chats');
