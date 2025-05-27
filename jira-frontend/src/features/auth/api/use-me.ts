import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetcher";

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetchWithAuth("/auth/me");
            return res.json();
        },
    });
};
