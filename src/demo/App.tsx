import { useEffect, useRef, useState, type ReactNode } from "react"
import { Bell, Search } from "lucide-react"

import {
  Accordion,
  AccordionBackLink,
  AccordionContent,
  AccordionSummary,
} from "@/components/ui/accordion"
import { Blockquote } from "@/components/ui/blockquote"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumbs,
  BreadcrumbsLabel,
} from "@/components/ui/breadcrumbs"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CalendarButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeading,
  CalendarHeaderCell,
} from "@/components/ui/calendar"
import {
  Carousel,
  CarouselSingle,
  CarouselSingleImage,
  CarouselSingleLink,
  type CarouselSlide,
} from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { ChipLabel } from "@/components/ui/chip-label"
import {
  DatePicker,
  DatePickerCalendarButton,
  DatePickerDate,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/ui/date-picker"
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogHeading,
  DialogScrollArea,
  useDialog,
} from "@/components/ui/dialog"
import {
  Disclosure,
  DisclosureBackLink,
  DisclosureSummary,
} from "@/components/ui/disclosure"
import { Divider } from "@/components/ui/divider"
import { Dd, Dl, Dt } from "@/components/ui/description-list"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerMenuLink,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  EmergencyBanner,
  EmergencyBannerBody,
  EmergencyBannerButton,
  EmergencyBannerHeading,
} from "@/components/ui/emergency-banner"
import { ErrorText } from "@/components/ui/error-text"
import {
  FileUpload,
  FileUploadDropArea,
  FileUploadFileInfo,
  FileUploadFileItem,
  FileUploadFileList,
  FileUploadFileMarker,
  FileUploadFileMeta,
  FileUploadFileName,
  FileUploadInput,
  formatSize,
  useFileUpload,
} from "@/components/ui/file-upload"
import {
  HamburgerIcon,
  HamburgerMenuButton,
} from "@/components/ui/hamburger-menu-button"
import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"
import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemButton,
  HorizontalMenuItemLink,
} from "@/components/ui/horizontal-menu"
import {
  Image,
  ImageArea,
  ImageAreaLink,
  ImageCaption,
  ImageFigure,
} from "@/components/ui/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LanguageSelector,
  LanguageSelectorArrowIcon,
  LanguageSelectorButton,
  LanguageSelectorGlobeIcon,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
} from "@/components/ui/language-selector"
import { Legend } from "@/components/ui/legend"
import { Link } from "@/components/ui/link"
import { List } from "@/components/ui/list"
import {
  MenuList,
  MenuListItem,
  MenuListItemButton,
  MenuListItemLink,
} from "@/components/ui/menu-list"
import {
  MenuListBox,
  MenuListBoxOpener,
  MenuListBoxPopup,
  useMenuListBox,
} from "@/components/ui/menu-list-box"
import {
  NotificationBanner,
  NotificationBannerBody,
  NotificationBannerClose,
} from "@/components/ui/notification-banner"
import {
  ProgressIndicator,
  ProgressIndicatorLinear,
  ProgressIndicatorSpinner,
  ProgressIndicatorStatic,
} from "@/components/ui/progress-indicator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RequirementBadge } from "@/components/ui/requirement-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SeparatedDatePicker,
  SeparatedDatePickerCalendarButton,
  SeparatedDatePickerDate,
  SeparatedDatePickerMonth,
  SeparatedDatePickerYear,
} from "@/components/ui/separated-date-picker"
import { StatusBadge } from "@/components/ui/status-badge"
import { SupportText } from "@/components/ui/support-text"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tab,
  TabItem,
  TabList,
  TabPanel,
  useTabAria,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UtilityLink } from "@/components/ui/utility-link"

// 画像プレースホルダー（SVG data URI）
const placeholder = (label: string, bg: string, w = 640, h = 360) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/><text x="${w / 2}" y="${h / 2}" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
  )

const carouselSlides: CarouselSlide[] = [
  {
    id: "s1",
    label: "マイナンバーカードの申請",
    href: "#",
    image: {
      src: placeholder("スライド 1", "#0017c1"),
      alt: "スライド1の画像",
      width: 640,
      height: 360,
    },
  },
  {
    id: "s2",
    label: "子育て支援の手続き",
    href: "#",
    image: {
      src: placeholder("スライド 2", "#007a3f"),
      alt: "スライド2の画像",
      width: 640,
      height: 360,
    },
  },
  {
    id: "s3",
    label: "確定申告のオンライン化",
    href: "#",
    image: {
      src: placeholder("スライド 3", "#b8005c"),
      alt: "スライド3の画像",
      width: 640,
      height: 360,
    },
  },
]

const menuItemClass =
  "flex w-full items-center min-h-11 px-4 py-2.5 text-left text-dns-16N-130 text-solid-gray-800 hover:bg-solid-gray-50 hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black focus-visible:bg-yellow-300"

