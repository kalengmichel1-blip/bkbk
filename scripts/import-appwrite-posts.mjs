import { Client, Databases, Users, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// Check for required environment variables
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;

if (!dbId || !collectionId || !endpoint || !project || !apiKey) {
    console.error("Missing one or more required Appwrite environment variables:");
    console.error(`- NEXT_PUBLIC_APPWRITE_ENDPOINT: ${endpoint ? 'OK' : 'MISSING'}`);
    console.error(`- NEXT_PUBLIC_APPWRITE_PROJECT: ${project ? 'OK' : 'MISSING'}`);
    console.error(`- APPWRITE_API_KEY: ${apiKey ? 'OK' : 'MISSING'}`);
    console.error(`- NEXT_PUBLIC_APPWRITE_DATABASE_ID: ${dbId ? 'OK' : 'MISSING'}`);
    console.error(`- NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID: ${collectionId ? 'OK' : 'MISSING'}`);
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

const databases = new Databases(client);
const users = new Users(client);

async function loadPosts() {
    const jsonDirectory = path.join(process.cwd(), 'content');
    const fileContents = fs.readFileSync(path.join(jsonDirectory, 'posts.json'), 'utf8');
    const posts = JSON.parse(fileContents);
    return posts;
}

async function run() {
    console.log("Fetching first available user to assign as author...");
    let adminUserId = null;
    try {
        const userList = await users.list();
        if (userList.users.length > 0) {
            adminUserId = userList.users[0].$id;
            console.log(`Using user ID ${adminUserId} as author.`);
        } else {
             // Fallback default author ID
             adminUserId = "legacy_admin_id";
             console.log("No users found. Using fallback author_id 'legacy_admin_id'.");
        }
    } catch (e) {
        console.error("Failed to list users. Are Appwrite API keys valid with 'users.read' permission?", e.message);
        process.exit(1);
    }

    const posts = await loadPosts();
    console.log(`Loaded ${posts.length} posts from content/posts.json. Starting import...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        
        const title = post.title.replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&nbsp;/g, ' ');

        const doc = {
            title: title,
            slug: post.slug || `post-${Date.now()}-${i}`,
            content: post.content || '',
            excerpt: post.excerpt || '',
            featured_image: post.featured_image_url || null,
            status: 'published',
            published_at: post.date,
            created_at: post.date,
            author_id: adminUserId
        };

        try {
            await databases.createDocument(dbId, collectionId, ID.unique(), doc);
            successCount++;
            if (successCount % 50 === 0) {
                console.log(`[Progress] Imported ${successCount} / ${posts.length} posts...`);
            }
        } catch (error) {
            failCount++;
            console.error(`Error importing post "${title}":`, error.message);
        }
    }

    console.log(`\nImport complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

run();
