export function getNameInitials(name: string): string {
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0));
  return initials.join("");
}

export function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(?:^|_)\w/g, (char) => char.toUpperCase())
    .replace(/_/g, " ");
}

export function titleCaseToCamelCase(titleCaseString: string): string {
  return titleCaseString
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase());
}

export function humanDate(date: Date, showTime: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };

  if (showTime) {
    options["minute"] = "2-digit";
    options["hour"] = "2-digit";
    options["timeZoneName"] = "short";
  }

  if (date === null) {
    return "";
  }

  return date.toLocaleDateString(undefined, options);
}
