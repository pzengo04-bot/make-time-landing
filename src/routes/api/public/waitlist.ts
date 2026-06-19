import { createFileRoute } from "@tanstack/react-router";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
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

        return json({ ok: true, status: "stored" });
      },
    },
  },
});