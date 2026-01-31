interface TulipLogoProps {
  className?: string;
}

export function TulipLogo({ className }: TulipLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 17C14.5 17 17 14 17 9V5C17 3 15 2 14 2C13 2 12 4 12 4C12 4 11 2 10 2C9 2 7 3 7 5V9C7 14 9.5 17 12 17Z" />
      <path d="M12 17C12 17 11.5 20 12 22" />
    </svg>
  );
}
