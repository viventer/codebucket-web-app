import { Timestamp } from "firebase-admin/firestore";

export function dateToFirestoreTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function firestoreTimestampToDate(
  value: Timestamp | Date | string,
): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    return new Date(value);
  }

  return value.toDate();
}
