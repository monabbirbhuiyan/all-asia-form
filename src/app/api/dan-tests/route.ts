import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let danTests;

    if (session.role === 'admin') {
      danTests = await sql`
        SELECT
          d.id,
          d."branchChiefId" AS branch_chief_id,
          d."fullName" AS full_name,
          d.position,
          d.email,
          d.phone,
          d."blackBelt" AS black_belt,
          d.dan,
          d."internationalRegistrationNumber" AS international_registration_number,
          d."createdAt" AS created_at,
          d."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM dan_tests d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        ORDER BY d."createdAt" DESC
      `;
    } else {
      danTests = await sql`
        SELECT
          d.id,
          d."branchChiefId" AS branch_chief_id,
          d."fullName" AS full_name,
          d.position,
          d.email,
          d.phone,
          d."blackBelt" AS black_belt,
          d.dan,
          d."internationalRegistrationNumber" AS international_registration_number,
          d."createdAt" AS created_at,
          d."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM dan_tests d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        WHERE d."branchChiefId" = ${session.id}
        ORDER BY d."createdAt" DESC
      `;
    }

    return NextResponse.json({ danTests });
  } catch (error) {
    console.error('Get dan tests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'branch_chief') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      fullName,
      position,
      email,
      phone,
      blackBelt,
      dan,
      internationalRegistrationNumber,
    } = await request.json();

    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO dan_tests (
        "branchChiefId",
        "fullName",
        position,
        email,
        phone,
        "blackBelt",
        dan,
        "internationalRegistrationNumber",
        "updatedAt"
      )
      VALUES (
        ${session.id},
        ${fullName},
        ${position},
        ${email},
        ${phone},
        ${blackBelt},
        ${dan},
        ${internationalRegistrationNumber},
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        "branchChiefId" AS branch_chief_id,
        "fullName" AS full_name,
        position,
        email,
        phone,
        "blackBelt" AS black_belt,
        dan,
        "internationalRegistrationNumber" AS international_registration_number,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
    `;

    return NextResponse.json({ danTest: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Create dan test error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
