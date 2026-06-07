import { render } from '@react-email/components'; 
import React from 'react';
import BranchChiefCredentialsEmail from '@/emails/branch-chief-credentials';


export async function renderBranchChiefCredentialsEmail(props: {
  branchName: string;
  email: string;
  password: string;
  loginUrl: string;
}) {
  const html = await render(
    React.createElement(BranchChiefCredentialsEmail, props)
  );
  return `<!DOCTYPE html>${html}`;
}
