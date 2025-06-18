# Deployment & Release Guide

This document describes the deployment and release process for safe-find.

## 🚀 Release Process Overview

The project uses automated CI/CD with GitHub Actions and JSR (JavaScript
Registry) for publishing.

### Release Flow

1. **Development** → Code changes and tests
2. **CI Validation** → Automated testing on PR/push
3. **Version Tag** → Create version tag (triggers release)
4. **Automated Publishing** → JSR publication via GitHub Actions

## 📋 Pre-Release Checklist

Before creating a release, ensure:

- [ ] All tests pass locally: `deno task test:all`
- [ ] Integration tests pass: `deno task test:integration`
- [ ] Code is properly formatted: `deno fmt --check`
- [ ] No linting errors: `deno lint`
- [ ] Documentation is updated (README.md, README.ja.md, CLAUDE.md)
- [ ] CHANGELOG.md is updated (if exists)
- [ ] Version number follows [Semantic Versioning](https://semver.org/)

## 🔄 Release Steps

### 1. Update Version

Edit `deno.jsonc` to update the version:

```jsonc
{
  "version": "x.y.z" // Update this
}
```

### 2. Commit Version Change

```bash
git add deno.jsonc
git commit -m "Release vx.y.z: Brief description of changes

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

### 3. Create and Push Tag

```bash
# Create tag
git tag vx.y.z

# Push tag (triggers automated release)
git push origin vx.y.z
```

### 4. Monitor Release

Check the GitHub Actions workflow:

```bash
# Check workflow status
gh run list --limit 3

# View specific run details
gh run view <run-id>
```

## 🏗️ CI/CD Workflows

### GitHub Actions Workflows

#### `ci.yml` - Continuous Integration

- **Triggers**: Push to main, Pull Requests
- **Jobs**:
  - Unit tests (`deno test`)
  - Integration tests (`deno task test:integration`)
  - Code formatting check (`deno fmt --check`)
  - Linting (`deno lint`)
  - Type checking (`deno check`)

#### `publish.yml` - Release Publishing

- **Triggers**: Tag push (`v*`)
- **Jobs**:
  1. **test**: Runs full test suite (reuses `test.yml`)
  2. **publish**: Publishes to JSR (only after tests pass)

#### `test.yml` - Reusable Test Workflow

- **Purpose**: Shared test logic for CI and publish workflows
- **Jobs**: Unit tests + Integration tests

### Required Permissions

The publish workflow requires these permissions:

- `contents: read` - Read repository content
- `id-token: write` - OIDC token for JSR authentication

## 📦 JSR Publishing

### Package Configuration

The package is configured in `deno.jsonc`:

```jsonc
{
  "name": "@masinc/safe-find",
  "version": "x.y.z",
  "license": "MIT",
  "exports": {
    "./safe-find": "./safe-find.ts",
    "./safe-fd": "./safe-fd.ts"
  },
  "bin": {
    "safe-find": "deno run --allow-run ./safe-find.ts",
    "safe-fd": "deno run --allow-run ./safe-fd.ts"
  }
}
```

### Publication Details

- **Registry**: [JSR (JavaScript Registry)](https://jsr.io)
- **Package URL**: https://jsr.io/@masinc/safe-find
- **Installation**:
  ```bash
  deno install -g --allow-run jsr:@masinc/safe-find/safe-find
  deno install -g --allow-run jsr:@masinc/safe-find/safe-fd
  ```

## 🔧 Manual Release (Emergency)

If automated release fails, you can publish manually:

### Prerequisites

1. Ensure you have JSR publish permissions
2. Deno 2.x installed locally

### Steps

```bash
# 1. Checkout the correct tag
git checkout vx.y.z

# 2. Run tests locally
deno task test:all

# 3. Publish to JSR
deno publish
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Test Failures

- **Symptom**: CI fails on test step
- **Solution**: Fix failing tests before release
- **Command**: `deno task test:all` to reproduce locally

#### 2. Linting Errors

- **Symptom**: CI fails on linting step
- **Solution**: Fix linting issues
- **Commands**:
  ```bash
  deno lint          # Check issues
  deno fmt           # Auto-fix formatting
  ```

#### 3. JSR Publication Failures

- **Symptom**: Publish step fails
- **Common causes**:
  - Missing `exports` field in `deno.jsonc`
  - Invalid package configuration
  - Network issues
- **Solution**: Check JSR error logs in GitHub Actions

#### 4. Permission Issues

- **Symptom**: `id-token: write` permission denied
- **Solution**: Ensure repository has proper OIDC configuration

### Debug Commands

```bash
# Check recent workflows
gh run list --limit 5

# View failed workflow logs
gh run view <run-id> --log-failed

# Check JSR package status
curl https://jsr.io/@masinc/safe-find
```

## 📊 Version Strategy

### Semantic Versioning

Follow [SemVer](https://semver.org/) guidelines:

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features (backward compatible)
- **PATCH** (0.0.x): Bug fixes (backward compatible)

### Examples

```bash
# Bug fix
0.1.0 → 0.1.1

# New feature (add new blocked option)
0.1.1 → 0.2.0

# Breaking change (change API)
0.2.0 → 1.0.0
```

## 📝 Post-Release Tasks

After successful release:

1. **Verify Installation**:
   ```bash
   deno install -g --allow-run jsr:@masinc/safe-find/safe-find
   safe-find --version  # Should show new version
   ```

2. **Update Documentation**: Ensure all docs reflect the new version

3. **Communicate Release**: Update relevant channels/discussions

4. **Monitor**: Watch for any issues reported by users

## 🔗 Related Resources

- [JSR Documentation](https://jsr.io/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Deno Publishing Guide](https://docs.deno.com/runtime/fundamentals/publishing/)
