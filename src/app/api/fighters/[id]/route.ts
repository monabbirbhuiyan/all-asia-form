import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (session.role === 'branch_chief') {
      // Branch chiefs can only delete their own fighters
      await sql`
        DELETE FROM fighters 
        WHERE id = ${id} AND "branchChiefId" = ${session.id}
      `;
    } else {
      // Admin can delete any fighter
      await sql`DELETE FROM fighters WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete fighter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
