import { expect, test } from "@playwright/test";

test("home and city concept routes render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Jake Brulato/i })
  ).toBeVisible();

  await page.goto("/concepts");
  await expect(
    page.getByRole("heading", { name: /City map, but sharper/i })
  ).toBeVisible();
});
