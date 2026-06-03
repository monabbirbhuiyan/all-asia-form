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

    let csvContent = '';
    
    if (type === 'fighters') {
      const fighters = await sql`
        SELECT 
          f.id,
          f."fullName" AS full_name,
          f."branchChiefName" AS branch_chief_name,
          f.address,
          f.height,
          f.weight,
          f."beltColor" AS belt_color,
          f."beltRank" AS belt_rank,
          f."internationalRegistrationNumber" AS international_registration_number,
          bc."branchName" AS branch_name,
          f."createdAt" AS created_at
        FROM fighters f
        JOIN branch_chiefs bc ON f."branchChiefId" = bc.id
        ORDER BY bc."branchName", f."fullName"
      `;

      csvContent = 'ID,Full Name,Branch Chief Name,Address,Height (cm),Weight (kg),Belt Color,Belt Rank,International Reg. No.,Branch,Registered At\n';
      
      for (const f of fighters) {
        csvContent += `${f.id},"${f.full_name || ''}","${(f.branch_chief_name || '').replace(/"/g, '""')}","${(f.address || '').replace(/"/g, '""')}",${formatWholeNumber(f.height)},${formatWholeNumber(f.weight)},"${f.belt_color || ''}","${f.belt_rank || ''}","${f.international_registration_number || ''}","${f.branch_name}","${f.created_at}"\n`;
      }
    } else if (type === 'officials') {
      const officials = await sql`
        SELECT 
          o.id,
          o."fullName" AS full_name,
          o.position,
          o.email,
          o.phone,
          bc."branchName" AS branch_name,
          o."createdAt" AS created_at
        FROM officials o
        JOIN branch_chiefs bc ON o."branchChiefId" = bc.id
        ORDER BY bc."branchName", o."fullName"
      `;

      csvContent = 'ID,Full Name,Position,Email,Phone,Branch,Registered At\n';
      
      for (const o of officials) {
        csvContent += `${o.id},"${o.full_name || ''}","${o.position || ''}","${o.email || ''}","${o.phone || ''}","${o.branch_name}","${o.created_at}"\n`;
      }
    } else if (type === 'branch_chiefs') {
      const chiefs = await sql`
        SELECT
          id,
          "branchName" AS branch_name,
          email,
          "isActive" AS is_active,
          "createdAt" AS created_at
        FROM branch_chiefs
        ORDER BY "branchName"
      `;

      csvContent = 'ID,Branch Name,Email,Active,Created At\n';
      
      for (const c of chiefs) {
        csvContent += `${c.id},"${c.branch_name}","${c.email}",${c.is_active},"${c.created_at}"\n`;
      }
    } else if (type === 'dan_tests') {
      const danTests = await sql`
        SELECT
          d.id,
          d."fullName" AS full_name,
          d.position,
          d.email,
          d.phone,
          d."blackBelt" AS black_belt,
          d.dan,
          d."internationalRegistrationNumber" AS international_registration_number,
          bc."branchName" AS branch_name,
          d."createdAt" AS created_at
        FROM dan_tests d
        JOIN branch_chiefs bc ON d."branchChiefId" = bc.id
        ORDER BY bc."branchName", d."fullName"
      `;

      csvContent = 'ID,Full Name,Position,Email,Phone,Black Belt,Dan,International Reg. No.,Branch,Registered At\n';

      for (const d of danTests) {
        csvContent += `${d.id},"${d.full_name || ''}","${d.position || ''}","${d.email || ''}","${d.phone || ''}","${d.black_belt || ''}","${d.dan || ''}","${d.international_registration_number || ''}","${d.branch_name}","${d.created_at}"\n`;
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
