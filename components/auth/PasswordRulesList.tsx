import { XIcon } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/auth/password-validation";
import { ClientIcon } from "@/components/ui/client-icon";
import { cn } from "@/lib/utils";

type PasswordRulesListProps = {
  password: string;
  touched: boolean;
};

export function PasswordRulesList({
  password,
  touched,
}: PasswordRulesListProps) {
  const showResults = touched || password.length > 0;

  return (
    <ul className="mt-0.5 flex flex-col gap-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              showResults
                ? passed
                  ? "text-feedback-success"
                  : "text-feedback-destructive"
                : "text-muted-foreground",
            )}
          >
            {showResults ? (
              passed ? (
                <ClientIcon
                  src="checkCircle.svg"
                  size={12}
                  className="shrink-0"
                />
              ) : (
                <XIcon className="size-3 shrink-0" />
              )
            ) : (
              <span className="inline-block size-3 shrink-0 rounded-full border border-current" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
