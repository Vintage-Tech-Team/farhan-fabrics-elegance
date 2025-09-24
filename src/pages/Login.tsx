import { useState } from "react";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithOtp(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-lg border p-6 shadow-sm"
      >
        <h1 className="mb-4 text-2xl font-semibold">Login</h1>
        {sent ? (
          <p className="text-sm text-gray-600">
            Check your email for the magic link.
          </p>
        ) : (
          <>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 w-full rounded border px-3 py-2"
            />
            {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            >
              Send magic link
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
