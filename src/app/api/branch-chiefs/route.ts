import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession, hashPassword } from '@/lib/auth';

const SHARED_BRANCH_CHIEF_PASSWORD = 'AllAsia2026#Kyoku!Access';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const branchChiefs = await sql`
      SELECT
        id,
        "branchName" AS branch_name,
        email,
        "isActive" AS is_active,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM branch_chiefs
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ branchChiefs });
  } catch (error) {
    console.error('Get branch chiefs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { branchName, email } = await request.json();

    if (!branchName || !email) {
      return NextResponse.json(
        { error: 'Branch name and email are required' },
        { status: 400 }
      );
    }

    // Append @kyokushinbd.com to the email if not already present
    const fullEmail = email.includes('@') ? email : `${email}@kyokushinbd.com`;

    const passwordHash = await hashPassword(SHARED_BRANCH_CHIEF_PASSWORD);

    const result = await sql`
      INSERT INTO branch_chiefs ("branchName", email, "passwordHash", "updatedAt")
      VALUES (${branchName}, ${fullEmail}, ${passwordHash}, CURRENT_TIMESTAMP)
      RETURNING
        id,
        "branchName" AS branch_name,
        email,
        "isActive" AS is_active,
        "createdAt" AS created_at
    `;

    return NextResponse.json(
      {
        branchChief: result[0],
        sharedPassword: SHARED_BRANCH_CHIEF_PASSWORD,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Create branch chief error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { error: 'Branch name or email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
