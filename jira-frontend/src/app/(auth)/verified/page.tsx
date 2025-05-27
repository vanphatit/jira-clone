"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

const VerifiedPage = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 w-full max-w-md text-center">
      <div className="mb-6 mt-5">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Email verified successfully!
        </h1>
        <p className="text-gray-600 text-sm">
          Your account is ready. Welcome to the platform!
        </p>
      </div>

      <Link
        href="/dashboard"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6 inline-block"
      >
        Continue to Dashboard
      </Link>

      <div className="text-center mb-8 space-y-2">
        <Link
          href="/profile"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium block"
        >
          Set up your profile
        </Link>
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 text-sm block"
        >
          Back to Home
        </Link>
      </div>

      <div className="text-xs text-gray-500">
        You now have access to all platform features.
      </div>
    </div>
  );
};

export default VerifiedPage;
