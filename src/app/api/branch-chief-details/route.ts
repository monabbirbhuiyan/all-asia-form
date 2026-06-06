import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let details;

    if (session.role === 'admin') {
      details = await sql`
        SELECT
          d.id,
          d."branchChiefId" AS branch_chief_id,
          d."fullName" AS full_name,
          d."operatorRole" AS operator_role,
          d.address,
          d."branchChiefCardNumber" AS branch_chief_card_number,
          d.country,
          d.phone,
          d.email,
          d."photoUrl" AS photo_url,
          d."passportImageUrl" AS passport_image_url,
          d."internationalRegistrationNumber" AS international_registration_number,
          d."trainingSeminar" AS training_seminar,
          d."createdAt" AS created_at,
          d."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM branch_chief_details d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        ORDER BY d."createdAt" DESC
      `;
    } else {
      details = await sql`
        SELECT
          d.id,
          d."branchChiefId" AS branch_chief_id,
          d."fullName" AS full_name,
          d."operatorRole" AS operator_role,
          d.address,
          d."branchChiefCardNumber" AS branch_chief_card_number,
          d.country,
          d.phone,
          d.email,
          d."photoUrl" AS photo_url,
          d."passportImageUrl" AS passport_image_url,
          d."internationalRegistrationNumber" AS international_registration_number,
          d."trainingSeminar" AS training_seminar,
          d."createdAt" AS created_at,
          d."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM branch_chief_details d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        WHERE d."branchChiefId" = ${session.id}
        ORDER BY d."createdAt" DESC
      `;
    }

    return NextResponse.json({ details });
  } catch (error) {
    console.error('Get branch chief details error:', error);
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
      operatorRole,
      address,
      branchChiefCardNumber,
      country,
      phone,
      email,
      photoDataUrl,
      passportImageDataUrl,
      internationalRegistrationNumber,
      trainingSeminar,
    } = await request.json();

    if (!fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO branch_chief_details (
        "branchChiefId",
        "fullName",
        "operatorRole",
        address,
        "branchChiefCardNumber",
        country,
        phone,
        email,
        "photoUrl",
        "passportImageUrl",
        "internationalRegistrationNumber",
        "trainingSeminar",
        "updatedAt"
      )
      VALUES (
        ${session.id},
        ${fullName},
        ${operatorRole},
        ${address},
        ${branchChiefCardNumber},
        ${country},
        ${phone},
        ${email},
        ${photoDataUrl},
        ${passportImageDataUrl},
        ${internationalRegistrationNumber},
        ${trainingSeminar},
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        "branchChiefId" AS branch_chief_id,
        "fullName" AS full_name,
        "operatorRole" AS operator_role,
        address,
        "branchChiefCardNumber" AS branch_chief_card_number,
        country,
        phone,
        email,
        "photoUrl" AS photo_url,
        "passportImageUrl" AS passport_image_url,
        "internationalRegistrationNumber" AS international_registration_number,
        "trainingSeminar" AS training_seminar,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
    `;

    return NextResponse.json({ detail: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Create branch chief details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
