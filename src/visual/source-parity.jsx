import { parseDate } from "@internationalized/date"
import { useEffect, useId, useRef, useState } from "react"
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
} from "react-aria-components"

import {
  Accordion as UpstreamAccordion,
  AccordionBackLink as UpstreamAccordionBackLink,
  AccordionContent as UpstreamAccordionContent,
  AccordionSummary as UpstreamAccordionSummary,
} from "../../upstream/design-system-example-components-react/src/components/Accordion"
import { Blockquote as UpstreamBlockquote } from "../../upstream/design-system-example-components-react/src/components/Blockquote"
import {
  BreadcrumbItem as UpstreamBreadcrumbItem,
  BreadcrumbLink as UpstreamBreadcrumbLink,
  BreadcrumbList as UpstreamBreadcrumbList,
  Breadcrumbs as UpstreamBreadcrumbs,
  BreadcrumbsLabel as UpstreamBreadcrumbsLabel,
} from "../../upstream/design-system-example-components-react/src/components/Breadcrumbs"
import { Button as UpstreamButton } from "../../upstream/design-system-example-components-react/src/components/Button/Button"
import { Checkbox as UpstreamCheckbox } from "../../upstream/design-system-example-components-react/src/components/Checkbox"
import { ChipLabel as UpstreamChipLabel } from "../../upstream/design-system-example-components-react/src/components/ChipLabel"
import {
  Carousel as UpstreamCarousel,
  CarouselSingle as UpstreamCarouselSingle,
  CarouselSingleImage as UpstreamCarouselSingleImage,
  CarouselSingleLink as UpstreamCarouselSingleLink,
} from "../../upstream/design-system-example-components-react/src/components/Carousel"
import {
  DatePicker as UpstreamDatePicker,
  DatePickerDate as UpstreamDatePickerDate,
  DatePickerMonth as UpstreamDatePickerMonth,
  DatePickerYear as UpstreamDatePickerYear,
} from "../../upstream/design-system-example-components-react/src/components/DatePicker"
import {
  Disclosure as UpstreamDisclosure,
  DisclosureBackLink as UpstreamDisclosureBackLink,
  DisclosureSummary as UpstreamDisclosureSummary,
} from "../../upstream/design-system-example-components-react/src/components/Disclosure"
import { Divider as UpstreamDivider } from "../../upstream/design-system-example-components-react/src/components/Divider"
import {
  Dd as UpstreamDd,
  Dl as UpstreamDl,
  Dt as UpstreamDt,
} from "../../upstream/design-system-example-components-react/src/components/Dl"
import {
  EmergencyBanner as UpstreamEmergencyBanner,
  EmergencyBannerBody as UpstreamEmergencyBannerBody,
  EmergencyBannerButton as UpstreamEmergencyBannerButton,
  EmergencyBannerHeading as UpstreamEmergencyBannerHeading,
} from "../../upstream/design-system-example-components-react/src/components/EmergencyBanner"
import { ErrorText as UpstreamErrorText } from "../../upstream/design-system-example-components-react/src/components/ErrorText/ErrorText"
import {
  FileUpload as UpstreamFileUpload,
  FileUploadDropArea as UpstreamFileUploadDropArea,
  FileUploadFileInfo as UpstreamFileUploadFileInfo,
  FileUploadFileItem as UpstreamFileUploadFileItem,
  FileUploadFileList as UpstreamFileUploadFileList,
  FileUploadFileMarker as UpstreamFileUploadFileMarker,
  FileUploadFileMeta as UpstreamFileUploadFileMeta,
  FileUploadFileName as UpstreamFileUploadFileName,
  FileUploadInput as UpstreamFileUploadInput,
} from "../../upstream/design-system-example-components-react/src/components/FileUpload"
import {
  CloseIcon as UpstreamCloseIcon,
  CloseWithLabelIcon as UpstreamCloseWithLabelIcon,
  HamburgerIcon as UpstreamHamburgerIcon,
  HamburgerMenuButton as UpstreamHamburgerMenuButton,
  HamburgerMenuIconButton as UpstreamHamburgerMenuIconButton,
  HamburgerWithLabelIcon as UpstreamHamburgerWithLabelIcon,
} from "../../upstream/design-system-example-components-react/src/components/HamburgerMenuButton"
import {
  Heading as UpstreamHeading,
  HeadingShoulder as UpstreamHeadingShoulder,
  HeadingTitle as UpstreamHeadingTitle,
} from "../../upstream/design-system-example-components-react/src/components/Heading"
import {
  HorizontalMenu as UpstreamHorizontalMenu,
  HorizontalMenuItem as UpstreamHorizontalMenuItem,
  HorizontalMenuItemButton as UpstreamHorizontalMenuItemButton,
  HorizontalMenuItemLink as UpstreamHorizontalMenuItemLink,
} from "../../upstream/design-system-example-components-react/src/components/HorizontalMenu"
import {
  Image as UpstreamImageFigure,
  ImageArea as UpstreamImageArea,
  ImageAreaLink as UpstreamImageAreaLink,
  ImageCaption as UpstreamImageCaption,
} from "../../upstream/design-system-example-components-react/src/components/Image"
import { Input as UpstreamInput } from "../../upstream/design-system-example-components-react/src/components/Input"
import { Label as UpstreamLabel } from "../../upstream/design-system-example-components-react/src/components/Label"
import {
  LanguageSelector as UpstreamLanguageSelector,
  LanguageSelectorArrowIcon as UpstreamLanguageSelectorArrowIcon,
  LanguageSelectorButton as UpstreamLanguageSelectorButton,
  LanguageSelectorGlobeIcon as UpstreamLanguageSelectorGlobeIcon,
  LanguageSelectorMenu as UpstreamLanguageSelectorMenu,
  LanguageSelectorMenuItem as UpstreamLanguageSelectorMenuItem,
} from "../../upstream/design-system-example-components-react/src/components/LanguageSelector"
import { Legend as UpstreamLegend } from "../../upstream/design-system-example-components-react/src/components/Legend/Legend"
import { Link as UpstreamLink } from "../../upstream/design-system-example-components-react/src/components/Link"
import { List as UpstreamList } from "../../upstream/design-system-example-components-react/src/components/List"
import {
  MenuList as UpstreamMenuList,
  MenuListItem as UpstreamMenuListItem,
  MenuListItemButton as UpstreamMenuListItemButton,
  MenuListItemLink as UpstreamMenuListItemLink,
} from "../../upstream/design-system-example-components-react/src/components/MenuList/MenuList"
import {
  MenuListBox as UpstreamMenuListBox,
  MenuListBoxOpener as UpstreamMenuListBoxOpener,
  MenuListBoxPopup as UpstreamMenuListBoxPopup,
} from "../../upstream/design-system-example-components-react/src/components/MenuListBox/MenuListBox"
import { useMenuListBox as useUpstreamMenuListBox } from "../../upstream/design-system-example-components-react/src/components/MenuListBox/useMenuListBox"
import {
  ModalDialog as UpstreamDialog,
  ModalDialogActions as UpstreamDialogActions,
  ModalDialogBody as UpstreamDialogBody,
  ModalDialogClose as UpstreamDialogClose,
  ModalDialogContent as UpstreamDialogContent,
  ModalDialogHeader as UpstreamDialogHeader,
  ModalDialogHeading as UpstreamDialogHeading,
  ModalDialogScrollArea as UpstreamDialogScrollArea,
} from "../../upstream/design-system-example-components-react/src/components/ModalDialog/ModalDialog"
import { useModalDialog as useUpstreamDialog } from "../../upstream/design-system-example-components-react/src/components/ModalDialog/useModalDialog"
import {
  NotificationBanner as UpstreamNotificationBanner,
  NotificationBannerBody as UpstreamNotificationBannerBody,
  NotificationBannerClose as UpstreamNotificationBannerClose,
} from "../../upstream/design-system-example-components-react/src/components/NotificationBanner"
import {
  ProgressIndicator as UpstreamProgressIndicator,
  ProgressIndicatorLinear as UpstreamProgressIndicatorLinear,
  ProgressIndicatorSpinner as UpstreamProgressIndicatorSpinner,
  ProgressIndicatorStatic as UpstreamProgressIndicatorStatic,
} from "../../upstream/design-system-example-components-react/src/components/ProgressIndicator"
import { Radio as UpstreamRadio } from "../../upstream/design-system-example-components-react/src/components/Radio"
import { RequirementBadge as UpstreamRequirementBadge } from "../../upstream/design-system-example-components-react/src/components/RequirementBadge/RequirementBadge"
import { Select as UpstreamSelect } from "../../upstream/design-system-example-components-react/src/components/Select"
import {
  SeparatedDatePicker as UpstreamSeparatedDatePicker,
  SeparatedDatePickerCalendarButton as UpstreamSeparatedDatePickerCalendarButton,
  SeparatedDatePickerDate as UpstreamSeparatedDatePickerDate,
  SeparatedDatePickerMonth as UpstreamSeparatedDatePickerMonth,
  SeparatedDatePickerYear as UpstreamSeparatedDatePickerYear,
} from "../../upstream/design-system-example-components-react/src/components/SeparatedDatePicker"
import { StatusBadge as UpstreamStatusBadge } from "../../upstream/design-system-example-components-react/src/components/StatusBadge"
import { SupportText as UpstreamSupportText } from "../../upstream/design-system-example-components-react/src/components/SupportText/SupportText"
import {
  Tab as UpstreamTab,
  TabItem as UpstreamTabItem,
  TabList as UpstreamTabList,
  TabPanel as UpstreamTabPanel,
} from "../../upstream/design-system-example-components-react/src/components/Tab/Tab"
import { Textarea as UpstreamTextarea } from "../../upstream/design-system-example-components-react/src/components/Textarea"
import { UtilityLink as UpstreamUtilityLink } from "../../upstream/design-system-example-components-react/src/components/UtilityLink"

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
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
} from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { ChipLabel } from "@/components/ui/chip-label"
import {
  Carousel,
  CarouselSingle,
  CarouselSingleImage,
  CarouselSingleLink,
} from "@/components/ui/carousel"
import {
  DatePicker,
  DatePickerDate,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/ui/date-picker"
import {
  Disclosure,
  DisclosureBackLink,
  DisclosureSummary,
} from "@/components/ui/disclosure"
import { Divider } from "@/components/ui/divider"
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogHeading,
  DialogScrollArea,
  useDialog,
} from "@/components/ui/dialog"
import { Dd, Dl, Dt } from "@/components/ui/description-list"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerMenuLink,
  DrawerTitle,
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
} from "@/components/ui/file-upload"
import {
  CloseIcon,
  CloseWithLabelIcon,
  HamburgerIcon,
  HamburgerMenuButton,
  HamburgerMenuIconButton,
  HamburgerWithLabelIcon,
} from "@/components/ui/hamburger-menu-button"
import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"
import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemButton,
  HorizontalMenuItemLink,
} from "@/components/ui/horizontal-menu"
import {
  Image as OursImage,
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
import { Tab, TabItem, TabList, TabPanel } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { UtilityLink } from "@/components/ui/utility-link"

const carouselImageUrl = (name) =>
  new URL(
    `../../upstream/design-system-example-components-react/src/components/Carousel/carousel-sample-images/${name}`,
    import.meta.url
  ).href

const carouselSlides = [
  {
    id: "slide-1",
    label: "写真：デジタル公園の入り口",
    href: "#slide-1",
    image: {
      src: carouselImageUrl("image-1.webp"),
      srcSet: `${carouselImageUrl("image-1@2x.webp")} 2x`,
      alt: "写真：デジタル公園の入り口",
      width: 696,
      height: 392,
    },
  },
  {
    id: "slide-2",
    label: "写真：デジタル公園の芝生",
    href: "#slide-2",
    image: {
      src: carouselImageUrl("image-2.webp"),
      srcSet: `${carouselImageUrl("image-2@2x.webp")} 2x`,
      alt: "写真：デジタル公園の芝生",
      width: 696,
      height: 392,
    },
  },
  {
    id: "slide-3",
    label: "写真：デジタル公園の木立",
    href: "#slide-3",
    image: {
      src: carouselImageUrl("image-3.webp"),
      srcSet: `${carouselImageUrl("image-3@2x.webp")} 2x`,
      alt: "写真：デジタル公園の木立",
      width: 696,
      height: 392,
    },
  },
]

const imageUrl = (name) =>
  new URL(
    `../../upstream/design-system-example-components-react/src/components/Image/${name}`,
    import.meta.url
  ).href

const sampleImage = {
  src: imageUrl("sample.png"),
  srcSet: `${imageUrl("sample@2x.png")} 2x`,
  alt: "サンプル画像",
  width: 696,
  height: 392,
}

const menuItems = [
  "メニュー項目1",
  "メニュー項目2",
  "メニュー項目3",
  "メニュー項目4",
  "メニュー項目5",
  "メニュー項目6",
  "メニュー項目7",
]

const drawerMenu = [
  { id: "sample1", name: "メニューアイテム1", url: "#" },
  { id: "sample2", name: "メニューアイテム2", url: "#" },
  { id: "sample3", name: "メニューアイテム3", url: "#" },
  { id: "sample4", name: "メニューアイテム4", url: "#" },
]

const rawDrawerMenuLinkClass = `
  flex min-h-[calc(44/16*1rem)] items-center px-4 py-3 text-dns-16N-120 rounded-4
  hover:bg-solid-gray-50 hover:underline hover:underline-offset-[calc(3/16*1rem)]
  focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:-outline-offset-4 focus-visible:bg-yellow-300 focus-visible:ring-[calc(6/16*1rem)] focus-visible:ring-inset focus-visible:ring-yellow-300
`

function MenuIcon({ className = "shrink-0 w-5 h-5" }) {
  return (
    <svg
      aria-hidden={true}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={true}
      className="mt-1 shrink-0 size-4 group-aria-expanded/horizontal-menu-item:rotate-180"
    >
      <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" />
    </svg>
  )
}

function SampleChipIcon() {
  return (
    <svg
      aria-hidden={true}
      className="mr-1 inline-block size-4 align-[-0.15em]"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M8 1.5 9.9 5.6l4.4.5-3.2 3.1.8 4.3L8 11.4l-3.9 2.1.8-4.3-3.2-3.1 4.4-.5L8 1.5Z" />
    </svg>
  )
}

function UpstreamAccordionFixture() {
  return (
    <div className="max-w-3xl">
      <UpstreamAccordion className="text-std-16N-170" open>
        <UpstreamAccordionSummary
          className="desktop:text-std-18N-160"
          id="source-parity-accordion-summary"
        >
          <h3>ダミーテキストとは何ですか？</h3>
        </UpstreamAccordionSummary>
        <UpstreamAccordionContent>
          <p className="mb-4">これはダミーテキストです。</p>
          <p>
            ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
          </p>
          <UpstreamAccordionBackLink
            className="mt-4 [text-spacing-trim:trim-start]"
            href="#source-parity-accordion-summary"
          >
            「ダミーテキストとは何ですか？」の先頭に戻る
          </UpstreamAccordionBackLink>
        </UpstreamAccordionContent>
      </UpstreamAccordion>
    </div>
  )
}

function OursAccordionFixture() {
  return (
    <div className="max-w-3xl">
      <Accordion className="text-std-16N-170" open>
        <AccordionSummary
          className="desktop:text-std-18N-160"
          id="source-parity-accordion-summary"
        >
          <h3>ダミーテキストとは何ですか？</h3>
        </AccordionSummary>
        <AccordionContent>
          <p className="mb-4">これはダミーテキストです。</p>
          <p>
            ダミーテキストは、デザインやレイアウトの作成時に使用される仮の文章です。
          </p>
          <AccordionBackLink
            className="mt-4 [text-spacing-trim:trim-start]"
            href="#source-parity-accordion-summary"
          >
            「ダミーテキストとは何ですか？」の先頭に戻る
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>
    </div>
  )
}

function UpstreamBlockquoteFixture() {
  return (
    <UpstreamBlockquote>
      <p>すべての人がデジタルサービスを利用できるように設計します。</p>
      <p className="mt-4">重要な引用文を複数段落で表示します。</p>
    </UpstreamBlockquote>
  )
}

function OursBlockquoteFixture() {
  return (
    <Blockquote>
      <p>すべての人がデジタルサービスを利用できるように設計します。</p>
      <p className="mt-4">重要な引用文を複数段落で表示します。</p>
    </Blockquote>
  )
}

function UpstreamBreadcrumbsFixture() {
  return (
    <UpstreamBreadcrumbs aria-label="パンくずリスト">
      <UpstreamBreadcrumbsLabel className="sr-only">
        現在位置
      </UpstreamBreadcrumbsLabel>
      <UpstreamBreadcrumbList>
        <UpstreamBreadcrumbItem>
          <UpstreamBreadcrumbLink href="#">ホーム</UpstreamBreadcrumbLink>
        </UpstreamBreadcrumbItem>
        <UpstreamBreadcrumbItem>
          <UpstreamBreadcrumbLink href="#">手続き</UpstreamBreadcrumbLink>
        </UpstreamBreadcrumbItem>
        <UpstreamBreadcrumbItem isCurrent>申請フォーム</UpstreamBreadcrumbItem>
      </UpstreamBreadcrumbList>
    </UpstreamBreadcrumbs>
  )
}

function OursBreadcrumbsFixture() {
  return (
    <Breadcrumbs aria-label="パンくずリスト">
      <BreadcrumbsLabel className="sr-only">現在位置</BreadcrumbsLabel>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">手続き</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent>申請フォーム</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumbs>
  )
}

function UpstreamButtonFixture() {
  return (
    <div className="grid gap-6">
      {["solid-fill", "outline", "text"].map((variant) => (
        <div className="flex items-center gap-4" key={variant}>
          {["lg", "md", "sm", "xs"].map((size) => (
            <UpstreamButton key={size} size={size} variant={variant}>
              ラベル
            </UpstreamButton>
          ))}
        </div>
      ))}
    </div>
  )
}

function OursButtonFixture() {
  return (
    <div className="grid gap-6">
      {["solid-fill", "outline", "text"].map((variant) => (
        <div className="flex items-center gap-4" key={variant}>
          {["lg", "md", "sm", "xs"].map((size) => (
            <Button key={size} size={size} variant={variant}>
              ラベル
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}

function UpstreamCheckboxFixture() {
  return (
    <fieldset>
      <UpstreamLegend>
        ラベル<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLegend>
      <UpstreamSupportText className="mt-2">
        サポートテキスト
      </UpstreamSupportText>
      <div className="mt-2 flex flex-col gap-2">
        <UpstreamCheckbox>選択肢1</UpstreamCheckbox>
        <UpstreamCheckbox defaultChecked>選択肢2</UpstreamCheckbox>
        <UpstreamCheckbox isError>選択肢3</UpstreamCheckbox>
      </div>
    </fieldset>
  )
}

function OursCheckboxRow({ checked, error, label }) {
  return (
    <div className="flex w-fit items-start gap-1 py-2">
      <Checkbox aria-label={label} defaultChecked={checked} isError={error} />
      <span className="pt-px text-dns-16N-130 text-solid-gray-800">
        {label}
      </span>
    </div>
  )
}

function OursCheckboxFixture() {
  return (
    <fieldset>
      <Legend>
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Legend>
      <SupportText className="mt-2">サポートテキスト</SupportText>
      <div className="mt-2 flex flex-col gap-2">
        <OursCheckboxRow label="選択肢1" />
        <OursCheckboxRow checked label="選択肢2" />
        <OursCheckboxRow error label="選択肢3" />
      </div>
    </fieldset>
  )
}

function UpstreamChipLabelFixture() {
  return (
    <div className="flex max-w-3xl flex-wrap gap-3">
      {["text", "outlined", "filled-1", "filled-2"].map((variant) => (
        <UpstreamChipLabel color="blue" key={variant} variant={variant}>
          <SampleChipIcon />
          {variant}
        </UpstreamChipLabel>
      ))}
      {["gray", "green", "yellow", "red", "purple"].map((color) => (
        <UpstreamChipLabel color={color} key={color} variant="filled-1">
          {color}
        </UpstreamChipLabel>
      ))}
    </div>
  )
}

function OursChipLabelFixture() {
  return (
    <div className="flex max-w-3xl flex-wrap gap-3">
      {["text", "outlined", "filled-1", "filled-2"].map((variant) => (
        <ChipLabel color="blue" key={variant} variant={variant}>
          <SampleChipIcon />
          {variant}
        </ChipLabel>
      ))}
      {["gray", "green", "yellow", "red", "purple"].map((color) => (
        <ChipLabel color={color} key={color} variant="filled-1">
          {color}
        </ChipLabel>
      ))}
    </div>
  )
}

function UpstreamDisclosureFixture() {
  return (
    <UpstreamDisclosure open>
      <UpstreamDisclosureSummary id="source-parity-disclosure">
        ディスクロージャータイトル
      </UpstreamDisclosureSummary>
      <div className="my-4 pl-8">
        これはダミーテキストです。詳細情報を開いた状態で表示しています。
        <UpstreamDisclosureBackLink
          className="mt-4 [text-spacing-trim:trim-start]"
          href="#source-parity-disclosure"
        >
          「ディスクロージャータイトル」の先頭に戻る
        </UpstreamDisclosureBackLink>
      </div>
    </UpstreamDisclosure>
  )
}

function OursDisclosureFixture() {
  return (
    <Disclosure open>
      <DisclosureSummary id="source-parity-disclosure">
        ディスクロージャータイトル
      </DisclosureSummary>
      <div className="my-4 pl-8">
        これはダミーテキストです。詳細情報を開いた状態で表示しています。
        <DisclosureBackLink
          className="mt-4 [text-spacing-trim:trim-start]"
          href="#source-parity-disclosure"
        >
          「ディスクロージャータイトル」の先頭に戻る
        </DisclosureBackLink>
      </div>
    </Disclosure>
  )
}

function UpstreamDividerFixture() {
  return (
    <div className="w-[36rem] space-y-5">
      <p className="text-std-16N-170">区切り線の上のテキスト</p>
      <UpstreamDivider />
      <UpstreamDivider color="gray-536" />
      <UpstreamDivider color="black" />
    </div>
  )
}

function OursDividerFixture() {
  return (
    <div className="w-[36rem] space-y-5">
      <p className="text-std-16N-170">区切り線の上のテキスト</p>
      <Divider />
      <Divider color="gray-536" />
      <Divider color="black" />
    </div>
  )
}

function UpstreamDlFixture() {
  return (
    <UpstreamDl marker="bullet">
      <UpstreamDt>申請期限</UpstreamDt>
      <UpstreamDd>2026年7月31日</UpstreamDd>
      <UpstreamDt>対象者</UpstreamDt>
      <UpstreamDd>日本国内に居住する申請者</UpstreamDd>
    </UpstreamDl>
  )
}

function OursDlFixture() {
  return (
    <Dl marker="bullet">
      <Dt>申請期限</Dt>
      <Dd>2026年7月31日</Dd>
      <Dt>対象者</Dt>
      <Dd>日本国内に居住する申請者</Dd>
    </Dl>
  )
}

function UpstreamEmergencyBannerFixture() {
  return (
    <div className="w-[56rem]">
      <UpstreamEmergencyBanner>
        <UpstreamEmergencyBannerHeading level="h2">
          〇〇地区に避難準備情報が発令されました
        </UpstreamEmergencyBannerHeading>
        <UpstreamEmergencyBannerBody>
          <div className="flex flex-col gap-2 desktop:gap-4">
            <p className="text-std-16N-170">
              <time dateTime="2024-01-01T06:00">2024年1月1日 06:00更新</time>
            </p>
            <p className="text-std-16N-170 desktop:text-std-20N-150">
              指定避難所へ避難してください。
            </p>
            <UpstreamEmergencyBannerButton className="mt-4 mb-2" href="#">
              指定避難所を確認する
            </UpstreamEmergencyBannerButton>
          </div>
        </UpstreamEmergencyBannerBody>
      </UpstreamEmergencyBanner>
    </div>
  )
}

function OursEmergencyBannerFixture() {
  return (
    <div className="w-[56rem]">
      <EmergencyBanner>
        <EmergencyBannerHeading level="h2">
          〇〇地区に避難準備情報が発令されました
        </EmergencyBannerHeading>
        <EmergencyBannerBody>
          <div className="flex flex-col gap-2 desktop:gap-4">
            <p className="text-std-16N-170">
              <time dateTime="2024-01-01T06:00">2024年1月1日 06:00更新</time>
            </p>
            <p className="text-std-16N-170 desktop:text-std-20N-150">
              指定避難所へ避難してください。
            </p>
            <EmergencyBannerButton className="mt-4 mb-2" href="#">
              指定避難所を確認する
            </EmergencyBannerButton>
          </div>
        </EmergencyBannerBody>
      </EmergencyBanner>
    </div>
  )
}

function UpstreamErrorTextFixture() {
  return <UpstreamErrorText>＊エラーテキスト</UpstreamErrorText>
}

function OursErrorTextFixture() {
  return <ErrorText>＊エラーテキスト</ErrorText>
}

function UpstreamFileUploadFixture() {
  return (
    <UpstreamFileUpload className="w-[36rem]" maxFiles={3} hasError droppable>
      <UpstreamFileUploadDropArea>
        <div className="grid justify-items-center gap-3 text-center">
          <p className="text-std-16N-170">
            ファイルをドラッグ＆ドロップ、または選択してください。
          </p>
          <UpstreamButton size="md" variant="outline">
            ファイルを選択
          </UpstreamButton>
        </div>
        <UpstreamFileUploadInput aria-label="ファイル" multiple />
      </UpstreamFileUploadDropArea>
      <UpstreamFileUploadFileList>
        <UpstreamFileUploadFileItem>
          <UpstreamFileUploadFileMarker />
          <UpstreamFileUploadFileInfo>
            <UpstreamFileUploadFileName>sample.pdf</UpstreamFileUploadFileName>
            <UpstreamFileUploadFileMeta>1.2MB</UpstreamFileUploadFileMeta>
          </UpstreamFileUploadFileInfo>
        </UpstreamFileUploadFileItem>
        <UpstreamFileUploadFileItem hasError>
          <UpstreamFileUploadFileMarker />
          <UpstreamFileUploadFileInfo>
            <UpstreamFileUploadFileName>large.zip</UpstreamFileUploadFileName>
            <UpstreamFileUploadFileMeta>
              ファイルサイズが上限を超過しています。
            </UpstreamFileUploadFileMeta>
          </UpstreamFileUploadFileInfo>
        </UpstreamFileUploadFileItem>
      </UpstreamFileUploadFileList>
    </UpstreamFileUpload>
  )
}

function OursFileUploadFixture() {
  return (
    <FileUpload className="w-[36rem]" maxFiles={3} hasError droppable>
      <FileUploadDropArea>
        <div className="grid justify-items-center gap-3 text-center">
          <p className="text-std-16N-170">
            ファイルをドラッグ＆ドロップ、または選択してください。
          </p>
          <Button size="md" variant="outline">
            ファイルを選択
          </Button>
        </div>
        <FileUploadInput aria-label="ファイル" multiple />
      </FileUploadDropArea>
      <FileUploadFileList>
        <FileUploadFileItem>
          <FileUploadFileMarker />
          <FileUploadFileInfo>
            <FileUploadFileName>sample.pdf</FileUploadFileName>
            <FileUploadFileMeta>1.2MB</FileUploadFileMeta>
          </FileUploadFileInfo>
        </FileUploadFileItem>
        <FileUploadFileItem hasError>
          <FileUploadFileMarker />
          <FileUploadFileInfo>
            <FileUploadFileName>large.zip</FileUploadFileName>
            <FileUploadFileMeta>
              ファイルサイズが上限を超過しています。
            </FileUploadFileMeta>
          </FileUploadFileInfo>
        </FileUploadFileItem>
      </FileUploadFileList>
    </FileUpload>
  )
}

function UpstreamHamburgerMenuButtonFixture() {
  return (
    <div className="flex items-center gap-4">
      <UpstreamHamburgerMenuButton>
        <UpstreamHamburgerIcon className="flex-none" />
        メニュー
      </UpstreamHamburgerMenuButton>
      <UpstreamHamburgerMenuButton>
        <UpstreamCloseIcon className="flex-none" />
        閉じる
      </UpstreamHamburgerMenuButton>
      <UpstreamHamburgerMenuIconButton aria-label="メニューを開く">
        <UpstreamHamburgerWithLabelIcon />
      </UpstreamHamburgerMenuIconButton>
      <UpstreamHamburgerMenuIconButton aria-label="メニューを閉じる">
        <UpstreamCloseWithLabelIcon />
      </UpstreamHamburgerMenuIconButton>
    </div>
  )
}

function OursHamburgerMenuButtonFixture() {
  return (
    <div className="flex items-center gap-4">
      <HamburgerMenuButton>
        <HamburgerIcon className="flex-none" />
        メニュー
      </HamburgerMenuButton>
      <HamburgerMenuButton>
        <CloseIcon className="flex-none" />
        閉じる
      </HamburgerMenuButton>
      <HamburgerMenuIconButton aria-label="メニューを開く">
        <HamburgerWithLabelIcon />
      </HamburgerMenuIconButton>
      <HamburgerMenuIconButton aria-label="メニューを閉じる">
        <CloseWithLabelIcon />
      </HamburgerMenuIconButton>
    </div>
  )
}

function UpstreamHeadingFixture() {
  return (
    <UpstreamHeading size="36" hasChip rule="6">
      <UpstreamHeadingShoulder>手続き情報</UpstreamHeadingShoulder>
      <UpstreamHeadingTitle level="h2">
        <MenuIcon className="mr-[0.4em] inline-block size-[1.25em] align-[-0.25em]" />
        見出しテキスト
      </UpstreamHeadingTitle>
    </UpstreamHeading>
  )
}

function OursHeadingFixture() {
  return (
    <Heading size="36" hasChip rule="6">
      <HeadingShoulder>手続き情報</HeadingShoulder>
      <HeadingTitle level="h2">
        <MenuIcon className="mr-[0.4em] inline-block size-[1.25em] align-[-0.25em]" />
        見出しテキスト
      </HeadingTitle>
    </Heading>
  )
}

function UpstreamHorizontalMenuFixture() {
  return (
    <UpstreamHorizontalMenu>
      <UpstreamHorizontalMenuItem>
        <UpstreamHorizontalMenuItemLink href="#" aria-current="true">
          <MenuIcon className="shrink-0 size-6" />
          メニュー1
        </UpstreamHorizontalMenuItemLink>
      </UpstreamHorizontalMenuItem>
      <UpstreamHorizontalMenuItem>
        <UpstreamHorizontalMenuItemButton aria-expanded={true}>
          メニュー2
          <ChevronIcon />
        </UpstreamHorizontalMenuItemButton>
      </UpstreamHorizontalMenuItem>
      <UpstreamHorizontalMenuItem>
        <UpstreamHorizontalMenuItemLink href="#">
          メニュー3
        </UpstreamHorizontalMenuItemLink>
      </UpstreamHorizontalMenuItem>
    </UpstreamHorizontalMenu>
  )
}

function OursHorizontalMenuFixture() {
  return (
    <HorizontalMenu>
      <HorizontalMenuItem>
        <HorizontalMenuItemLink href="#" aria-current="true">
          <MenuIcon className="shrink-0 size-6" />
          メニュー1
        </HorizontalMenuItemLink>
      </HorizontalMenuItem>
      <HorizontalMenuItem>
        <HorizontalMenuItemButton aria-expanded={true}>
          メニュー2
          <ChevronIcon />
        </HorizontalMenuItemButton>
      </HorizontalMenuItem>
      <HorizontalMenuItem>
        <HorizontalMenuItemLink href="#">メニュー3</HorizontalMenuItemLink>
      </HorizontalMenuItem>
    </HorizontalMenu>
  )
}

function UpstreamImageFixture() {
  return (
    <UpstreamImageFigure>
      <UpstreamImageArea bordered>
        <UpstreamImageAreaLink href="#" aria-label="サンプル画像の詳細">
          <img {...sampleImage} />
        </UpstreamImageAreaLink>
      </UpstreamImageArea>
      <UpstreamImageCaption captionStyle="solid">
        キャプションテキスト
      </UpstreamImageCaption>
    </UpstreamImageFigure>
  )
}

function OursImageFixture() {
  return (
    <ImageFigure>
      <ImageArea bordered>
        <ImageAreaLink href="#" aria-label="サンプル画像の詳細">
          <OursImage {...sampleImage} />
        </ImageAreaLink>
      </ImageArea>
      <ImageCaption captionStyle="solid">キャプションテキスト</ImageCaption>
    </ImageFigure>
  )
}

function UpstreamInputFixture() {
  return (
    <div className="flex flex-col items-start gap-2">
      <UpstreamLabel htmlFor="source-parity-input">
        ラベル<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLabel>
      <UpstreamSupportText id="source-parity-input-support">
        サポートテキスト
      </UpstreamSupportText>
      <UpstreamInput
        aria-describedby="source-parity-input-support"
        className="w-80"
        defaultValue="入力テキスト"
        id="source-parity-input"
      />
    </div>
  )
}

function OursInputFixture() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="source-parity-input">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id="source-parity-input-support">
        サポートテキスト
      </SupportText>
      <Input
        aria-describedby="source-parity-input-support"
        className="w-80"
        defaultValue="入力テキスト"
        id="source-parity-input"
      />
    </div>
  )
}

function UpstreamLabelFixture() {
  return (
    <div className="grid gap-2">
      <UpstreamLabel size="lg">ラベル大</UpstreamLabel>
      <UpstreamLabel size="md">ラベル中</UpstreamLabel>
      <UpstreamLabel size="sm">ラベル小</UpstreamLabel>
    </div>
  )
}

function OursLabelFixture() {
  return (
    <div className="grid gap-2">
      <Label size="lg">ラベル大</Label>
      <Label size="md">ラベル中</Label>
      <Label size="sm">ラベル小</Label>
    </div>
  )
}

const languageItems = [
  { code: "ja", name: "日本語", url: "#" },
  { code: "en", name: "English", url: "#" },
  { code: "zh-cn", name: "简体中文", url: "#" },
  { code: "ko", name: "한국어", url: "#" },
]

function UpstreamLanguageSelectorFixture() {
  return (
    <div className="h-72">
      <UpstreamLanguageSelector>
        <UpstreamLanguageSelectorButton
          aria-controls="source-parity-language-menu"
          aria-expanded={true}
        >
          <UpstreamLanguageSelectorGlobeIcon />
          <span className="mb-0.5">Language</span>
          <UpstreamLanguageSelectorArrowIcon className="mt-0.5 group-[:has([aria-expanded='true'])]:rotate-180" />
        </UpstreamLanguageSelectorButton>
        <UpstreamLanguageSelectorMenu
          className="absolute top-full left-0 block overflow-auto"
          id="source-parity-language-menu"
        >
          {languageItems.map((lang) => (
            <UpstreamLanguageSelectorMenuItem
              href={lang.url}
              isCurrent={lang.code === "ja"}
              key={lang.code}
              lang={lang.code}
            >
              {lang.name}
            </UpstreamLanguageSelectorMenuItem>
          ))}
        </UpstreamLanguageSelectorMenu>
      </UpstreamLanguageSelector>
    </div>
  )
}

function OursLanguageSelectorFixture() {
  return (
    <div className="h-72">
      <LanguageSelector>
        <LanguageSelectorButton
          aria-controls="source-parity-language-menu"
          aria-expanded={true}
        >
          <LanguageSelectorGlobeIcon />
          <span className="mb-0.5">Language</span>
          <LanguageSelectorArrowIcon className="mt-0.5 group-[:has([aria-expanded='true'])]:rotate-180" />
        </LanguageSelectorButton>
        <LanguageSelectorMenu
          className="absolute top-full left-0 block overflow-auto"
          id="source-parity-language-menu"
        >
          {languageItems.map((lang) => (
            <LanguageSelectorMenuItem
              href={lang.url}
              isCurrent={lang.code === "ja"}
              key={lang.code}
              lang={lang.code}
            >
              {lang.name}
            </LanguageSelectorMenuItem>
          ))}
        </LanguageSelectorMenu>
      </LanguageSelector>
    </div>
  )
}

function UpstreamLegendFixture() {
  return (
    <fieldset>
      <UpstreamLegend size="lg">
        凡例<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLegend>
    </fieldset>
  )
}

function OursLegendFixture() {
  return (
    <fieldset>
      <Legend size="lg">
        凡例<RequirementBadge>※必須</RequirementBadge>
      </Legend>
    </fieldset>
  )
}

function UpstreamLinkFixture() {
  return (
    <div className="grid gap-3">
      <UpstreamLink href="#">標準リンク</UpstreamLink>
      <UpstreamLink href="#" target="_blank">
        新しいウィンドウで開く
      </UpstreamLink>
    </div>
  )
}

function OursLinkFixture() {
  return (
    <div className="grid gap-3">
      <Link href="#">標準リンク</Link>
      <Link href="#" target="_blank">
        新しいウィンドウで開く
      </Link>
    </div>
  )
}

function UpstreamListFixture() {
  return (
    <div className="max-w-2xl">
      <UpstreamList spacing="4">
        <li>短いテキスト</li>
        <li>
          ネストされたリスト
          <UpstreamList marker="number" spacing="4">
            <li>
              <span>1. </span>
              <span>番号付きリストの最初の項目</span>
            </li>
            <li>
              <span>2. </span>
              <span>番号付きリストの二番目の項目</span>
            </li>
          </UpstreamList>
        </li>
      </UpstreamList>
    </div>
  )
}

function OursListFixture() {
  return (
    <div className="max-w-2xl">
      <List spacing="4">
        <li>短いテキスト</li>
        <li>
          ネストされたリスト
          <List marker="number" spacing="4">
            <li>
              <span>1. </span>
              <span>番号付きリストの最初の項目</span>
            </li>
            <li>
              <span>2. </span>
              <span>番号付きリストの二番目の項目</span>
            </li>
          </List>
        </li>
      </List>
    </div>
  )
}

function UpstreamMenuListFixture() {
  return (
    <div className="w-72">
      <UpstreamMenuList indent={1}>
        <UpstreamMenuListItem>
          <UpstreamMenuListItemLink href="#" type="standard" size="regular">
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目1
          </UpstreamMenuListItemLink>
        </UpstreamMenuListItem>
        <UpstreamMenuListItem>
          <UpstreamMenuListItemLink
            href="#"
            type="standard"
            size="regular"
            current
          >
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目2
          </UpstreamMenuListItemLink>
        </UpstreamMenuListItem>
        <UpstreamMenuListItem>
          <UpstreamMenuListItemButton type="box" size="small">
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目3
          </UpstreamMenuListItemButton>
        </UpstreamMenuListItem>
      </UpstreamMenuList>
    </div>
  )
}

function OursMenuListFixture() {
  return (
    <div className="w-72">
      <MenuList indent={1}>
        <MenuListItem>
          <MenuListItemLink href="#" type="standard" size="regular">
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目1
          </MenuListItemLink>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemLink href="#" type="standard" size="regular" current>
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目2
          </MenuListItemLink>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemButton type="box" size="small">
            <MenuIcon className="shrink-0 size-6" />
            メニュー項目3
          </MenuListItemButton>
        </MenuListItem>
      </MenuList>
    </div>
  )
}

function UpstreamNotificationBannerFixture() {
  return (
    <div className="w-[56rem]">
      <UpstreamNotificationBanner
        bannerStyle="standard"
        headingLevel="h2"
        title="メンテナンスのお知らせ"
        type="warning"
      >
        <UpstreamNotificationBannerClose />
        <UpstreamNotificationBannerBody>
          <p>2026年7月31日 22:00からサービスを停止します。</p>
          <p>作業中は一部機能を利用できません。</p>
        </UpstreamNotificationBannerBody>
      </UpstreamNotificationBanner>
    </div>
  )
}

function OursNotificationBannerFixture() {
  return (
    <div className="w-[56rem]">
      <NotificationBanner
        bannerStyle="standard"
        headingLevel="h2"
        title="メンテナンスのお知らせ"
        type="warning"
      >
        <NotificationBannerClose />
        <NotificationBannerBody>
          <p>2026年7月31日 22:00からサービスを停止します。</p>
          <p>作業中は一部機能を利用できません。</p>
        </NotificationBannerBody>
      </NotificationBanner>
    </div>
  )
}

function UpstreamProgressIndicatorFixture() {
  return (
    <div className="grid w-[28rem] gap-8">
      <UpstreamProgressIndicator type="stacked" value={65}>
        <UpstreamProgressIndicatorSpinner />
        <span>読み込み中</span>
      </UpstreamProgressIndicator>
      <UpstreamProgressIndicator type="inlined" value={65}>
        <UpstreamProgressIndicatorLinear size="lg" />
        <span>65%</span>
      </UpstreamProgressIndicator>
      <UpstreamProgressIndicator type="stacked-underlay" value={65}>
        <UpstreamProgressIndicatorStatic size="sm" />
        <span>待機中</span>
      </UpstreamProgressIndicator>
    </div>
  )
}

function OursProgressIndicatorFixture() {
  return (
    <div className="grid w-[28rem] gap-8">
      <ProgressIndicator type="stacked" value={65}>
        <ProgressIndicatorSpinner />
        <span>読み込み中</span>
      </ProgressIndicator>
      <ProgressIndicator type="inlined" value={65}>
        <ProgressIndicatorLinear size="lg" />
        <span>65%</span>
      </ProgressIndicator>
      <ProgressIndicator type="stacked-underlay" value={65}>
        <ProgressIndicatorStatic size="sm" />
        <span>待機中</span>
      </ProgressIndicator>
    </div>
  )
}

function UpstreamRadioFixture() {
  return (
    <fieldset>
      <UpstreamLegend>
        ラベル<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLegend>
      <UpstreamSupportText className="mt-2">
        サポートテキスト
      </UpstreamSupportText>
      <div className="mt-2 flex flex-col gap-2">
        <UpstreamRadio name="source-parity-radio">選択肢1</UpstreamRadio>
        <UpstreamRadio name="source-parity-radio" defaultChecked>
          選択肢2
        </UpstreamRadio>
        <UpstreamRadio name="source-parity-radio" isError>
          選択肢3
        </UpstreamRadio>
      </div>
    </fieldset>
  )
}

function OursRadioFixture() {
  return (
    <fieldset>
      <Legend>
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Legend>
      <SupportText className="mt-2">サポートテキスト</SupportText>
      <RadioGroup className="mt-2 gap-2" defaultValue="2">
        {[
          ["1", "選択肢1", false],
          ["2", "選択肢2", false],
          ["3", "選択肢3", true],
        ].map(([value, label, error]) => (
          <div className="flex w-fit items-start gap-1 py-2" key={value}>
            <RadioGroupItem aria-label={label} isError={error} value={value} />
            <span className="pt-px text-dns-16N-130 text-solid-gray-800">
              {label}
            </span>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

function UpstreamRequirementBadgeFixture() {
  return (
    <div className="flex items-center gap-4">
      <span>
        氏名<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </span>
      <span>
        建物名
        <UpstreamRequirementBadge isOptional>任意</UpstreamRequirementBadge>
      </span>
    </div>
  )
}

function OursRequirementBadgeFixture() {
  return (
    <div className="flex items-center gap-4">
      <span>
        氏名<RequirementBadge>※必須</RequirementBadge>
      </span>
      <span>
        建物名
        <RequirementBadge isOptional>任意</RequirementBadge>
      </span>
    </div>
  )
}

function UpstreamSelectFixture() {
  return (
    <div className="w-80">
      <UpstreamSelect defaultValue="1" blockSize="lg" aria-label="選択肢">
        <option value="1">選択肢1</option>
        <option value="2">選択肢2</option>
        <option value="3">選択肢3</option>
      </UpstreamSelect>
    </div>
  )
}

function OursSelectFixture() {
  return (
    <div className="w-80">
      <Select defaultValue="1">
        <SelectTrigger aria-label="選択肢" blockSize="lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">選択肢1</SelectItem>
          <SelectItem value="2">選択肢2</SelectItem>
          <SelectItem value="3">選択肢3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function UpstreamSeparatedDatePickerFixture() {
  return (
    <UpstreamSeparatedDatePicker isError>
      {(props) => (
        <>
          <UpstreamSeparatedDatePickerYear defaultValue="2026" {...props} />
          <UpstreamSeparatedDatePickerMonth defaultValue="07" {...props} />
          <UpstreamSeparatedDatePickerDate defaultValue="13" {...props} />
          <UpstreamSeparatedDatePickerCalendarButton aria-expanded={true} />
        </>
      )}
    </UpstreamSeparatedDatePicker>
  )
}

function OursSeparatedDatePickerFixture() {
  return (
    <SeparatedDatePicker isError>
      {(props) => (
        <>
          <SeparatedDatePickerYear defaultValue="2026" {...props} />
          <SeparatedDatePickerMonth defaultValue="07" {...props} />
          <SeparatedDatePickerDate defaultValue="13" {...props} />
          <SeparatedDatePickerCalendarButton aria-expanded={true} />
        </>
      )}
    </SeparatedDatePicker>
  )
}

function UpstreamStatusBadgeFixture() {
  return <UpstreamStatusBadge>受付済み</UpstreamStatusBadge>
}

function OursStatusBadgeFixture() {
  return <StatusBadge>受付済み</StatusBadge>
}

function UpstreamSupportTextFixture() {
  return <UpstreamSupportText>サポートテキスト</UpstreamSupportText>
}

function OursSupportTextFixture() {
  return <SupportText>サポートテキスト</SupportText>
}

function UpstreamTextareaFixture() {
  return (
    <div className="flex flex-col items-start gap-2">
      <UpstreamLabel htmlFor="source-parity-textarea">
        ラベル<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLabel>
      <UpstreamTextarea
        className="h-36 w-[28rem]"
        defaultValue="入力テキスト"
        id="source-parity-textarea"
      />
    </div>
  )
}

function OursTextareaFixture() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="source-parity-textarea">
        ラベル<RequirementBadge>※必須</RequirementBadge>
      </Label>
      <Textarea
        className="h-36 w-[28rem]"
        defaultValue="入力テキスト"
        id="source-parity-textarea"
      />
    </div>
  )
}

function UpstreamUtilityLinkFixture() {
  return (
    <div className="grid gap-3">
      <UpstreamUtilityLink href="#">関連情報</UpstreamUtilityLink>
      <UpstreamUtilityLink href="#" target="_blank">
        外部サイト
      </UpstreamUtilityLink>
    </div>
  )
}

function OursUtilityLinkFixture() {
  return (
    <div className="grid gap-3">
      <UtilityLink href="#">関連情報</UtilityLink>
      <UtilityLink href="#" target="_blank">
        外部サイト
      </UtilityLink>
    </div>
  )
}

function UpstreamTabsStatic({ position }) {
  const tabList = (
    <UpstreamTabList>
      <UpstreamTabItem href="#" aria-current="page">
        タブラベル
      </UpstreamTabItem>
      <UpstreamTabItem href="#">タブラベル</UpstreamTabItem>
      <UpstreamTabItem href="#">タブラベル</UpstreamTabItem>
      <UpstreamTabItem href="#">タブラベル</UpstreamTabItem>
      <UpstreamTabItem href="#">タブラベル</UpstreamTabItem>
    </UpstreamTabList>
  )

  return (
    <UpstreamTab position={position}>
      {tabList}
      <UpstreamTabPanel>タブパネルの内容</UpstreamTabPanel>
    </UpstreamTab>
  )
}

function OursTabsStatic({ position }) {
  const tabList = (
    <TabList>
      <TabItem href="#" aria-current="page">
        タブラベル
      </TabItem>
      <TabItem href="#">タブラベル</TabItem>
      <TabItem href="#">タブラベル</TabItem>
      <TabItem href="#">タブラベル</TabItem>
      <TabItem href="#">タブラベル</TabItem>
    </TabList>
  )

  return (
    <Tab position={position}>
      {tabList}
      <TabPanel>タブパネルの内容</TabPanel>
    </Tab>
  )
}

const longParagraphs = Array.from({ length: 28 }, (_, index) => `p-${index}`)

function UpstreamDialogOpen({ fixedBoth = false }) {
  const [open, setOpen] = useState(true)
  const { dialogProps, headingProps, closeButtonProps } = useUpstreamDialog({
    open,
    onOpenChange: setOpen,
  })
  const body = fixedBoth ? (
    longParagraphs.map((id) => (
      <p key={id} className="my-4">
        コンテンツ
      </p>
    ))
  ) : (
    <>コンテンツ</>
  )

  return (
    <UpstreamDialog {...dialogProps} scroll={fixedBoth ? "inner" : undefined}>
      <UpstreamDialogContent>
        <UpstreamDialogHeader>
          <UpstreamDialogHeading {...headingProps}>
            タイトル
          </UpstreamDialogHeading>
          <UpstreamDialogClose {...closeButtonProps} />
        </UpstreamDialogHeader>
        {fixedBoth ? (
          <UpstreamDialogScrollArea>
            <UpstreamDialogBody>{body}</UpstreamDialogBody>
          </UpstreamDialogScrollArea>
        ) : (
          <UpstreamDialogBody>{body}</UpstreamDialogBody>
        )}
        <UpstreamDialogActions className="flex justify-end">
          <UpstreamButton size="lg" variant="solid-fill" {...closeButtonProps}>
            OK
          </UpstreamButton>
        </UpstreamDialogActions>
      </UpstreamDialogContent>
    </UpstreamDialog>
  )
}

function OursDialogOpen({ fixedBoth = false }) {
  const [open, setOpen] = useState(true)
  const { dialogProps, headingProps, closeButtonProps } = useDialog({
    open,
    onOpenChange: setOpen,
  })
  const body = fixedBoth ? (
    longParagraphs.map((id) => (
      <p key={id} className="my-4">
        コンテンツ
      </p>
    ))
  ) : (
    <>コンテンツ</>
  )

  return (
    <Dialog {...dialogProps} scroll={fixedBoth ? "inner" : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogHeading {...headingProps}>タイトル</DialogHeading>
          <DialogClose {...closeButtonProps} />
        </DialogHeader>
        {fixedBoth ? (
          <DialogScrollArea>
            <DialogBody>{body}</DialogBody>
          </DialogScrollArea>
        ) : (
          <DialogBody>{body}</DialogBody>
        )}
        <DialogActions className="flex justify-end">
          <Button size="lg" variant="solid-fill" {...closeButtonProps}>
            OK
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

function UpstreamMenuListBoxOpen() {
  const openerId = useId()
  const menuId = useId()

  return (
    <div className="h-80">
      <UpstreamMenuListBox>
        <UpstreamMenuListBoxOpener
          id={openerId}
          aria-controls={menuId}
          aria-expanded={true}
          size="sm"
          buttonStyle="text"
          fontWeight="normal"
        >
          <MenuIcon />
          メニュー
        </UpstreamMenuListBoxOpener>
        <UpstreamMenuListBoxPopup>
          <UpstreamMenuList id={menuId} role="menu" aria-labelledby={openerId}>
            {menuItems.map((label) => (
              <UpstreamMenuListItem key={label} role="presentation">
                <UpstreamMenuListItemButton
                  type="box"
                  size="regular"
                  role="menuitem"
                  tabIndex={-1}
                >
                  <MenuIcon className="shrink-0 w-6 h-6" />
                  <span>{label}</span>
                </UpstreamMenuListItemButton>
              </UpstreamMenuListItem>
            ))}
          </UpstreamMenuList>
        </UpstreamMenuListBoxPopup>
      </UpstreamMenuListBox>
    </div>
  )
}

function OursMenuListBoxOpen() {
  const openerId = useId()
  const menuId = useId()

  return (
    <div className="h-80">
      <MenuListBox>
        <MenuListBoxOpener
          id={openerId}
          aria-controls={menuId}
          aria-expanded={true}
          size="sm"
          buttonStyle="text"
          fontWeight="normal"
        >
          <MenuIcon />
          メニュー
        </MenuListBoxOpener>
        <MenuListBoxPopup>
          <MenuList id={menuId} role="menu" aria-labelledby={openerId}>
            {menuItems.map((label) => (
              <MenuListItem key={label} role="presentation">
                <MenuListItemButton
                  type="box"
                  size="regular"
                  role="menuitem"
                  tabIndex={-1}
                >
                  <MenuIcon className="shrink-0 w-6 h-6" />
                  <span>{label}</span>
                </MenuListItemButton>
              </MenuListItem>
            ))}
          </MenuList>
        </MenuListBoxPopup>
      </MenuListBox>
    </div>
  )
}

function UpstreamMenuListBoxInteractive() {
  const openerId = useId()
  const menuId = useId()
  const [status, setStatus] = useState("未選択")
  const { isOpen, rootProps, openerProps, popupProps } = useUpstreamMenuListBox(
    {
      onMenuItemSelect: ({ selectedValue }) => setStatus(selectedValue),
    }
  )

  return (
    <div className="h-80">
      <UpstreamMenuListBox {...rootProps}>
        <UpstreamMenuListBoxOpener
          {...openerProps}
          id={openerId}
          aria-controls={menuId}
          size="sm"
          buttonStyle="text"
          fontWeight="normal"
        >
          <MenuIcon />
          メニュー
        </UpstreamMenuListBoxOpener>
        {isOpen && (
          <UpstreamMenuListBoxPopup {...popupProps}>
            <UpstreamMenuList
              id={menuId}
              role="menu"
              aria-labelledby={openerId}
            >
              {menuItems.slice(0, 3).map((label) => (
                <UpstreamMenuListItem key={label} role="presentation">
                  <UpstreamMenuListItemButton
                    data-value={label}
                    type="box"
                    size="regular"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <MenuIcon className="shrink-0 size-6" />
                    <span>{label}</span>
                  </UpstreamMenuListItemButton>
                </UpstreamMenuListItem>
              ))}
            </UpstreamMenuList>
          </UpstreamMenuListBoxPopup>
        )}
      </UpstreamMenuListBox>
      <p className="mt-6 text-std-16N-170" data-testid="behavior-status">
        {status}
      </p>
    </div>
  )
}

function OursMenuListBoxInteractive() {
  const openerId = useId()
  const menuId = useId()
  const [status, setStatus] = useState("未選択")
  const { isOpen, rootProps, openerProps, popupProps } = useMenuListBox({
    onMenuItemSelect: ({ selectedValue }) => setStatus(selectedValue),
  })

  return (
    <div className="h-80">
      <MenuListBox {...rootProps}>
        <MenuListBoxOpener
          {...openerProps}
          id={openerId}
          aria-controls={menuId}
          size="sm"
          buttonStyle="text"
          fontWeight="normal"
        >
          <MenuIcon />
          メニュー
        </MenuListBoxOpener>
        {isOpen && (
          <MenuListBoxPopup {...popupProps}>
            <MenuList id={menuId} role="menu" aria-labelledby={openerId}>
              {menuItems.slice(0, 3).map((label) => (
                <MenuListItem key={label} role="presentation">
                  <MenuListItemButton
                    data-value={label}
                    type="box"
                    size="regular"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <MenuIcon className="shrink-0 size-6" />
                    <span>{label}</span>
                  </MenuListItemButton>
                </MenuListItem>
              ))}
            </MenuList>
          </MenuListBoxPopup>
        )}
      </MenuListBox>
      <p className="mt-6 text-std-16N-170" data-testid="behavior-status">
        {status}
      </p>
    </div>
  )
}

function UpstreamCarouselMulti() {
  return (
    <div className="w-[64rem]">
      <UpstreamCarousel
        aria-labelledby="source-parity-carousel-heading"
        slides={carouselSlides}
        currentIndex={0}
        unit="スライド"
        isNormal={true}
        onPrev={() => {}}
        onNext={() => {}}
        onStepSelect={() => {}}
      >
        <h2
          className="mb-4 text-std-20B-150 [@media(min-width:30rem)]:text-std-24B-150 [@media(min-width:64rem)]:text-std-32B-150"
          id="source-parity-carousel-heading"
        >
          開催中のイベント
        </h2>
      </UpstreamCarousel>
    </div>
  )
}

function OursCarouselMulti() {
  return (
    <div className="w-[64rem]">
      <Carousel
        aria-labelledby="source-parity-carousel-heading"
        slides={carouselSlides}
        currentIndex={0}
        unit="スライド"
        isNormal={true}
        onPrev={() => {}}
        onNext={() => {}}
        onStepSelect={() => {}}
      >
        <h2
          className="mb-4 text-std-20B-150 [@media(min-width:30rem)]:text-std-24B-150 [@media(min-width:64rem)]:text-std-32B-150"
          id="source-parity-carousel-heading"
        >
          開催中のイベント
        </h2>
      </Carousel>
    </div>
  )
}

function UpstreamCarouselInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="w-[64rem]">
      <UpstreamCarousel
        aria-labelledby="source-parity-carousel-interactive-heading"
        slides={carouselSlides}
        currentIndex={currentIndex}
        unit="スライド"
        isNormal={true}
        onPrev={() =>
          setCurrentIndex(
            (index) =>
              (index - 1 + carouselSlides.length) % carouselSlides.length
          )
        }
        onNext={() =>
          setCurrentIndex((index) => (index + 1) % carouselSlides.length)
        }
        onStepSelect={setCurrentIndex}
      >
        <h2
          className="mb-4 text-std-24B-150"
          id="source-parity-carousel-interactive-heading"
        >
          開催中のイベント
        </h2>
      </UpstreamCarousel>
      <p className="mt-4 text-std-16N-170" data-testid="behavior-status">
        {carouselSlides[currentIndex].label}
      </p>
    </div>
  )
}

function OursCarouselInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="w-[64rem]">
      <Carousel
        aria-labelledby="source-parity-carousel-interactive-heading"
        slides={carouselSlides}
        currentIndex={currentIndex}
        unit="スライド"
        isNormal={true}
        onPrev={() =>
          setCurrentIndex(
            (index) =>
              (index - 1 + carouselSlides.length) % carouselSlides.length
          )
        }
        onNext={() =>
          setCurrentIndex((index) => (index + 1) % carouselSlides.length)
        }
        onStepSelect={setCurrentIndex}
      >
        <h2
          className="mb-4 text-std-24B-150"
          id="source-parity-carousel-interactive-heading"
        >
          開催中のイベント
        </h2>
      </Carousel>
      <p className="mt-4 text-std-16N-170" data-testid="behavior-status">
        {carouselSlides[currentIndex].label}
      </p>
    </div>
  )
}

function UpstreamCarouselSingleStory() {
  return (
    <UpstreamCarouselSingle className="text-std-16N-170">
      <UpstreamCarouselSingleLink>
        <UpstreamCarouselSingleImage
          src={carouselImageUrl("image-9.webp")}
          srcSet={`${carouselImageUrl("image-9@2x.webp")} 2x`}
          alt="写真：デジタル公園の大木"
          width={1024}
          height={392}
        />
      </UpstreamCarouselSingleLink>
    </UpstreamCarouselSingle>
  )
}

function OursCarouselSingleStory() {
  return (
    <CarouselSingle className="text-std-16N-170">
      <CarouselSingleLink>
        <CarouselSingleImage
          src={carouselImageUrl("image-9.webp")}
          srcSet={`${carouselImageUrl("image-9@2x.webp")} 2x`}
          alt="写真：デジタル公園の大木"
          width={1024}
          height={392}
        />
      </CarouselSingleLink>
    </CarouselSingle>
  )
}

function UpstreamTableFirstRowAndColumn() {
  return (
    <table className="w-full text-std-16N-170">
      <colgroup>
        <col className="border-r border-black bg-solid-gray-100" />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr className="border-b border-black bg-solid-gray-100">
          <td className="border-b border-r border-solid-gray-500 px-4 py-5 align-top" />
          <th className="px-4 py-5 text-start align-top" scope="col">
            ラベル
          </th>
          <th className="px-4 py-5 text-start align-top" scope="col">
            ラベル
          </th>
          <th className="px-4 py-5 text-start align-top" scope="col">
            ラベル
          </th>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2].map((row) => (
          <tr className="border-b border-solid-gray-420" key={row}>
            <th
              className="border-b border-solid-gray-500 px-4 py-5 text-start align-top"
              scope="row"
            >
              ラベル
            </th>
            <td className="px-4 py-5 align-top">データ</td>
            <td className="px-4 py-5 align-top">データ</td>
            <td className="px-4 py-5 align-top">データ</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function OursTableFirstRowAndColumn() {
  return (
    <Table>
      <colgroup>
        <col className="border-r border-black bg-solid-gray-100" />
        <col />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableRow className="border-b border-black bg-solid-gray-100">
          <TableCell className="border-b border-r border-solid-gray-500" />
          <TableHead>ラベル</TableHead>
          <TableHead>ラベル</TableHead>
          <TableHead>ラベル</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[0, 1, 2].map((row) => (
          <TableRow key={row}>
            <TableHead className="border-b border-solid-gray-500" scope="row">
              ラベル
            </TableHead>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function UpstreamRightDrawerOpen() {
  const drawerId = useId()
  const drawerRef = useRef(null)

  useEffect(() => {
    drawerRef.current?.showModal()
  }, [])

  return (
    <dialog
      aria-labelledby={`${drawerId}-heading`}
      className="m-[unset] max-w-full max-h-[unset] w-72 h-dvh start-auto bg-white shadow-2 border-l border-l-transparent [scrollbar-gutter:stable] backdrop:bg-opacity-gray-100 forced-colors:backdrop:bg-[#000b]"
      ref={drawerRef}
    >
      <h2 id={`${drawerId}-heading`} className="sr-only">
        サンプルメニュー
      </h2>
      <div className="flex justify-end p-4">
        <UpstreamHamburgerMenuButton className="p-1">
          <UpstreamCloseIcon className="flex-none" />
          閉じる
        </UpstreamHamburgerMenuButton>
      </div>
      <ul className="px-6 py-4">
        {drawerMenu.map((item) => (
          <li key={item.id}>
            <a className={rawDrawerMenuLinkClass} href={item.url}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </dialog>
  )
}

function OursRightDrawerOpen() {
  const drawerId = useId()
  const drawerRef = useRef(null)

  useEffect(() => {
    drawerRef.current?.showModal()
  }, [])

  return (
    <Drawer
      aria-labelledby={`${drawerId}-heading`}
      ref={drawerRef}
      side="right"
    >
      <DrawerTitle id={`${drawerId}-heading`}>サンプルメニュー</DrawerTitle>
      <DrawerHeader>
        <DrawerClose />
      </DrawerHeader>
      <DrawerBody>
        {drawerMenu.map((item) => (
          <li key={item.id}>
            <DrawerMenuLink href={item.url}>{item.name}</DrawerMenuLink>
          </li>
        ))}
      </DrawerBody>
    </Drawer>
  )
}

function UpstreamCalendarGrid() {
  const [date, setDate] = useState(parseDate("2025-02-18"))
  const [focusedDate, setFocusedDate] = useState(parseDate("2025-02-18"))

  return (
    <AriaCalendar
      className="flex flex-col items-center w-max"
      value={date}
      onChange={setDate}
      focusedValue={focusedDate}
      onFocusChange={setFocusedDate}
    >
      <AriaCalendarGrid className="mx-3 mb-2">
        <AriaCalendarGridHeader className="[&_th]:p-0">
          {(day) => (
            <AriaCalendarHeaderCell className="size-12 text-center font-bold">
              {day}
            </AriaCalendarHeaderCell>
          )}
        </AriaCalendarGridHeader>
        <AriaCalendarGridBody className="[&_td]:p-0">
          {(calendarDate) => (
            <AriaCalendarCell
              className="m-1 flex items-center justify-center size-10 rounded-full underline-offset-[calc(3/16*1rem)] aria-disabled:hidden hover:bg-solid-gray-50 hover:underline focus:outline-0 data-[focus-visible]:bg-yellow-300 data-[focus-visible]:outline data-[focus-visible]:outline-4 data-[focus-visible]:outline-black data-[focus-visible]:outline-offset-[calc(2/16*1rem)] data-[focus-visible]:ring-[calc(2/16*1rem)] data-[focus-visible]:ring-yellow-300 data-[selected]:!bg-key-900 data-[selected]:border data-[selected]:border-transparent data-[selected]:text-white"
              date={calendarDate}
            />
          )}
        </AriaCalendarGridBody>
      </AriaCalendarGrid>
    </AriaCalendar>
  )
}

function OursCalendarGrid() {
  const [date, setDate] = useState(parseDate("2025-02-18"))
  const [focusedDate, setFocusedDate] = useState(parseDate("2025-02-18"))

  return (
    <Calendar
      value={date}
      onChange={setDate}
      focusedValue={focusedDate}
      onFocusChange={setFocusedDate}
    >
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(calendarDate) => <CalendarCell date={calendarDate} />}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}

function UpstreamDatePickerErrored() {
  return (
    <fieldset className="flex flex-col gap-2 items-start">
      <UpstreamLegend>
        日付<UpstreamRequirementBadge>※必須</UpstreamRequirementBadge>
      </UpstreamLegend>
      <UpstreamSupportText id="source-parity-date-picker-support">
        例：2025年01月20日
      </UpstreamSupportText>
      <UpstreamDatePicker isError>
        {({ yearRef, monthRef, dateRef, ...rest }) => (
          <>
            <UpstreamDatePickerYear
              ref={yearRef}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
            <UpstreamDatePickerMonth
              ref={monthRef}
              defaultValue={10}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
            <UpstreamDatePickerDate
              ref={dateRef}
              defaultValue={28}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
          </>
        )}
      </UpstreamDatePicker>
      <UpstreamErrorText id="source-parity-date-picker-error">
        ＊正しい日付を入力してください。
      </UpstreamErrorText>
    </fieldset>
  )
}

function OursDatePickerErrored() {
  return (
    <fieldset className="flex flex-col gap-2 items-start">
      <Legend>
        日付<RequirementBadge>※必須</RequirementBadge>
      </Legend>
      <SupportText id="source-parity-date-picker-support">
        例：2025年01月20日
      </SupportText>
      <DatePicker isError>
        {({ yearRef, monthRef, dateRef, ...rest }) => (
          <>
            <DatePickerYear
              ref={yearRef}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
            <DatePickerMonth
              ref={monthRef}
              defaultValue={10}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
            <DatePickerDate
              ref={dateRef}
              defaultValue={28}
              aria-describedby="source-parity-date-picker-support source-parity-date-picker-error"
              {...rest}
            />
          </>
        )}
      </DatePicker>
      <ErrorText id="source-parity-date-picker-error">
        ＊正しい日付を入力してください。
      </ErrorText>
    </fieldset>
  )
}

export const sourceParityStories = {
  "source-parity-accordion": {
    title: "Source parity/Accordion",
    upstream: <UpstreamAccordionFixture />,
    ours: <OursAccordionFixture />,
  },
  "source-parity-blockquote": {
    title: "Source parity/Blockquote",
    upstream: <UpstreamBlockquoteFixture />,
    ours: <OursBlockquoteFixture />,
  },
  "source-parity-breadcrumbs": {
    title: "Source parity/Breadcrumbs",
    upstream: <UpstreamBreadcrumbsFixture />,
    ours: <OursBreadcrumbsFixture />,
  },
  "source-parity-button": {
    title: "Source parity/Button",
    upstream: <UpstreamButtonFixture />,
    ours: <OursButtonFixture />,
  },
  "source-parity-checkbox": {
    title: "Source parity/Checkbox",
    upstream: <UpstreamCheckboxFixture />,
    ours: <OursCheckboxFixture />,
  },
  "source-parity-chip-label": {
    title: "Source parity/ChipLabel",
    upstream: <UpstreamChipLabelFixture />,
    ours: <OursChipLabelFixture />,
  },
  "source-parity-disclosure": {
    title: "Source parity/Disclosure",
    upstream: <UpstreamDisclosureFixture />,
    ours: <OursDisclosureFixture />,
  },
  "source-parity-divider": {
    title: "Source parity/Divider",
    upstream: <UpstreamDividerFixture />,
    ours: <OursDividerFixture />,
  },
  "source-parity-dl": {
    title: "Source parity/Description list",
    upstream: <UpstreamDlFixture />,
    ours: <OursDlFixture />,
  },
  "source-parity-emergency-banner": {
    title: "Source parity/EmergencyBanner",
    upstream: <UpstreamEmergencyBannerFixture />,
    ours: <OursEmergencyBannerFixture />,
  },
  "source-parity-error-text": {
    title: "Source parity/ErrorText",
    upstream: <UpstreamErrorTextFixture />,
    ours: <OursErrorTextFixture />,
  },
  "source-parity-file-upload": {
    title: "Source parity/FileUpload",
    upstream: <UpstreamFileUploadFixture />,
    ours: <OursFileUploadFixture />,
  },
  "source-parity-hamburger-menu-button": {
    title: "Source parity/HamburgerMenuButton",
    upstream: <UpstreamHamburgerMenuButtonFixture />,
    ours: <OursHamburgerMenuButtonFixture />,
  },
  "source-parity-heading": {
    title: "Source parity/Heading",
    upstream: <UpstreamHeadingFixture />,
    ours: <OursHeadingFixture />,
  },
  "source-parity-horizontal-menu": {
    title: "Source parity/HorizontalMenu",
    upstream: <UpstreamHorizontalMenuFixture />,
    ours: <OursHorizontalMenuFixture />,
  },
  "source-parity-image": {
    title: "Source parity/Image",
    upstream: <UpstreamImageFixture />,
    ours: <OursImageFixture />,
  },
  "source-parity-input": {
    title: "Source parity/Input",
    upstream: <UpstreamInputFixture />,
    ours: <OursInputFixture />,
  },
  "source-parity-label": {
    title: "Source parity/Label",
    upstream: <UpstreamLabelFixture />,
    ours: <OursLabelFixture />,
  },
  "source-parity-language-selector": {
    title: "Source parity/LanguageSelector",
    upstream: <UpstreamLanguageSelectorFixture />,
    ours: <OursLanguageSelectorFixture />,
  },
  "source-parity-legend": {
    title: "Source parity/Legend",
    upstream: <UpstreamLegendFixture />,
    ours: <OursLegendFixture />,
  },
  "source-parity-link": {
    title: "Source parity/Link",
    upstream: <UpstreamLinkFixture />,
    ours: <OursLinkFixture />,
  },
  "source-parity-list": {
    title: "Source parity/List",
    upstream: <UpstreamListFixture />,
    ours: <OursListFixture />,
  },
  "source-parity-menu-list": {
    title: "Source parity/MenuList",
    upstream: <UpstreamMenuListFixture />,
    ours: <OursMenuListFixture />,
  },
  "source-parity-notification-banner": {
    title: "Source parity/NotificationBanner",
    upstream: <UpstreamNotificationBannerFixture />,
    ours: <OursNotificationBannerFixture />,
  },
  "source-parity-progress-indicator": {
    title: "Source parity/ProgressIndicator",
    upstream: <UpstreamProgressIndicatorFixture />,
    ours: <OursProgressIndicatorFixture />,
  },
  "source-parity-radio": {
    title: "Source parity/Radio",
    upstream: <UpstreamRadioFixture />,
    ours: <OursRadioFixture />,
  },
  "source-parity-requirement-badge": {
    title: "Source parity/RequirementBadge",
    upstream: <UpstreamRequirementBadgeFixture />,
    ours: <OursRequirementBadgeFixture />,
  },
  "source-parity-select": {
    title: "Source parity/Select",
    upstream: <UpstreamSelectFixture />,
    ours: <OursSelectFixture />,
  },
  "source-parity-separated-date-picker": {
    title: "Source parity/SeparatedDatePicker",
    upstream: <UpstreamSeparatedDatePickerFixture />,
    ours: <OursSeparatedDatePickerFixture />,
  },
  "source-parity-status-badge": {
    title: "Source parity/StatusBadge",
    upstream: <UpstreamStatusBadgeFixture />,
    ours: <OursStatusBadgeFixture />,
  },
  "source-parity-support-text": {
    title: "Source parity/SupportText",
    upstream: <UpstreamSupportTextFixture />,
    ours: <OursSupportTextFixture />,
  },
  "source-parity-tabs-static-top": {
    title: "Source parity/Tabs static top",
    upstream: <UpstreamTabsStatic position="top" />,
    ours: <OursTabsStatic position="top" />,
  },
  "source-parity-tabs-static-left": {
    title: "Source parity/Tabs static left",
    upstream: <UpstreamTabsStatic position="left" />,
    ours: <OursTabsStatic position="left" />,
  },
  "source-parity-dialog-basic-open": {
    title: "Source parity/Dialog basic open",
    upstream: <UpstreamDialogOpen />,
    ours: <OursDialogOpen />,
  },
  "source-parity-dialog-inner-fixed-both": {
    title: "Source parity/Dialog inner fixed both",
    upstream: <UpstreamDialogOpen fixedBoth />,
    ours: <OursDialogOpen fixedBoth />,
  },
  "source-parity-menu-list-box-open": {
    title: "Source parity/MenuListBox open",
    upstream: <UpstreamMenuListBoxOpen />,
    ours: <OursMenuListBoxOpen />,
  },
  "source-parity-menu-list-box-interactive": {
    title: "Source parity/MenuListBox interactive",
    upstream: <UpstreamMenuListBoxInteractive />,
    ours: <OursMenuListBoxInteractive />,
  },
  "source-parity-carousel-multi": {
    title: "Source parity/Carousel multi",
    upstream: <UpstreamCarouselMulti />,
    ours: <OursCarouselMulti />,
  },
  "source-parity-carousel-interactive": {
    title: "Source parity/Carousel interactive",
    upstream: <UpstreamCarouselInteractive />,
    ours: <OursCarouselInteractive />,
  },
  "source-parity-carousel-single": {
    title: "Source parity/Carousel single",
    upstream: <UpstreamCarouselSingleStory />,
    ours: <OursCarouselSingleStory />,
  },
  "source-parity-table-row-column": {
    title: "Source parity/Table row and column",
    upstream: <UpstreamTableFirstRowAndColumn />,
    ours: <OursTableFirstRowAndColumn />,
  },
  "source-parity-drawer-right-open": {
    title: "Source parity/Drawer right open",
    upstream: <UpstreamRightDrawerOpen />,
    ours: <OursRightDrawerOpen />,
  },
  "source-parity-calendar-grid": {
    title: "Source parity/Calendar grid",
    upstream: <UpstreamCalendarGrid />,
    ours: <OursCalendarGrid />,
  },
  "source-parity-date-picker-errored": {
    title: "Source parity/DatePicker errored",
    upstream: <UpstreamDatePickerErrored />,
    ours: <OursDatePickerErrored />,
  },
  "source-parity-textarea": {
    title: "Source parity/Textarea",
    upstream: <UpstreamTextareaFixture />,
    ours: <OursTextareaFixture />,
  },
  "source-parity-utility-link": {
    title: "Source parity/UtilityLink",
    upstream: <UpstreamUtilityLinkFixture />,
    ours: <OursUtilityLinkFixture />,
  },
}
