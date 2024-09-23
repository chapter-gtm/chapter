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

export function timeAgo(date: Date): string {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units: { [key: string]: number } = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const unit in units) {
    const timeInterval = Math.floor(secondsAgo / units[unit]);
    if (timeInterval >= 1) {
      return `${timeInterval} ${unit}${timeInterval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function getURL(input: string): string {
  try {
    const url = new URL(input);
    return url.href;
  } catch (error) {
    return `https://${input}`;
  }
}

export function truncateString(str: string, maxLength: number = 30): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 1) + "…";
}
