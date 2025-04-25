---
sidebar_position: 5
title: Security Best Practices
---

# Security Best Practices

When working with secrets and sensitive data, it's critical to follow security best practices. This guide provides recommendations for using Node SOPS securely in your projects.

## Key Management

### Protecting the Encryption Key

The `.sops-key` file is the most critical security component in your Node SOPS setup. Anyone with access to this file can decrypt your secrets.

**Do:**
- Add `.sops-key` to your `.gitignore` file immediately after generating it
- Store the key securely outside your repository
- Use different keys for different environments (development, staging, production)
- Rotate keys periodically for enhanced security

**Don't:**
- Commit the key file to version control
- Share the key through insecure channels (like email or chat)
- Use the same key across multiple projects

### Secure Key Sharing

To share the encryption key with team members:

1. Use a secure password manager like 1Password, LastPass, or Bitwarden
2. Use end-to-end encrypted communication channels
3. Consider using a secrets management service for enterprise environments

## File Handling

### Encrypted Files

**Do:**
- Commit encrypted files to version control
- Use descriptive file names that indicate they contain encrypted content (e.g., `secrets.enc.json`)
- Keep encrypted files organized in a consistent location in your project

**Don't:**
- Store unencrypted secrets files in the repository
- Log or display decrypted content in your application logs

### Temporary Decrypted Files

If you need to temporarily decrypt files during development:

**Do:**
- Add decrypted files to `.gitignore`
- Delete decrypted files when you're done with them
- Use the `view` or `get` commands instead of full decryption when possible

**Don't:**
- Leave decrypted files on disk longer than necessary
- Share decrypted files outside secure channels

## Application Security

### Environment Variables

When using secrets in your application:

**Do:**
- Load secrets from encrypted files at application startup
- Use environment variables as an interface to your secrets
- Clear sensitive data from memory when no longer needed

**Don't:**
- Hard-code secrets in your application code
- Include secrets in client-side code
- Log environment variables that contain secrets

### Example: Loading Secrets Securely

```javascript
const { Sops } = require('node-sops');

// Load secrets early in your application bootstrap
function loadSecrets() {
  try {
    const sops = new Sops();
    const secrets = sops.view('secrets.enc.json');
    
    // Add secrets to process.env
    Object.entries(secrets.data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        process.env[key.toUpperCase()] = value;
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            process.env[`${key.toUpperCase()}_${subKey.toUpperCase()}`] = subValue;
          }
        });
      }
    });
    
    // The decrypted content is no longer accessible outside this function
    // due to JavaScript's garbage collection
  } catch (error) {
    console.error('Failed to load secrets:', error.message);
    process.exit(1); // Exit if secrets cannot be loaded
  }
}
```

## CI/CD Integration

When using Node SOPS in continuous integration and deployment pipelines:

**Do:**
- Store the encryption key in your CI/CD system's secure environment variables or secrets storage
- Decrypt secrets only during the build/deploy process, not in artifacts
- Use different keys for different deployment environments

**Don't:**
- Store the key in your repository or build scripts
- Output decrypted secrets in build logs
- Use the same key across multiple environments

### Example: GitHub Actions Integration

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Create key file
      run: echo "$SOPS_KEY" > .sops-key
      env:
        SOPS_KEY: ${{ secrets.SOPS_KEY }}
      
    - name: Build with secrets
      run: |
        # Use the secrets during build
        npx node-sops view -i secrets.enc.json -f json > .env.json
        npm run build
        
    - name: Clean up
      run: rm -f .sops-key .env.json
```

## Team Workflows

### Onboarding New Team Members

When onboarding new team members:

1. Share the encryption key securely
2. Provide clear documentation on how to use Node SOPS in your project
3. Establish clear guidelines for creating and modifying secrets

### Handling Key Rotation

Periodically rotating encryption keys enhances security:

1. Generate a new encryption key
2. Decrypt all secret files using the old key
3. Re-encrypt them with the new key
4. Securely distribute the new key to all team members
5. Securely destroy the old key

## Production Deployments

For production deployments, consider these additional recommendations:

**Do:**
- Use a dedicated key for production environments
- Consider using a more robust secrets management solution for production (like AWS Secrets Manager, HashiCorp Vault, etc.)
- Limit access to production keys to essential personnel only
- Audit and log access to production secrets

**Don't:**
- Use development keys in production
- Store production keys on developer machines
- Automate production key distribution without proper security controls

## Additional Security Measures

### File Permissions

Set appropriate file permissions on your encryption key file:

```bash
# On Unix-based systems (Linux, macOS)
chmod 600 .sops-key
```

This makes the file readable and writable only by the owner.

### Key Backups

Ensure you have a secure backup of your encryption keys. Losing the key means losing access to all encrypted data.

### Security Audits

Regularly audit your security practices and ensure all team members are following established guidelines.

## Conclusion

Security is a continuous process, not a one-time setup. Regularly review and update your security practices as your project evolves and as new security challenges emerge.