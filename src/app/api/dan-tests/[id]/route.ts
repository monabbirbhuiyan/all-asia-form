import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (session.role === 'branch_chief') {
      await sql`
        DELETE FROM dan_tests
        WHERE id = ${id} AND "branchChiefId" = ${session.id}
      `;
    } else {
      await sql`DELETE FROM dan_tests WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete dan test error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
