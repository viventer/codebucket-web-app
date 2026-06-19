import { toast as sonnerToast, type ExternalToast } from "sonner";

export const toast = {
  success: (message: string, options?: ExternalToast) =>
    sonnerToast.success(message, options),
  warning: (message: string, options?: ExternalToast) =>
    sonnerToast.warning(message, options),
  error: (message: string, options?: ExternalToast) =>
    sonnerToast.error(message, options),
  info: (message: string, options?: ExternalToast) =>
    sonnerToast.info(message, options),
};

export function useToast() {
  return { toast };
}
