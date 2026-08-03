import { useEffect } from 'react';

export default function BadgeToast({ badges, onDone }) {
  useEffect(() => {
    if (badges.length > 0) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [badges, onDone]);

  if (!badges.length) return null;

  return (
    <div className="badge-toast" role="status" aria-live="polite">
      🏅 Badge Unlocked: {badges[0]}
    </div>
  );
}
