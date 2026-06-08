/**
 * MediGo - Generate trusted self-signed SSL certificate for localhost
 * Uses PowerShell's New-SelfSignedCertificate (more reliable on Windows)
 * Run with: node generate-cert.js
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const certDir = path.join(__dirname, 'certs');
fs.mkdirSync(certDir, { recursive: true });

const keyPath  = path.join(certDir, 'key.pem');
const certPath = path.join(certDir, 'cert.pem');
const pfxPath  = path.join(certDir, 'medigo.pfx');
const crtPath  = path.join(certDir, 'cert.crt');

if (os.platform() !== 'win32') {
  console.error('This script is for Windows. On Linux/Mac use openssl.');
  process.exit(1);
}

console.log('🔐 Generating trusted self-signed certificate for localhost...\n');

// Step 1: Create cert in Windows cert store using PowerShell
const psCreate = `
$cert = New-SelfSignedCertificate \`
  -DnsName "localhost","127.0.0.1" \`
  -CertStoreLocation "Cert:\\CurrentUser\\My" \`
  -NotAfter (Get-Date).AddYears(2) \`
  -KeyAlgorithm RSA \`
  -KeyLength 2048 \`
  -HashAlgorithm SHA256 \`
  -KeyUsage DigitalSignature,KeyEncipherment \`
  -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1","2.5.29.17={text}DNS=localhost&IPAddress=127.0.0.1") \`
  -FriendlyName "MediGo Dev Certificate"

Write-Host "THUMBPRINT:$($cert.Thumbprint)"
$thumb = $cert.Thumbprint

# Export PFX (includes private key)
$pwd = ConvertTo-SecureString -String "medigo123" -Force -AsPlainText
Export-PfxCertificate -Cert "Cert:\\CurrentUser\\My\\$thumb" -FilePath "${pfxPath.replace(/\\/g,'\\\\')}" -Password $pwd | Out-Null
Write-Host "PFX_EXPORTED:OK"

# Also install into Trusted Root (requires elevation)
try {
  Import-Certificate -FilePath (Get-Item "Cert:\\CurrentUser\\My\\$thumb").PSPath.Replace("Microsoft.PowerShell.Security\\Certificate::","") -CertStoreLocation "Cert:\\LocalMachine\\Root" -ErrorAction Stop | Out-Null
  Write-Host "TRUSTED_ROOT:OK"
} catch {
  # Try CurrentUser root instead
  try {
    \$cert | Export-Certificate -FilePath "${crtPath.replace(/\\/g,'\\\\')}" -Type CERT | Out-Null
    Import-Certificate -FilePath "${crtPath.replace(/\\/g,'\\\\')}" -CertStoreLocation "Cert:\\CurrentUser\\Root" | Out-Null
    Write-Host "TRUSTED_ROOT:USER_OK"
  } catch {
    Write-Host "TRUSTED_ROOT:FAILED:\$(\$_.Exception.Message)"
  }
}
`;

let thumbprint = null;
try {
  const result = execSync(`powershell -Command "${psCreate.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
    encoding: 'utf8',
    timeout: 30000
  });

  console.log('PowerShell output:');
  console.log(result);

  const thumbMatch = result.match(/THUMBPRINT:([A-F0-9]+)/i);
  if (thumbMatch) thumbprint = thumbMatch[1];

  if (result.includes('TRUSTED_ROOT:OK') || result.includes('TRUSTED_ROOT:USER_OK')) {
    console.log('✅ Certificate installed as TRUSTED in Windows!');
  } else {
    console.log('⚠️  Could not auto-install as trusted root. See manual steps below.');
  }
} catch (err) {
  console.error('PowerShell cert creation error:', err.message);
}

// Step 2: Convert PFX to PEM using openssl (if available) or Node crypto
console.log('\n🔄 Converting PFX to PEM format...');

// Try openssl first
const opensslResult = spawnSync('openssl', ['version'], { encoding: 'utf8' });
if (opensslResult.status === 0) {
  try {
    // Extract private key
    execSync(
      `openssl pkcs12 -in "${pfxPath}" -nocerts -nodes -out "${keyPath}" -passin pass:medigo123`,
      { stdio: 'inherit' }
    );
    // Extract certificate
    execSync(
      `openssl pkcs12 -in "${pfxPath}" -nokeys -clcerts -out "${certPath}" -passin pass:medigo123`,
      { stdio: 'inherit' }
    );
    // Also export .crt
    execSync(
      `openssl pkcs12 -in "${pfxPath}" -nokeys -clcerts -out "${crtPath}" -passin pass:medigo123`,
      { stdio: 'inherit' }
    );
    console.log('✅ PEM files created via OpenSSL!');
  } catch (e) {
    console.error('OpenSSL conversion error:', e.message);
    fallbackConvert();
  }
} else {
  fallbackConvert();
}

function fallbackConvert() {
  // Use selfsigned as async fallback
  console.log('📦 OpenSSL not found. Using Node crypto fallback...');
  const { generateKeyPairSync, createCertificate } = require('crypto');
  
  try {
    require('selfsigned').generate(
      [{ name: 'commonName', value: 'localhost' }],
      {
        keySize: 2048,
        days: 730,
        algorithm: 'sha256',
        extensions: [
          { name: 'subjectAltName', altNames: [
            { type: 2, value: 'localhost' },
            { type: 7, ip: '127.0.0.1' }
          ]}
        ]
      }
    ).then(pems => {
      const privateKey = pems.private || pems.key || pems.privateKey;
      const certificate = pems.cert || pems.certificate;
      if (privateKey && certificate) {
        fs.writeFileSync(keyPath, privateKey);
        fs.writeFileSync(certPath, certificate);
        fs.writeFileSync(crtPath, certificate);
        console.log('✅ PEM files created via selfsigned!');
        printManualSteps();
      } else {
        console.log('Keys from selfsigned:', Object.keys(pems));
        printManualSteps();
      }
    });
  } catch(e) {
    console.error('Fallback error:', e.message);
    printManualSteps();
  }
}

function printManualSteps() {
  console.log('\n📋 ─── MANUAL BROWSER TRUST STEPS ──────────────────────────');
  console.log('If browser still shows "Not Secure", do ONE of these:\n');
  console.log('Option A - Chrome flag (easiest, no install needed):');
  console.log('  1. Go to: chrome://flags/#allow-insecure-localhost');
  console.log('  2. Set to "Enabled"');
  console.log('  3. Relaunch Chrome\n');
  console.log('Option B - Install cert manually:');
  console.log('  1. Double-click: certs\\cert.crt');
  console.log('  2. Click "Install Certificate"');
  console.log('  3. Choose "Local Machine" → Next');
  console.log('  4. "Place all certificates in the following store" → Browse');
  console.log('  5. Select "Trusted Root Certification Authorities" → OK');
  console.log('  6. Finish → restart browser');
  console.log('────────────────────────────────────────────────────────────');
}

printManualSteps();
console.log('\n🔁 Restart the server after this: npm run dev');
