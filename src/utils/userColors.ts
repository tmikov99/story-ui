export function stringToHslColor(str: string | undefined, s = 30, l = 80) {
  if (!str) {
    return `hsl(160, ${s}%, ${l}%)`;
  }
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}