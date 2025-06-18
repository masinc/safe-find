# safe-find

Safe wrappers for `find` and `fd` commands that block dangerous execution
options.

📖 **[日本語版 README](README.ja.md)**

## 🚀 Quick Start

```bash
# Install both tools
deno install -g --allow-run jsr:@masinc/safe-find/safe-find
deno install -g --allow-run jsr:@masinc/safe-find/safe-fd

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

- [Deno](https://deno.land/) 2.x or later

### Install from JSR

```bash
# Install safe-find
deno install -g --allow-run jsr:@masinc/safe-find/safe-find

# Install safe-fd
deno install -g --allow-run jsr:@masinc/safe-find/safe-fd
```

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

safe-find and safe-fd add minimal overhead:

- Argument parsing: ~1ms
- Security filtering: ~1ms
- Original command execution: same as native

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
deno task test

# Run integration tests
deno task test:integration

# Run all tests
deno task test:all

# Test locally
deno run --allow-run safe-find.ts . -name "*.ts"
deno run --allow-run safe-fd.ts "*.md"
```

## 📚 Use Cases

- **CI/CD pipelines**: Prevent accidental command execution in automated scripts
- **Shared servers**: Allow file search without execution risks
- **Security-conscious environments**: Maintain find/fd functionality while
  blocking dangerous operations
- **Teaching environments**: Safe way to learn find/fd without execution risks

## 📄 License

MIT License

## 🔗 Links

### Project Links

- [JSR Package](https://jsr.io/@masinc/safe-find)
- [GitHub Repository](https://github.com/masinc/safe-find)
- [Issues & Bug Reports](https://github.com/masinc/safe-find/issues)

### Original Commands

- [find command](https://www.gnu.org/software/findutils/manual/html_mono/find.html) -
  GNU findutils documentation
- [fd command](https://github.com/sharkdp/fd) - A simple, fast and user-friendly
  alternative to find

## ⭐ Show Your Support

Give a ⭐️ if this project helped you stay safe while using find/fd commands!
