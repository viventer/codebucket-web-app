import { flattenError } from "zod";

import {
  contactInputSchema,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS,
  type ContactReasonValue,
} from "@/schemas/contactSchema";

export type ContactFieldErrors = {
  reason?: string;
  email?: string;
  message?: string;
  attachments?: string;
  form?: string;
};

export type SelectedAttachment = {
  id: string;
  file: File;
  previewUrl: string | null;
};

export const ATTACHMENT_COUNT_ERROR = `Możesz dodać maksymalnie ${MAX_ATTACHMENTS} załączniki.`;
export const ATTACHMENT_SIZE_ERROR =
  "Każdy załącznik może mieć maksymalnie 8 MB.";
export const CONTACT_SUBMIT_ERROR =
  "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.";
export const CONTACT_ATTACHMENT_ACCEPT = "image/*,.pdf,.txt,.zip,.log";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileTypeLabel(file: File): string {
  const subtype = file.type.split("/")[1];
  if (subtype) {
    return subtype.toUpperCase();
  }
  const extension = file.name.split(".").pop();
  return extension ? extension.toUpperCase() : "Plik";
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function createSelectedAttachments(
  files: File[],
): SelectedAttachment[] {
  return files.map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    previewUrl: isImageFile(file) ? URL.createObjectURL(file) : null,
  }));
}

export function revokeAttachmentPreview(attachment: SelectedAttachment) {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}

export function getAttachmentSelectionError(
  currentCount: number,
  selected: File[],
): string | undefined {
  if (currentCount + selected.length > MAX_ATTACHMENTS) {
    return ATTACHMENT_COUNT_ERROR;
  }
  if (selected.some((file) => file.size > MAX_ATTACHMENT_BYTES)) {
    return ATTACHMENT_SIZE_ERROR;
  }
  return undefined;
}

export function getContactFieldErrors(input: {
  reason: ContactReasonValue | undefined;
  email: string;
  message: string;
  files: File[];
}): ContactFieldErrors | null {
  const parsed = contactInputSchema.safeParse({
    reason: input.reason,
    email: input.email,
    message: input.message,
  });

  const errors: ContactFieldErrors = {};

  if (!parsed.success) {
    const fieldErrors = flattenError(parsed.error).fieldErrors;
    errors.reason = fieldErrors.reason?.[0];
    errors.email = fieldErrors.email?.[0];
    errors.message = fieldErrors.message?.[0];
  }

  const attachmentError = getAttachmentSelectionError(0, input.files);
  if (attachmentError) {
    errors.attachments = attachmentError;
  }

  if (
    errors.reason ||
    errors.email ||
    errors.message ||
    errors.attachments
  ) {
    return errors;
  }

  return null;
}

export function buildContactFormData(input: {
  reason: ContactReasonValue;
  email: string;
  message: string;
  files: File[];
}): FormData {
  const formData = new FormData();
  formData.set("reason", input.reason);
  formData.set("email", input.email);
  formData.set("message", input.message);
  for (const file of input.files) {
    formData.append("attachments", file);
  }
  return formData;
}
