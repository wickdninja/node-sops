# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Build: `npm run build`
- Test all: `npm test`
- Test specific file: `npx jest path/to/file.test.ts`
- Test specific test: `npx jest -t 'test name pattern'`
- Lint: `npm run lint`

## Code Style Guidelines
- TypeScript with strict type checking
- Error handling: Use try/catch blocks with error messages including context
- Exports: Use named exports with concise documentation
- Imports: Group imports (Node.js core, external libs, internal)
- Use async/await for asynchronous operations
- Functions should have JSDoc comments
- File/variable naming: camelCase
- Interface names: PascalCase
- Error handling: Type narrowing with `(error as Error).message` pattern
- Indentation: 2 spaces
- Security: Follow secure crypto practices
- Testing: Jest with descriptive test blocks