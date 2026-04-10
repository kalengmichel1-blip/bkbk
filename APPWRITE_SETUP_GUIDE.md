# Manual Appwrite Setup Guide

Your `.env.local` template has been created at `.env.local`. Follow these steps to fill it in:

## Step 1: Access Appwrite Dashboard

Go to: **http://localhost/console** 

Wait for it to load (may take 1-2 minutes on first start).

## Step 2: Create Project

1. Click **Create Project**
2. Name: `BKBK CMS`
3. Copy the **Project ID** to `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT=<project_id>
   ```

## Step 3: Create Database

1. In your project, go to **Databases**
2. Click **Create Database**
3. Name: `BKBK Database`
4. Copy the **Database ID** to `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=<database_id>
   ```

## Step 4: Create Collections

### 4.1 Posts Collection
1. In your database, click **Create Collection**
2. Name: `Posts`
3. Copy the **Collection ID** to `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID=<posts_collection_id>
   ```
4. Click on the Posts collection → **Attributes** tab
5. Add these attributes:
   - `title` (String, 255, Required)
   - `slug` (String, 255, Required)
   - `content` (String, 65535)
   - `excerpt` (String, 1000)
   - `published_at` (DateTime)
   - `created_at` (DateTime)
   - `featured_image` (URL)
   - `status` (String, 50, Required, Default: "published")
   - `author_id` (String, 50, Required)
6. Go to **Settings** tab → **Permissions**, add role **Any** with **Read** access

### 4.2 Users Collection
1. In your database, click **Create Collection**
2. Name: `Users`
3. Copy the **Collection ID** to `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=<users_collection_id>
   ```
4. Click on the Users collection → **Attributes** tab
5. Add these attributes:
   - `full_name` (String, 255, Required)
   - `username` (String, 255)
   - `role` (String, 50, Required, Default: "admin")
   - `updated_at` (DateTime)

## Step 5: Create Storage Bucket

1. Go to **Storage** tab
2. Click **Create Bucket**
3. Name: `Images`
4. Copy the **Bucket ID** to `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=<bucket_id>
   ```
5. Go to **Settings** → **Permissions**, add role **Any** with **Read** access

## Step 6: Create API Key

1. From project **Overview**, scroll to **Integrations** → **API Keys**
2. Click **Create API Key**
3. Name: `BKBK Admin API`
4. Add these scopes:
   - `users.read`
   - `users.write`
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`
   - `files.read`
   - `files.write`
   - `buckets.read`
   - `buckets.write`
5. Copy the **secret key** to `.env.local`:
   ```
   APPWRITE_API_KEY=<api_key>
   ```

## Step 7: Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 8: Import Articles

```bash
node scripts/import-appwrite-posts.mjs
```

This will import all ~600 articles from `content/posts.json` to Appwrite.

## Step 9: Access Admin Dashboard

Go to: http://localhost:3000/admin/login

**Login credentials:**
- Email: `admin@bkbk.local`
- Password: `Admin@1234567890`

(Create an admin user in Appwrite Auth first if needed)
