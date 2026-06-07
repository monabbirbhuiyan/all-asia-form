import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BranchChiefCredentialsEmailProps {
  branchName: string;
  email: string;
  password: string;
  loginUrl: string;
}

export const BranchChiefCredentialsEmail = ({
  branchName,
  email,
  password,
  loginUrl,
}: BranchChiefCredentialsEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your 18th All Asia Open Karate Championship 2026 Login Credentials</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Top Decorative Border Accent */}
          <Section style={accentBar} />

          {/* Header Branding */}
          <Section style={headerSection}>
            <Heading style={h1}>18th All Asia Open</Heading>
            <Heading style={subHeading}>Karate Championship 2026</Heading>
          </Section>

          <Hr style={divider} />

          {/* Body Content */}
          <Section style={bodySection}>
            <Text style={paragraphBold}>Osu,</Text>
            <Text style={paragraph}>
              Dear {branchName},
            </Text>
            <Text style={paragraph}>
              Your official portal account has been configured for the upcoming championship registrations. Please use the secure credentials below to access your Branch Chief / Dojo Operator dashboard.
            </Text>

            {/* Credentials Layout Block */}
            <Section style={credentialsBox}>
              <table style={tableWrapper}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Login Email:</td>
                    <td style={monospaceValue}>{email}</td>
                  </tr>
                  <tr>
                    <td style={labelCellLast}>Password:</td>
                    <td style={monospaceValueLast}>{password}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={paragraph}>
              Click the button below to log in and start registering your fighters:
            </Text>

            {/* Main Action Call-To-Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Login to Dashboard
              </Button>
            </Section>           

            {/* Sign-off Details */}
            <Text style={signOffText}>
              Respectfully,<br />
              <strong style={{ color: '#1a237e' }}>Organizing Committee</strong><br />
              <span style={{ fontSize: '13px', color: '#718096' }}>18th All Asia Open Karate Championship 2026</span>
            </Text>
          </Section>

          {/* Core Footer Element */}
          <Section style={footerSection}>
            <Text style={footerText}>
              This is an automated operational transmission. Please do not reply directly to this email address.<br />
              &copy; 2026 International Karate Organization (IKO). All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BranchChiefCredentialsEmail;

/* --- Refined Inline CSS Component Styles --- */
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  borderRadius: "8px",
  maxWidth: "600px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eef2f5",
};

const accentBar = {
  background: "linear-gradient(90deg, #d32f2f 0%, #1a237e 100%)",
  height: "6px",
  lineHeight: "6px",
};

const headerSection = {
  padding: "40px 40px 20px 40px",
  textAlign: "center" as const,
};

const h1 = {
  margin: "0 0 10px 0",
  color: "#1a237e",
  fontSize: "24px",
  fontWeight: "800",
  textTransform: "uppercase" as const,
  letterSpacing: "-0.5px",
};

const subHeading = {
  margin: "0",
  color: "#d32f2f",
  fontSize: "16px",
  fontWeight: "700",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
};

const divider = {
  borderColor: "#eef2f5",
  margin: "0 40px",
};

const bodySection = {
  padding: "40px",
};

const paragraphBold = {
  margin: "0 0 16px 0",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333333",
  fontWeight: "600",
};

const paragraph = {
  margin: "0 0 20px 0",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4a5568",
};

const credentialsBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  padding: "24px",
  marginBottom: "30px",
};

const tableWrapper = {
  width: "100%",
  borderCollapse: "collapse" as const,
  border: "0",
};

const labelCell = {
  width: "30%",
  padding: "0 0 12px 0",
  fontSize: "13px",
  fontWeight: "700",
  color: "#718096",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const labelCellLast = {
  width: "30%",
  padding: "0",
  fontSize: "13px",
  fontWeight: "700",
  color: "#718096",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const monospaceValue = {
  width: "70%",
  padding: "0 0 12px 0",
  fontSize: "15px",
  color: "#2d3748",
  fontFamily: "Courier New, Courier, monospace",
  fontWeight: "700",
};

const monospaceValueLast = {
  width: "70%",
  padding: "0",
  fontSize: "15px",
  color: "#2d3748",
  fontFamily: "Courier New, Courier, monospace",
  fontWeight: "700",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#1a237e",
  color: "#ffffff",
  display: "inline-block",
  padding: "14px 32px",
  fontSize: "14px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  textDecoration: "none",
  borderRadius: "4px",
};

const noticeSection = {
  borderLeft: "3px solid #cbd5e1",
  paddingLeft: "15px",
  marginBottom: "35px",
};

const noticeText = {
  margin: "0",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#718096",
};

const signOffText = {
  margin: "0",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4a5568",
};

const footerSection = {
  padding: "24px 40px",
  backgroundColor: "#f8fafc",
  borderTop: "1px solid #eef2f5",
  textAlign: "center" as const,
};

const footerText = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#a0aec0",
};