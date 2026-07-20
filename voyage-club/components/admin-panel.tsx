"use client";

import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { createContent, deleteContent, updateContent, updateSubmission } from "@/lib/actions";
import type { AdminContentTable, AdminRecord, SubmissionTable } from "@/lib/types";
import { SmartForm } from "./forms";

type Field = {
  name: string;
  label: string;
  type?: "text" | "url" | "date" | "number" | "textarea" | "select" | "checkbox";
  required?: boolean;
  options?: string[];
};

const contentFields: Record<AdminContentTable, Field[]> = {
  events: [
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug", required: true },
    { name: "category", label: "Category", required: true },
    { name: "date", label: "Start date", type: "date", required: true },
    { name: "end_date", label: "End date", type: "date" },
    { name: "location", label: "Location", required: true },
    { name: "status", label: "Status", type: "select", options: ["upcoming", "completed", "draft"], required: true },
    { name: "registration_status", label: "Registration", type: "select", options: ["open", "closed", "waitlist"], required: true },
    { name: "capacity", label: "Capacity", type: "number" },
    { name: "summary", label: "Summary", type: "textarea", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "poster_url", label: "Poster URL", type: "url" },
    { name: "is_published", label: "Published", type: "checkbox" }
  ],
  team_members: [
    { name: "name", label: "Name", required: true },
    { name: "role", label: "Role", required: true },
    { name: "department", label: "Department", required: true },
    { name: "group_name", label: "Group", required: true },
    { name: "bio", label: "Biography", type: "textarea", required: true },
    { name: "image_url", label: "Portrait URL", type: "url" },
    { name: "image_alt", label: "Portrait alt text" },
    { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
    { name: "instagram_url", label: "Instagram URL", type: "url" },
    { name: "sort_order", label: "Display order", type: "number", required: true },
    { name: "is_published", label: "Published", type: "checkbox" }
  ],
  gallery_items: [
    { name: "title", label: "Title", required: true },
    { name: "category", label: "Category", required: true },
    { name: "media_type", label: "Media type", type: "select", options: ["image", "video"], required: true },
    { name: "media_url", label: "Image or YouTube URL", type: "url" },
    { name: "thumbnail_url", label: "Thumbnail URL", type: "url" },
    { name: "alt_text", label: "Alt text" },
    { name: "caption", label: "Caption", type: "textarea" },
    { name: "event_date", label: "Event date", type: "date" },
    { name: "sort_order", label: "Display order", type: "number", required: true },
    { name: "is_published", label: "Published", type: "checkbox" }
  ],
  sponsors: [
    { name: "name", label: "Sponsor name", required: true },
    { name: "tier", label: "Tier", required: true },
    { name: "logo_url", label: "Logo URL", type: "url" },
    { name: "logo_alt", label: "Logo alt text" },
    { name: "website_url", label: "Website URL", type: "url" },
    { name: "sort_order", label: "Display order", type: "number", required: true },
    { name: "is_published", label: "Published", type: "checkbox" }
  ],
  testimonials: [
    { name: "name", label: "Person", required: true },
    { name: "role", label: "Role" },
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "image_url", label: "Portrait URL", type: "url" },
    { name: "image_alt", label: "Portrait alt text" },
    { name: "sort_order", label: "Display order", type: "number", required: true },
    { name: "is_published", label: "Published", type: "checkbox" }
  ]
};

const contentTitles: Record<AdminContentTable, string> = {
  events: "Events",
  team_members: "Team",
  gallery_items: "Gallery",
  sponsors: "Sponsors",
  testimonials: "Testimonials"
};

const submissionTitles: Record<SubmissionTable, string> = {
  contact_inquiries: "Contact inquiries",
  recruitment_applications: "Recruitment applications",
  membership_applications: "Membership applications",
  event_registrations: "Event registrations"
};

