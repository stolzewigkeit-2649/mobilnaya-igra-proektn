const INDEX: Record<string, number> = { male: 0, female: 1, nonbinary: 2 };

export function gendered(text: string, gender: string): string {
  const i = INDEX[gender] ?? 0;
  return text.replace(/\{([^{}]+)\}/g, (_, body: string) => {
    const parts = body.split('|');
    return parts[Math.min(i, parts.length - 1)] ?? parts[0];
  });
}
