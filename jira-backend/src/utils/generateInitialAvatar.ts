export const generateInitialsAvatar = (name: string): string => {
  const initials = name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  // Generate a basic base64 SVG
  const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#2563eb" />
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
          fill="white" font-size="40" font-family="Arial">${initials}</text>
      </svg>
    `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};
