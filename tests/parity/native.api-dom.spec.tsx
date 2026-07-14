import { render, screen } from "@testing-library/react"

import { Blockquote } from "@/components/ui/blockquote"
import { ChipLabel } from "@/components/ui/chip-label"
import { Dd, Dl, Dt } from "@/components/ui/description-list"
import { Divider } from "@/components/ui/divider"
import { ErrorText } from "@/components/ui/error-text"
import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"
import {
  Image,
  ImageArea,
  ImageCaption,
  ImageFigure,
} from "@/components/ui/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/components/ui/link"
import { List } from "@/components/ui/list"
import { RequirementBadge } from "@/components/ui/requirement-badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { SupportText } from "@/components/ui/support-text"
import { Textarea } from "@/components/ui/textarea"
import { UtilityLink } from "@/components/ui/utility-link"

describe("Native component API/DOM parity", () => {
  it("Input and Textarea preserve upstream native element contracts", () => {
    render(
      <>
        <Input aria-disabled blockSize="md" isError placeholder="input" />
        <Textarea aria-disabled isError placeholder="textarea" />
      </>
    )

    const input = screen.getByPlaceholderText("input")
    const textarea = screen.getByPlaceholderText("textarea")

    expect(input.tagName).toBe("INPUT")
    expect(input).toHaveAttribute("data-slot", "input")
    expect(input).toHaveAttribute("data-size", "md")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("readonly")
    expect(input.className).toContain("border-solid-gray-600")

    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea).toHaveAttribute("data-slot", "textarea")
    expect(textarea).toHaveAttribute("aria-invalid", "true")
    expect(textarea).toHaveAttribute("readonly")
    expect(textarea.className).toContain("text-std-16N-170")
  })

  it("Label, badges, support text, and error text keep native tags and state attributes", () => {
    render(
      <>
        <Label htmlFor="x" size="lg">
          ラベル
        </Label>
        <RequirementBadge isOptional>任意</RequirementBadge>
        <StatusBadge>受付済み</StatusBadge>
        <SupportText>サポート</SupportText>
        <ErrorText>エラー</ErrorText>
        <ChipLabel color="blue" variant="filled-1">
          チップ
        </ChipLabel>
      </>
    )

    expect(screen.getByText("ラベル").tagName).toBe("LABEL")
    expect(screen.getByText("ラベル")).toHaveAttribute("data-size", "lg")
    expect(screen.getByText("任意")).toHaveAttribute("data-is-optional", "true")
    expect(screen.getByText("受付済み")).toHaveAttribute(
      "data-slot",
      "status-badge"
    )
    expect(screen.getByText("サポート").tagName).toBe("P")
    expect(screen.getByText("エラー").className).toContain("text-error-1")
    expect(screen.getByText("チップ")).toHaveAttribute("data-color", "blue")
    expect(screen.getByText("チップ")).toHaveAttribute(
      "data-variant",
      "filled-1"
    )
  })

  it("Link and UtilityLink preserve external icon behavior and upstream classes", () => {
    render(
      <>
        <Link href="/link" target="_blank">
          リンク
        </Link>
        <UtilityLink href="/utility" target="_blank">
          ユーティリティ
        </UtilityLink>
      </>
    )

    expect(screen.getByRole("link", { name: /リンク/ })).toHaveAttribute(
      "data-slot",
      "link"
    )
    const utility = screen.getByRole("link", { name: /ユーティリティ/ })
    expect(utility).toHaveAttribute("data-slot", "utility-link")
    expect(utility.className).toContain("!text-solid-gray-800")
    expect(
      screen.getAllByRole("img", { name: "新規タブで開きます" })
    ).toHaveLength(2)
  })

  it("Heading, List, Description list, Divider, and Blockquote keep semantic wrappers", () => {
    const { container } = render(
      <>
        <Heading hasChip rule="4" size="24">
          <HeadingShoulder>肩書き</HeadingShoulder>
          <HeadingTitle level="h2">見出し</HeadingTitle>
        </Heading>
        <List marker="number" spacing="8">
          <li>
            <span>項目</span>
          </li>
        </List>
        <Dl marker="bullet">
          <Dt>用語</Dt>
          <Dd>説明</Dd>
        </Dl>
        <Divider color="black" />
        <Blockquote>引用</Blockquote>
      </>
    )

    const heading = container.querySelector('[data-slot="heading"]')
    expect(heading?.tagName).toBe("HGROUP")
    expect(screen.getByRole("heading", { name: "見出し" }).tagName).toBe("H2")
    expect(container.querySelector("ul")).toHaveAttribute("data-spacing", "8")
    expect(container.querySelector("dl")).toHaveAttribute(
      "data-marker",
      "bullet"
    )
    expect(container.querySelector("hr")).toHaveAttribute("data-color", "black")
    expect(container.querySelector("blockquote")).toHaveAttribute(
      "data-slot",
      "blockquote"
    )
  })

  it("Image documents the local shadcn split from upstream figure-based Image", () => {
    render(
      <ImageFigure fullWidth>
        <ImageArea bordered>
          <Image alt="サンプル" src="/sample.png" />
        </ImageArea>
        <ImageCaption captionStyle="solid">キャプション</ImageCaption>
      </ImageFigure>
    )

    const figure = screen.getByText("キャプション").closest("figure")
    const image = screen.getByRole("img", { name: "サンプル" })

    expect(figure).toHaveAttribute("data-slot", "image-figure")
    expect(figure).toHaveAttribute("data-full-width", "")
    expect(image.tagName).toBe("IMG")
    expect(image).toHaveAttribute("data-slot", "image")
    expect(screen.getByText("キャプション")).toHaveAttribute(
      "data-style",
      "solid"
    )
  })
})
