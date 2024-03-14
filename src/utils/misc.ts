export function getNameInitials(name: string): string {
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0));
  return initials.join("");
}

export function toTitleCase(input: string): string {
  return input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}