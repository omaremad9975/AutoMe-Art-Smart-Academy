import { redirect } from 'next/navigation'

// /register is no longer a standalone page — registration is via the modal on the landing page.
// Redirect with ?register=1 so the landing page auto-opens the registration modal.
export default function RegisterPage() {
  redirect('/?register=1')
}
