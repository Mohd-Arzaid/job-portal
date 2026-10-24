
/*
 * 1. GET TIME AGO HELPER
 * Date string ko human-readable relative time format mein convert karta hai
 * Purpose -> Job kab post hui thi user ko easily samajh aane wale format mein dikhana
 *
 * Example:
 * - Aaj post hui -> "Today"
 * - 1 din pehle -> "1 day ago"
 * - 5 din pehle -> "5 days ago"
 * - 40 din pehle -> "1 mo ago"
 * - Date missing ho -> "Recently"
 */

export function getTimeAgo(dateString) {
  // Agar date nahi hai toh fallback "Recently" return karo
  if (!dateString) return "Recently";

  const now = new Date();
  const past = new Date(dateString);

  // Milliseconds difference calculate karo
  const diffInMs = now.getTime() - past.getTime();

  // Milliseconds ko days mein convert karo (1000ms * 60s * 60m * 24h)
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;

  // 30 din se zyada ho toh months mein convert karo
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} mo ago`;
}

/*
 * 2. FORMAT FULL DATE HELPER
 * Date string ko standard Indian locale readable date format mein convert karta hai
 * Purpose -> Job Details page par exact posting date dikhana
 *
 * Example:
 * - "2026-10-24T00:00:00.000Z" -> "24 Oct 2026"
 * - null ya undefined -> "Not disclosed"
 */
export function formatDate(dateString) {
  // Agar date nahi di gayi toh "Not disclosed" return karo
  if (!dateString) return "Not disclosed";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
