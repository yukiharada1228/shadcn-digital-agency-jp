import { createRoot } from "react-dom/client"
import { useState, type ReactNode } from "react"

import { Blockquote } from "@/components/ui/blockquote"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChipLabel } from "@/components/ui/chip-label"
import { Divider } from "@/components/ui/divider"
import { Dd, Dl, Dt } from "@/components/ui/description-list"
import { ErrorText } from "@/components/ui/error-text"
import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"
import {
  Image,
  ImageArea,
  ImageAreaLink,
  ImageCaption,
  ImageFigure,
} from "@/components/ui/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { List } from "@/components/ui/list"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RequirementBadge } from "@/components/ui/requirement-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { SupportText } from "@/components/ui/support-text"
import { Textarea } from "@/components/ui/textarea"
import { UtilityLink } from "@/components/ui/utility-link"

import { sourceParityStories } from "./source-parity"
import "./visual.css"

type VisualStory = {
  title: string
  node: ReactNode
}

const fieldClass = "flex flex-col items-start gap-2"
const storyFrameClass = "min-h-screen bg-white p-8"
const sampleImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23e8f1fe'/%3E%3Cpath d='M32 132h256' stroke='%230017c1' stroke-width='8'/%3E%3Ccircle cx='94' cy='78' r='34' fill='%2300118f'/%3E%3Crect x='156' y='52' width='92' height='52' rx='8' fill='%23ffffff' stroke='%230017c1' stroke-width='4'/%3E%3C/svg%3E"

