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
        bc.id,
        bc."branchName" AS branch_name,
        bc.email,
        bc."contactEmail" AS contact_email,
        bc."isActive" AS is_active,
        bc."createdAt" AS created_at,
        bc."updatedAt" AS updated_at,
        d.id AS detail_id,
        d."fullName" AS full_name,
        d."operatorRole" AS operator_role,
        d.address,
        d."branchChiefCardNumber" AS branch_chief_card_number,
        d.country,
        d.phone,
        d.email AS detail_email,
        d."internationalRegistrationNumber" AS international_registration_number,
        d."trainingSeminar" AS training_seminar,
        d."danTestParticipation" AS dan_test_participation,
        d."danTestQualificationNumber" AS dan_test_qualification_number,
        d."photoUrl" AS photo_url,
        d."passportImageUrl" AS passport_image_url,
        d."createdAt" AS detail_created_at,
        d."updatedAt" AS detail_updated_at
      FROM branch_chiefs bc
      LEFT JOIN LATERAL (
        SELECT *
        FROM branch_chief_details d
        WHERE d."branchChiefId" = bc.id
        ORDER BY d."createdAt" DESC
        LIMIT 1
      ) d ON TRUE
       ORDER BY bc.id ASC
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

    const { branchName, email, contactEmail } = await request.json();

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
      INSERT INTO branch_chiefs ("branchName", email, "contactEmail", "passwordHash", "updatedAt")
      VALUES (${branchName}, ${fullEmail}, ${contactEmail || null}, ${passwordHash}, CURRENT_TIMESTAMP)
      RETURNING
        id,
        "branchName" AS branch_name,
        email,
        "contactEmail" AS contact_email,
        "isActive" AS is_active,
        "createdAt" AS created_at
    `;

    return NextResponse.json(
      {
        branchChief: {
          id: result[0].id,
          branch_name: result[0].branch_name,
          email: result[0].email,
          contact_email: result[0].contact_email,
          is_active: result[0].is_active,
          created_at: result[0].created_at,
        },
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
