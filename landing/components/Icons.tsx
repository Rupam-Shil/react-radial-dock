// Lucide-style SVG icons. Single source of truth for the page.

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const base = (children: React.ReactNode, p: IconProps = {}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={p.strokeWidth ?? 1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={p.size}
    height={p.size}
    className={p.className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const StarIcon = (p: IconProps = {}) =>
  base(<path d="M12 2l2.7 6.3L21 9l-5 4.3L17.5 21 12 17.5 6.5 21 8 13.3 3 9l6.3-.7z" />, p);

export const EditIcon = (p: IconProps = {}) =>
  base(
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>,
    p,
  );

export const BookmarkIcon = (p: IconProps = {}) =>
  base(<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />, p);

export const PinIcon = (p: IconProps = {}) =>
  base(
    <>
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.4-3.5a3 3 0 0 1-.6-1.8V5H7v6.7c0 .6-.2 1.2-.5 1.7L5 17z" />
    </>,
    p,
  );

export const ShareIcon = (p: IconProps = {}) =>
  base(
    <>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </>,
    p,
  );

export const TrashIcon = (p: IconProps = {}) =>
  base(
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>,
    p,
  );

export const CopyIcon = (p: IconProps = {}) =>
  base(
    <>
      <rect x="9" y="9" width="13" height="13" rx="1" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>,
    p,
  );

export type IconKey = 'star' | 'edit' | 'mark' | 'pin' | 'share' | 'trash';

export const ICON_BY_KEY: Record<IconKey, () => React.ReactElement> = {
  star: () => <StarIcon />,
  edit: () => <EditIcon />,
  mark: () => <BookmarkIcon />,
  pin: () => <PinIcon />,
  share: () => <ShareIcon />,
  trash: () => <TrashIcon />,
};
