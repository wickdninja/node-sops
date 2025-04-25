# Contributing to node-sops

Thank you for your interest in contributing to node-sops! This document provides guidelines and instructions for contributing.

## Security-focused Development

node-sops is a security-focused library for managing secrets. Security must be a top priority when contributing:

1. **Never weaken encryption**: We use AES-256-GCM for authenticated encryption. Any changes must maintain or improve security.
2. **Backwards compatibility**: Changes must not break existing encrypted files.
3. **Secure by default**: All new features should be secure by default.
4. **No key exposure**: Never log or expose encryption keys.
5. **Secure file handling**: Temporary files must be securely deleted and use random names.
6. **Security features**: Permission checks, secure deletion, and tamper detection are critical.

## Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd node-sops

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

## Pull Request Process

1. Fork the repository and create a branch for your feature/fix
2. Ensure all tests pass and add new tests for new functionality
3. Update documentation (README.md, SECURITY.md, etc.) as needed
4. Submit a pull request with a clear description of the changes

## Testing Guidelines

- All new functionality must include tests
- Security-critical functions should have comprehensive tests
- All tests must pass before submitting a PR
- Test backward compatibility with older encrypted formats

## Security Testing

When adding or changing security-critical code:

1. Test for proper handling of tampering (altered ciphertext, altered IV)
2. Ensure key files are stored with proper permissions
3. Verify secure cleanup of temporary files
4. Test error handling for security-critical operations
5. Check for information leakage in error messages

## Documentation

Keep documentation up to date, especially:

- README.md for user-facing features and usage
- SECURITY.md for security features and considerations
- Code comments for implementation details
- JSDoc for all public API functions

## Code Style

- Follow the existing code style
- Use TypeScript types for all functions and interfaces
- Use descriptive variable names
- Add meaningful comments
- Use error handling consistently

## Security Vulnerability Reporting

If you discover a security vulnerability:

1. **Do NOT** create a public GitHub issue
2. Email the maintainers directly at [security contact]
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.