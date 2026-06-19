## Disconnect Shopify

Disconnect the Shopify store from this project using the `shopify--disconnect_store` tool.

### What this does
- Removes the Shopify connection from this Lovable project
- Your Shopify store, products, and orders remain fully intact on Shopify
- Enables remixing the project again
- Allows connecting a different Shopify store later

### What this does NOT do
- Does not delete anything in your Shopify store
- Does not automatically remove Shopify-related code from the app (the waitlist form's Shopify sync code stays in place; it will simply fail/skip until a store is reconnected, and signups continue to be stored in the database)

### Follow-up (optional, ask after disconnect)
If you'd like, I can also strip the Shopify customer-sync logic out of `src/routes/api/public/waitlist.ts` so the waitlist runs cleanly without a connected store.