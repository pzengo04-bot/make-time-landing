import { createFileRoute } from "@tanstack/react-router";

const SHOP_DOMAIN = "z3dpsf-0q.myshopify.com";
const API_VERSION = "2025-07";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function shopifyAdmin(path: string, init: RequestInit = {}) {
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!token) throw new Error("SHOPIFY_ACCESS_TOKEN missing");
  return fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}${path}`, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export const Route = createFileRoute("/api/public/waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { email?: string };
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const email = (payload.email ?? "").trim().toLowerCase();
        if (!email || email.length > 255 || !EMAIL_RE.test(email)) {
          return json({ error: "Please enter a valid email." }, 400);
        }

        const consentTs = new Date().toISOString();
        const marketingConsent = {
          state: "subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: consentTs,
        };

        // 0. Persist the signup to the database first — this is the source of truth.
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const userAgent = request.headers.get("user-agent") ?? null;
        const ipAddress =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for") ??
          null;

        const { error: dbError } = await supabaseAdmin
          .from("waitlist_signups")
          .upsert(
            {
              email,
              source: "website",
              user_agent: userAgent,
              ip_address: ipAddress,
              marketing_consent_at: consentTs,
            },
            { onConflict: "email", ignoreDuplicates: false },
          );

        if (dbError) {
          console.error("Waitlist DB insert failed", dbError);
          return json({ error: "Couldn't sign you up. Please try again." }, 500);
        }

        // 1. Best-effort Shopify sync. Failures are logged but do not break signup.
        try {
          const createRes = await shopifyAdmin("/customers.json", {
            method: "POST",
            body: JSON.stringify({
              customer: {
                email,
                email_marketing_consent: marketingConsent,
                tags: "Roo Waitlist",
              },
            }),
          });

          if (createRes.ok) {
            const created = await createRes.json().catch(() => ({}));
            await supabaseAdmin
              .from("waitlist_signups")
              .update({
                shopify_synced_at: new Date().toISOString(),
                shopify_customer_id: String(created?.customer?.id ?? ""),
                shopify_sync_error: null,
              })
              .eq("email", email);
            return json({ ok: true, status: "created" });
          }

          const createBody = await createRes.json().catch(() => ({}));
          const emailErrors: string[] = createBody?.errors?.email ?? [];
          const alreadyExists = emailErrors.some((e) =>
            /taken|already/i.test(e),
          );

          if (!alreadyExists) {
            console.error(
              "Shopify customer create failed",
              createRes.status,
              createBody,
            );
            await supabaseAdmin
              .from("waitlist_signups")
              .update({
                shopify_sync_error: `${createRes.status}: ${JSON.stringify(createBody?.errors ?? createBody)}`.slice(0, 1000),
              })
              .eq("email", email);
            // Signup still succeeds — email is stored in the database.
            return json({ ok: true, status: "stored" });
          }

          // 2. Customer exists — find them and update marketing consent.
          const searchRes = await shopifyAdmin(
            `/customers/search.json?query=${encodeURIComponent(`email:${email}`)}`,
          );
          const searchBody = await searchRes.json().catch(() => ({}));
          const existing = searchBody?.customers?.[0];

          if (existing?.id) {
            const updateRes = await shopifyAdmin(`/customers/${existing.id}.json`, {
              method: "PUT",
              body: JSON.stringify({
                customer: {
                  id: existing.id,
                  email_marketing_consent: marketingConsent,
                  tags: [existing.tags, "Roo Waitlist"]
                    .filter(Boolean)
                    .join(", "),
                },
              }),
            });
            if (!updateRes.ok) {
              const updateBody = await updateRes.text();
              console.error("Shopify customer update failed", updateRes.status, updateBody);
            } else {
              await supabaseAdmin
                .from("waitlist_signups")
                .update({
                  shopify_synced_at: new Date().toISOString(),
                  shopify_customer_id: String(existing.id),
                  shopify_sync_error: null,
                })
                .eq("email", email);
            }
          }

          return json({ ok: true, status: "already_subscribed" });
        } catch (err) {
          console.error("Waitlist handler error", err);
          // DB insert succeeded — treat as success even if Shopify call threw.
          return json({ ok: true, status: "stored" });
        }
      },
    },
  },
});