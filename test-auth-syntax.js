const fs = require('fs');
const path = require('path');

console.log('🔍 Checking auth.ts file...');

try {
  const authPath = path.join(__dirname, 'src/lib/auth.ts');
  const content = fs.readFileSync(authPath, 'utf8');
  
  // Базові перевірки
  const checks = [
    { name: 'File exists', result: true },
    { name: 'Has authOptions export', result: content.includes('export const authOptions') },
    { name: 'Has NextAuthOptions type', result: content.includes('NextAuthOptions') },
    { name: 'Has CredentialsProvider', result: content.includes('CredentialsProvider') },
    { name: 'Has prisma import', result: content.includes('prisma') },
    { name: 'Has bcrypt import', result: content.includes('bcrypt') },
    { name: 'Has session strategy', result: content.includes('strategy: "jwt"') },
    { name: 'Has secret reference', result: content.includes('NEXTAUTH_SECRET') },
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    const passed = check.result;
    console.log(`${passed ? '✅' : '❌'} ${check.name}`);
    if (!passed) allPassed = false;
  });
  
  if (allPassed) {
    console.log('🎉 All basic checks passed!');
  } else {
    console.log('⚠️ Some checks failed');
  }
  
} catch (error) {
  console.error('❌ Error checking file:', error.message);
}
