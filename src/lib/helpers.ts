export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const deg = (d: number): number => (d * Math.PI) / 180;
