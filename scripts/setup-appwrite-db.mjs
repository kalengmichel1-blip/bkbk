import { Client, Databases, Storage, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const project = 'bkbkcms';
const apiKey = 'standard_f01be0835ae1c9540110601d0375286152271db6583cad2cbc31d637c957dccf778c8a840ffcb57529e66702c9490e69f89d75ef75b6af65b83e4e235e34c31c06880dd3757d86882bbe085fbf346753f40f6319620f17670016b5236bb6a0f9bad89c78e4757b94266bbdd16dd83d308f5dbe2b50964c3b7a1b3521296d14e4';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    try {
        console.log("Setting up Appwrite environment...");

        // 1. Create Database
        const db = await databases.create(ID.unique(), 'BKBK Database');
        console.log("Database created:", db.$id);

        // 2. Create Posts Collection
        const postsCol = await databases.createCollection(db.$id, ID.unique(), 'Posts');
        console.log("Posts Collection created:", postsCol.$id);
        
        await databases.createStringAttribute(db.$id, postsCol.$id, 'title', 255, true);
        await databases.createStringAttribute(db.$id, postsCol.$id, 'slug', 255, true);
        await databases.createStringAttribute(db.$id, postsCol.$id, 'content', 1000000, false); // large size
        await databases.createStringAttribute(db.$id, postsCol.$id, 'excerpt', 1000, false);
        await databases.createDatetimeAttribute(db.$id, postsCol.$id, 'published_at', false);
        await databases.createDatetimeAttribute(db.$id, postsCol.$id, 'created_at', false);
        await databases.createUrlAttribute(db.$id, postsCol.$id, 'featured_image', false);
        await databases.createStringAttribute(db.$id, postsCol.$id, 'status', 50, false, 'published');
        await databases.createStringAttribute(db.$id, postsCol.$id, 'author_id', 50, true);

        // 3. Create Users Collection
        const usersCol = await databases.createCollection(db.$id, ID.unique(), 'Users');
        console.log("Users Collection created:", usersCol.$id);

        await databases.createStringAttribute(db.$id, usersCol.$id, 'full_name', 255, true);
        await databases.createStringAttribute(db.$id, usersCol.$id, 'username', 255, false);
        await databases.createStringAttribute(db.$id, usersCol.$id, 'role', 50, false, 'admin');
        await databases.createDatetimeAttribute(db.$id, usersCol.$id, 'updated_at', false);

        // 4. Create Storage Bucket
        let bucketId;
        try {
            const bucket = await storage.createBucket(ID.unique(), 'Images');
            bucketId = bucket.$id;
            console.log("Storage Bucket created:", bucketId);
        } catch (e) {
            console.log("Failed to create bucket, perhaps permissions or endpoint?", e.message);
            bucketId = 'images_bucket_placeholder';
        }

        // Write .env.local
        const envContent = `NEXT_PUBLIC_APPWRITE_ENDPOINT=${endpoint}
NEXT_PUBLIC_APPWRITE_PROJECT=${project}
NEXT_PUBLIC_APPWRITE_DATABASE_ID=${db.$id}
NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID=${postsCol.$id}
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=${usersCol.$id}
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=${bucketId}
APPWRITE_API_KEY=${apiKey}
`;
        fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
        console.log("\nSuccessfully generated .env.local!");

        console.log("\nSetup Complete. Generating attributes might take a few moments on Appwrite's side.");
        
    } catch (e) {
        console.error("Setup error:", e);
    }
}

run();
