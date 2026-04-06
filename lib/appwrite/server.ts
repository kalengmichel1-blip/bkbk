import { Client, Account, Databases, Storage, Users } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
    const client = new Client();
    
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';

    if (!endpoint || !project) {
        console.warn('Appwrite credentials missing in createSessionClient!');
    } else {
        client.setEndpoint(endpoint).setProject(project);
    }
    
    const cookieStore = await cookies();
    const session = cookieStore.get('appwrite-session');

    if (!session || !session.value) {
        return {
            account: null,
            databases: null,
            storage: null
        }
    }

    client.setSession(session.value);

    return {
        get account() { return new Account(client); },
        get databases() { return new Databases(client); },
        get storage() { return new Storage(client); }
    };
}

export async function createAdminClient() {
    const client = new Client();
    
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
    const key = process.env.APPWRITE_API_KEY || '';

    if (!endpoint || !project || !key) {
        console.warn('Appwrite credentials missing in createAdminClient!');
    } else {
        client.setEndpoint(endpoint).setProject(project).setKey(key);
    }

    return {
        get account() { return new Account(client); },
        get databases() { return new Databases(client); },
        get storage() { return new Storage(client); },
        get users() { return new Users(client); }
    };
}
