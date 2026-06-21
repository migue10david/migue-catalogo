export function getCoverGradient(name: string) {
  const gradients = [
    "from-amber-500/20 via-orange-400/15 to-rose-400/20",
    "from-emerald-500/20 via-teal-400/15 to-cyan-400/20",
    "from-violet-500/20 via-purple-400/15 to-fuchsia-400/20",
    "from-sky-500/20 via-blue-400/15 to-indigo-400/20",
    "from-rose-500/20 via-pink-400/15 to-red-400/20",
    "from-lime-500/20 via-green-400/15 to-emerald-400/20",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function getAccentBorder(name: string) {
  const accents = [
    "border-l-amber-400",
    "border-l-emerald-400",
    "border-l-violet-400",
    "border-l-sky-400",
    "border-l-rose-400",
    "border-l-lime-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return accents[Math.abs(hash) % accents.length];
}