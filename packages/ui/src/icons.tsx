import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const make = (d: string) => (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={d} /></svg>
);

export const Icon = {
  search: make("M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM21 21l-4.3-4.3"),
  send: make("M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"),
  sparkle: make("M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"),
  menu: make("M4 6h16M4 12h16M4 18h16"),
  x: make("M18 6 6 18M6 6l12 12"),
  check: make("M20 6 9 17l-5-5"),
  bell: make("M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"),
  arrow: make("M5 12h14M13 5l7 7-7 7"),
  upload: make("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"),
  bot: make("M12 8V4H8M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM9 13v2M15 13v2"),
  plus: make("M12 5v14M5 12h14"),
  chevron: make("M6 9l6 6 6-6"),
  heart: make("M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"),
  zap: make("M13 2 3 14h9l-1 8 10-12h-9l1-8z"),
  user: make("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z"),
  mail: make("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"),
  cube: make("M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12"),
  chart: make("M3 3v18h18M7 15l4-4 3 3 5-6"),
  info: make("M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01"),
  alert: make("M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"),
  layers: make("M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"),
  gamepad: make("M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-3.95 3.4L2 14.5A2.5 2.5 0 0 0 6.4 16l1.6-2h8l1.6 2a2.5 2.5 0 0 0 4.4-1.5l-.75-6.1A4 4 0 0 0 17.3 5z"),
  back: make("M19 12H5M12 19l-7-7 7-7"),
};
