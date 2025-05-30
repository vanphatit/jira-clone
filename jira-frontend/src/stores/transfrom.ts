import { createTransform } from "redux-persist";

// Remove accessToken field from auth slice before saving
export const authTransform = createTransform(
  // Called when state is being saved to storage
  (inboundState: any) => {
    if (!inboundState) return inboundState;
    // Only remove accessToken
    const { accessToken, ...rest } = inboundState;
    return rest;
  },
  // Called when state is being loaded from storage
  (outboundState: any) => {
    if (!outboundState) return outboundState;
    return {
      ...outboundState,
      accessToken: null, // Always null after rehydrate
    };
  },
  { whitelist: ["auth"] }
);
