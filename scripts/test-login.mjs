import { Client, Account } from 'node-appwrite';
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
const account = new Account(client);
async function run() {
    const session = await account.createEmailPasswordSession('admin@bkbk.local', 'Admin@1234567890');
    console.log('Session expire string:', session.expire);
    console.log('Calculated MaxAge:', new Date(session.expire).getTime() - Date.now());
}
run();
