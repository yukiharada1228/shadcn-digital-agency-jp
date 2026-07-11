import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Download,
  FileCheck2,
  History,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Example } from "./Example"

import { Blockquote } from "@/components/ui/blockquote"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Dl, Dd, Dt } from "@/components/ui/dl"
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
import { Textarea } from "@/components/ui/textarea"
import { UtilityLink } from "@/components/ui/utility-link"

type FormState = {
  applicant: string
  address: string
  contact: string
  note: string
}

const panelClass =
  "rounded-8 border border-solid-gray-300 bg-white p-4 min-[700px]:p-6"
const iconButtonClass =
  "inline-flex items-center gap-2 max-[560px]:w-full max-[560px]:justify-center"
const fieldClass = "grid gap-2"

const initialForm: FormState = {
  applicant: "山田 太郎",
  address: "東京都千代田区霞が関 1-1-1",
  contact: "taro@example.jp",
  note: "平日午前中に連絡を希望。本人確認書類はマイナンバーカードを利用。",
}

const steps = [
  { label: "本人確認", state: "完了", icon: ShieldCheck },
  { label: "申請内容", state: "入力中", icon: FileCheck2 },
  { label: "審査待ち", state: "未着手", icon: Bell },
]

const documents = ["本人確認書類", "新住所の確認資料", "連絡先確認"]

const reviewSteps = ["入力内容を確認", "必要書類を照合", "受付番号を発行"]

const previewMarkup = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="760" height="460" viewBox="0 0 760 460">
  <rect width="760" height="460" fill="#f7f7f7"/>
  <rect x="40" y="36" width="680" height="388" fill="#ffffff" stroke="#949494" stroke-width="2"/>
  <rect x="72" y="72" width="230" height="20" fill="#0017c1"/>
  <rect x="72" y="116" width="616" height="12" fill="#d9e6ff"/>
  <rect x="72" y="152" width="616" height="1" fill="#b3b3b3"/>
  <rect x="72" y="188" width="170" height="14" fill="#767676"/>
  <rect x="270" y="184" width="300" height="22" fill="#f2f2f2" stroke="#b3b3b3"/>
  <rect x="72" y="236" width="170" height="14" fill="#767676"/>
  <rect x="270" y="232" width="360" height="22" fill="#f2f2f2" stroke="#b3b3b3"/>
  <rect x="72" y="284" width="170" height="14" fill="#767676"/>
  <rect x="270" y="280" width="250" height="22" fill="#f2f2f2" stroke="#b3b3b3"/>
  <circle cx="640" cy="344" r="34" fill="#fff" stroke="#0017c1" stroke-width="8"/>
  <path d="M622 344l13 13 25-30" fill="none" stroke="#0017c1" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)

const previewSrc = `data:image/svg+xml;utf8,${previewMarkup}`

function completionFor(form: FormState) {
  const values = Object.values(form)
  return Math.round((values.filter(Boolean).length / values.length) * 100)
}

