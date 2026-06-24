import { describe, expect, it } from "vitest";
import {
  contactSchema,
  eventRegistrationSchema,
  eventSchema,
  fieldErrors,
  formDataObject,
  galleryItemSchema,
  teamMemberSchema
} from "./validation";

const validContact = {
  kind: "general",
  name: "Ada Lovelace",
  email: "Ada@Example.COM ",
  subject: "Hello there",
  message: "This is a message long enough to pass."
};

describe("contactSchema", () => {
  it("accepts a valid inquiry and normalizes the email", () => {
    const parsed = contactSchema.parse(validContact);
    expect(parsed.email).toBe("ada@example.com");
  });

  it("rejects a name that is too short", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a message under the minimum length", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid kind", () => {
    const result = contactSchema.safeParse({ ...validContact, kind: "spam" });
    expect(result.success).toBe(false);
  });

  it("treats a filled honeypot as invalid", () => {
    const result = contactSchema.safeParse({ ...validContact, website: "http://bot.example" });
    expect(result.success).toBe(false);
  });

  it("allows an empty honeypot", () => {
    const result = contactSchema.safeParse({ ...validContact, website: "" });
    expect(result.success).toBe(true);
  });
});

describe("eventSchema", () => {
  const validEvent = {
    title: "Launch Night",
    slug: "launch-night",
    category: "Social",
    date: "2026-07-01",
    location: "Main Hall",
    status: "upcoming",
    registration_status: "open",
    summary: "An evening to launch the new season.",
    is_published: "on"
  };

  it("accepts a valid event and coerces the checkbox", () => {
    const parsed = eventSchema.parse(validEvent);
    expect(parsed.is_published).toBe(true);
  });

  it("defaults an unchecked checkbox to false", () => {
    const parsed = eventSchema.parse({ ...validEvent, is_published: undefined });
    expect(parsed.is_published).toBe(false);
  });

  it("rejects a slug with invalid characters", () => {
    const result = eventSchema.safeParse({ ...validEvent, slug: "Launch Night!" });
    expect(result.success).toBe(false);
  });

  it("coerces a numeric capacity string", () => {
    const parsed = eventSchema.parse({ ...validEvent, capacity: "50" });
    expect(parsed.capacity).toBe(50);
  });

  it("rejects a zero or negative capacity", () => {
    expect(eventSchema.safeParse({ ...validEvent, capacity: "0" }).success).toBe(false);
    expect(eventSchema.safeParse({ ...validEvent, capacity: "-5" }).success).toBe(false);
  });
});

describe("eventRegistrationSchema", () => {
  it("requires a uuid event id", () => {
    const result = eventRegistrationSchema.safeParse({
      event_id: "not-a-uuid",
      full_name: "Grace Hopper",
      email: "grace@example.com",
      phone: "1234567",
      program: "Computer Science"
    });
    expect(result.success).toBe(false);
  });
});

describe("optional url fields", () => {
  const base = {
    name: "Grace Hopper",
    role: "Mentor",
    department: "Engineering",
    group_name: "Core Team",
    bio: "A long enough biography string.",
    sort_order: "10",
    is_published: "true"
  };

  it("accepts an empty optional url", () => {
    expect(teamMemberSchema.safeParse({ ...base, linkedin_url: "" }).success).toBe(true);
  });

  it("rejects a malformed optional url", () => {
    expect(teamMemberSchema.safeParse({ ...base, linkedin_url: "notaurl" }).success).toBe(false);
  });

  it("coerces sort_order to a number", () => {
    const parsed = teamMemberSchema.parse(base);
    expect(parsed.sort_order).toBe(10);
  });
});

describe("galleryItemSchema", () => {
  it("rejects an unknown media type", () => {
    const result = galleryItemSchema.safeParse({
      title: "Photo",
      category: "Events",
      media_type: "gif",
      sort_order: "1",
      is_published: "false"
    });
    expect(result.success).toBe(false);
  });
});

describe("formDataObject", () => {
  it("keeps string entries and drops files", () => {
    const fd = new FormData();
    fd.set("name", "Ada");
    fd.set("media_file", new File(["x"], "x.png", { type: "image/png" }));
    const obj = formDataObject(fd);
    expect(obj).toEqual({ name: "Ada" });
  });
});

describe("fieldErrors", () => {
  it("returns per-field error arrays", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error) as Record<string, string[] | undefined>;
      expect(errors.name?.length).toBeGreaterThan(0);
    }
  });
});
