import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let officials;
    
    if (session.role === 'admin') {
      officials = await sql`
        SELECT
          o.id,
          o."branchChiefId" AS branch_chief_id,
          o."fullName" AS full_name,
          o.position,
          o.country,
          o."passportNumber" AS passport_number,
          o."trainingSeminar" AS training_seminar,
          o.email,
          o.phone,
          o."photoUrl" AS photo_url,
          o."passportImageUrl" AS passport_image_url,
          o."createdAt" AS created_at,
          o."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM officials o
        JOIN branch_chiefs bc ON o."branchChiefId" = bc.id
        ORDER BY o."createdAt" DESC
      `;
    } else {
      officials = await sql`
        SELECT
          o.id,
          o."branchChiefId" AS branch_chief_id,
          o."fullName" AS full_name,
          o.position,
          o.country,
          o."passportNumber" AS passport_number,
          o."trainingSeminar" AS training_seminar,
          o.email,
          o.phone,
          o."photoUrl" AS photo_url,
          o."passportImageUrl" AS passport_image_url,
          o."createdAt" AS created_at,
          o."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM officials o
        JOIN branch_chiefs bc ON o."branchChiefId" = bc.id
        WHERE o."branchChiefId" = ${session.id}
        ORDER BY o."createdAt" DESC
      `;
    }

    return NextResponse.json({ officials });
  } catch (error) {
    console.error('Get officials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      country,
      passportNumber,
      trainingSeminar,
      email,
      phone,
      photoDataUrl,
      passportImageDataUrl,
    } = await request.json();

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO officials (
        "branchChiefId", "fullName", position, country, "passportNumber", "trainingSeminar", email, phone, "photoUrl", "passportImageUrl", "updatedAt"
      )
      VALUES (
        ${session.id}, ${fullName}, ${position}, ${country}, ${passportNumber}, ${trainingSeminar}, ${email}, ${phone}, ${photoDataUrl}, ${passportImageDataUrl}, CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        "branchChiefId" AS branch_chief_id,
        "fullName" AS full_name,
        position,
        country,
        "passportNumber" AS passport_number,
        "trainingSeminar" AS training_seminar,
        email,
        phone,
        "photoUrl" AS photo_url,
        "passportImageUrl" AS passport_image_url,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
    `;

    return NextResponse.json({ official: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Create official error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