const submissionStatuses: Record<SubmissionTable, string[]> = {
  contact_inquiries: ["new", "in_progress", "resolved", "spam"],
  recruitment_applications: ["pending", "shortlisted", "interview", "accepted", "rejected", "withdrawn"],
  membership_applications: ["pending", "approved", "rejected", "waitlisted", "withdrawn"],
  event_registrations: ["registered", "waitlisted", "cancelled", "attended", "no_show"]
};

function stringValue(record: AdminRecord | undefined, key: string, fallback = "") {
  const value = record?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function RecordFields({ table, record }: { table: AdminContentTable; record?: AdminRecord }) {
  const pathField: Partial<Record<AdminContentTable, string>> = {
    events: "poster_path",
    team_members: "image_path",
    gallery_items: "media_path",
    sponsors: "logo_path",
    testimonials: "image_path"
  };
  return (
    <>
      {record ? <input type="hidden" name="id" value={record.id} /> : null}
      {record && pathField[table] ? <input type="hidden" name={pathField[table]} value={stringValue(record, pathField[table])} /> : null}
      <div className="admin-form-grid">
        {contentFields[table].map((field) => {
          const id = `${record?.id ?? "new"}-${field.name}`;
          const defaultValue = stringValue(record, field.name, field.name === "sort_order" ? "100" : "");
          if (field.type === "checkbox") {
            return (
              <label className="check-field" key={field.name} htmlFor={id}>
                <input id={id} name={field.name} type="checkbox" defaultChecked={record?.[field.name] === true} />
                <span>{field.label}</span>
              </label>
            );
          }
          return (
            <div className={`field${field.type === "textarea" ? " wide" : ""}`} key={field.name}>
              <label htmlFor={id}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea id={id} name={field.name} defaultValue={defaultValue} required={field.required} />
              ) : field.type === "select" ? (
                <select id={id} name={field.name} defaultValue={defaultValue || field.options?.[0]} required={field.required}>
                  {field.options?.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}
                </select>
              ) : (
                <input id={id} name={field.name} type={field.type ?? "text"} defaultValue={defaultValue} required={field.required} min={field.type === "number" ? 0 : undefined} />
              )}
            </div>
          );
        })}
        <div className="field wide">
          <label htmlFor={`${record?.id ?? "new"}-media_file`}>Upload image (JPEG, PNG, WebP or AVIF, max 5 MB)</label>
          <input id={`${record?.id ?? "new"}-media_file`} name="media_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
        </div>
      </div>
    </>
  );
}

