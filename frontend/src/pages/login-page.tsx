import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AuthContext } from "../context/auth-context";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            if (!resp.ok) {
                const {message} = await resp.json();
                setError(message || "Login failed");
                return;
            }

            const {token} = await resp.json();
            auth?.setToken(token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Network error");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm space-y-4 rounded-lg bg-white p-8 shadow"
            >
                <h1 className="text-2xl font-semibold text-gray-700 text-center">
                    Admin Login
                </h1>

                {error && (
                    <div className="rounded bg-red-100 px-4 py-2 text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="mt-1 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-1 w-full"
                    />
                </div>

                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </div>
    );
}