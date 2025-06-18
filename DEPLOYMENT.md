# Deployment & Release Guide

This document describes the deployment and release process for safe-find.

## 🚀 Release Process Overview

The project uses automated CI/CD with GitHub Actions and Crates.io for publishing Rust binaries.

### Release Flow

1. **Development** → Code changes and tests
2. **CI Validation** → Automated testing on PR/push (cargo test, fmt, clippy)
3. **Version Tag** → Create version tag (triggers release)
4. **Automated Publishing** → Crates.io publication + GitHub Releases with cross-platform binaries

## 📋 Pre-Release Checklist

Before creating a release, ensure:

- [ ] All tests pass locally: `cargo test`
- [ ] Code is properly formatted: `cargo fmt --check`
- [ ] No linting errors: `cargo clippy -- -D warnings`
- [ ] Release build succeeds: `cargo build --release`
- [ ] Documentation is updated (README.md, README.ja.md, CLAUDE.md)
- [ ] CHANGELOG.md is updated (if exists)
- [ ] Version number follows [Semantic Versioning](https://semver.org/)
- [ ] Crates.io publish check passes: `cargo publish --dry-run`

## 🔄 Release Steps

### 1. Update Version

Edit `Cargo.toml` to update the version:

```toml
[package]
name = "safe-find"
version = "x.y.z"  # Update this
```

### 2. Commit Version Change

```bash
git add Cargo.toml
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
  - Unit tests (`cargo test`)
  - Code formatting check (`cargo fmt --check`)
  - Linting (`cargo clippy -- -D warnings`)
  - Release build test (`cargo build --release`)

#### `publish.yml` - Release Publishing

- **Triggers**: Tag push (`v*`)
- **Jobs**:
  1. **test**: Runs full test suite (cargo test + fmt + clippy)
  2. **build-binaries**: Cross-platform binary builds for 4 targets
  3. **publish**: Publishes to Crates.io (only after tests pass)
  4. **release**: Creates GitHub Release with binary assets

### Required Permissions

The publish workflow requires these permissions:

- `contents: read` - Read repository content  
- `contents: write` - Create GitHub releases
- Secret: `CARGO_REGISTRY_TOKEN` - Crates.io API token for publishing

## 📦 Crates.io Publishing

### Package Configuration

The package is configured in `Cargo.toml`:

```toml
[package]
name = "safe-find"
version = "x.y.z"
edition = "2021"
license = "MIT"
description = "Safe wrappers for find and fd commands that block dangerous execution options"
repository = "https://github.com/masinc/safe-find"

[[bin]]
name = "safe-find"
path = "src/bin/safe-find.rs"

[[bin]]
name = "safe-fd"
path = "src/bin/safe-fd.rs"
```

### Publication Details

- **Registry**: [Crates.io](https://crates.io)
- **Package URL**: https://crates.io/crates/safe-find
- **Installation**:
  ```bash
  cargo install safe-find
  ```
- **Binary Size**: 361KB per binary (extremely lightweight)
- **Supported Platforms**: Linux, Windows, macOS (x86_64 + ARM64)

## 🔧 Manual Release (Emergency)

If automated release fails, you can publish manually:

### Prerequisites

1. Ensure you have Crates.io publish permissions (`cargo login`)
2. Rust toolchain installed locally

### Steps

```bash
# 1. Checkout the correct tag
git checkout vx.y.z

# 2. Run tests locally
cargo test

# 3. Check formatting and linting
cargo fmt --check
cargo clippy -- -D warnings

# 4. Test publish (dry run)
cargo publish --dry-run

# 5. Publish to Crates.io
cargo publish
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Test Failures

- **Symptom**: CI fails on test step
- **Solution**: Fix failing tests before release
- **Command**: `cargo test` to reproduce locally

#### 2. Linting/Formatting Errors

- **Symptom**: CI fails on fmt/clippy step
- **Solution**: Fix formatting/linting issues
- **Commands**:
  ```bash
  cargo clippy -- -D warnings  # Check clippy issues
  cargo fmt                     # Auto-fix formatting
  ```

#### 3. Crates.io Publication Failures

- **Symptom**: Publish step fails
- **Common causes**:
  - Missing/invalid `Cargo.toml` metadata
  - Version already exists on Crates.io
  - Network issues
  - Authentication failure (`CARGO_REGISTRY_TOKEN`)
- **Solution**: Check Crates.io error logs in GitHub Actions

#### 4. Binary Build Failures

- **Symptom**: Cross-platform build fails
- **Common causes**:
  - Platform-specific compilation issues
  - Missing target toolchain
- **Solution**: Check build logs for specific target failures

### Debug Commands

```bash
# Check recent workflows
gh run list --limit 5

# View failed workflow logs
gh run view <run-id> --log-failed

# Check Crates.io package status
curl https://crates.io/api/v1/crates/safe-find

# Test local publish
cargo publish --dry-run
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
   cargo install safe-find
   safe-find --help  # Should work with new version
   safe-fd --help    # Should work with new version
   ```

2. **Update Documentation**: Ensure all docs reflect the new version

3. **Communicate Release**: Update relevant channels/discussions

4. **Monitor**: Watch for any issues reported by users

## 🔗 Related Resources

- [Crates.io Documentation](https://doc.rust-lang.org/cargo/reference/publishing.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Rust Cross-compilation Guide](https://rust-lang.github.io/rustup/cross-compilation.html)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
