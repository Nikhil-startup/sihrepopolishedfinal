# Security Policy — AgriFlow AI (Frontend Prototype)

## Frontend-Only Architecture Notice

AgriFlow AI is a client-side frontend prototype built with Next.js, React, TypeScript, and Tailwind CSS.

- **No backend servers**: All features run client-side using browser storage (`localStorage` and `sessionStorage`).
- **Demo authentication**: Authentication flows simulate role access for demo and presentation purposes.
- **No production secrets**: No live API keys, database credentials, or private cloud certificates are stored or required.

---

## Client-Side Data & Privacy

- All user data, demo transactions, and cart states remain within the user's local browser environment.
- Clearing browser storage resets the application to default demonstration data.
- Input validation is enforced via Zod schemas and React Hook Form on all client-side entry points.

---

## Hygiene Rules

- Never commit real private keys, authentication secrets, or personal identifiable data.
- Ensure all demo data remains sanitized and mock-only.

---

## Reporting Vulnerabilities

If you discover a security vulnerability or sensitive data exposure, please contact the repository maintainers directly.