const sectionNavItems = [
  { id: "basics", label: "基本" },
  { id: "form", label: "フォーム" },
  { id: "feedback", label: "通知" },
  { id: "nav", label: "ナビゲーション" },
  { id: "data", label: "データ表示" },
] as const

type SectionId = (typeof sectionNavItems)[number]["id"]

type CalendarDateLike = {
  year: number
  month: number
  day: number
}

const isCalendarDateLike = (value: unknown): value is CalendarDateLike =>
  typeof value === "object" &&
  value !== null &&
  "year" in value &&
  "month" in value &&
  "day" in value &&
  typeof value.year === "number" &&
  typeof value.month === "number" &&
  typeof value.day === "number"

const isSectionId = (value: string): value is SectionId =>
  sectionNavItems.some((item) => item.id === value)

const getHashSectionId = (): SectionId => {
  if (typeof window === "undefined") return "basics"

  const id = window.location.hash.slice(1)
  return isSectionId(id) ? id : "basics"
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="min-w-0 rounded-8 border border-solid-gray-300 bg-white p-5 md:p-7"
      style={{ scrollMarginTop: "calc(var(--app-anchor-offset, 6rem) + 1rem)" }}
    >
      <Heading size="24" hasChip className="mb-6">
        <HeadingTitle level="h2">{title}</HeadingTitle>
      </Heading>
      {children}
    </section>
  )
}

