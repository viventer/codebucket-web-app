import { PlusIcon } from "lucide-react";

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { MAX_ATTACHMENTS } from "@/schemas/contactSchema";

type ContactAddAttachmentProps = {
  disabled: boolean;
  onClick: () => void;
};

export function ContactAddAttachment({
  disabled,
  onClick,
}: ContactAddAttachmentProps) {
  return (
    <Attachment state="idle" className="w-full max-w-full">
      <AttachmentMedia>
        <PlusIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Dodaj załączniki</AttachmentTitle>
        <AttachmentDescription>
          Maks. {MAX_ATTACHMENTS} pliki, do 8 MB każdy.
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger
        aria-label="Dodaj załączniki"
        disabled={disabled}
        onClick={onClick}
      />
    </Attachment>
  );
}