function ButtonAllButtons() {
  return (
    <div className="flex flex-col gap-8">
      {(["solid-fill", "outline", "text"] as const).map((variant) => (
        <section key={variant}>
          <h2 className="mb-6 text-std-32B-150">
            {variant === "solid-fill"
              ? "塗りボタン（Solid Fill）"
              : variant === "outline"
                ? "アウトラインボタン（Outline）"
                : "テキストボタン（Text）"}
          </h2>
          <div className="flex items-center gap-4">
            {(["lg", "md", "sm", "xs"] as const).map((size) => (
              <Button key={size} variant={variant} size={size}>
                ラベル
              </Button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function InputPlayground() {
  return (
    <div className={fieldClass}>
      <Label htmlFor="visual-input">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id="visual-input-support">サポートテキスト</SupportText>
      <Input
        aria-describedby="visual-input-support"
        className="w-80"
        defaultValue="入力テキスト"
        id="visual-input"
        name="visual-input"
      />
    </div>
  )
}

function TextareaPlayground() {
  return (
    <div className={fieldClass}>
      <Label htmlFor="visual-textarea">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id="visual-textarea-support">サポートテキスト</SupportText>
      <Textarea
        aria-describedby="visual-textarea-support"
        className="h-36 w-[28rem]"
        defaultValue="入力テキスト"
        id="visual-textarea"
        name="visual-textarea"
      />
    </div>
  )
}

function SelectPlayground() {
  return (
    <div className={fieldClass}>
      <Label htmlFor="visual-select-trigger">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id="visual-select-support">サポートテキスト</SupportText>
      <div className="w-80">
        <Select defaultValue="1">
          <SelectTrigger
            aria-describedby="visual-select-support"
            id="visual-select-trigger"
          >
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">選択肢1</SelectItem>
            <SelectItem value="2">選択肢2</SelectItem>
            <SelectItem value="3">選択肢3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function CheckboxRow({ checked, label }: { checked?: boolean; label: string }) {
  return (
    <div className="flex w-fit items-start gap-1 py-2">
      <Checkbox aria-label={label} defaultChecked={checked} />
      <span className="pt-px text-dns-16N-130 text-solid-gray-800">
        {label}
      </span>
    </div>
  )
}

function CheckboxStacked() {
  return (
    <fieldset>
      <legend className="text-std-17B-170 text-solid-gray-800">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </legend>
      <SupportText className="mt-2" id="visual-checkbox-support">
        サポートテキスト
      </SupportText>
      <div className="mt-2 flex flex-col gap-2">
        <CheckboxRow label="選択肢1" />
        <CheckboxRow checked label="選択肢2" />
        <CheckboxRow label="選択肢3" />
      </div>
    </fieldset>
  )
}

function RadioStacked() {
  return (
    <fieldset>
      <legend className="text-std-17B-170 text-solid-gray-800">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </legend>
      <SupportText className="mt-2" id="visual-radio-support">
        サポートテキスト
      </SupportText>
      <RadioGroup
        aria-describedby="visual-radio-support"
        className="mt-1 gap-0"
        defaultValue="2"
      >
        {["選択肢1", "選択肢2", "選択肢3"].map((label, index) => (
          <div className="flex w-fit items-start gap-1 py-2" key={label}>
            <RadioGroupItem aria-label={label} value={String(index + 1)} />
            <span className="pt-px text-dns-16N-130 text-solid-gray-800">
              {label}
            </span>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

function FormErrorStack() {
  return (
    <div className={fieldClass}>
      <Label htmlFor="visual-input-error">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id="visual-input-error-support">
        サポートテキスト
      </SupportText>
      <Input
        aria-describedby="visual-input-error-text visual-input-error-support"
        className="w-80"
        id="visual-input-error"
        isError
        name="visual-input-error"
      />
      <ErrorText id="visual-input-error-text">＊エラーテキスト</ErrorText>
    </div>
  )
}

function BrowserA11yShowcase() {
  return (
    <div className="grid max-w-4xl gap-8">
      <Heading size="32" hasChip rule="4">
        <HeadingShoulder data-a11y-contrast>手続き情報</HeadingShoulder>
        <HeadingTitle data-a11y-contrast level="h1">
          アクセシビリティ検証
        </HeadingTitle>
      </Heading>

      <div className={fieldClass}>
        <Label data-a11y-contrast htmlFor="a11y-input">
          氏名<RequirementBadge data-a11y-contrast>※必須</RequirementBadge>
        </Label>
        <SupportText data-a11y-contrast id="a11y-input-help">
          住民票に記載されている氏名を入力してください。
        </SupportText>
        <Input
          aria-describedby="a11y-input-help"
          className="w-80"
          data-a11y-contrast
          defaultValue="デジタル 太郎"
          id="a11y-input"
        />
      </div>

      <div className={fieldClass}>
        <Label data-a11y-contrast htmlFor="a11y-textarea">
          補足事項
        </Label>
        <Textarea
          className="h-28 w-[28rem]"
          data-a11y-contrast
          defaultValue="申請に関する補足事項を入力します。"
          id="a11y-textarea"
        />
      </div>

      <div className={fieldClass}>
        <Label data-a11y-contrast htmlFor="a11y-select-trigger">
          都道府県
        </Label>
        <div className="w-80">
          <Select defaultValue="tokyo">
            <SelectTrigger data-a11y-contrast id="a11y-select-trigger">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokyo">東京都</SelectItem>
              <SelectItem value="osaka">大阪府</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <fieldset>
        <legend className="text-std-17B-170 text-solid-gray-800">
          <span data-a11y-contrast>通知設定</span>
        </legend>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex w-fit items-start gap-1 py-2">
            <Checkbox aria-label="メールで通知する" defaultChecked />
            <span
              className="pt-px text-dns-16N-130 text-solid-gray-800"
              data-a11y-contrast
            >
              メールで通知する
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-std-17B-170 text-solid-gray-800">
          <span data-a11y-contrast>連絡方法</span>
        </legend>
        <RadioGroup className="mt-1 gap-0" defaultValue="mail">
          <div className="flex w-fit items-start gap-1 py-2">
            <RadioGroupItem aria-label="メール" value="mail" />
            <span
              className="pt-px text-dns-16N-130 text-solid-gray-800"
              data-a11y-contrast
            >
              メール
            </span>
          </div>
          <div className="flex w-fit items-start gap-1 py-2">
            <RadioGroupItem aria-label="郵送" value="post" />
            <span
              className="pt-px text-dns-16N-130 text-solid-gray-800"
              data-a11y-contrast
            >
              郵送
            </span>
          </div>
        </RadioGroup>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <Button data-a11y-contrast>申請する</Button>
        <Link data-a11y-contrast href="/help">
          ヘルプ
        </Link>
        <UtilityLink data-a11y-contrast href="/related">
          関連情報
        </UtilityLink>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <StatusBadge data-a11y-contrast>受付済み</StatusBadge>
        <ChipLabel data-a11y-contrast color="blue" variant="filled-1">
          ラベル
        </ChipLabel>
        <ChipLabel data-a11y-contrast color="green" variant="filled-2">
          完了
        </ChipLabel>
      </div>

      <Divider />

      <List spacing="8">
        <li data-a11y-contrast>本人確認書類</li>
        <li data-a11y-contrast>申請書</li>
      </List>

      <Dl marker="bullet">
        <Dt data-a11y-contrast>申請期限</Dt>
        <Dd data-a11y-contrast>2026年7月31日</Dd>
        <Dt data-a11y-contrast>対象者</Dt>
        <Dd data-a11y-contrast>日本国内に居住する申請者</Dd>
      </Dl>

      <Blockquote>
        <p data-a11y-contrast>
          すべての人がデジタルサービスを利用できるように設計します。
        </p>
      </Blockquote>

      <ImageFigure>
        <ImageArea bordered>
          <ImageAreaLink aria-label="サンプル画像の詳細" href="/image">
            <Image alt="行政手続きのサンプル画像" src={sampleImage} />
          </ImageAreaLink>
        </ImageArea>
        <ImageCaption data-a11y-contrast captionStyle="solid">
          画像の説明
        </ImageCaption>
      </ImageFigure>

      <div className={fieldClass}>
        <Label data-a11y-contrast htmlFor="a11y-error-input">
          メールアドレス
        </Label>
        <Input
          aria-describedby="a11y-error"
          className="w-80"
          data-a11y-contrast
          defaultValue="invalid"
          id="a11y-error-input"
          isError
        />
        <ErrorText data-a11y-contrast id="a11y-error">
          メールアドレスの形式で入力してください。
        </ErrorText>
      </div>
    </div>
  )
}

function BrowserA11yInteractive() {
  const [status, setStatus] = useState("未実行")

  return (
    <div className="grid max-w-xl gap-6">
      <Button
        data-testid="keyboard-button"
        onClick={() => setStatus("ボタンを実行しました")}
      >
        実行
      </Button>

      <Checkbox aria-label="メールで通知する" data-testid="keyboard-checkbox" />

      <RadioGroup aria-label="連絡方法" defaultValue="mail">
        <RadioGroupItem aria-label="メール" value="mail" />
        <RadioGroupItem aria-label="郵送" value="post" />
      </RadioGroup>

      <Label htmlFor="keyboard-select-trigger">都道府県</Label>
      <Select>
        <SelectTrigger
          data-testid="keyboard-select"
          id="keyboard-select-trigger"
        >
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tokyo">東京都</SelectItem>
          <SelectItem value="osaka">大阪府</SelectItem>
        </SelectContent>
      </Select>

      <p data-testid="keyboard-status" role="status">
        {status}
      </p>
    </div>
  )
}

const visualStories: Record<string, VisualStory> = {
  "component-dads-v2-button--all-buttons": {
    title: "Component/ボタン/AllButtons",
    node: <ButtonAllButtons />,
  },
  "component-dads-v2-input--playground": {
    title: "Component/インプットテキスト/Playground",
    node: <InputPlayground />,
  },
  "component-dads-v2-textarea--playground": {
    title: "Component/テキストエリア/Playground",
    node: <TextareaPlayground />,
  },
  "component-dads-v2-select--playground": {
    title: "Component/セレクトボックス/Playground",
    node: <SelectPlayground />,
  },
  "component-dads-v2-checkbox--stacked": {
    title: "Component/チェックボックス/Stacked",
    node: <CheckboxStacked />,
  },
  "component-dads-v2-radio--stacked": {
    title: "Component/ラジオボタン/Stacked",
    node: <RadioStacked />,
  },
  "component-dads-v2-input--errored": {
    title: "Component/インプットテキスト/Errored",
    node: <FormErrorStack />,
  },
  "component-dads-v2-a11y--showcase": {
    title: "Component/A11y/Showcase",
    node: <BrowserA11yShowcase />,
  },
  "component-dads-v2-a11y--interactive": {
    title: "Component/A11y/Interactive",
    node: <BrowserA11yInteractive />,
  },
}

function VisualApp() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id") ?? "component-dads-v2-button--all-buttons"
  const source = params.get("source")
  const sourceParityStory = sourceParityStories[id]

  if (sourceParityStory && (source === "upstream" || source === "ours")) {
    return (
      <main className={storyFrameClass}>
        <section
          aria-label={sourceParityStory.title}
          data-source={source}
          data-story-id={id}
          data-testid="visual-story"
        >
          {sourceParityStory[source]}
        </section>
      </main>
    )
  }

  const story = visualStories[id]

  if (!story) {
    return (
      <main className={storyFrameClass}>
        <h1 className="text-std-24B-150">Unknown visual story</h1>
        <p className="mt-4 text-std-16N-170">{id}</p>
      </main>
    )
  }

  return (
    <main className={storyFrameClass}>
      <section
        aria-label={story.title}
        data-story-id={id}
        data-testid="visual-story"
      >
        {story.node}
      </section>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<VisualApp />)
