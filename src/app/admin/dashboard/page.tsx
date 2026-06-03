import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return <AdminDashboardClient />;
}
