"use client";

import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setMessage("Verification email has been sent again. Please check your inbox/spam.");
    } catch (error) {
      console.error("Resend error:", error.message);
      setMessage("Failed to resend email. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
      <p className="mb-2 text-gray-700">We have sent a verification link</p>
      <p className="font-semibold text-blue-600">{user?.email}</p>
      <p className="mt-4 text-gray-600">
        Please check your inbox and click the link to verify your account.
      </p>

      <button
        onClick={handleResend}
        disabled={loading}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
