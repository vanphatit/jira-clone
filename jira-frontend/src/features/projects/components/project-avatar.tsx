import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface ProjectAvatarProps {
  image?: string;
  name?: string;
  className?: string;
}

export const ProjectAvatar = ({
    image, 
    name, className
}: ProjectAvatarProps) => {
    // if(image) {
    //     return (
    //         <div className={cn(
    //             "size-10 relative rounded-md overflow-hidden", className
    //         )}>
    //             <Image src={image || ""} alt="name" fill className="object-cover" />
    //         </div>
    //     )
    // }

    return (
        <Avatar className={cn("size-6 rounded-md", className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-xs uppercase rounded-md">
                {name ? name.charAt(0) : "W"}
            </AvatarFallback>
        </Avatar>
    )
}