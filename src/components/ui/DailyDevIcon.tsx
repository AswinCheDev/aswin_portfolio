// src/components/ui/DailyDevIcon.tsx
import React from 'react';

export const DailyDevIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>daily.dev</title>
    <path d="M12 0A12 12 0 0 0 .7 14.55v.72h1.94v-2.3c0-4.8 3.5-8.73 7.93-8.73a8 8 0 0 1 8 8c0 4.41-3.58 8-8 8-3.32 0-6.15-2.2-7.37-5.26H1.07A12 12 0 0 0 12 24a12 12 0 0 0 0-24zM4.6 15.28c.4 1.76 1.7 3.12 3.3 3.65v-3.3c-.3-.2-.5-.49-.5-.86h-2.8zm.9-.73H8v-2.14H5.5zm1.18-2.87H8V9.54H6.68zm1.9 0H10.7V9.54H8.58zm2.84 0H13V9.54h-1.58zM8.58 12.4H10.7v-2.14H8.58zm2.84 0H13v-2.14h-1.58zm2.14 2.87v3.3c.42-.14.8-.35 1.15-.6v-2.7zm1.12-5.74V7.4a5.2 5.2 0 0 0-4.52-5.13v2.87c.2.04.4.1.58.17v-.72c.3-.2.66-.3 1.05-.3.9 0 1.63.73 1.63 1.63s-.73 1.64-1.63 1.64c-.4 0-.75-.1-1.05-.3v-.72c-.18.07-.37.13-.58.17v2.87z" />
  </svg>
);