# shadcn-digital-agency-jp

デジタル庁デザインシステム（DADS）を参考にした、**非公式**の shadcn/ui ネイティブコンポーネント集です。
`shadcn add` でソースコードごとプロジェクトに取り込めます。

> Unofficial shadcn/ui native components inspired by the Digital Agency Design System.

> [!IMPORTANT]
> 本プロジェクトはデジタル庁公式ではありません。**Unofficial — not** an official
> Digital Agency (デジタル庁) product. デザイン仕様は
> [digital-go-jp/design-system-example-components-react](https://github.com/digital-go-jp/design-system-example-components-react)
> を参照し、shadcn/ui ネイティブ（ソース配布）な形で再実装しています。

## これは何？ / What is this

- **shadcn registry** です。`shadcn add <name>` で、コンポーネントが**ソースコードとして**
  あなたのプロジェクト（`components.json` の `aliases.ui`、既定 `components/ui`）に配置されます。
  npm package の wrapper ではないので、コードを自由に読んで・直せます。
- **DADS のデザイントークン**（色・タイポグラフィ・角丸・影など）を Tailwind CSS v4 用の
  `digital-agency.css` として同梱。`bg-key-900` や `text-std-17B-170` のようなユーティリティが使えます。
- shadcn/ui の慣習に準拠：`cn()` / `cva` / `asChild`（`@radix-ui/react-slot`）/ `data-slot` /
  compound component。
- **upstream の全 41 コンポーネントを実装済み**（下記カタログ参照）。upstream は Git submodule として
  read-only 参照し、parity テストで追随します。

## 動作要件 / Requirements

- **React 18 または 19**
- **Tailwind CSS v4**
- `shadcn` CLI で `init` 済み（`components.json` があること）

## クイックスタート / Quick start

### 1. shadcn/ui を Vite に導入（未実施なら）

まず [shadcn/ui の Vite 公式手順](https://ui.shadcn.com/docs/installation/vite) に沿って、
Vite project に shadcn/ui を入れてください。pnpm の場合は公式 docs の **Existing Project** 手順が確実です。

```bash
pnpm create vite@latest my-app --template react-ts
cd my-app
pnpm install
pnpm add tailwindcss @tailwindcss/vite
pnpm add -D @types/node
```

`src/index.css` を Tailwind v4 の import にします。`tsconfig.json` と `tsconfig.app.json` には
`@/*` alias を追加し、`vite.config.ts` には Tailwind plugin と `@` alias を追加してください。
設定内容は shadcn/ui 公式 Vite docs の **Add Tailwind CSS** / **Edit tsconfig** /
**Update vite.config.ts** と同じです。

```css
@import "tailwindcss";
```

ここまで設定してから `shadcn init` を実行してください。

```bash
pnpm dlx shadcn@latest init
```

> [!NOTE]
> 公式 docs には `pnpm dlx shadcn@latest init -t vite` で新規 Vite project を作る手順もあります。
> ただし pnpm では `ERR_PNPM_ADDING_TO_ROOT` で止まる場合があるため、この README では公式の
> **Existing Project** 手順を推奨しています。`ignore-workspace-root-check=true` は不要です。

### 2. コンポーネントを追加

各コンポーネントは `theme` に依存しているため、**1つ追加するだけで**
トークン CSS・`cn()`・必要な npm 依存も一緒に入ります。

```bash
# 単体で追加
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/button

# まとめて追加（セットは後述）
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/core
```

### 3. テーマ CSS を読み込む

グローバル CSS（例 `src/index.css` / `app/globals.css`）で一度だけ import します。

```css
@import "tailwindcss";
@import "@/styles/digital-agency.css";
```

これだけで完了です。`.npmrc` の追記や `clsx` / `tailwind-merge` の手動 install は不要です。

## コンポーネント一覧 / Components

全 **41 コンポーネント**。`add` するときの名前は各コード（`yukiharada1228/shadcn-digital-agency-jp/<name>`）です。

### 基本 / Basics

`button` · `link` · `utility-link` · `heading` · `divider` · `list` · `dl` · `blockquote` · `image` · `legend`

### フォーム / Form

`input` · `textarea` · `label` · `select` · `checkbox` · `radio-group` · `requirement-badge` · `support-text` · `error-text` · `calendar` · `date-picker` · `separated-date-picker` · `file-upload`

### バッジ・通知 / Badges & notifications

`status-badge` · `chip-label` · `notification-banner` · `emergency-banner` · `progress-indicator`

### ナビゲーション / Navigation

`breadcrumbs` · `tabs` · `accordion` · `disclosure` · `horizontal-menu` · `hamburger-menu-button` · `menu-list` · `menu-list-box` · `language-selector`

### オーバーレイ / Overlay

`dialog` · `drawer`

### データ表示 / Data display

`table` · `carousel`

> 命名メモ: upstream の `ModalDialog` → `dialog`、`Radio` → `radio-group`、`Tab` → `tabs` に対応しています。

### セット / Bundles

よく使う組み合わせをまとめて入れられます。

| セット  | 内容                                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme` | デザイントークン CSS・`cn()`（`lib/utils.ts`）・ライセンス表示。`clsx` / `tailwind-merge` を依存として install。**全コンポーネントの土台。**                      |
| `core`  | 軽量な基本 UI（`button` `input` `textarea` `label` `divider` `link` `utility-link` `heading` `list` `blockquote` `dl` `image`）。重いオーバーレイ等は含みません。 |
| `form`  | フォーム系（`checkbox` `radio-group` `select` `error-text` `support-text` `requirement-badge` `status-badge` `chip-label`）。                                     |

```bash
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/form
```

> [!NOTE]
> GitHub registry の `#branch` / `#tag` / `#commit` ref は `registryDependencies` に継承されません。
> 通常は ref なしのコマンドを使ってください。

## 使い方 / Usage

shadcn/ui の既定 alias（`@/components/ui`）を使う例です。

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <>
      <Button>送信</Button>
      <Button variant="outline" size="lg">
        戻る
      </Button>
      {/* asChild で任意の要素にスタイルを移譲 */}
      <Button asChild>
        <a href="/next">次へ</a>
      </Button>
    </>
  )
}
```

Radix 化・shadcn 化に伴う API / DOM の差分は
[`docs/compatibility.md`](./docs/compatibility.md) に明文化しています。

## 開発 / Development

このリポジトリは upstream を Git submodule として含みます。

```bash
git clone --recurse-submodules https://github.com/yukiharada1228/shadcn-digital-agency-jp.git
cd shadcn-digital-agency-jp
# 既に clone 済みなら: git submodule update --init --recursive

pnpm install
pnpm generate:theme     # トークンから digital-agency.css を生成
pnpm registry:generate  # registry.json を生成
pnpm typecheck
pnpm test               # unit + a11y (vitest)
pnpm test:visual        # Playwright visual regression
pnpm license:check      # 著作権表示 / attribution の検証
```

`upstream/` 配下は read-only です。実装は常に `src/components/ui/` に置きます。

### Demo

作業ツリー上の `src/components/ui/*` をブラウザで確認する画面です。

```bash
pnpm demo   # http://127.0.0.1:5173/
```

## ライセンス / License

本プロジェクトは [MIT License](./LICENSE) です。

デジタル庁デザインシステムの仕様・実装構造を参照しているため、
[`digital-go-jp/design-system-example-components-react`](https://github.com/digital-go-jp/design-system-example-components-react)
（Copyright (c) 2025 デジタル庁, MIT License）の著作権・ライセンス表示を
[`NOTICE`](./NOTICE) と [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) に保持しています。
registry 経由でコピーされる各コンポーネントには attribution header を付与しています。
