import { LoginForm } from '@/components/admin/login-form'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8">Admin Login</h1>
            <LoginForm />
        </div>
    )
}
