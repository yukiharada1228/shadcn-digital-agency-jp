# shadcn-digital-agency-jp

デジタル庁デザインシステムを参考にした、**非公式**の shadcn/ui ネイティブコンポーネント集です。
`shadcn add` でソースコードごとプロジェクトに取り込めます。

> Unofficial shadcn/ui native components inspired by the Digital Agency Design System.

> [!IMPORTANT]
> 本プロジェクトはデジタル庁公式ではありません（**Unofficial — not** an official Digital Agency product）。
> デザイン仕様は [digital-go-jp/design-system-example-components-react](https://github.com/digital-go-jp/design-system-example-components-react)
> を参照し、shadcn/ui ネイティブ（ソース配布）な形で再実装しています。

---

## 目次 / Contents

1. [特徴](#特徴--features)
2. [動作要件](#動作要件--requirements)
3. [使いはじめる（3ステップ）](#使いはじめる3ステップ--getting-started)
4. [使い方](#使い方--usage)
5. [コンポーネント一覧](#コンポーネント一覧--components)
6. [セット（Bundles）](#セットbundles)
7. [開発](#開発--development)
8. [ライセンス](#ライセンス--license)

---

## 特徴 / Features

- **ソースコードとして配布**
  `shadcn add <name>` でコンポーネントを直接コピー（既定 `components/ui`）。
  npm wrapper ではないので、コードを自由に読み・直せます。
- **デジタル庁のデザイントークンを同梱**
  色・タイポグラフィ・角丸・影などを Tailwind CSS v4 用の `digital-agency.css` として提供。
  `bg-key-900` や `text-std-17B-170` のようなユーティリティが使えます。
- **shadcn/ui の慣習に準拠**
  `cn()` / `cva` / `asChild`（`@radix-ui/react-slot`）/ `data-slot` / compound component。
- **upstream の全 41 コンポーネントを実装済み**
  upstream は Git submodule として read-only 参照し、parity テストで追随します。

---

## 動作要件 / Requirements

| 項目         | 要件                                        |
| ------------ | ------------------------------------------- |
| React        | **18 または 19**                            |
| Tailwind CSS | **v4**                                      |
| shadcn CLI   | `init` 済み（`components.json` があること） |

---

## 使いはじめる（3ステップ） / Getting started

### ステップ 1. Vite プロジェクトを新規作成する

[shadcn/ui の Vite 公式手順](https://ui.shadcn.com/docs/installation/vite#scaffold-with-create) に沿って、
`init` コマンドで新しい Vite プロジェクトを作成します。表示される質問に答えて、プロジェクト名、
ベースカラー、プリセットなどを設定してください。

```bash
npx shadcn@latest init -t vite
```

作成されたプロジェクトのディレクトリへ移動します。

```bash
cd my-app
```

### ステップ 2. コンポーネントを追加する

各コンポーネントは `theme` に依存しているため、**1つ追加するだけで**トークン CSS・`cn()`・
必要な npm 依存も一緒に入ります。

```bash
# 単体で追加
npx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/button

# セットで追加（内容は「セット」の節を参照）
npx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/core

# 全コンポーネントを追加
npx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/all-components
```

### ステップ 3. テーマ CSS を読み込む

グローバル CSS（例 `src/index.css` / `app/globals.css`）で一度だけ import します。

```css
@import "tailwindcss";
@import "@/styles/digital-agency.css";
```

これで完了です。`.npmrc` の追記や `clsx` / `tailwind-merge` の手動 install は不要です。

---

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

---

## コンポーネント一覧 / Components

全 **41 コンポーネント**。`add` するときの名前は `yukiharada1228/shadcn-digital-agency-jp/<name>` です。

| カテゴリ                                  | コンポーネント                                                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **基本** / Basics                         | `button` · `link` · `utility-link` · `heading` · `divider` · `list` · `description-list` · `blockquote` · `image` · `legend`                                                                        |
| **フォーム** / Form                       | `input` · `textarea` · `label` · `select` · `checkbox` · `radio-group` · `requirement-badge` · `support-text` · `error-text` · `calendar` · `date-picker` · `separated-date-picker` · `file-upload` |
| **バッジ・通知** / Badges & notifications | `status-badge` · `chip-label` · `notification-banner` · `emergency-banner` · `progress-indicator`                                                                                                   |
| **ナビゲーション** / Navigation           | `breadcrumbs` · `tabs` · `accordion` · `disclosure` · `horizontal-menu` · `hamburger-menu-button` · `menu-list` · `menu-list-box` · `language-selector`                                             |
| **オーバーレイ** / Overlay                | `dialog` · `drawer`                                                                                                                                                                                 |
| **データ表示** / Data display             | `table` · `carousel`                                                                                                                                                                                |

> 命名メモ: upstream の `ModalDialog` → `dialog`、`Radio` → `radio-group`、`Tab` → `tabs` に対応しています。

---

## セット（Bundles）

よく使う組み合わせをまとめて追加できます。

| セット           | 内容                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`          | デザイントークン CSS・`cn()`（`lib/utils.ts`）・ライセンス表示。`clsx` / `tailwind-merge` を依存として install。**全コンポーネントの土台。**                                    |
| `core`           | 軽量な基本 UI（`button` `input` `textarea` `label` `divider` `link` `utility-link` `heading` `list` `blockquote` `description-list` `image`）。重いオーバーレイ等は含みません。 |
| `form`           | フォーム系（`checkbox` `radio-group` `select` `error-text` `support-text` `requirement-badge` `status-badge` `chip-label`）。                                                   |
| `all-components` | 全コンポーネントと確認用画面（`components/digital-agency-all-components.tsx`）をまとめて追加します。実プロジェクトでの install 確認用 bundle です。                             |

```bash
npx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/form
npx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/all-components
```

> [!NOTE]
> GitHub registry の `#branch` / `#tag` / `#commit` ref は `registryDependencies` に継承されません。
> 通常は ref なしのコマンドを使ってください。

---

## 開発 / Development

このリポジトリは upstream を Git submodule として含み、開発用パッケージマネージャーには npm を使用します。

```bash
git clone --recurse-submodules https://github.com/yukiharada1228/shadcn-digital-agency-jp.git
cd shadcn-digital-agency-jp
# 既に clone 済みなら: git submodule update --init --recursive

npm install
npm run generate:theme     # トークンから digital-agency.css を生成
npm run registry:generate  # registry.json を生成
npm run typecheck
npm test                   # unit + a11y (vitest)
npm run test:visual        # Playwright visual regression
npm run license:check      # 著作権表示 / attribution の検証
```

`upstream/` 配下は read-only です。実装は常に `src/components/ui/` に置きます。

### Demo

作業ツリー上の `src/components/ui/*` をブラウザで確認する画面です。内容は registry block の
`all-components` と同じで、`shadcn add` 後の消費者プロジェクトと同じ `@/components/ui/*` import で動きます。

```bash
npm run demo   # http://127.0.0.1:5173/
```

---

## ライセンス / License

本プロジェクトは [MIT License](./LICENSE) です。

デジタル庁デザインシステムの仕様・実装構造を参照しているため、
[`digital-go-jp/design-system-example-components-react`](https://github.com/digital-go-jp/design-system-example-components-react)
（Copyright (c) 2025 デジタル庁, MIT License）の著作権・ライセンス表示を
[`NOTICE`](./NOTICE) と [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) に保持しています。
registry 経由でコピーされる各コンポーネントには attribution header を付与しています。
