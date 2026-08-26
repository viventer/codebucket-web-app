import { FileIcon, XIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  fileTypeLabel,
  formatFileSize,
  type SelectedAttachment,
} from "@/lib/contact/contact-form-helpers";

type ContactSelectedAttachmentProps = {
  attachment: SelectedAttachment;
  disabled: boolean;
  onRemove: (id: string) => void;
};

export function ContactSelectedAttachment({
  attachment,
  disabled,
  onRemove,
}: ContactSelectedAttachmentProps) {
  return (
    <Attachment className="w-full max-w-full" state="done">
      {attachment.previewUrl ? (
        <AttachmentMedia variant="image">
          <img src={attachment.previewUrl} alt="" />
        </AttachmentMedia>
      ) : (
        <AttachmentMedia>
          <FileIcon />
        </AttachmentMedia>
      )}
      <AttachmentContent>
        <AttachmentTitle>{attachment.file.name}</AttachmentTitle>
        <AttachmentDescription>
          {fileTypeLabel(attachment.file)} · {formatFileSize(attachment.file.size)}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction
          type="button"
          disabled={disabled}
          aria-label={`Usuń ${attachment.file.name}`}
          onClick={() => onRemove(attachment.id)}
        >
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}
