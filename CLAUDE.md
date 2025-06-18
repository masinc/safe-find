# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際にClaude Code (claude.ai/code)
にガイダンスを提供します。

## プロジェクト概要

これは "safe-find" という名前のRustプロジェクトです。このプロジェクトは `find` と `fd` コマンドの安全なラッパーである `safe-find` と `safe-fd` を提供します。これらのラッパーは、元のコマンドの危険な `-exec` 系オプション（`-exec`, `-execdir`, `-delete` など）を無効化し、セキュリティリスクを軽減します。

プロジェクトはRustで実装され、crates.ioで公開されています。バイナリサイズは361KBと非常に軽量で、ゼロ依存関係で動作します。

## 開発コマンド

- **ビルド**: `cargo build` (デバッグ) / `cargo build --release` (最適化)
- **テストの実行**: `cargo test` (全テスト)
- **ユニットテストの実行**: `cargo test --lib`
- **統合テストの実行**: `cargo test --test integration_test`
- **safe-findの実行**: `cargo run --bin safe-find`
- **safe-fdの実行**: `cargo run --bin safe-fd`
- **フォーマット**: `cargo fmt`
- **リント**: `cargo clippy`
- **インストール**: `cargo install --path .` (ローカル) / `cargo install safe-find` (crates.io)

## プロジェクト構成

- `Cargo.toml` - Rustプロジェクト設定・依存関係・バイナリ定義
- `src/lib.rs` - 共通ライブラリ（危険オプション検出ロジック・ユニットテスト）
- `src/bin/safe-find.rs` - `safe-find` 実行可能ファイル
- `src/bin/safe-fd.rs` - `safe-fd` 実行可能ファイル
- `tests/integration_test.rs` - 統合テスト（コマンド実行レベルのテスト）
- `.github/workflows/` - CI/CD設定（Rust toolchain、ユニット＋統合テスト）

## 依存関係

**ゼロ依存関係** - 外部ライブラリを一切使用せず、Rust標準ライブラリのみで実装されています。これにより：

- **軽量**: バイナリサイズ361KB
- **高速**: 瞬時起動
- **安全**: 依存関係の脆弱性リスクなし
- **互換性**: 追加インストール不要

## アーキテクチャ注記

このプロジェクトは2つの独立した実行可能ファイル（`safe-find`, `safe-fd`）からなるツール集です。各バイナリは `Cargo.toml` の `[[bin]]` セクションで定義されています。

- **共通ライブラリ**: `src/lib.rs` に危険オプション検出・コマンド実行ロジックを実装
- **実行ファイル**: `src/bin/` 配下で各ツールの main 関数を実装
- **サイズ最適化**: `Cargo.toml` の `[profile.release]` で積極的な最適化設定

各ラッパーは元のコマンドの引数を解析し、危険なオプションを除去してから安全な形で実行します。

## セキュリティ機能

このプロジェクトの主要な目的は、`find` と `fd`
コマンドの安全なラッパーを提供することです：

### safe-find

- **危険なオプションの無効化**: `-exec`, `-execdir`, `-ok`, `-okdir`, `-delete`
  などの任意コマンド実行・破壊的操作を可能にするオプションをフィルタリング

### safe-fd

- **危険なオプションの無効化**: `-x`, `--exec`, `-X`, `--exec-batch`, `-l`,
  `--list-details` などの任意コマンド実行を可能にするオプションをフィルタリング

### 共通機能

- **安全なファイル検索**:
  ファイル検索機能は保持しつつ、セキュリティリスクのある機能を除去
- **透明性**: 元のコマンドの使いやすさを維持しながら、危険な機能のみを制限

## インストール・使用方法

### Crates.ioからのインストール

```bash
# グローバルインストール（推奨）
cargo install safe-find

# ローカルビルド・インストール
git clone https://github.com/masinc/safe-find.git
cd safe-find
cargo install --path .
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

- **CI**: PR・pushで自動テスト実行（ユニットテスト＋統合テスト、`cargo fmt`, `cargo clippy`）
- **公開**: タグ作成時に自動でcrates.ioに公開
- **リリース**: タグ作成時にGitHub Releasesにクロスプラットフォームバイナリを自動デプロイ
- **最適化**: リリースビルドでサイズ・パフォーマンス最適化（361KBバイナリ）

## リリース作業手順

リリースを行う際は、必ずTodoWriteツールを使用して以下のタスクリストを作成し、順次実行してください：

```
TodoWrite ツールで以下のTODOリストを作成：
1. mainブランチの最新CI状態確認 (gh run list --branch main --limit 3)
2. ローカル全テスト実行 (cargo test) - ユニット＋統合テスト
3. フォーマットチェック (cargo fmt --check)
4. リントチェック (cargo clippy -- -D warnings)
5. Cargo.toml バージョン更新
6. バージョン更新をコミット・push
7. mainブランチのコミット後CI成功確認 (gh run list --branch main --limit 3)
8. リリースタグ作成・push (git tag vX.Y.Z && git push origin vX.Y.Z)
9. crates.io公開ワークフロー実行確認 (gh run list --limit 3)
10. 公開成功確認 (gh run view <run-id>)
```

詳細な手順は `DEPLOYMENT.md` を参照してください。

## バイナリリリース

タグpush時に自動で以下が実行されます：

1. **クロスプラットフォームバイナリビルド**:
   - Linux (x86_64)
   - Windows (x86_64)
   - macOS (x86_64, ARM64)

2. **GitHub Releasesに自動公開**:
   - プラットフォーム別アーカイブ (tar.gz/zip)
   - インストール手順を含むリリースノート
   - Crates.ioパッケージとバイナリの両方を提供

3. **配布形式**:
   - Crates.io: `cargo install safe-find`
   - バイナリ: GitHub Releasesページからダウンロード（361KBの軽量バイナリ）
