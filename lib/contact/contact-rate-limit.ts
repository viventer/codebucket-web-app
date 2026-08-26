import "server-only";

import { MAX_CONTACT_PER_DAY } from "@/schemas/contactSchema";
import { getRedis } from "@/lib/redis/redis";

const WARSAW_TIME_ZONE = "Europe/Warsaw";

export type ReserveContactSlotResult =
  | { ok: true }
  | { ok: false; reason: "limit" }
  | { ok: false; reason: "unavailable" };

function getWarsawDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: WARSAW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function warsawDateKey(date = new Date()): string {
  const { year, month, day } = getWarsawDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function secondsUntilNextWarsawMidnight(date = new Date()): number {
  const { hour, minute, second } = getWarsawDateParts(date);
  const elapsed = hour * 3600 + minute * 60 + second;
  return Math.max(24 * 3600 - elapsed, 1);
}

function rateLimitKey(uid: string, date = new Date()): string {
  return `contact:rl:${uid}:${warsawDateKey(date)}`;
}

export async function reserveContactSlot(
  uid: string,
): Promise<ReserveContactSlotResult> {
  try {
    const redis = getRedis();
    const key = rateLimitKey(uid);
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, secondsUntilNextWarsawMidnight());
    }

    if (count > MAX_CONTACT_PER_DAY) {
      return { ok: false, reason: "limit" };
    }

    return { ok: true };
  } catch (error) {
    console.error("reserveContactSlot failed:", error);
    return { ok: false, reason: "unavailable" };
  }
}

export async function releaseContactSlot(uid: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.decr(rateLimitKey(uid));
  } catch (error) {
    console.error("releaseContactSlot failed:", error);
  }
}
