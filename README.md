# safe-find

Safe wrappers for `find` and `fd` commands that block dangerous execution
options.

📖 **[日本語版 README](README.ja.md)**

## 🚀 Quick Start

```bash
# Install both tools (361KB each!)
cargo install safe-find

# Use just like normal find/fd commands
safe-find . -name "*.txt" -type f
safe-fd "*.js"
```

## 🔒 Why safe-find?

The standard `find` and `fd` commands have powerful but dangerous options that
can execute arbitrary commands:

```bash
# ⚠️ DANGEROUS - Can execute any command
find . -name "*.tmp" -exec rm {} \;
fd "*.tmp" -x rm

# ✅ SAFE - Dangerous options are blocked
safe-find . -name "*.tmp" -delete  # ❌ Blocked
safe-fd "*.tmp" -x rm              # ❌ Blocked
```

## 🛡️ Blocked Options

### safe-find blocks:

- `-exec` - Execute arbitrary commands
- `-execdir` - Execute commands in file's directory
- `-ok` - Interactive command execution
- `-okdir` - Interactive command execution in file's directory
- `-delete` - Delete matched files/directories

### safe-fd blocks:

- `-x`, `--exec` - Execute arbitrary commands
- `-X`, `--exec-batch` - Batch command execution
- `-l`, `--list-details` - Uses `ls` internally (potential risk)

## 📦 Installation

### Prerequisites

- [Rust](https://rustup.rs/) (for building from source) or just use pre-built
  binaries

### Install from Crates.io (Recommended)

```bash
# Install both safe-find and safe-fd
cargo install safe-find
```

### Install from Source

```bash
git clone https://github.com/masinc/safe-find.git
cd safe-find
cargo install --path .
```

### Pre-built Binaries

Download platform-specific binaries (361KB each) from
[GitHub Releases](https://github.com/masinc/safe-find/releases).

## 🔧 Usage

### safe-find

All safe `find` options work exactly the same:

```bash
# Find TypeScript files
safe-find . -name "*.ts" -type f

# Find large log files
safe-find /var/log -name "*.log" -size +10M

# Find recently modified files
safe-find . -mtime -7 -type f

# Complex searches
safe-find . \( -name "*.js" -o -name "*.ts" \) -not -path "*/node_modules/*"
```

### safe-fd

All safe `fd` options work exactly the same:

```bash
# Find JavaScript files
safe-fd "*.js"

# Find files with glob pattern
safe-fd --glob "*.ts" --type f

# Search in specific directory
safe-fd "README" /home

# Case insensitive search
safe-fd --ignore-case "readme"
```

## ⚡ Performance

**Extremely lightweight and fast:**

- **Binary size**: Only 361KB each (98.3% smaller than Deno version)
- **Zero dependencies**: No external libraries required
- **Instant startup**: Near-zero overhead compared to native commands
- **Memory efficient**: Minimal memory footprint

## 🧪 Example Output

```bash
$ safe-find . -exec echo "test" \;
Error: Dangerous option '-exec' is not allowed for security reasons

$ safe-fd "*.js" -x rm
Error: Dangerous option '-x' is not allowed for security reasons

$ safe-find . -name "*.md" -type f
./README.md
./CLAUDE.md
```

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/masinc/safe-find.git
cd safe-find

# Run tests
cargo test

# Check formatting
cargo fmt --check

# Run linter
cargo clippy -- -D warnings

# Build debug version
cargo build

# Build optimized release version
cargo build --release

# Test locally
cargo run --bin safe-find . -name "*.rs"
cargo run --bin safe-fd "*.md"
```

## 📚 Use Cases

### 🤖 LLM/AI Tools (Primary Use Case)

**The most important use case is providing safe file search capabilities to AI
tools like Claude Code, ChatGPT Code Interpreter, and other LLM-based
development assistants.**

AI models often need to search and analyze file systems, but giving them access
to dangerous execution commands poses significant security risks. safe-find and
safe-fd provide the perfect solution - full search functionality without
execution capabilities.

#### Claude Code Integration

Add this to your project's `CLAUDE.md` file to enable safe file operations:

```markdown
## Safe File Search for AI Assistants

### Installation

`cargo install safe-find`

### Claude Code Tool Configuration

Add to your `.claude/settings.local.json`:

{ "permissions": { "allow": [ "Bash(safe-find:_)", "Bash(safe-fd:_)" ], "deny":
[ "Bash(find:_)", "Bash(fd:_)" ] } }

### Usage

Use `safe-fd` when fd is available, or `safe-find` when fd is not installed.
Both tools block dangerous execution options while providing safe file search
functionality.

Basic search examples:

- With fd: `safe-fd "*.ts" --type f`
- Without fd: `safe-find . -name "*.ts" -type f`
```

#### Benefits for AI Development:

- **Security**: Prevents accidental file deletion or command execution
- **Functionality**: Maintains all search and filtering capabilities
- **Performance**: Zero overhead for search operations
- **Trust**: Allows confident delegation of file system tasks to AI
- **Compliance**: Meets security requirements for automated development
  environments

### 🛠️ Other Use Cases

- **CI/CD pipelines**: Prevent accidental command execution in automated scripts
- **Shared servers**: Allow file search without execution risks
- **Security-conscious environments**: Maintain find/fd functionality while
  blocking dangerous operations
- **Teaching environments**: Safe way to learn find/fd without execution risks
- **Development containers**: Secure file operations in containerized
  development environments

## 📄 License

MIT License

## 🔗 Links

### Project Links

- [Crates.io Package](https://crates.io/crates/safe-find)
- [GitHub Repository](https://github.com/masinc/safe-find)
- [Issues & Bug Reports](https://github.com/masinc/safe-find/issues)
- [Releases & Binaries](https://github.com/masinc/safe-find/releases)

### Original Commands

- [find command](https://www.gnu.org/software/findutils/manual/html_mono/find.html) -
  GNU findutils documentation
- [fd command](https://github.com/sharkdp/fd) - A simple, fast and user-friendly
  alternative to find

## ⭐ Show Your Support

Give a ⭐️ if this project helped you stay safe while using find/fd commands!
