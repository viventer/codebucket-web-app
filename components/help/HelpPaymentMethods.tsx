import Image from "next/image";

import { PAYMENT_METHODS } from "@/constants/help-page";

export function HelpPaymentMethods() {
  return (
    <div className="flex flex-col gap-3">
      {PAYMENT_METHODS.map((method) => (
        <p
          key={method.label}
          className="flex flex-wrap items-center gap-1.5 mb-0!"
        >
          {method.logos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={64}
              height={64}
              className="w-12 h-auto"
            />
          ))}
          <span>{method.label}</span>
        </p>
      ))}
    </div>
  );
}
