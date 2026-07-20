import { expect, test } from "@playwright/test";

test("public home and events pages render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Knowledge From The Past, Power For The Future" })
  ).toBeVisible();

  await page.goto("/events");
  await expect(page.getByRole("heading", { name: "Talks, Circles, And Campus Gatherings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit Registration" })).toBeVisible();
});

test("admin route exposes the sign-in form when signed out", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Club Operations" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});