export default function App() {
  // フォーム状態
  const [name, setName] = useState("山田 太郎")
  const [agree, setAgree] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [contact, setContact] = useState("email")
  const [pref, setPref] = useState("tokyo")
  const [linkedDate, setLinkedDate] = useState({
    year: "2026",
    month: "7",
    day: "13",
  })
  const [separatedDate, setSeparatedDate] = useState({
    year: "2026",
    month: "07",
    day: "13",
  })

  // インタラクティブ UI 状態
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lang, setLang] = useState("日本語")
  const [langOpen, setLangOpen] = useState(false)
  const [pickedAction, setPickedAction] = useState<string | null>(null)
  const [linkedCalendarOpen, setLinkedCalendarOpen] = useState(false)
  const [separatedCalendarOpen, setSeparatedCalendarOpen] = useState(false)

  const drawerRef = useRef<HTMLDialogElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const linkedDatePickerRef = useRef<HTMLDivElement>(null)
  const separatedDatePickerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  const tabs = useTabAria()
  const dialog = useDialog({ open: dialogOpen, onOpenChange: setDialogOpen })
  const menu = useMenuListBox({
    onMenuItemSelect: (d) => setPickedAction(d.selectedValue),
  })
  const upload = useFileUpload({
    maxFiles: 3,
    accept: ".pdf,.png,.jpg",
    maxFileSize: "5MB",
  })
  const [activeSection, setActiveSection] = useState<SectionId>(() =>
    getHashSectionId()
  )

  const openDrawer = () => {
    const d = drawerRef.current
    if (d && !d.open) d.showModal()
  }
  const closeDrawer = () => drawerRef.current?.close()

  const nameError = submitted && name.trim() === ""
  const agreeError = submitted && !agree
  const submitSucceeded = submitted && !nameError && !agreeError
  const languages = ["日本語", "English", "中文", "한국어"]

  const handleLinkedCalendarSelect = (date: CalendarDateLike) => {
    setLinkedDate({
      year: String(date.year),
      month: String(date.month),
      day: String(date.day),
    })
    setLinkedCalendarOpen(false)
  }

  const handleSeparatedCalendarSelect = (date: CalendarDateLike) => {
    setSeparatedDate({
      year: String(date.year),
      month: String(date.month).padStart(2, "0"),
      day: String(date.day).padStart(2, "0"),
    })
    setSeparatedCalendarOpen(false)
  }

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const updateAnchorOffset = () => {
      document.documentElement.style.setProperty(
        "--app-anchor-offset",
        `${Math.ceil(header.getBoundingClientRect().height)}px`
      )
    }

    updateAnchorOffset()

    const observer = new ResizeObserver(updateAnchorOffset)
    observer.observe(header)
    window.addEventListener("resize", updateAnchorOffset)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateAnchorOffset)
      document.documentElement.style.removeProperty("--app-anchor-offset")
    }
  }, [])

  useEffect(() => {
    let frameId = 0

    const updateActiveSection = () => {
      frameId = 0

      const rawOffset = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--app-anchor-offset")
      const headerOffset = Number.parseFloat(rawOffset) || 0
      const probeY = headerOffset + 24
      let current = getHashSectionId()

      for (const item of sectionNavItems) {
        const section = document.getElementById(item.id)
        if (!section) continue

        if (section.getBoundingClientRect().top <= probeY) {
          current = item.id
        } else {
          break
        }
      }

      setActiveSection(current)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", scheduleUpdate)
    }
  }, [])

  // 言語メニューは外側クリック / Escape で閉じる
  useEffect(() => {
    if (!langOpen) return
    const onPointerDown = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [langOpen])

  useEffect(() => {
    if (!linkedCalendarOpen && !separatedCalendarOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (linkedCalendarOpen && !linkedDatePickerRef.current?.contains(target))
        setLinkedCalendarOpen(false)
      if (
        separatedCalendarOpen &&
        !separatedDatePickerRef.current?.contains(target)
      )
        setSeparatedCalendarOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLinkedCalendarOpen(false)
        setSeparatedCalendarOpen(false)
      }
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [linkedCalendarOpen, separatedCalendarOpen])

  const calendarPanel = (
    label: string,
    onSelect: (date: CalendarDateLike) => void
  ) => (
    <div className="absolute left-0 top-full z-40 mt-2 w-full max-w-[calc(100vw-2rem)] overflow-x-auto rounded-8 border border-solid-gray-300 bg-white shadow-2 md:w-[360px]">
      <Calendar
        aria-label={label}
        className="!w-full"
        onChange={(date) => {
          if (isCalendarDateLike(date)) onSelect(date)
        }}
      >
        <header className="flex w-full items-center justify-between px-3 py-2">
          <CalendarButton slot="previous">‹</CalendarButton>
          <CalendarHeading />
          <CalendarButton slot="next">›</CalendarButton>
        </header>
        <CalendarGrid>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </div>
  )

  return (
    <div className="min-h-svh bg-solid-gray-50 text-solid-gray-800">
      {/* ===== ヘッダー ===== */}
      <header
        ref={headerRef}
        className="sticky top-0 z-30 border-b border-solid-gray-300 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="min-w-0">
            <p className="m-0 break-keep text-sm leading-snug text-solid-gray-600">
              デジタル庁デザインシステム（非公式）
            </p>
            <p className="m-0 break-keep text-lg font-bold leading-snug text-solid-gray-900">
              コンポーネント ショーケース
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
            <Button
              variant="text"
              size="sm"
              className="inline-flex items-center gap-1.5"
            >
              <Search aria-hidden="true" size={16} />
              検索
            </Button>
            <Button
              variant="text"
              size="sm"
              className="inline-flex items-center gap-1.5"
            >
              <Bell aria-hidden="true" size={16} />
              通知
            </Button>

            {/* LanguageSelector */}
            <LanguageSelector ref={langRef}>
              <LanguageSelectorButton
                aria-expanded={langOpen}
                aria-haspopup="menu"
                onClick={() => setLangOpen((v) => !v)}
              >
                <LanguageSelectorGlobeIcon />
                {lang}
                <LanguageSelectorArrowIcon />
              </LanguageSelectorButton>
              {langOpen && (
                <LanguageSelectorMenu className="absolute right-0 z-40 mt-1">
                  {languages.map((l) => (
                    <LanguageSelectorMenuItem
                      key={l}
                      href="#"
                      isCurrent={l === lang}
                      onClick={(e) => {
                        e.preventDefault()
                        setLang(l)
                        setLangOpen(false)
                      }}
                    >
                      {l}
                    </LanguageSelectorMenuItem>
                  ))}
                </LanguageSelectorMenu>
              )}
            </LanguageSelector>

            {/* Drawer（ハンバーガーメニュー） */}
            <DrawerTrigger onClick={openDrawer} />
          </div>
        </div>

        {/* HorizontalMenu */}
        <nav className="mx-auto max-w-[1180px] px-4">
          <HorizontalMenu>
            {sectionNavItems.slice(0, 3).map((item) => (
              <HorizontalMenuItem key={item.id}>
                <HorizontalMenuItemLink
                  href={`#${item.id}`}
                  aria-current={activeSection === item.id ? "true" : undefined}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </HorizontalMenuItemLink>
              </HorizontalMenuItem>
            ))}
            <HorizontalMenuItem>
              <HorizontalMenuItemButton
                aria-current={
                  activeSection === "nav" || activeSection === "data"
                    ? "true"
                    : undefined
                }
                onClick={openDrawer}
              >
                その他
              </HorizontalMenuItemButton>
            </HorizontalMenuItem>
          </HorizontalMenu>
        </nav>
      </header>

      {/* Drawer 本体 */}
      <Drawer ref={drawerRef} side="right">
        <DrawerHeader>
          <DrawerClose onClick={closeDrawer} />
        </DrawerHeader>
        <DrawerTitle>メニュー</DrawerTitle>
        <DrawerBody>
          {sectionNavItems.map((item) => (
            <li key={item.id}>
              <DrawerMenuLink
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "true" : undefined}
                onClick={() => {
                  setActiveSection(item.id)
                  closeDrawer()
                }}
              >
                {item.label}
              </DrawerMenuLink>
            </li>
          ))}
        </DrawerBody>
      </Drawer>

      <main className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 [&>*]:min-w-0">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="パンくずリスト">
          <BreadcrumbsLabel className="sr-only">現在位置：</BreadcrumbsLabel>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">デザインシステム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrent>コンポーネント一覧</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumbs>

        {/* ページ見出し */}
        <div>
          <Heading size="36" hasChip rule="4">
            <HeadingShoulder>全 41 コンポーネント</HeadingShoulder>
            <HeadingTitle level="h1">
              デジタル庁デザインシステム風コンポーネント サンプル
            </HeadingTitle>
          </Heading>
          <p className="mt-4 max-w-[720px] leading-[1.8] text-solid-gray-600">
            <code>shadcn-digital-agency-jp</code> で提供される全コンポーネントを
            1 画面で使用したデモです。
          </p>
        </div>

        {/* ===== 緊急バナー ===== */}
        <EmergencyBanner>
          <EmergencyBannerHeading level="h2">
            大規模災害に関する重要なお知らせ
          </EmergencyBannerHeading>
          <EmergencyBannerBody>
            <p className="leading-[1.8]">
              現在、対象地域にお住まいの方は避難情報をご確認ください。
            </p>
            <EmergencyBannerButton href="#" className="mt-4">
              避難情報を確認する
            </EmergencyBannerButton>
          </EmergencyBannerBody>
        </EmergencyBanner>

        {/* ===== 基本 ===== */}
        <Section id="basics" title="基本 / Basics">
          <div className="grid gap-8">
            {/* Button */}
            <div className="flex flex-wrap items-center gap-3">
              <Button>送信</Button>
              <Button variant="outline">戻る</Button>
              <Button variant="text">キャンセル</Button>
              <Button variant="solid-fill" size="lg">
                大きいボタン
              </Button>
              <Button size="xs" variant="outline">
                小
              </Button>
              <Button asChild>
                <a href="#basics">リンクボタン</a>
              </Button>
            </div>

            {/* Link / UtilityLink */}
            <div className="flex flex-wrap items-center gap-6">
              <Link href="https://www.digital.go.jp/" target="_blank">
                デジタル庁の公式サイト
              </Link>
              <UtilityLink href="#">よくある質問</UtilityLink>
            </div>

            <Divider />

            {/* Heading バリエーション */}
            <div className="grid gap-4">
              <Heading size="28" hasChip>
                <HeadingTitle level="h3">
                  見出し（size 28・チップ付き）
                </HeadingTitle>
              </Heading>
              <Heading size="20">
                <HeadingTitle level="h4">見出し（size 20）</HeadingTitle>
              </Heading>
            </div>

            {/* List / Description list / Blockquote */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="mb-2 font-bold">List</p>
                <List spacing="8" className="ml-5 list-disc">
                  <li>本人確認書類</li>
                  <li>住民票の写し</li>
                  <li>印鑑登録証明書</li>
                </List>
              </div>
              <div>
                <p className="mb-2 font-bold">Description list</p>
                <Dl marker="bullet">
                  <Dt>受付窓口</Dt>
                  <Dd className="text-solid-gray-600">住民記録係</Dd>
                  <Dt>処理目安</Dt>
                  <Dd className="text-solid-gray-600">2 営業日</Dd>
                </Dl>
              </div>
              <div>
                <p className="mb-2 font-bold">Blockquote</p>
                <Blockquote>
                  <p className="leading-[1.8]">
                    申請後、受付番号をメールでお知らせします。
                  </p>
                </Blockquote>
              </div>
            </div>

            {/* Image */}
            <div className="grid gap-6 md:grid-cols-2">
              <ImageFigure fullWidth>
                <ImageArea>
                  <ImageAreaLink href="#" aria-label="サンプル画像を開く">
                    <Image
                      src={placeholder("画像（リンク付き）", "#4b5563")}
                      alt="サンプル画像"
                    />
                  </ImageAreaLink>
                </ImageArea>
                <ImageCaption captionStyle="dashed">
                  リンク付き画像 / ImageAreaLink
                </ImageCaption>
              </ImageFigure>
              <ImageFigure fullWidth>
                <ImageArea bordered>
                  <Image src={placeholder("枠線付き画像", "#334155")} alt="" />
                </ImageArea>
                <ImageCaption captionStyle="solid">
                  枠線付き画像 / bordered
                </ImageCaption>
              </ImageFigure>
            </div>
          </div>
        </Section>

        {/* ===== フォーム ===== */}
        <Section id="form" title="フォーム / Form">
          <form
            className="grid min-w-0 gap-8 [&>*]:min-w-0"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">
              {/* Input + Label + RequirementBadge + SupportText */}
              <div className="grid gap-2">
                <Label htmlFor="name">
                  氏名
                  <RequirementBadge>必須</RequirementBadge>
                </Label>
                <Input
                  id="name"
                  className="w-full"
                  placeholder="山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isError={nameError}
                  aria-describedby={nameError ? "name-error" : "name-support"}
                />
                {nameError ? (
                  <ErrorText id="name-error">
                    氏名を入力してください。
                  </ErrorText>
                ) : (
                  <SupportText id="name-support">
                    戸籍上の氏名を入力してください。
                  </SupportText>
                )}
              </div>

              {/* Input（任意） */}
              <div className="grid gap-2">
                <Label htmlFor="phone">
                  電話番号
                  <RequirementBadge isOptional>任意</RequirementBadge>
                </Label>
                <Input
                  id="phone"
                  className="w-full"
                  type="tel"
                  placeholder="03-0000-0000"
                />
                <SupportText>
                  日中に連絡が取れる番号を入力してください。
                </SupportText>
              </div>

              {/* Select */}
              <div className="grid gap-2">
                <Label htmlFor="pref">都道府県</Label>
                <Select value={pref} onValueChange={setPref}>
                  <SelectTrigger id="pref" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokyo">東京都</SelectItem>
                    <SelectItem value="osaka">大阪府</SelectItem>
                    <SelectItem value="aichi">愛知県</SelectItem>
                    <SelectItem value="fukuoka">福岡県</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Textarea */}
              <div className="grid gap-2">
                <Label htmlFor="note">備考</Label>
                <Textarea
                  id="note"
                  className="w-full"
                  rows={4}
                  placeholder="ご要望などがあればご記入ください。"
                />
              </div>
            </div>

            {/* RadioGroup + Legend */}
            <fieldset className="grid gap-3 border-0 p-0">
              <Legend size="md">
                連絡方法
                <RequirementBadge>必須</RequirementBadge>
              </Legend>
              <RadioGroup
                value={contact}
                onValueChange={setContact}
                aria-label="連絡方法"
              >
                {[
                  ["email", "メール"],
                  ["phone", "電話"],
                  ["post", "郵送"],
                ].map(([value, label]) => (
                  <div className="flex items-center gap-2" key={value}>
                    <RadioGroupItem value={value} id={`contact-${value}`} />
                    <Label htmlFor={`contact-${value}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>

            {/* 日付入力：DatePicker / SeparatedDatePicker / Calendar */}
            <div className="flex min-w-0 flex-wrap items-start gap-6">
              <div
                ref={linkedDatePickerRef}
                className="relative grid max-w-full min-w-0 gap-2"
              >
                <p className="font-bold">DatePicker（連結型）</p>
                <div className="relative flex w-fit max-w-full items-start gap-4">
                  <DatePicker>
                    {({ yearRef, monthRef, dateRef, ...rest }) => (
                      <>
                        <DatePickerYear
                          ref={yearRef}
                          value={linkedDate.year}
                          onChange={(e) =>
                            setLinkedDate((date) => ({
                              ...date,
                              year: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                        <DatePickerMonth
                          ref={monthRef}
                          value={linkedDate.month}
                          onChange={(e) =>
                            setLinkedDate((date) => ({
                              ...date,
                              month: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                        <DatePickerDate
                          ref={dateRef}
                          value={linkedDate.day}
                          onChange={(e) =>
                            setLinkedDate((date) => ({
                              ...date,
                              day: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                      </>
                    )}
                  </DatePicker>
                  <DatePickerCalendarButton
                    aria-expanded={linkedCalendarOpen}
                    aria-haspopup="dialog"
                    aria-label="カレンダーを開く"
                    onClick={() => setLinkedCalendarOpen((v) => !v)}
                  />
                  {linkedCalendarOpen &&
                    calendarPanel(
                      "連結型の日付を選択",
                      handleLinkedCalendarSelect
                    )}
                </div>
              </div>

              <div
                ref={separatedDatePickerRef}
                className="relative grid max-w-full min-w-0 gap-2"
              >
                <p className="font-bold">SeparatedDatePicker（分離型）</p>
                <div className="relative w-fit max-w-full">
                  <SeparatedDatePicker>
                    {(rest) => (
                      <>
                        <SeparatedDatePickerYear
                          value={separatedDate.year}
                          onChange={(e) =>
                            setSeparatedDate((date) => ({
                              ...date,
                              year: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                        <SeparatedDatePickerMonth
                          value={separatedDate.month}
                          onChange={(e) =>
                            setSeparatedDate((date) => ({
                              ...date,
                              month: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                        <SeparatedDatePickerDate
                          value={separatedDate.day}
                          onChange={(e) =>
                            setSeparatedDate((date) => ({
                              ...date,
                              day: e.target.value,
                            }))
                          }
                          {...rest}
                        />
                        <SeparatedDatePickerCalendarButton
                          aria-expanded={separatedCalendarOpen}
                          aria-haspopup="dialog"
                          aria-label="カレンダーを開く"
                          onClick={() => setSeparatedCalendarOpen((v) => !v)}
                        />
                      </>
                    )}
                  </SeparatedDatePicker>
                  {separatedCalendarOpen &&
                    calendarPanel(
                      "分離型の日付を選択",
                      handleSeparatedCalendarSelect
                    )}
                </div>
              </div>

              <div className="grid max-w-full min-w-0 gap-2">
                <p className="font-bold">Calendar</p>
                <div className="max-w-full overflow-x-auto rounded-8 border border-solid-gray-300">
                  <Calendar aria-label="日付を選択">
                    <header className="flex w-full items-center justify-between px-3 py-2">
                      <CalendarButton slot="previous">‹</CalendarButton>
                      <CalendarHeading />
                      <CalendarButton slot="next">›</CalendarButton>
                    </header>
                    <CalendarGrid>
                      <CalendarGridHeader>
                        {(day) => (
                          <CalendarHeaderCell>{day}</CalendarHeaderCell>
                        )}
                      </CalendarGridHeader>
                      <CalendarGridBody>
                        {(date) => <CalendarCell date={date} />}
                      </CalendarGridBody>
                    </CalendarGrid>
                  </Calendar>
                </div>
              </div>
            </div>

            {/* FileUpload */}
            <div className="grid gap-2">
              <p className="font-bold">
                本人確認書類のアップロード
                <RequirementBadge>必須</RequirementBadge>
              </p>
              <FileUpload maxFiles={3} hasError={upload.hasError} droppable>
                <FileUploadInput
                  ref={upload.inputRef}
                  multiple={upload.isMultiple}
                  accept=".pdf,.png,.jpg"
                  onChange={upload.handleInputChange}
                  aria-describedby="fu-support"
                />
                <FileUploadDropArea
                  isDragOver={upload.isDragOver}
                  onDragEnter={upload.handleDragEnter}
                  onDragOver={upload.handleDragOver}
                  onDragLeave={upload.handleDragLeave}
                  onDrop={upload.handleDrop}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <p className="m-0">
                      ここにファイルをドラッグ＆ドロップ、または
                    </p>
                    <Button
                      ref={upload.selectButtonRef}
                      type="button"
                      variant="outline"
                      onClick={upload.handleSelectButtonClick}
                    >
                      ファイルを選択
                    </Button>
                    <SupportText id="fu-support">
                      PDF / PNG / JPG・1 ファイル 5MB まで（最大 3 件）
                    </SupportText>
                  </div>
                </FileUploadDropArea>
                {upload.files.length > 0 && (
                  <FileUploadFileList>
                    {upload.files.map((f, index) => (
                      <FileUploadFileItem
                        key={f.id}
                        hasError={Boolean(f.errors?.length)}
                      >
                        <FileUploadFileMarker />
                        <FileUploadFileInfo>
                          <FileUploadFileName>{f.name}</FileUploadFileName>
                          <FileUploadFileMeta>
                            {formatSize(f.size)}
                          </FileUploadFileMeta>
                        </FileUploadFileInfo>
                        <Button
                          type="button"
                          variant="text"
                          size="sm"
                          onClick={() => upload.removeFile(f.id, index)}
                        >
                          削除
                        </Button>
                      </FileUploadFileItem>
                    ))}
                  </FileUploadFileList>
                )}
              </FileUpload>
            </div>

            <Divider color="black" />

            {/* Checkbox + Error/Support */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agree"
                  checked={agree}
                  onCheckedChange={(v) => setAgree(v === true)}
                  isError={agreeError}
                />
                <Label htmlFor="agree">
                  利用規約に同意します
                  <RequirementBadge>必須</RequirementBadge>
                </Label>
              </div>
              {agreeError ? (
                <ErrorText>利用規約への同意が必要です。</ErrorText>
              ) : (
                <SupportText>送信の前に同意のチェックが必要です。</SupportText>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button type="submit" size="lg">
                申請を送信
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setDialogOpen(true)}
              >
                利用規約を表示（Dialog）
              </Button>
            </div>

            {/* 送信結果（実際のフォーム状態に連動） */}
            {submitted &&
              (submitSucceeded ? (
                <NotificationBanner
                  bannerStyle="standard"
                  type="success"
                  title="申請を受け付けました"
                  headingLevel="h3"
                  aria-live="polite"
                >
                  <NotificationBannerBody>
                    <p>
                      {name} 様の申請を受け付けました。受付番号は{" "}
                      <strong>TK-2026-0713-0048</strong> です。
                    </p>
                  </NotificationBannerBody>
                </NotificationBanner>
              ) : (
                <NotificationBanner
                  bannerStyle="color-chip"
                  type="error"
                  title="送信できませんでした"
                  headingLevel="h3"
                  aria-live="assertive"
                >
                  <NotificationBannerBody>
                    <p>
                      未入力または未同意の必須項目があります。上部の項目をご確認ください。
                    </p>
                  </NotificationBannerBody>
                </NotificationBanner>
              ))}
          </form>
        </Section>

        {/* ===== バッジ・通知 ===== */}
        <Section id="feedback" title="バッジ・通知 / Badges & notifications">
          <div className="grid gap-8">
            {/* StatusBadge / ChipLabel */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge>審査待ち</StatusBadge>
              <ChipLabel variant="filled-1" color="blue">
                転入届
              </ChipLabel>
              <ChipLabel variant="filled-2" color="magenta">
                優先
              </ChipLabel>
              <ChipLabel variant="outlined" color="green">
                本人確認済み
              </ChipLabel>
            </div>

            {/* NotificationBanner（種別ごとの表示サンプル） */}
            <p className="text-sm text-solid-gray-600">
              以下は通知バナーの種別（情報・警告・成功）の表示サンプルです。
            </p>
            <div className="grid gap-4">
              <NotificationBanner
                bannerStyle="standard"
                type="info1"
                title="メンテナンスのお知らせ"
                headingLevel="h3"
              >
                <NotificationBannerBody>
                  <p>
                    7 月 20 日 2:00〜4:00 にシステムメンテナンスを実施します。
                  </p>
                </NotificationBannerBody>
              </NotificationBanner>
              <NotificationBanner
                bannerStyle="color-chip"
                type="warning"
                title="入力内容をご確認ください"
                headingLevel="h3"
              >
                <NotificationBannerClose />
                <NotificationBannerBody>
                  <p>未入力の必須項目があります。</p>
                </NotificationBannerBody>
              </NotificationBanner>
              <NotificationBanner
                bannerStyle="standard"
                type="success"
                title="送信が完了しました"
                headingLevel="h3"
              >
                <NotificationBannerBody>
                  <p>受付番号 TK-2026-0713-0048 を発行しました。</p>
                </NotificationBannerBody>
              </NotificationBanner>
            </div>

            {/* ProgressIndicator */}
            <div className="flex flex-wrap items-center gap-10">
              <ProgressIndicator type="stacked" value={65}>
                <ProgressIndicatorLinear />
                <span>読み込み中… 65%</span>
              </ProgressIndicator>
              <ProgressIndicator type="stacked-underlay">
                <ProgressIndicatorSpinner />
              </ProgressIndicator>
              <ProgressIndicator type="inlined">
                <ProgressIndicatorStatic size="sm" />
                <span>処理中です</span>
              </ProgressIndicator>
            </div>
          </div>
        </Section>

        {/* ===== ナビゲーション ===== */}
        <Section id="nav" title="ナビゲーション / Navigation">
          <div className="grid gap-8">
            {/* Tabs */}
            <div>
              <p className="mb-3 font-bold">Tabs</p>
              <Tab>
                <TabList aria-label="サービス情報" {...tabs.getListProps()}>
                  <TabItem {...tabs.getTabProps(0)}>概要</TabItem>
                  <TabItem {...tabs.getTabProps(1)}>手続き</TabItem>
                  <TabItem {...tabs.getTabProps(2)}>よくある質問</TabItem>
                </TabList>
                <TabPanel {...tabs.getPanelProps(0)}>
                  <p className="leading-[1.8]">
                    転入手続きの概要を表示します。
                  </p>
                </TabPanel>
                <TabPanel {...tabs.getPanelProps(1)}>
                  <p className="leading-[1.8]">
                    必要書類と手続きの流れを表示します。
                  </p>
                </TabPanel>
                <TabPanel {...tabs.getPanelProps(2)}>
                  <p className="leading-[1.8]">
                    よくある質問と回答を表示します。
                  </p>
                </TabPanel>
              </Tab>
            </div>

            {/* Accordion */}
            <div>
              <p className="mb-3 font-bold">Accordion</p>
              <div className="border-t border-solid-gray-420">
                <Accordion>
                  <AccordionSummary>
                    転入届はいつまでに提出が必要ですか？
                  </AccordionSummary>
                  <AccordionContent>
                    <p className="leading-[1.8]">
                      引っ越し後 14 日以内に提出してください。
                    </p>
                    <AccordionBackLink href="#nav" className="mt-3">
                      ページの先頭へ戻る
                    </AccordionBackLink>
                  </AccordionContent>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    オンラインで手続きできますか？
                  </AccordionSummary>
                  <AccordionContent>
                    <p className="leading-[1.8]">
                      マイナンバーカードをお持ちの場合はオンラインで手続き可能です。
                    </p>
                  </AccordionContent>
                </Accordion>
              </div>
            </div>

            {/* Disclosure */}
            <div>
              <p className="mb-3 font-bold">Disclosure</p>
              <Disclosure>
                <DisclosureSummary>詳しい条件を表示する</DisclosureSummary>
                <div className="mt-3 pl-8">
                  <p className="leading-[1.8]">
                    対象となるのは当該市区町村に住民登録がある方です。
                  </p>
                  <DisclosureBackLink href="#nav" className="mt-3">
                    先頭へ戻る
                  </DisclosureBackLink>
                </div>
              </Disclosure>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* MenuList */}
              <div>
                <p className="mb-3 font-bold">MenuList</p>
                <MenuList>
                  <MenuListItem>
                    <MenuListItemLink
                      type="standard"
                      size="regular"
                      href="#"
                      current
                    >
                      ダッシュボード
                    </MenuListItemLink>
                  </MenuListItem>
                  <MenuListItem>
                    <MenuListItemLink type="standard" size="regular" href="#">
                      申請履歴
                    </MenuListItemLink>
                  </MenuListItem>
                  <MenuListItem>
                    <MenuListItemButton type="standard" size="regular">
                      設定
                    </MenuListItemButton>
                  </MenuListItem>
                </MenuList>
              </div>

              {/* MenuListBox + HamburgerMenuButton */}
              <div className="grid gap-6">
                <div>
                  <p className="mb-3 font-bold">MenuListBox</p>
                  <MenuListBox {...menu.rootProps}>
                    <MenuListBoxOpener
                      size="md"
                      buttonStyle="outlined"
                      {...menu.openerProps}
                    >
                      操作を選択
                    </MenuListBoxOpener>
                    {menu.isOpen && (
                      <MenuListBoxPopup {...menu.popupProps}>
                        <ul role="menu" className="min-w-40">
                          {[
                            ["edit", "編集する"],
                            ["duplicate", "複製する"],
                            ["delete", "削除する"],
                          ].map(([value, label]) => (
                            <li role="none" key={value}>
                              <button
                                type="button"
                                role="menuitem"
                                data-value={value}
                                className={menuItemClass}
                              >
                                {label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </MenuListBoxPopup>
                    )}
                  </MenuListBox>
                  {pickedAction && (
                    <p className="mt-2 text-sm text-solid-gray-600">
                      選択した操作: {pickedAction}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 font-bold">HamburgerMenuButton</p>
                  <HamburgerMenuButton onClick={openDrawer}>
                    <HamburgerIcon />
                    メニュー
                  </HamburgerMenuButton>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== データ表示 ===== */}
        <Section id="data" title="データ表示 / Data display">
          <div className="grid gap-10">
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>申請状況一覧</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>受付番号</TableHead>
                    <TableHead>種別</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>受付日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["TK-0048", "転入届", "審査待ち", "2026-07-13"],
                    ["TK-0049", "印鑑登録", "受付完了", "2026-07-12"],
                    ["TK-0050", "住民票の写し", "発行済み", "2026-07-11"],
                  ].map((row) => (
                    <TableRow key={row[0]}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>
                        <StatusBadge>{row[2]}</StatusBadge>
                      </TableCell>
                      <TableCell>{row[3]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Carousel */}
            <div>
              <p className="mb-3 font-bold">Carousel</p>
              <Carousel
                slides={carouselSlides}
                currentIndex={carouselIndex}
                isNormal
                unit="スライド"
                onPrev={() =>
                  setCarouselIndex(
                    (i) =>
                      (i - 1 + carouselSlides.length) % carouselSlides.length
                  )
                }
                onNext={() =>
                  setCarouselIndex((i) => (i + 1) % carouselSlides.length)
                }
                onStepSelect={setCarouselIndex}
              />
            </div>

            {/* CarouselSingle */}
            <div>
              <p className="mb-3 font-bold">CarouselSingle（単一画像）</p>
              <CarouselSingle>
                <CarouselSingleLink href="#">
                  <CarouselSingleImage
                    src={placeholder("単一スライド", "#1f2937")}
                    alt="単一スライドの画像"
                    width={640}
                    height={360}
                  />
                </CarouselSingleLink>
              </CarouselSingle>
            </div>
          </div>
        </Section>
      </main>

      {/* Dialog 本体 */}
      <Dialog {...dialog.dialogProps} scroll="inner" width="min(560px, 92vw)">
        <DialogContent>
          <DialogHeader>
            <DialogHeading {...dialog.headingProps}>
              利用規約への同意
            </DialogHeading>
            <DialogClose {...dialog.closeButtonProps} />
          </DialogHeader>
          <DialogScrollArea className="px-4 md:px-6">
            <div className="grid gap-3 leading-[1.8]">
              <p>
                第 1 条
                本サービスは、行政手続きのオンライン申請を目的として提供されます。
              </p>
              <p>第 2 条 利用者は、正確な情報を入力するものとします。</p>
              <p>
                第 3 条 提供された情報は、関係法令に基づき適切に取り扱われます。
              </p>
              <p>第 4 条 本規約は予告なく変更される場合があります。</p>
              <p>第 5 条 不明点はお問い合わせ窓口までご連絡ください。</p>
            </div>
          </DialogScrollArea>
          <DialogActions>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setAgree(true)
                  setDialogOpen(false)
                }}
              >
                同意する
              </Button>
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-solid-gray-300 bg-white py-6 text-center text-sm text-solid-gray-600">
        <p>
          Unofficial — デジタル庁デザインシステムを参考にした shadcn/ui
          コンポーネント集のデモ
        </p>
      </footer>
    </div>
  )
}
