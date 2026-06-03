import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let fighters;
    
    if (session.role === 'admin') {
      fighters = await sql`
        SELECT
          f.id,
          f."branchChiefId" AS branch_chief_id,
          f."fullName" AS full_name,
          f."branchChiefName" AS branch_chief_name,
          f.address,
          f.height,
          f.weight,
          f."beltColor" AS belt_color,
          f."beltRank" AS belt_rank,
          f."internationalRegistrationNumber" AS international_registration_number,
          f."photoUrl" AS photo_url,
          f."createdAt" AS created_at,
          f."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM fighters f
        JOIN branch_chiefs bc ON f."branchChiefId" = bc.id
        ORDER BY f."createdAt" DESC
      `;
    } else {
      fighters = await sql`
        SELECT
          f.id,
          f."branchChiefId" AS branch_chief_id,
          f."fullName" AS full_name,
          f."branchChiefName" AS branch_chief_name,
          f.address,
          f.height,
          f.weight,
          f."beltColor" AS belt_color,
          f."beltRank" AS belt_rank,
          f."internationalRegistrationNumber" AS international_registration_number,
          f."photoUrl" AS photo_url,
          f."createdAt" AS created_at,
          f."updatedAt" AS updated_at,
          bc."branchName" AS branch_name
        FROM fighters f
        JOIN branch_chiefs bc ON f."branchChiefId" = bc.id
        WHERE f."branchChiefId" = ${session.id}
        ORDER BY f."createdAt" DESC
      `;
    }

    return NextResponse.json({ fighters });
  } catch (error) {
    console.error('Get fighters error:', error);
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

    const formData = await request.formData();

    const parseWholeNumber = (value: FormDataEntryValue | null): number | null => {
      const raw = typeof value === 'string' ? value.trim() : '';
      if (!raw) return null;
      const numericValue = Number(raw);
      if (Number.isNaN(numericValue)) return null;
      return Math.trunc(numericValue);
    };
    
    const fullName = formData.get('fullName') as string;
    const branchChiefName = (formData.get('branchChiefName') as string)?.trim() || null;
    const address = formData.get('address') as string;
    const height = parseWholeNumber(formData.get('height'));
    const weight = parseWholeNumber(formData.get('weight'));
    const beltColor = formData.get('beltColor') as string;
    const beltRank = formData.get('beltRank') as string;
    const internationalRegistrationNumber = formData.get('internationalRegistrationNumber') as string;
    const photo = formData.get('photo') as File | null;

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    let photoUrl = null;

    if (photo && photo.size > 0) {
      const maxPhotoBytes = 2 * 1024 * 1024; // 2MB limit for DB-stored image data.
      if (photo.size > maxPhotoBytes) {
        return NextResponse.json(
          { error: 'Photo size must be 2MB or smaller' },
          { status: 400 }
        );
      }

      const bytes = await photo.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = photo.type || 'image/jpeg';
      photoUrl = `data:${mimeType};base64,${base64}`;
    }

    const result = await sql`
      INSERT INTO fighters (
        "branchChiefId", "fullName", address, height, weight,
        "beltColor", "beltRank", "internationalRegistrationNumber", "photoUrl", "branchChiefName", "updatedAt"
      )
      VALUES (
        ${session.id}, ${fullName}, ${address}, ${height}, ${weight},
        ${beltColor}, ${beltRank}, ${internationalRegistrationNumber}, ${photoUrl}, ${branchChiefName}, CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        "branchChiefId" AS branch_chief_id,
        "fullName" AS full_name,
        "branchChiefName" AS branch_chief_name,
        address,
        height,
        weight,
        "beltColor" AS belt_color,
        "beltRank" AS belt_rank,
        "internationalRegistrationNumber" AS international_registration_number,
        "photoUrl" AS photo_url,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
    `;

    return NextResponse.json({ fighter: result[0] }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create fighter error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { error: 'International registration number already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
