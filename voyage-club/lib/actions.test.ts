import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminContentTable, SubmissionTable } from "./types";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: vi.fn(() => null) }))
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  })
}));

vi.mock("./auth", () => ({
  requireAdmin: vi.fn()
}));

vi.mock("./notifications", () => ({
  sendAdminSubmissionNotification: vi.fn(async () => ({ status: "sent" }))
}));

vi.mock("./supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
  createSupabaseServiceClient: vi.fn(),
  hasSupabaseEnv: vi.fn(() => true)
}));

const { createContent, submitMembershipApplication, updateSubmission } = await import("./actions");
const { requireAdmin } = await import("./auth");
const { sendAdminSubmissionNotification } = await import("./notifications");
const { createSupabaseServerClient, createSupabaseServiceClient } = await import("./supabase/server");

const mockedRequireAdmin = vi.mocked(requireAdmin);
const mockedNotification = vi.mocked(sendAdminSubmissionNotification);
const mockedServerClient = vi.mocked(createSupabaseServerClient);
const mockedServiceClient = vi.mocked(createSupabaseServiceClient);

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("admin server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an invalid content table before opening the admin service client", async () => {
    const result = await createContent("admin_users" as AdminContentTable, null, formData({}));

    expect(result).toEqual({ ok: false, message: "Choose a valid admin section." });
    expect(mockedRequireAdmin).not.toHaveBeenCalled();
  });

  it("rejects an invalid submission queue before opening the admin service client", async () => {
    const result = await updateSubmission("admin_users" as SubmissionTable, null, formData({}));

    expect(result).toEqual({ ok: false, message: "Choose a valid review queue." });
    expect(mockedRequireAdmin).not.toHaveBeenCalled();
  });

  it("rejects a status that does not belong to the selected submission queue", async () => {
    const result = await updateSubmission(
      "membership_applications",
      null,
      formData({
        id: "11111111-1111-4111-8111-111111111111",
        status: "attended"
      })
    );

    expect(result).toEqual({ ok: false, message: "Choose a valid status." });
    expect(mockedRequireAdmin).not.toHaveBeenCalled();
  });

  it("updates a valid submission through the admin service client", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));

    mockedRequireAdmin.mockResolvedValue({
      user: { id: "22222222-2222-4222-8222-222222222222" },
      service: { from }
    } as never);

    const result = await updateSubmission(
      "membership_applications",
      null,
      formData({
        id: "11111111-1111-4111-8111-111111111111",
        status: "approved",
        notes: "Welcome aboard"
      })
    );

    expect(result).toEqual({ ok: true, message: "Submission updated." });
    expect(from).toHaveBeenCalledWith("membership_applications");
    expect(update).toHaveBeenCalledWith({
      status: "approved",
      notes: "Welcome aboard",
      reviewed_at: expect.any(String),
      reviewed_by: "22222222-2222-4222-8222-222222222222"
    });
    expect(eq).toHaveBeenCalledWith("id", "11111111-1111-4111-8111-111111111111");
  });
});

describe("public membership submissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the application before notifying administrators", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    mockedServerClient.mockResolvedValue({ from } as never);
    mockedServiceClient.mockReturnValue({ rpc } as never);

    const result = await submitMembershipApplication(null, formData({
      full_name: "Aarav Sharma",
      email: "AARAV@example.com",
      phone: "+91 9876543210",
      student_id: "24BCS001",
      program: "B.Tech CSE",
      year: "2",
      interests: "Public policy and event operations"
    }));

    expect(result.ok).toBe(true);
    expect(rpc).toHaveBeenCalledWith("consume_rate_limit", expect.any(Object));
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      full_name: "Aarav Sharma",
      email: "aarav@example.com",
      status: "pending"
    }));
    expect(mockedNotification).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      table: "membership_applications"
    }));
    expect(insert.mock.invocationCallOrder[0]).toBeLessThan(mockedNotification.mock.invocationCallOrder[0]);
  });
});
