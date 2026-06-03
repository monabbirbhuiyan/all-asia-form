import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await sql`DELETE FROM branch_chiefs WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete branch chief error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { isActive, password } = await request.json();

    if (typeof isActive === 'boolean') {
      await sql`
        UPDATE branch_chiefs 
        SET "isActive" = ${isActive}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    }

    if (password) {
      const passwordHash = await hashPassword(password);
      await sql`
        UPDATE branch_chiefs 
        SET "passwordHash" = ${passwordHash}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update branch chief error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
