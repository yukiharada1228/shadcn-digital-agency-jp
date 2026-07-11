import { createRoot } from "react-dom/client"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorText } from "@/components/ui/error-text"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RequirementBadge } from "@/components/ui/requirement-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SupportText } from "@/components/ui/support-text"
import { Textarea } from "@/components/ui/textarea"

import "./visual.css"

type VisualStory = {
  title: string
  node: ReactNode
}

const fieldClass = "flex flex-col items-start gap-2"
const storyFrameClass = "min-h-screen bg-white p-8"

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
}

function VisualApp() {
  const id =
    new URLSearchParams(window.location.search).get("id") ??
    "component-dads-v2-button--all-buttons"
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
