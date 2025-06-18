# safe-find

`find` と `fd` コマンドの危険な実行オプションをブロックする安全なラッパーです。

## 🚀 クイックスタート

```bash
# 両方のツールをインストール
deno install -g --allow-run jsr:@masinc/safe-find/safe-find
deno install -g --allow-run jsr:@masinc/safe-find/safe-fd

# 通常のfind/fdコマンドと同じように使用
safe-find . -name "*.txt" -type f
safe-fd "*.js"
```

## 🔒 なぜsafe-findが必要？

標準の `find` と `fd`
コマンドには、任意のコマンドを実行できる強力だが危険なオプションがあります：

```bash
# ⚠️ 危険 - 任意のコマンドを実行可能
find . -name "*.tmp" -exec rm {} \;
fd "*.tmp" -x rm

# ✅ 安全 - 危険なオプションはブロックされる
safe-find . -name "*.tmp" -delete  # ❌ ブロック
safe-fd "*.tmp" -x rm              # ❌ ブロック
```

## 🛡️ ブロックされるオプション

### safe-findがブロックするオプション：

- `-exec` - 任意のコマンド実行
- `-execdir` - ファイルのディレクトリでコマンド実行
- `-ok` - 対話的コマンド実行
- `-okdir` - ファイルのディレクトリで対話的コマンド実行
- `-delete` - マッチしたファイル/ディレクトリの削除

### safe-fdがブロックするオプション：

- `-x`, `--exec` - 任意のコマンド実行
- `-X`, `--exec-batch` - バッチコマンド実行
- `-l`, `--list-details` - 内部で`ls`を使用（潜在的リスク）

## 📦 インストール

### 前提条件

- [Deno](https://deno.land/) 2.x 以降

### JSRからのインストール

```bash
# safe-findをインストール
deno install -g --allow-run jsr:@masinc/safe-find/safe-find

# safe-fdをインストール
deno install -g --allow-run jsr:@masinc/safe-find/safe-fd
```

## 🔧 使用方法

### safe-find

すべての安全な `find` オプションは全く同じように動作します：

```bash
# TypeScriptファイルを検索
safe-find . -name "*.ts" -type f

# 大きなログファイルを検索
safe-find /var/log -name "*.log" -size +10M

# 最近変更されたファイルを検索
safe-find . -mtime -7 -type f

# 複雑な検索
safe-find . \( -name "*.js" -o -name "*.ts" \) -not -path "*/node_modules/*"
```

### safe-fd

すべての安全な `fd` オプションは全く同じように動作します：

```bash
# JavaScriptファイルを検索
safe-fd "*.js"

# globパターンでファイルを検索
safe-fd --glob "*.ts" --type f

# 特定のディレクトリで検索
safe-fd "README" /home

# 大文字小文字を区別しない検索
safe-fd --ignore-case "readme"
```

## ⚡ パフォーマンス

safe-findとsafe-fdは最小限のオーバーヘッドしか追加しません：

- 引数解析: ~1ms
- セキュリティフィルタリング: ~1ms
- 元のコマンド実行: ネイティブと同じ

## 🧪 出力例

```bash
$ safe-find . -exec echo "test" \;
Error: Dangerous option '-exec' is not allowed for security reasons

$ safe-fd "*.js" -x rm
Error: Dangerous option '-x' is not allowed for security reasons

$ safe-find . -name "*.md" -type f
./README.md
./README.ja.md
./CLAUDE.md
```

## 🛠️ 開発

```bash
# リポジトリをクローン
git clone https://github.com/masinc/safe-find.git
cd safe-find

# テスト実行
deno task test

# 統合テスト実行
deno task test:integration

# 全テスト実行
deno task test:all

# ローカルでテスト
deno run --allow-run safe-find.ts . -name "*.ts"
deno run --allow-run safe-fd.ts "*.md"
```

## 📚 使用例

### 🤖 LLM/AIツール（主要な用途）

**最も重要な用途は、Claude Code、ChatGPT Code
Interpreter、その他のLLMベース開発アシスタントなどのAIツールに安全なファイル検索機能を提供することです。**

AIモデルはファイルシステムの検索・分析を行う必要がありますが、危険な実行コマンドへのアクセスを与えることは重大なセキュリティリスクとなります。safe-findとsafe-fdは完璧な解決策を提供します -
実行機能なしでの完全な検索機能です。

#### Claude Code統合

AIアシスタンスで安全なファイル操作を有効にするため、プロジェクトの`CLAUDE.md`ファイルに以下を追加してください：

```markdown
## AIアシスタント向け安全なファイル検索

### インストール

fdがインストール済みの場合:
`deno install -g --allow-run jsr:@masinc/safe-find/safe-fd`

fdがない場合: `deno install -g --allow-run jsr:@masinc/safe-find/safe-find`

### Claude Code ツール設定

`.claude/settings.local.json` に以下を追加:

{ "permissions": { "allow": [ "Bash(safe-find:_)", "Bash(safe-fd:_)" ], "deny":
[ "Bash(find:_)", "Bash(fd:_)" ] } }

### 使用方法

fdがある環境では `safe-fd` を、ない環境では `safe-find` を使用してください。
どちらも危険な実行オプションをブロックしつつ、安全なファイル検索機能を提供します。

基本的な検索例:

- fdがある場合: `safe-fd "*.ts" --type f`
- fdがない場合: `safe-find . -name "*.ts" -type f`
```

#### AI開発における利点：

- **セキュリティ**: 偶発的なファイル削除やコマンド実行を防止
- **機能性**: すべての検索・フィルタリング機能を維持
- **パフォーマンス**: 検索操作に対するオーバーヘッドゼロ
- **信頼性**: AIへのファイルシステムタスク委任を安心して実行
- **コンプライアンス**: 自動化開発環境のセキュリティ要件を満たす

### 🛠️ その他の使用例

- **CI/CDパイプライン**: 自動化スクリプトでの偶発的なコマンド実行を防止
- **共有サーバー**: 実行リスクなしでファイル検索を許可
- **セキュリティ重視の環境**: find/fd機能を維持しながら危険な操作をブロック
- **教育環境**: 実行リスクなしでfind/fdを安全に学習
- **開発コンテナ**: コンテナ化された開発環境での安全なファイル操作

## 📄 ライセンス

MITライセンス

## 🔗 リンク

### プロジェクトリンク

- [JSRパッケージ](https://jsr.io/@masinc/safe-find)
- [GitHubリポジトリ](https://github.com/masinc/safe-find)
- [Issues・バグレポート](https://github.com/masinc/safe-find/issues)

### 元のコマンド

- [findコマンド](https://www.gnu.org/software/findutils/manual/html_mono/find.html) -
  GNU findutilsドキュメント
- [fdコマンド](https://github.com/sharkdp/fd) -
  findのシンプルで高速なユーザーフレンドリーな代替

## ⭐ サポートを表示

このプロジェクトがfind/fdコマンドを安全に使用するのに役立った場合は、⭐️をお願いします！
