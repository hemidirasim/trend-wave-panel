
export const validateUrl = (platform: string, url: string): boolean => {
  const patterns: Record<string, RegExp> = {
    youtube: /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|channel\/|user\/)|youtu\.be\/)/i,
    instagram: /^https?:\/\/(www\.)?instagram\.com\//i,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\//i,
    facebook: /^https?:\/\/(www\.)?facebook\.com\//i,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
    telegram: /^https?:\/\/(www\.)?t\.me\//i,
  };

  const pattern = patterns[platform.toLowerCase()];
  return pattern ? pattern.test(url) : true;
};
