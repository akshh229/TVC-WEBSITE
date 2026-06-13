"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ComponentPropsWithoutRef } from "react";
import type { ActionResult } from "@/lib/types";

const initialState: ActionResult | null = null;

function SubmitButton({ children, className = "btn primary" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? "Submitting..." : children}
    </button>
  );
}

type SmartFormProps = {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  buttonClassName?: string;
} & Omit<ComponentPropsWithoutRef<"form">, "action">;

export function SmartForm({ action, children, submitLabel, className = "form", buttonClassName, ...props }: SmartFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className={className} {...props}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`website-${submitLabel}`}>Website</label>
        <input id={`website-${submitLabel}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {children}
      <SubmitButton className={buttonClassName}>{submitLabel}</SubmitButton>
      {state ? (
        <div
          className={`notice ${state.ok ? "success" : "error"}`}
          role={state.ok ? "status" : "alert"}
          aria-live={state.ok ? "polite" : "assertive"}
        >
          <p>{state.message}</p>
          {state.fieldErrors ? (
            <ul>
              {Object.entries(state.fieldErrors).flatMap(([field, errors]) =>
                errors.map((error) => <li key={`${field}-${error}`}>{error}</li>)
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
