"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { useVerifyEmail } from "@/features/auth/api/use-verify-emails";
import { useResendCode } from "@/features/auth/api/use-resend-code";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const verifyEmail = useVerifyEmail();
  const resendCode = useResendCode();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      await verifyEmail.mutateAsync({ email, code: verificationCode });
      toast.success("Email verified successfully");
      router.push("/verified");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendCode.mutateAsync({ email });
      toast.success("Verification code resent!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-56 h-17 rounded-lg mx-auto flex items-center justify-center mb-4 pt-8">
          <Image src="/logo.svg" height={56} width={152} alt="logo"></Image>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          We've emailed you a code
        </h1>
        <p className="text-gray-600 text-sm">
          To complete your account setup, enter the code sent to:{" "}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 justify-center mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6"
      >
        Verify
      </button>

      <div className="text-center mb-8">
        <button
          onClick={handleResendEmail}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Didn't receive an email? Resend email
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
