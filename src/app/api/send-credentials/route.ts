"use server"
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import nodemailer from 'nodemailer';

const smtpPort = parseInt(process.env.SMTP_PORT || '587');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  // FIX: If port is 465, secure must be true. If 587, secure must be false.
  secure: smtpPort === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // OPTIONAL: Prevent connection pooling issues across bulk async sends
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'Email service not configured. Set SMTP_USER and SMTP_PASS in .env' },
        { status: 500 }
      );
    }

    const session = await getSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chiefIds } = await request.json();

    if (!Array.isArray(chiefIds) || chiefIds.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one recipient' },
        { status: 400 }
      );
    }

    const chiefs = await sql`
      SELECT id, "branchName" AS branch_name, email, "contactEmail" AS contact_email
      FROM branch_chiefs
      WHERE id = ANY(${chiefIds})
      AND "contactEmail" IS NOT NULL
    `;

    if (chiefs.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found' },
        { status: 400 }
      );
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/branch/login`;
    
    const { renderBranchChiefCredentialsEmail } = await import('@/lib/email-renderer');

    const results = await Promise.allSettled(
      chiefs.map(async (chief) => {
        try {
          const html = await renderBranchChiefCredentialsEmail({
            branchName: chief.branch_name,
            email: chief.email,
            password: 'AllAsia2026#Kyoku!Access',
            loginUrl,
          });

          await transporter.sendMail({
            from: `"18th All Asia Championship" <${process.env.SMTP_USER}>`,
            to: chief.contact_email,
            subject: 'Your Login Credentials - 18th All Asia Open Karate Championship 2026',
            html: html,
          });

          return { id: chief.id, email: chief.contact_email };
        } catch (err) {
          console.error(`Failed to send email to ${chief.contact_email}:`, err);
          throw err;
        }
      })
    );

    const succeeded = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<{ id: number; email: string }>).value);

    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason);

    return NextResponse.json({
      success: true,
      sent: succeeded.length,
      failed: failed.length,
      errors: failed,
    });
  } catch (error) {
    console.error('Send credentials error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
