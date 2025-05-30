"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAcceptInvite } from "@/features/workspaces/api/use-accept-invite";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/stores/hooks";
import { fetchWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

const AcceptInvitePage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { mutateAsync: acceptInvite } = useAcceptInvite();
  const [loading, setLoading] = useState(true);

  const workspaceId = params.get("workspaceId");
  const inviteEmail = params.get("email");

  // Redux user
  const user = useAppSelector((state) => state.auth.user);

  // Fix: prevent double execution
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // guard: only run once
    hasRun.current = true;

    const handleAcceptInvite = async () => {
      if (!workspaceId || !inviteEmail) {
        toast.error("Invalid invite link.");
        router.push("/");
        return;
      }

      if (user?.email?.toLowerCase() !== inviteEmail.toLowerCase()) {
        toast.error("This invite is not for your account.");
        router.push("/");
        return;
      }

      try {
        await acceptInvite({ workspaceId, email: inviteEmail });
        toast.success("Successfully joined the workspace!");
        await fetchWorkspaces()
        router.push("/");
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to accept invitation");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    handleAcceptInvite();
  }, [workspaceId, inviteEmail, acceptInvite, router, user?.email]);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        {loading ? (
          <>
            <Spinner className="mx-auto mb-4" />
            <p className="text-lg font-semibold">Accepting invitation...</p>
          </>
        ) : (
          <p className="text-lg font-semibold">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;
