import { redirect } from 'next/navigation'

// /register is no longer used — registration happens via the modal on the landing page.
// Redirect anyone who lands here (bookmarks, old links) back to the homepage.
export default function RegisterPage() {
  redirect('/')
}
