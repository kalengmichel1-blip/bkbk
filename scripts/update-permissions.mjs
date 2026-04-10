import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const postsColId = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID;
const usersColId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function run() {
    try {
        console.log("Opening Public Read permissions...");

        // 1. Posts Collection
        const pCol = await databases.getCollection(dbId, postsColId);
        let pPerms = pCol.$permissions || [];
        const anyRead = Permission.read(Role.any());
        if (!pPerms.includes(anyRead)) pPerms.push(anyRead);
        await databases.updateCollection(dbId, postsColId, pCol.name, pPerms, pCol.documentSecurity, pCol.enabled);
        console.log("✅ Posts Collection: Public Read Granted");

        // 2. Users Collection
        const uCol = await databases.getCollection(dbId, usersColId);
        let uPerms = uCol.$permissions || [];
        if (!uPerms.includes(anyRead)) uPerms.push(anyRead);
        await databases.updateCollection(dbId, usersColId, uCol.name, uPerms, uCol.documentSecurity, uCol.enabled);
        console.log("✅ Users Collection: Public Read Granted");

        // 3. Storage Bucket
        const bucket = await storage.getBucket(bucketId);
        let bPerms = bucket.$permissions || [];
        if (!bPerms.includes(anyRead)) bPerms.push(anyRead);
        await storage.updateBucket(
            bucketId, 
            bucket.name, 
            bPerms, 
            bucket.fileSecurity, 
            bucket.enabled, 
            bucket.maximumFileSize, 
            bucket.allowedFileExtensions, 
            bucket.compression, 
            bucket.encryption, 
            bucket.antivirus
        );
        console.log("✅ Images Bucket: Public Read Granted");

        console.log("Done! You can now load the website!");
    } catch (e) {
        console.error("Error setting permissions:", e.message);
    }
}
run();
