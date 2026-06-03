import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import BranchDashboardClient from './branch-dashboard-client';

export default async function BranchDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'branch_chief') {
    redirect('/branch/login');
  }

  return <BranchDashboardClient branchName={session.branchName || ''} />;
}
