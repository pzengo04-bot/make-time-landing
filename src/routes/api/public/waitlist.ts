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

        try {
          // 1. Try to create the customer with marketing consent.
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
            return json({ ok: true, status: "created" });
          }

          const createBody = await createRes.json().catch(() => ({}));
          const emailErrors: string[] = createBody?.errors?.email ?? [];
          const alreadyExists = emailErrors.some((e) =>
            /taken|already/i.test(e),
          );

          if (!alreadyExists) {
            console.error("Shopify customer create failed", createRes.status, createBody);
            return json({ error: "Couldn't sign you up. Please try again." }, 502);
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
            }
          }

          return json({ ok: true, status: "already_subscribed" });
        } catch (err) {
          console.error("Waitlist handler error", err);
          return json({ error: "Unexpected error. Please try again." }, 500);
        }
      },
    },
  },
});