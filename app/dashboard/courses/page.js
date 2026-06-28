import { redirect } from 'next/navigation'

// /dashboard/courses is superseded by /dashboard/landing which has all course management.
export default function CoursesPage() {
  redirect('/dashboard/landing')
}
