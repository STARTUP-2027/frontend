import CertificateVerifyPage from "../../../src/app/verify/CertificateVerifyPage";

export function generateStaticParams() {
  return [
    { credentialId: "ASTRA-CERT-8849-2026" },
    { credentialId: "ASTRA-CERT-4921-2026" },
    { credentialId: "ASTRA-CERT-1049-2026" },
  ];
}

export default function VerifyCredentialRoute() {
  return <CertificateVerifyPage />;
}
