export const formatStoryReads = (reads: number | undefined): string => {
  if (!reads) return "0 reads";

  if (reads >= 1_000_000) {
    return `${(reads / 1_000_000).toFixed(1).replace(/\.0$/, '')}M reads`;
  }

  if (reads >= 1_000) {
    return `${(reads / 1_000).toFixed(1).replace(/\.0$/, '')}K reads`;
  }

  return `${reads} ${reads === 1 ? 'read' : 'reads'}`;
};

export const getStatFormatting = (stat: number | undefined):string => {
  if (!stat) return "+0";

  const statSign = Math.sign(stat) >= 0 ? "+" : "-";
  return `${statSign}${Math.abs(stat)}`;
}