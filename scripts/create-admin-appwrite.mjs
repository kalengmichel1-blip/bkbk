import { Client, Users, Databases, ID } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const usersColId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

const users = new Users(client);
const databases = new Databases(client);

// Default Admin Credentials
const email = process.env.ADMIN_EMAIL || 'admin@bkbk.local';
const password = process.env.ADMIN_PASSWORD || 'Admin@1234567890';
const name = 'Admin User';

async function run() {
    console.log(`Setting up Admin user for ${email}...`);
    try {
        // 1. Create Auth Identity
        const user = await users.create(ID.unique(), email, null, password, name);
        console.log(`-> Auth user created with ID: ${user.$id}`);

        // 2. Add Prefs (role = admin)
        await users.updatePrefs(user.$id, { role: 'admin' });
        console.log(`-> Permissions updated to 'admin'.`);
        
        // 3. Create document in the Users collection for the team management UI
        await databases.createDocument(
            dbId,
            usersColId,
            user.$id,
            {
                full_name: name,
                username: 'admin',
                role: 'admin',
                updated_at: new Date().toISOString()
            }
        );
        console.log(`-> Database record created. You can now log in at /admin/login.`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch(err) {
        if (err.code === 409) {
             console.log("-> Admin user already exists with this email!");
        } else {
             console.error("Error:", err.message);
        }
    }
}
run();
