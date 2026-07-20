import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { hasAdminNotificationEnv, sendAdminSubmissionNotification } = await import("./notifications");

describe("admin submission notifications", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("RESEND_FROM_EMAIL", "The Voyage Club <notifications@example.com>");
    vi.stubEnv("ADMIN_NOTIFICATION_EMAILS", "admin@example.com, second@example.com");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://voyage.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends an idempotent email with a secure dashboard link", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendAdminSubmissionNotification({
      id: "11111111-1111-4111-8111-111111111111",
      table: "membership_applications",
      payload: { full_name: "Aarav <Sharma>", email: "aarav@example.com" }
    });

    expect(result).toEqual({ status: "sent" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, request] = fetchMock.mock.calls[0];
    expect(request.headers["Idempotency-Key"]).toBe(
      "new-membership_applications-11111111-1111-4111-8111-111111111111"
    );
    const body = JSON.parse(request.body);
    expect(body.to).toEqual(["admin@example.com", "second@example.com"]);
    expect(body.text).toContain("https://voyage.example.com/admin?view=membership_applications");
    expect(body.html).toContain("Aarav &lt;Sharma&gt;");
    expect(body.html).not.toContain("Aarav <Sharma>");
  });

  it("skips delivery when email alerts are not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(hasAdminNotificationEnv()).toBe(false);
    await expect(sendAdminSubmissionNotification({
      id: "22222222-2222-4222-8222-222222222222",
      table: "contact_inquiries",
      payload: { name: "Visitor", email: "visitor@example.com" }
    })).resolves.toEqual({ status: "skipped" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports provider failures without throwing into the submission flow", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(sendAdminSubmissionNotification({
      id: "33333333-3333-4333-8333-333333333333",
      table: "recruitment_applications",
      payload: { full_name: "Applicant", email: "applicant@example.com" }
    })).resolves.toEqual({ status: "failed" });
  });
});
