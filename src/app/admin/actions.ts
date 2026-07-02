"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { grantAdminSession, requireAdmin, revokeAdminSession } from "@/lib/admin-auth";
import { slugExists } from "@/lib/admin";
import { slugify } from "@/lib/format";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function nullableString(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return value === "" ? null : value;
}

function revalidatePublicSite() {
  // Root-layout revalidation clears every public page plus both sitemaps.
  revalidatePath("/", "layout");
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const slug = slugify(base) || `story-${Date.now().toString(36)}`;
  if (!(await slugExists(slug, excludeId))) return slug;
  return `${slug}-${Date.now().toString(36)}`;
}

/* ---------- auth ---------- */

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await grantAdminSession(password);
  redirect(ok ? "/admin" : "/admin/login?error=1");
}

export async function logoutAction() {
  await revokeAdminSession();
  redirect("/admin/login");
}

/* ---------- status transitions ---------- */

export async function approveArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await pool.query(
    `UPDATE articles SET status = 'published', published_at = COALESCE(published_at, NOW()) WHERE id = $1`,
    [id],
  );
  revalidatePath("/admin");
  revalidatePublicSite();
}

export async function rejectArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await pool.query(`UPDATE articles SET status = 'rejected' WHERE id = $1`, [id]);
  revalidatePath("/admin");
  revalidatePublicSite();
  const redirectTo = formData.get("redirectTo");
  if (redirectTo) redirect(String(redirectTo));
}

/** Takes a published article off the site and puts it back in the review queue. */
export async function unpublishArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await pool.query(`UPDATE articles SET status = 'pending' WHERE id = $1`, [id]);
  revalidatePath("/admin");
  revalidatePublicSite();
}

/** Moves a rejected article back to the pending queue. */
export async function restoreArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await pool.query(`UPDATE articles SET status = 'pending' WHERE id = $1`, [id]);
  revalidatePath("/admin");
}

/** Permanently removes an article. There is no undo. */
export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await pool.query(`DELETE FROM articles WHERE id = $1`, [id]);
  revalidatePath("/admin");
  revalidatePublicSite();
  const redirectTo = formData.get("redirectTo");
  if (redirectTo) redirect(String(redirectTo));
}

/* ---------- editing ---------- */

async function updateFromForm(formData: FormData, publish: boolean) {
  const id = Number(formData.get("id"));
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "");
  const slug = await uniqueSlug(requestedSlug || title, id);

  await pool.query(
    `UPDATE articles
     SET title = $1, slug = $2, body = $3, meta_description = $4, category = $5, tags = $6
         ${publish ? `, status = 'published', published_at = COALESCE(published_at, NOW())` : ""}
     WHERE id = $7`,
    [
      title,
      slug,
      String(formData.get("body") ?? ""),
      nullableString(formData.get("meta_description")),
      slugify(String(formData.get("category") ?? "general")) || "general",
      parseTags(formData.get("tags")),
      id,
    ],
  );
  return id;
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  const id = await updateFromForm(formData, false);
  revalidatePath(`/admin/${id}`);
  revalidatePath("/admin");
  revalidatePublicSite();
}

export async function saveAndPublishAction(formData: FormData) {
  await requireAdmin();
  await updateFromForm(formData, true);
  revalidatePath("/admin");
  revalidatePublicSite();
  redirect("/admin");
}

/* ---------- manual creation ---------- */

async function insertFromForm(formData: FormData, publish: boolean) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/new?error=title");
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const slug = await uniqueSlug(requestedSlug || title);

  await pool.query(
    `INSERT INTO articles
       (raw_news_id, language, title, slug, body, meta_description, category, tags,
        risk_level, status, source_attribution, published_at, reviewed_by)
     VALUES (NULL, 'en', $1, $2, $3, $4, $5, $6, 'low', $7, $8, $9, 'admin')`,
    [
      title,
      slug,
      String(formData.get("body") ?? ""),
      nullableString(formData.get("meta_description")),
      slugify(String(formData.get("category") ?? "general")) || "general",
      parseTags(formData.get("tags")),
      publish ? "published" : "pending",
      publish ? new Date().toISOString() : null,
      nullableString(formData.get("source_attribution")),
    ],
  );
}

export async function createArticleAction(formData: FormData) {
  await requireAdmin();
  await insertFromForm(formData, false);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createAndPublishAction(formData: FormData) {
  await requireAdmin();
  await insertFromForm(formData, true);
  revalidatePath("/admin");
  revalidatePublicSite();
  redirect("/admin/published");
}
