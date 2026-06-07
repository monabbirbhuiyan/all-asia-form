import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'fighters';

    const formatWholeNumber = (value: unknown): string => {
      if (value === null || value === undefined || value === '') return '';
      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) return '';
      return String(Math.trunc(numericValue));
    };

    const csvCell = (value: unknown): string => `"${String(value ?? '').replace(/"/g, '""')}"`;

    let csvContent = '';
    
    if (type === 'fighters') {
      const fighters = await sql`
        SELECT 
          f.id,
          f."fullName" AS full_name,
          f."branchChiefName" AS branch_chief_name,
          f.phone,
          f.email,
          f."dateOfBirth" AS date_of_birth,
          f.country,
          f."passportNumber" AS passport_number,
          f.address,
          f.height,
          f.weight,
          f."beltColor" AS belt_color,
          f."beltRank" AS belt_rank,
          f."trainingSeminar" AS training_seminar,
          f."danTestParticipation" AS dan_test_participation,
          f."danTestQualificationNumber" AS dan_test_qualification_number,
          f."internationalRegistrationNumber" AS international_registration_number,
          f."tournamentHistory" AS tournament_history,
          bc."branchName" AS branch_name,
          f."createdAt" AS created_at,
          f."updatedAt" AS updated_at
        FROM fighters f
        JOIN branch_chiefs bc ON f."branchChiefId" = bc.id
        ORDER BY bc."branchName", f."fullName"
      `;

      csvContent = 'ID,Full Name,Branch Chief Name,Phone,Email,Date of Birth,Country,Passport Number,Address,Height (cm),Weight (kg),Belt Color,Belt Rank,Training Seminar,Dan Test Participation,Dan Test Qualification Number,International Reg. No.,Tournament History,Branch,Registered At,Updated At\n';
      
      for (const f of fighters) {
        csvContent += [
          f.id,
          csvCell(f.full_name),
          csvCell(f.branch_chief_name),
          csvCell(f.phone),
          csvCell(f.email),
          csvCell(f.date_of_birth),
          csvCell(f.country),
          csvCell(f.passport_number),
          csvCell(f.address),
          csvCell(formatWholeNumber(f.height)),
          csvCell(formatWholeNumber(f.weight)),
          csvCell(f.belt_color),
          csvCell(f.belt_rank),
          csvCell(f.training_seminar),
          csvCell(f.dan_test_participation),
          csvCell(f.dan_test_qualification_number),
          csvCell(f.international_registration_number),
          csvCell(f.tournament_history),
          csvCell(f.branch_name),
          csvCell(f.created_at),
          csvCell(f.updated_at),
        ].join(',') + '\n';
      }
    } else if (type === 'officials') {
      const officials = await sql`
        SELECT 
          o.id,
          o."fullName" AS full_name,
          o.position,
          o.country,
          o."passportNumber" AS passport_number,
          o."trainingSeminar" AS training_seminar,
          o.email,
          o.phone,
          bc."branchName" AS branch_name,
          o."createdAt" AS created_at,
          o."updatedAt" AS updated_at
        FROM officials o
        JOIN branch_chiefs bc ON o."branchChiefId" = bc.id
        ORDER BY bc."branchName", o."fullName"
      `;

      csvContent = 'ID,Full Name,Position,Country,Passport Number,Training Seminar,Email,Phone,Branch,Registered At,Updated At\n';
      
      for (const o of officials) {
        csvContent += [
          o.id,
          csvCell(o.full_name),
          csvCell(o.position),
          csvCell(o.country),
          csvCell(o.passport_number),
          csvCell(o.training_seminar),
          csvCell(o.email),
          csvCell(o.phone),
          csvCell(o.branch_name),
          csvCell(o.created_at),
          csvCell(o.updated_at),
        ].join(',') + '\n';
      }
    } else if (type === 'branch_chiefs') {
      const chiefs = await sql`
        SELECT
          bc.id,
          bc."branchName" AS branch_name,
          bc.email,
          bc."isActive" AS is_active,
          bc."createdAt" AS created_at,
          bc."updatedAt" AS updated_at,
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
        ORDER BY bc."branchName"
      `;

      csvContent = 'ID,Branch Name,Account Email,Active,Created At,Updated At,Full Name,Operator Role,Address,Branch Chief Card Number,Country,Phone,Detail Email,International Reg. No.,Training Seminar,Dan Test Participation,Dan Test Qualification Number,Photo URL,Passport Image URL,Detail Submitted At,Detail Updated At\n';
      
      for (const c of chiefs) {
        csvContent += [
          c.id,
          csvCell(c.branch_name),
          csvCell(c.email),
          csvCell(c.is_active),
          csvCell(c.created_at),
          csvCell(c.updated_at),
          csvCell(c.full_name),
          csvCell(c.operator_role),
          csvCell(c.address),
          csvCell(c.branch_chief_card_number),
          csvCell(c.country),
          csvCell(c.phone),
          csvCell(c.detail_email),
          csvCell(c.international_registration_number),
          csvCell(c.training_seminar),
          csvCell(c.dan_test_participation),
          csvCell(c.dan_test_qualification_number),
          csvCell(c.photo_url),
          csvCell(c.passport_image_url),
          csvCell(c.detail_created_at),
          csvCell(c.detail_updated_at),
        ].join(',') + '\n';
      }
    } else if (type === 'dan_tests') {
      const danTests = await sql`
        SELECT
          d.id,
          d."fullName" AS full_name,
          d.position,
          d.country,
          d."passportNumber" AS passport_number,
          d.email,
          d.phone,
          d."blackBelt" AS black_belt,
          d.dan,
          d."internationalRegistrationNumber" AS international_registration_number,
          bc."branchName" AS branch_name,
          d."trainingSeminar" AS training_seminar,
          d."createdAt" AS created_at,
          d."updatedAt" AS updated_at
        FROM dan_tests d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        ORDER BY bc."branchName", d."fullName"
      `;

      csvContent = 'ID,Full Name,Position,Country,Passport Number,Email,Phone,Black Belt,Dan,International Reg. No.,Training Seminar,Branch,Registered At,Updated At\n';

      for (const d of danTests) {
        csvContent += [
          d.id,
          csvCell(d.full_name),
          csvCell(d.position),
          csvCell(d.country),
          csvCell(d.passport_number),
          csvCell(d.email),
          csvCell(d.phone),
          csvCell(d.black_belt),
          csvCell(d.dan),
          csvCell(d.international_registration_number),
          csvCell(d.training_seminar),
          csvCell(d.branch_name),
          csvCell(d.created_at),
          csvCell(d.updated_at),
        ].join(',') + '\n';
      }
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
