import { useId } from "react";

export default function BrandMark({ size = 34 }: { size?: number }) {
  const uid = useId();
  const bgId = `${uid}-bg`;
  const sheenId = `${uid}-sheen`;
  const clipId = `${uid}-clip`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={bgId}
          x1="10"
          y1="6"
          x2="54"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--brand-stop-1, #a888eb)" />
          <stop offset="52%" stopColor="var(--brand-stop-2, #805ad4)" />
          <stop offset="100%" stopColor="var(--brand-stop-3, #5d39ad)" />
        </linearGradient>
        <linearGradient
          id={sheenId}
          x1="32"
          y1="2"
          x2="32"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="29" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${bgId})`} />
      <circle
        cx="32"
        cy="32"
        r="29"
        stroke="#ffffff"
        strokeOpacity="0.38"
        strokeWidth="1.5"
      />
      <ellipse
        cx="32"
        cy="14"
        rx="24"
        ry="15"
        fill={`url(#${sheenId})`}
        clipPath={`url(#${clipId})`}
      />
      <circle cx="29" cy="18" r="3.35" fill="#ffffff" />
      <path
        d="M29 26V40.4C29 45.2 25.8 48.2 21.2 48.2C19.8 48.2 18.6 47.9 17.6 47.4"
        stroke="#ffffff"
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42.5" cy="36.2" r="3.45" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  );
}
