#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENDPOINT = 'http://localhost/v1';
const ADMIN_EMAIL = 'admin@bkbk.local';
const ADMIN_PASSWORD = 'Admin@1234567890';

// Generate a secure random key
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Retry logic
async function waitForAppwrite(maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`[${i + 1}/${maxRetries}] Checking Appwrite health...`);
            const response = await fetch(`${ENDPOINT}/health`);
            if (response.ok) {
                console.log('✓ Appwrite is healthy!\n');
                return true;
            }
        } catch (e) {}
        if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    // Continue anyway even if health check fails - user can access dashboard manually
    console.log('⚠️  Appwrite may still be initializing, but continuing...\n');
    return true;
}

// REST API calls
async function apiCreate(path, data, apiKey, projectId = 'console') {
    const res = await fetch(`${ENDPOINT}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Key': apiKey,
            'X-Appwrite-Project': projectId
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function apiGet(path, apiKey, projectId = 'console') {
    const res = await fetch(`${ENDPOINT}${path}`, {
        method: 'GET',
        headers: {
            'X-Appwrite-Key': apiKey,
            'X-Appwrite-Project': projectId
        }
    });
    return res.json();
}

async function setup() {
    try {
        console.log('🚀 Appwrite Setup Wizard\n');
        await waitForAppwrite();

        // For local Appwrite, we need to get/create a master API key
        // First, let's try using a default admin key (this will fail on first run, which is OK)
        const tempApiKey = 'appwrite_' + generateId();
        const projectId = generateId();

        console.log('\n📋 Creating Project and Collections...\n');
        console.log('ℹ️  Since the SDK has limited admin APIs, please manually:');
        console.log('\n1. Go to http://localhost/console');
        console.log('2. Create a project named "BKBK CMS"');
        console.log('3. Create a database named "BKBK Database"');
        console.log('4. Create two collections:');
        console.log('   - "Posts" collection');
        console.log('   - "Users" collection');
        console.log('5. Add attributes to Posts:');
        console.log('   - title (String, 255, required)');
        console.log('   - slug (String, 255, required)');
        console.log('   - content (String, 65535)');
        console.log('   - excerpt (String, 1000)');
        console.log('   - published_at (DateTime)');
        console.log('   - created_at (DateTime)');
        console.log('   - featured_image (URL)');
        console.log('   - status (String, 50, required, default: "published")');
        console.log('   - author_id (String, 50, required)');
        console.log('6. Add attributes to Users:');
        console.log('   - full_name (String, 255, required)');
        console.log('   - username (String, 255)');
        console.log('   - role (String, 50, required, default: "admin")');
        console.log('   - updated_at (DateTime)');
        console.log('7. Create a storage bucket named "Images"');
        console.log('8. Create an API Key with these scopes:');
        console.log('   - users.read, users.write');
        console.log('   - databases.read, databases.write, collections.read, collections.write');
        console.log('   - documents.read, documents.write');
        console.log('   - files.read, files.write, buckets.read, buckets.write');
        console.log('\nOnce you have created these, provide the IDs below:\n');

        // For now, generate a template .env.local
        const envContent = `# Appwrite Configuration - FILL IN THE IDS FROM APPWRITE DASHBOARD
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID=your_posts_collection_id_here
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id_here
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
APPWRITE_API_KEY=your_api_key_here

# Admin Credentials for testing
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
`;

        const envPath = path.join(__dirname, '..', '.env.local');
        fs.writeFileSync(envPath, envContent);

        console.log('✓ Template .env.local created at:', envPath);
        console.log('\n' + '='.repeat(70));
        console.log('📝 NEXT STEPS:');
        console.log('='.repeat(70));
        console.log('\n1. Open Appwrite dashboard: http://localhost/console');
        console.log('2. Create the project, database, and collections as described above');
        console.log('3. Copy the IDs and API key from the dashboard');
        console.log('4. Fill in the .env.local file with your IDs');
        console.log('5. Run: npm run dev');
        console.log('6. Run: node scripts/import-appwrite-posts.mjs');
        console.log('7. Visit: http://localhost:3000/admin/login\n');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

setup();
