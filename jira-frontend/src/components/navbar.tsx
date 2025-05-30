import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"
import { useAppSelector } from "@/stores/hooks";

export const Navbar = () => {
    
      const { projects, currentProjectId} = useAppSelector((state) => state.project);
    
      const currentProject = projects.find(
        (p) => p._id === currentProjectId
      );
      
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">{currentProject?.name} - Dashboard</h1>
                <p className="text-muted-foreground">Monitor all of your projects and tasks</p>
            </div>
            <UserButton />
            <MobileSidebar />
        </nav>
    )
}