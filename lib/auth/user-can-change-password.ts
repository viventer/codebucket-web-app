import { adminAuth } from "@/firebase/admin-init";

export async function userCanChangePassword(uid: string): Promise<boolean> {
  const userRecord = await adminAuth.getUser(uid);
  return userRecord.providerData.some(
    (provider) => provider.providerId === "password",
  );
}
