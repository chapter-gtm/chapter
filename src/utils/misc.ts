export function getNameInitials(name: string): string {
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0));
  return initials.join("");
}
