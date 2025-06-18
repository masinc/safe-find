# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際にClaude Code (claude.ai/code)
にガイダンスを提供します。

## プロジェクト概要

これは "safe-find" という名前のDeno
TypeScriptプロジェクトです。このプロジェクトは `find` と `fd`
コマンドの安全なラッパーである `safe-find` と `safe-fd`
を提供します。これらのラッパーは、元のコマンドの危険な `-exec`
系オプション（`-exec`, `-execdir`, `-delete`
など）を無効化し、セキュリティリスクを軽減します。

プロジェクトは `mise.toml` で指定されているDeno 2.xをランタイム管理に使用し、JSRで公開されています。

## 開発コマンド

- **safe-findの実行**: `deno run --allow-run safe-find.ts`
- **safe-fdの実行**: `deno run --allow-run safe-fd.ts`
- **テストの実行**: `deno task test` (または `deno test`)
- **テストのウォッチモード**: `deno task test:watch`
- **統合テストの実行**: `deno task test:integration`
- **全テストの実行**: `deno task test:all`

## プロジェクト構成

- `safe-find.ts` - `find` コマンドの安全なラッパー実装
- `safe-fd.ts` - `fd` コマンドの安全なラッパー実装
- `safe-find_test.ts` - safe-findのunit test
- `safe-fd_test.ts` - safe-fdのunit test
- `integration-test.ts` - コマンド実行レベルのintegration test
- `deno.jsonc` - Deno設定（JSR公開設定、実行可能ファイル定義、タスク）
- `mise.toml` - ツールバージョン管理 (Deno 2.x)
- `.github/workflows/` - CI/CD設定

## 依存関係

プロジェクトは最小限の依存関係を使用しています：

- `@std/assert` - テストアサーション用のJSRライブラリ

## アーキテクチャ注記

このプロジェクトは2つの独立した実行可能ファイル（`safe-find.ts`、`safe-fd.ts`）からなるツール集です。各ファイルは
`deno.jsonc` の `bin`
セクションで実行可能ファイルとして定義されています。各ラッパーは元のコマンドの引数を解析し、危険なオプションを除去してから安全な形で実行します。

## セキュリティ機能

このプロジェクトの主要な目的は、`find` と `fd`
コマンドの安全なラッパーを提供することです：

### safe-find
- **危険なオプションの無効化**: `-exec`, `-execdir`, `-ok`, `-okdir`, `-delete`
  などの任意コマンド実行・破壊的操作を可能にするオプションをフィルタリング

### safe-fd  
- **危険なオプションの無効化**: `-x`, `--exec`, `-X`, `--exec-batch`, `-l`, `--list-details`
  などの任意コマンド実行を可能にするオプションをフィルタリング

### 共通機能
- **安全なファイル検索**: ファイル検索機能は保持しつつ、セキュリティリスクのある機能を除去
- **透明性**: 元のコマンドの使いやすさを維持しながら、危険な機能のみを制限

## インストール・使用方法

### JSRからのインストール
```bash
# グローバルインストール
deno install -g --allow-run jsr:@masinc/safe-find/safe-find
deno install -g --allow-run jsr:@masinc/safe-find/safe-fd
```

### 使用例
```bash
# safe-find
safe-find . -name "*.txt" -type f
safe-find /home -name "*.log" -size +1M

# safe-fd
safe-fd "*.js"
safe-fd --glob "*.ts" --type f
```

## CI/CD

- **CI**: PR・pushで自動テスト実行（unit test + integration test）
- **公開**: タグ作成時に自動でJSRに公開
- **テスト分離**: unit testとintegration testを分離して実行
