# Security Policy and Documentation

## Security Features

node-sops provides the following security features:

1. **Authenticated Encryption**: Uses AES-256-GCM to ensure confidentiality, integrity, and authenticity of secrets.
2. **Secure Key Management**: Keys are stored with restrictive permissions (0o600) and verified at runtime.
3. **Secure File Handling**: Temporary files are securely deleted by overwriting content before removal.
4. **Random IVs**: Each encryption operation uses a different random initialization vector.
5. **Key Derivation**: Raw keys are processed through SHA-256 to create fixed-length keys suitable for AES.
6. **Metadata Tracking**: Format includes versioning and timestamps for audit purposes.
7. **Key Rotation**: Supports secure re-encryption with new keys without exposing plaintext.
8. **Permission Warnings**: Alerts when key file permissions are too permissive.

## Threat Model

node-sops is designed to protect against the following threats:

1. **Unauthorized Access to Encrypted Files**: Secrets are encrypted and cannot be read without the key.
2. **Data Tampering**: Authenticated encryption (GCM) detects and prevents tampering with encrypted content.
3. **Key Disclosure**: Keys are secured with restrictive permissions and warnings appear for insecure settings.
4. **Temporary File Exposure**: Files used during rotation are securely erased by overwriting before deletion.

Not protected against:

1. **System-Level Compromises**: If an attacker has root/admin access to your system, they can access memory/keys.
2. **Memory Dumping**: Node.js does not provide secure memory features to prevent memory dumps exposing secrets.
3. **Advanced Side-Channel Attacks**: Timing or other sophisticated side-channel attacks are not mitigated.

## Best Practices

1. **Key Management**:
   - Never commit key files to version control
   - Add `.sops-key` to your `.gitignore` file
   - Use key rotation periodically
   - Distribute keys through secure channels

2. **Operation**:
   - Only commit encrypted files to version control
   - Use different keys for different environments
   - Consider secrets manager services (AWS Secrets Manager, Azure Key Vault) for production environments

3. **Integration**:
   - Load secrets at startup, not during runtime
   - Don't log decrypted secrets
   - Don't expose secrets in error messages

## Implementation Notes

- Encryption: AES-256-GCM with random 12-byte IVs
- Key Handling: SHA-256 for key derivation from raw keys
- Format: JSON-based storage format with metadata
- Temp Files: Overwritten with zeros before deletion

## Reporting Security Issues

If you discover a security vulnerability in node-sops, please follow responsible disclosure principles:

1. Do NOT create a public GitHub issue
2. Email the maintainers directly 
3. Allow time for the issue to be addressed before disclosure

## Security Roadmap

Future security enhancements may include:

1. Key encryption with passphrase protection
2. Environment variable-based keys
3. Integration with cloud key management services
4. Improved memory handling for secrets
5. Hardware security module (HSM) support

## Acknowledgments

node-sops' security approach is inspired by several well-established secret management tools and implements best practices from NIST and OWASP.