import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const variables = {};
envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...rest] = line.split('=');
        variables[key.trim()] = rest.join('=').trim();
    }
});

const keysToUpload = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT',
    'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
    'NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID',
    'APPWRITE_API_KEY'
];

for (const key of keysToUpload) {
    if (variables[key]) {
        console.log(`Uploading ${key}...`);
        try {
            // Using echo to pipe secret securely to wrangler
            execSync(`echo "${variables[key]}" | npx wrangler pages secret put ${key} --project-name bkbk-main`, { stdio: 'inherit' });
        } catch (e) {
            console.error(`Failed to upload ${key}.`);
        }
    } else {
        console.warn(`Key ${key} not found in .env.local.`);
    }
}
console.log("All Appwrite environments successfully uploaded to Cloudflare!");
