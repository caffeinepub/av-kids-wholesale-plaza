# Specification

## Summary
**Goal:** Fix admin authentication/authorization so administrators can reliably access the existing admin pages, including after refresh, and clarify admin access status in the UI.

**Planned changes:**
- Update the frontend AdminRouteGuard logic to wait for a definitive admin check tied to the currently authenticated Internet Identity principal (avoid stale/incorrect cached admin status causing false “Access Denied”).
- Fix/adjust backend admin status and role-assignment logic so `isCallerAdmin()` accurately reflects the caller’s admin privileges and remains consistent across reloads and canister upgrades/redeploys per the existing admin policy.
- Improve the Admin Login page to clearly display (in English) whether the user is authenticated and whether they are an admin, and provide a clear action to navigate to `/admin/products` when admin access is confirmed.

**User-visible outcome:** Admin users logged in with Internet Identity can directly open `/admin/products` and `/admin/orders` (even after a page refresh) without being incorrectly blocked, and the Admin Login page clearly explains their current access state and next steps.
