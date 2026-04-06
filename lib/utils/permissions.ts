export type UserRole = 'admin' | 'editor' | 'staff'

export const ROLES = {
    ADMIN: 'admin' as UserRole,
    EDITOR: 'editor' as UserRole,
    STAFF: 'staff' as UserRole,
}

export function canManageUsers(role?: string) {
    return role === ROLES.ADMIN
}

export function canDeletePost(role?: string) {
    return role === ROLES.ADMIN
}

export function canPublishPost(role?: string) {
    return role === ROLES.ADMIN || role === ROLES.EDITOR
}

export function canEditPost(role?: string) {
    return role === ROLES.ADMIN || role === ROLES.EDITOR || role === ROLES.STAFF
}
