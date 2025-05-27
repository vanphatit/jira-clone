"use client";

import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";
import { useLogout } from "@/features/auth/api/use-logout";

export default function Home() {
  const user = useAuthStore((state) => state.user);

  const { mutate: logout } = useLogout()

  return (
    <main className="p-6">
      {user ? (
        <>
          <div className="mb-6 flex items-center space-x-4">
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-blue-600">{user.status}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-gray-600 mb-6">Not logged in</p>
      )}
    </main>
  );
}
