# shadcn-digital-agency-jp

デジタル庁デザインシステムを参考にした、非公式の shadcn/ui ネイティブコンポーネント集です。

> Unofficial shadcn/ui native components inspired by the Digital Agency Design System.

> [!IMPORTANT]
> 本プロジェクトはデジタル庁公式ではありません。**Unofficial.** This is **not** an
> official Digital Agency (デジタル庁) product. It reimplements component
> specifications from
> [digital-go-jp/design-system-example-components-react](https://github.com/digital-go-jp/design-system-example-components-react)
> in a shadcn/ui native, source-distributed form.

## 特徴 / What it is

- shadcn registry として `shadcn add` で導入でき、コンポーネントは利用者プロジェクトの
  `components/ui` に **ソースコードとして** 配置されます（npm package の wrapper ではありません）。
- `cn()` / `cva` / `asChild`（`@radix-ui/react-slot`）/ `data-slot` / compound component
  など shadcn/ui の慣習に従います。
- デジタル庁デザインシステム由来の Tailwind token を `digital-agency.css` として配布します。
- upstream を Git submodule として read-only 参照し、`components-map.json` と parity test で
  追随します。
- Radix 化や shadcn/ui 化による API / DOM 差分は
  [`docs/compatibility.md`](./docs/compatibility.md) に明文化します。

## インストール / Install

まだ shadcn/ui を初期化していない場合は、先に `shadcn init` を実行してください
（`components.json` と alias 設定が用意されます）。`theme` は各コンポーネントが依存する
`lib/utils.ts` の `cn()` も一緒に追加します。

```bash
pnpm dlx shadcn@latest init
```

```bash
# テーマ（トークン）
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/theme

# 個別コンポーネント
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/button

# 基本 UI セット
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/core

# フォーム系セット（checkbox / radio-group / select / 各種バッジ）
pnpm dlx shadcn@latest add yukiharada1228/shadcn-digital-agency-jp/form
```

テーマを有効にするため、グローバル CSS（例: `src/index.css` / `app/globals.css`）で
`digital-agency.css` を一度だけ import してください。

```css
@import "tailwindcss";
@import "@/styles/digital-agency.css";
```

`core` は軽量な基本 UI の最小セットです（Dialog / DatePicker などの重い component は含みません）。

## 使い方 / Usage

```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <>
      <Button>送信</Button>
      <Button variant="outline" size="lg">
        戻る
      </Button>
      <Button asChild>
        <a href="/next">次へ</a>
      </Button>
    </>
  )
}
```

## 開発 / Development

このリポジトリは upstream を Git submodule として含みます。clone 時にサブモジュールも取得してください。

```bash
git clone --recurse-submodules https://github.com/yukiharada1228/shadcn-digital-agency-jp.git
# 既に clone 済みの場合
git submodule update --init --recursive

pnpm install
pnpm generate:theme     # トークンから digital-agency.css を生成
pnpm registry:generate  # registry.json を生成
pnpm typecheck
pnpm test
pnpm test:visual        # Playwright visual regression
pnpm license:check
```

`upstream/` 配下は read-only です。本プロジェクトの実装は常に `src/components/ui/` に配置します。

### Demo

ローカルの demo は registry item の生成物ではなく、作業ツリー上の `src/components/ui/*` を直接確認するための画面です。

```bash
pnpm demo
```

Vite が起動したら `http://127.0.0.1:5173/` を開いてください。demo 用 CSS は Tailwind とテーマだけを読み込みます。

## ライセンス / License

本プロジェクトは [MIT License](./LICENSE) です。

デジタル庁デザインシステム由来の仕様・実装構造を参照しているため、
[`digital-go-jp/design-system-example-components-react`](https://github.com/digital-go-jp/design-system-example-components-react)
（Copyright (c) 2025 デジタル庁, MIT License）の著作権・ライセンス表示を
[`NOTICE`](./NOTICE) および [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) に保持しています。
registry 経由でコピーされる各コンポーネントには attribution header を付与しています。
