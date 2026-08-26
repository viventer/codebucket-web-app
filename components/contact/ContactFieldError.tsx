type ContactFieldErrorProps = {
  id?: string;
  children: string;
};

export function ContactFieldError({ id, children }: ContactFieldErrorProps) {
  return (
    <p id={id} className="text-sm text-feedback-destructive" role="alert">
      {children}
    </p>
  );
}
