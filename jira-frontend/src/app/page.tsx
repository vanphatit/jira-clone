import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={24}
        height={24}
        className="inline-block mr-2"
      />
      Click Me
    </Button>
  );
}
