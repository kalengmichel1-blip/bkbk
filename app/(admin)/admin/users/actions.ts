'use server'

import { createAdminClient } from "@/lib/appwrite/server"
import { revalidatePath } from "next/cache"
import { ID } from "node-appwrite"

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const USERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!

export async function createUser(firstName: string, email: string, password: string, role: string) {
    const { users: appwriteUsers, databases } = await createAdminClient()

    try {
        const user = await appwriteUsers.create(
            ID.unique(),
            email,
            undefined, // phone
            password,
            firstName
        );

        // Update preferences for role checking
        await appwriteUsers.updatePrefs(user.$id, { role: role });

        // Optional: save to databases profile collection
        await databases.createDocument(DB_ID, USERS_COLLECTION, user.$id, {
            full_name: firstName,
            username: email.split('@')[0],
            role: role,
            updated_at: new Date().toISOString()
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create user';
        return { error: message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function getUsers() {
    const { databases } = await createAdminClient()

    try {
        const result = await databases.listDocuments(DB_ID, USERS_COLLECTION);
        // Note: Sort logic will be added via Query later, assuming it's supported by indexes.
        return result.documents;
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

export async function updateUser(userId: string, fullName: string, role: string) {
    const { users: appwriteUsers, databases } = await createAdminClient()

    try {
        // 1. Update Document Profile
        await databases.updateDocument(DB_ID, USERS_COLLECTION, userId, {
            full_name: fullName,
            role: role,
            updated_at: new Date().toISOString()
        })

        // 2. Update Auth Name and Prefs (role)
        await appwriteUsers.updateName(userId, fullName);
        await appwriteUsers.updatePrefs(userId, { role: role });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update user';
        return { error: message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}
