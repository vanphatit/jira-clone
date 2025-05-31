import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"
import { useAppSelector } from "@/stores/hooks";

export const Navbar = () => {
    
      const { workspaces, currentWorkspaceId} = useAppSelector((state) => state.workspace);
    
      const currentWorkspace = workspaces.find(
        (p) => p._id === currentWorkspaceId
      );

      const title = currentWorkspace?.name + " | Workspace" || "Dashboard";
      
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-muted-foreground">Monitor all of your projects and tasks</p>
            </div>
            <UserButton />
            <MobileSidebar />
        </nav>
    )
}