"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      // Send verification email
      await sendEmailVerification(user);

      // Redirect to verify-email page
      router.push("/verify-email");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