export function App() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [lastSaved, setLastSaved] = useState("09:42")

  const completion = useMemo(() => completionFor(form), [form])

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSubmitted(false)
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const saveDraft = () => {
    const now = new Date()
    setLastSaved(
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    )
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-solid-gray-300 bg-white/95 px-4 py-3 min-[700px]:px-7 max-[900px]:static max-[900px]:flex-col max-[900px]:items-stretch">
        <div>
          <p className="m-0 text-sm text-solid-gray-600">東京都 千代田区</p>
          <p className="m-0 text-lg font-bold text-solid-gray-900">
            行政手続きワークスペース
          </p>
        </div>
        <nav
          className="flex flex-wrap justify-end gap-4 max-[900px]:justify-start"
          aria-label="主要メニュー"
        >
          <UtilityLink href="#application">申請</UtilityLink>
          <UtilityLink href="#documents">書類</UtilityLink>
          <UtilityLink href="#review">確認</UtilityLink>
        </nav>
      </header>

      <main className="mx-auto w-[calc(100%_-_2rem)] max-w-[1180px] py-7 max-[560px]:w-[calc(100%_-_20px)] max-[560px]:py-5">
        <Example />
        <section
          className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 pb-6 pt-2 max-[900px]:grid-cols-1"
          aria-labelledby="page-heading"
        >
          <div className="min-w-0">
            <Heading size="36" hasChip rule="4" id="page-heading">
              <HeadingShoulder>転入手続き</HeadingShoulder>
              <HeadingTitle level="h1">申請内容の確認</HeadingTitle>
            </Heading>
            <p className="mt-5 max-w-[720px] text-base leading-[1.7] text-solid-gray-600">
              申請者情報、必要書類、確認事項を一つの画面で管理します。
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3 max-[900px]:justify-start">
            <Button
              variant="outline"
              className={iconButtonClass}
              onClick={saveDraft}
            >
              <Save aria-hidden="true" size={18} />
              下書き保存
            </Button>
            <Button
              className={iconButtonClass}
              onClick={() => setSubmitted(true)}
            >
              <Send aria-hidden="true" size={18} />
              申請を送信
            </Button>
          </div>
        </section>

        <section
          className="mb-4 grid grid-cols-3 gap-3 max-[900px]:grid-cols-1"
          aria-label="申請状況"
        >
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <article
                className="flex min-h-[82px] items-center gap-3 rounded-8 border border-solid-gray-300 bg-white p-4"
                key={step.label}
              >
                <Icon aria-hidden="true" className="h-7 w-7 text-key-900" />
                <div>
                  <p className="m-0 text-sm text-solid-gray-600">
                    {step.label}
                  </p>
                  <p className="mt-0.5 font-bold">{step.state}</p>
                </div>
              </article>
            )
          })}
        </section>

        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)] gap-4 max-[900px]:grid-cols-1">
          <section className={`${panelClass} row-span-2`} id="application">
            <div className="mb-5 flex items-start justify-between gap-4">
              <Heading size="24" hasChip>
                <HeadingTitle level="h2">申請者情報</HeadingTitle>
              </Heading>
              <span
                className="min-w-16 rounded-full border border-key-900 px-3 py-2 text-center font-bold leading-none text-key-900"
                aria-label={`入力率 ${completion}%`}
              >
                {completion}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-[18px] max-[900px]:grid-cols-1">
              <div className={fieldClass}>
                <Label htmlFor="applicant">氏名</Label>
                <Input
                  id="applicant"
                  className="w-full"
                  value={form.applicant}
                  onChange={handleChange("applicant")}
                />
              </div>
              <div className={fieldClass}>
                <Label htmlFor="contact">連絡先メール</Label>
                <Input
                  id="contact"
                  className="w-full"
                  type="email"
                  value={form.contact}
                  onChange={handleChange("contact")}
                />
              </div>
              <div className={`${fieldClass} col-span-full`}>
                <Label htmlFor="address">新住所</Label>
                <Input
                  id="address"
                  className="w-full"
                  value={form.address}
                  onChange={handleChange("address")}
                />
              </div>
              <div className={`${fieldClass} col-span-full`}>
                <Label htmlFor="note">備考</Label>
                <Textarea
                  id="note"
                  className="w-full"
                  rows={5}
                  value={form.note}
                  onChange={handleChange("note")}
                />
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex items-start gap-3 border-l-8 border-key-900 bg-key-50 px-4 py-3">
              {submitted ? (
                <CheckCircle2 aria-hidden="true" className="text-cyan-800" />
              ) : (
                <CircleAlert aria-hidden="true" className="text-orange-800" />
              )}
              <p className="m-0 leading-[1.7]">
                {submitted
                  ? "申請を受け付けました。受付番号 TK-2026-0712-0048"
                  : `下書き保存 ${lastSaved}。送信前に必要書類を確認してください。`}
              </p>
            </div>
          </section>

          <aside className={panelClass} id="documents">
            <Heading size="20" hasChip>
              <HeadingTitle level="h2">必要書類</HeadingTitle>
            </Heading>
            <List spacing="8" className="my-5 grid list-none gap-3 p-0">
              {documents.map((document) => (
                <li className="flex items-center gap-2.5" key={document}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-5 w-5 text-cyan-800"
                  />
                  <span>{document}</span>
                </li>
              ))}
            </List>
            <Button variant="text" className={iconButtonClass}>
              <Download aria-hidden="true" size={18} />
              控えをダウンロード
            </Button>
          </aside>

          <section
            className={`${panelClass} grid gap-4`}
            aria-label="関連手続き"
          >
            <Heading size="20" hasChip>
              <HeadingTitle level="h2">関連手続き</HeadingTitle>
            </Heading>
            <p className="mt-0 leading-[1.7] text-solid-gray-600">
              本人確認の再確認や窓口での照合をここから進めます。
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="solid-fill"
                size="sm"
                className="inline-flex items-center gap-1.5 max-[560px]:w-full max-[560px]:justify-center"
              >
                <UserCheck aria-hidden="true" size={16} />
                本人確認
              </Button>
              <Button
                variant="outline"
                size="xs"
                className="inline-flex items-center gap-1.5 max-[560px]:w-full max-[560px]:justify-center"
              >
                <History aria-hidden="true" size={14} />
                履歴
              </Button>
            </div>
            <Divider color="black" />
            <Dl>
              <Dt>受付窓口</Dt>
              <Dd className="mb-1.5 text-solid-gray-600">住民記録係</Dd>
              <Dt>予約状況</Dt>
              <Dd className="text-solid-gray-600">当日受付可</Dd>
            </Dl>
          </section>

          <section className={panelClass} id="review">
            <Heading size="20" hasChip>
              <HeadingTitle level="h2">確認サマリー</HeadingTitle>
            </Heading>
            <Dl marker="bullet" className="my-5">
              <Dt>申請区分</Dt>
              <Dd className="mb-2.5 text-solid-gray-600">転入届</Dd>
              <Dt>窓口</Dt>
              <Dd className="mb-2.5 text-solid-gray-600">住民記録係</Dd>
              <Dt>処理目安</Dt>
              <Dd className="text-solid-gray-600">2営業日</Dd>
            </Dl>
            <Blockquote className="my-5">
              <p className="m-0 leading-[1.7]">
                送信後、登録されたメールアドレスへ受付番号と次の案内を送信します。
              </p>
            </Blockquote>
            <Divider color="gray-536" className="mb-5 mt-6" />
            <List spacing="4" marker="number" className="mb-5">
              {reviewSteps.map((step, index) => (
                <li className="gap-x-2" key={step}>
                  <span className="inline-grid h-6 w-6 place-items-center rounded-full border border-key-900 font-bold text-key-900">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </List>
            <Link href="https://www.digital.go.jp/" target="_blank">
              デジタル庁サイト
            </Link>
          </section>

          <section
            className={`${panelClass} grid gap-4`}
            aria-label="申請書プレビュー"
          >
            <ImageFigure fullWidth>
              <ImageArea>
                <ImageAreaLink href="#review" aria-label="申請書プレビュー">
                  <Image src={previewSrc} alt="申請書プレビュー" />
                </ImageAreaLink>
              </ImageArea>
              <ImageCaption captionStyle="dashed">
                申請書プレビュー / 本人確認済み
              </ImageCaption>
            </ImageFigure>
            <ImageFigure fullWidth>
              <ImageArea bordered>
                <Image src={previewSrc} alt="" />
              </ImageArea>
              <ImageCaption captionStyle="solid">提出控え</ImageCaption>
            </ImageFigure>
            <Button
              variant="outline"
              className={`${iconButtonClass} justify-self-start`}
              onClick={() => setSubmitted(false)}
            >
              <RefreshCw aria-hidden="true" size={18} />
              表示を更新
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
