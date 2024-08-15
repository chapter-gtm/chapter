import React, { useEffect, useState } from "react";
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


export const getTimeAgo = (timestamp: string | number | Date): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  return `${years} years ago`;
};