# Appwrite Setup Guide

This guide will walk you through setting up your Appwrite Cloud environment to match the expectations of the BKBK application backend infrastructure.

## Phase 1: Registration and Project Setup
1. Go to [Appwrite Cloud](https://cloud.appwrite.io/) and sign up or log in.
2. Click **Create Project** and give it a name (e.g., "BKBK CMS").
3. Inside your project, navigate to the **Settings** gear icon.
4. Copy the **Project ID** and grab the **API Endpoint** (usually `https://cloud.appwrite.io/v1`).
5. Open your `.env.local` file and add the following:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id_here
   ```

## Phase 2: Create the Database
1. Go to the **Databases** tab on the left sidebar.
2. Click **Create database** and name it "BKBK Database".
3. Copy the **Database ID** that was generated and add it to `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
   ```

## Phase 3: Setup 'Posts' Collection
1. Inside your new "BKBK Database", click **Create collection**.
2. Name the collection **"Posts"**.
3. Copy the **Collection ID** and add it to `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID=your_posts_collection_id_here
   ```
4. Click on the "Posts" collection and navigate to the **Attributes** tab. Create the following attributes exactly as spelt (all are standard fields, none need to be arrays unless specified):
   - `title` (Type: **String**, Size: 255, Required: Yes)
   - `slug` (Type: **String**, Size: 255, Required: Yes)
   - `content` (Type: **String**, Size: 65535, Required: No)
   - `excerpt` (Type: **String**, Size: 1000, Required: No)
   - `published_at` (Type: **Datetime**, Required: No)
   - `created_at` (Type: **Datetime**, Required: No)
   - `featured_image` (Type: **URL**, Required: No)
   - `status` (Type: **String**, Size: 50, Required: Yes, Default: "published")
   - `author_id` (Type: **String**, Size: 50, Required: Yes)
5. Navigate to the **Settings** tab of the "Posts" Collection. Under **Permissions**, click "Add Role" and select **Any**. Check the box for **"Read"**, so the public website has permission to fetch the blog posts.

## Phase 4: Setup 'Users' Collection
1. Still inside "BKBK Database", click **Create collection** again.
2. Name the collection **"Users"**.
3. Copy the **Collection ID** and add it to `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id_here
   ```
4. In the **Attributes** tab of the Users Collection, create:
   - `full_name` (Type: **String**, Size: 255, Required: Yes)
   - `username` (Type: **String**, Size: 255, Required: No)
   - `role` (Type: **String**, Size: 50, Required: Yes, Default: "admin")
   - `updated_at` (Type: **Datetime**, Required: No)

## Phase 5: Setup Storage for Images
1. Click the **Storage** tab on the left sidebar.
2. Click **Create bucket** and name it "Images".
3. Copy the **Bucket ID** and add it to your `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id_here
   ```
4. Navigate to the **Settings** tab of this bucket. Under **Permissions**, add the **Any** role and check **"Read"** (so images are accessible by public site visitors).

## Phase 6: Generate the Admin API Key
1. Go to the project **Overview** page.
2. Scroll to the **Integrations** section at the bottom, and click on **API Keys**.
3. Click **Create API Key**. Name it "NextJS Admin API".
4. Check the following scopes (permissions) to allow your backend code to manage everything securely:
   - `users.read`, `users.write` (Account Operations)
   - `databases.read`, `databases.write` (Database CRUD)
   - `collections.read`, `collections.write` (Collection management)
   - `documents.read`, `documents.write` (Reading/Writing your Posts)
   - `files.read`, `files.write` (Uploading Image files)
5. Save and **copy the API Key Secret**.
6. Paste it into your `.env.local`:
   ```env
   APPWRITE_API_KEY=your_copied_secret_string
   ```

## Final Step: Initial Admin Login

1. Now that everything is created, go to the **Auth** tab in Appwrite.
2. Create your first user via the dashboard manually: Click **Create User**. Enter your Administrator email and password.
3. This creates your admin identity which you can now use to log in securely at `/admin/login`. 

You are fully set! Simply restart your Next.js development server to pick up the new `.env.local` keys.
