import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';

export function createClient() {
    const client = new Client();
    
    if (endpoint && project) {
        client.setEndpoint(endpoint).setProject(project);
    } else {
        console.warn('Appwrite credentials missing. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT in your .env.local');
    }

    return {
        client,
        account: new Account(client),
        databases: new Databases(client),
        storage: new Storage(client)
    };
}