export function AdminNav({ active }: { active: string }) {
  const items = [
    ["overview", "Overview"],
    ["events", "Events"],
    ["team_members", "Team"],
    ["gallery_items", "Gallery"],
    ["sponsors", "Sponsors"],
    ["testimonials", "Testimonials"],
    ["contact_inquiries", "Inquiries"],
    ["recruitment_applications", "Recruitment"],
    ["membership_applications", "Membership"],
    ["event_registrations", "Registrations"]
  ];
  return (
    <nav className="admin-nav" aria-label="Admin sections">
      {items.map(([value, label]) => (
        <Link key={value} href={value === "overview" ? "/admin" : `/admin?view=${value}`} aria-current={active === value ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminContentPanel({ table, records }: { table: AdminContentTable; records: AdminRecord[] }) {
  const createAction = createContent.bind(null, table);
  const updateAction = updateContent.bind(null, table);
  const removeAction = deleteContent.bind(null, table);

  return (
    <section className="admin-panel" aria-labelledby="content-title">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Content</span>
          <h2 id="content-title">{contentTitles[table]}</h2>
        </div>
        <span className="count-badge">{records.length} records</span>
      </div>

      <details className="admin-editor" open={records.length === 0}>
        <summary>Add {contentTitles[table].toLowerCase().replace(/s$/, "")}</summary>
        <SmartForm action={createAction} submitLabel="Create record" encType="multipart/form-data">
          <RecordFields table={table} />
        </SmartForm>
      </details>

      <div className="admin-record-list">
        {records.length ? records.map((record) => (
          <details className="admin-editor" key={record.id}>
            <summary>
              <span>{stringValue(record, "title") || stringValue(record, "name")}</span>
              <span className={`status-dot${record.is_published ? " published" : ""}`}>{record.is_published ? "Published" : "Draft"}</span>
            </summary>
            <SmartForm action={updateAction} submitLabel="Save changes" encType="multipart/form-data">
              <RecordFields table={table} record={record} />
            </SmartForm>
            <form action={removeAction} className="danger-zone">
              <input type="hidden" name="id" value={record.id} />
              <input type="hidden" name="media_path" value={stringValue(record, "poster_path") || stringValue(record, "image_path") || stringValue(record, "media_path") || stringValue(record, "logo_path")} />
              <button className="btn danger" type="submit">
                <Trash2 size={16} aria-hidden="true" />
                Delete record
              </button>
            </form>
          </details>
        )) : <div className="empty-state"><p>No records yet.</p><p>Add the first record above.</p></div>}
      </div>
    </section>
  );
}

function primaryLabel(record: AdminRecord) {
  return stringValue(record, "name") || stringValue(record, "full_name") || stringValue(record, "email") || record.id;
}

function submissionDetails(record: AdminRecord) {
  const ignored = new Set(["id", "status", "notes", "reviewed_at", "reviewed_by", "created_at", "updated_at", "events"]);
  return Object.entries(record).filter(([key, value]) => !ignored.has(key) && value !== null && value !== "");
}

function readableDate(value: unknown) {
  if (typeof value !== "string") return "Unknown time";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function SubmissionValue({ field, value }: { field: string; value: unknown }) {
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (field === "email") return <a href={`mailto:${encodeURIComponent(text)}`}>{text}</a>;
  if (field === "phone") {
    const telephone = text.replace(/[^+\d]/g, "");
    return <a href={`tel:${telephone}`}>{text}</a>;
  }
  return <>{text}</>;
}

export function AdminSubmissionPanel({ table, records }: { table: SubmissionTable; records: AdminRecord[] }) {
  const action = updateSubmission.bind(null, table);
  return (
    <section className="admin-panel" aria-labelledby="submission-title">
      <div className="admin-panel-heading">
        <div>
          <span className="eyebrow">Review queue</span>
          <h2 id="submission-title">{submissionTitles[table]}</h2>
        </div>
        <span className="count-badge">{records.length} records</span>
      </div>
      <div className="admin-record-list">
        {records.length ? records.map((record) => (
          <details className="admin-editor" key={record.id}>
            <summary>
              <span className="submission-summary">
                <strong>{primaryLabel(record)}</strong>
                <small>{readableDate(record.created_at)}</small>
              </span>
              <span className={`status-dot${["approved", "accepted", "resolved", "attended"].includes(stringValue(record, "status")) ? " published" : ""}`}>{stringValue(record, "status").replaceAll("_", " ")}</span>
            </summary>
            <dl className="record-details">
              {submissionDetails(record).map(([key, value]) => (
                <div key={key}>
                  <dt>{key.replaceAll("_", " ")}</dt>
                  <dd><SubmissionValue field={key} value={value} /></dd>
                </div>
              ))}
            </dl>
            <SmartForm action={action} submitLabel="Update review">
              <input type="hidden" name="id" value={record.id} />
              <div className="field">
                <label htmlFor={`${record.id}-status`}>Status</label>
                <select id={`${record.id}-status`} name="status" defaultValue={stringValue(record, "status")}>
                  {submissionStatuses[table].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`${record.id}-notes`}>Internal notes</label>
                <textarea id={`${record.id}-notes`} name="notes" defaultValue={stringValue(record, "notes")} />
              </div>
            </SmartForm>
          </details>
        )) : <div className="empty-state"><p>This queue is clear.</p><Link href="/" className="btn secondary">View public site <ExternalLink size={15} aria-hidden="true" /></Link></div>}
      </div>
    </section>
  );
}
