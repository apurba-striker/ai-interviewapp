"use client";

import { SignIn } from "@clerk/nextjs";

export default function TestSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test Sign In</h1>
        <SignIn />
      </div>
    </div>
  );
} 
