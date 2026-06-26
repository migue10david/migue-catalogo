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

const WEBP_QUALITY = 0.86;

export function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the selected image"));
    };

    image.src = objectUrl;
  });
}

export function getResizedDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

export async function convertImageToWebp(
  file: File,
  options: {
    maxWidth: number;
    maxHeight: number;
  },
) {
  const image = await loadImage(file);
  const { width, height } = getResizedDimensions(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    options.maxWidth,
    options.maxHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser could not process the selected image");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
  });

  if (!blob) {
    throw new Error("Could not compress the selected image");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
