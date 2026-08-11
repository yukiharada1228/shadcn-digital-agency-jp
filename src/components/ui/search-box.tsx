// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
//
// `styles/digital-agency-search-box.css` は任意インポートです。`appearance: base-select`
// 対応ブラウザでドロップダウンの外観を DADS に合わせるためのもので、Tailwind の
// ユーティリティでは表現できないセレクタ（`::picker(select)` / `option::checkmark` 等）
// のみを含みます。読み込まなくても動作します（プログレッシブエンハンスメント）。
import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/digital-agency/cn"

export type SearchBoxSize = "lg" | "md" | "sm"

// --- Root ---

export type SearchBoxProps = React.ComponentProps<"div"> & {
  size?: SearchBoxSize
}

const SearchBox = React.forwardRef<HTMLDivElement, SearchBoxProps>(
  ({ className, size = "lg", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="search-box"
      className={cn(
        `
          group/search-box
          grid [grid-template-areas:'fields_submit'_'detail_detail'] grid-cols-[1fr_auto] gap-x-4
          text-solid-gray-900 text-oln-16N-100 font-sans
        `,
        className
      )}
      data-size={size}
      {...props}
    />
  )
)
SearchBox.displayName = "SearchBox"

// --- Fields ---

const SearchBoxFields = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="search-box-fields"
    className={cn("relative z-0 flex [grid-area:fields]", className)}
    {...props}
  />
))
SearchBoxFields.displayName = "SearchBoxFields"

// --- Select ---

export type SearchBoxSelectProps = React.ComponentProps<"select"> & {
  label: string
}

const SearchBoxSelect = React.forwardRef<
  HTMLSelectElement,
  SearchBoxSelectProps
>(({ children, className, label, ...props }, ref) => (
  // `dads-search-box__select` は任意インポートの CSS 側のフック。
  <label
    data-slot="search-box-select"
    className="dads-search-box__select relative flex shrink-0"
  >
    <span
      className={`
        absolute top-[calc(50%-1.25rem)] left-[calc(17/16*1rem)] z-[2] text-solid-gray-700 pointer-events-none
        group-data-[size=sm]/search-box:sr-only
        group-data-[size=md]/search-box:top-[calc(50%-1.125rem)]
      `}
    >
      {label}
    </span>
    <select
      ref={ref}
      className={cn(
        `
          appearance-none flex items-center overflow-hidden
          w-40 rounded-l-8 rounded-r-none
          border border-solid-gray-600
          bg-solid-gray-50
          pt-5 pr-10 pb-0 pl-4
          text-solid-gray-900 text-oln-17N-100 font-sans
          whitespace-nowrap text-ellipsis
          hover:border-black
          focus-visible:relative focus-visible:z-[1]
          focus-visible:outline focus-visible:outline-4 focus-visible:outline-black
          focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300
          group-data-[size=md]/search-box:pt-[calc(18/16*1rem)]
          group-data-[size=sm]/search-box:pt-0
        `,
        className
      )}
      {...props}
    >
      {children}
    </select>
    <svg
      aria-hidden={true}
      className="pointer-events-none absolute right-4 top-0 bottom-0 my-auto z-[1] w-4 h-4"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z" fill="currentColor" />
    </svg>
  </label>
))
SearchBoxSelect.displayName = "SearchBoxSelect"

// --- Input ---

// upstream と同じく、`label` と `aria-labelledby` はどちらか一方が必須。
export type SearchBoxInputProps = Omit<
  React.ComponentProps<"input">,
  "aria-labelledby"
> &
  (
    | { label: string; "aria-labelledby"?: never }
    | { label?: never; "aria-labelledby": string }
  )

const SearchBoxInput = React.forwardRef<HTMLInputElement, SearchBoxInputProps>(
  ({ className, label, ...props }, ref) => (
    <label data-slot="search-box-input" className="relative flex grow">
      <svg
        aria-hidden={true}
        className="pointer-events-none absolute left-4 top-0 bottom-0 my-auto z-[1] w-6 h-6 text-solid-gray-600 forced-colors:text-[CanvasText]"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="m21 20.5-6-6a7.4 7.4 0 0 0 1.9-5A7.4 7.4 0 0 0 9.5 2 7.5 7.5 0 1 0 14 15.5l6 6 1-1ZM3.5 9.5a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6Z"
          fill="currentColor"
        />
      </svg>
      {label !== undefined && <span className="sr-only">{label}</span>}
      <input
        ref={ref}
        className={cn(
          `
            grow w-32
            border border-solid-gray-600 rounded-8 bg-white
            pt-3 pr-4 pb-3 pl-12
            placeholder:text-solid-gray-600
            hover:border-black
            focus-visible:relative
            focus-visible:outline focus-visible:outline-4 focus-visible:outline-black
            focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300
            group-data-[size=md]/search-box:pt-[calc(11/16*1rem)] group-data-[size=md]/search-box:pb-[calc(11/16*1rem)]
            group-data-[size=sm]/search-box:pt-[calc(7/16*1rem)] group-data-[size=sm]/search-box:pb-[calc(7/16*1rem)]
            [label:not(:first-child)_&]:-ml-px [label:not(:first-child)_&]:rounded-tl-none [label:not(:first-child)_&]:rounded-bl-none
            [&::-webkit-search-cancel-button]:hidden
          `,
          className
        )}
        {...props}
      />
    </label>
  )
)
SearchBoxInput.displayName = "SearchBoxInput"

// --- Detail ---

export type SearchBoxDetailProps = React.ComponentProps<"details"> & {
  summary: string
}

const SearchBoxDetail = React.forwardRef<
  HTMLDetailsElement,
  SearchBoxDetailProps
>(({ children, className, summary, ...props }, ref) => (
  <details
    ref={ref}
    data-slot="search-box-detail"
    className={cn(
      `
        group/disclosure
        mt-4 [grid-area:detail] w-fit border border-solid-gray-600 rounded-8 py-3 px-4
        text-solid-gray-800 text-std-16N-170 font-sans
        open:w-auto open:pb-6
      `,
      className
    )}
    {...props}
  >
    <summary
      className={`
        group/summary
        flex items-start justify-start gap-2 w-fit cursor-default list-none
        -mx-4 -my-3 px-4 py-3
        [&::-webkit-details-marker]:hidden [&::marker]:content-['']
        hover:underline hover:underline-offset-[calc(3/16*1rem)]
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-black
        focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:rounded-4
        focus-visible:bg-yellow-300 focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300
      `}
    >
      <svg
        aria-hidden={true}
        className="shrink-0 mt-[calc((1lh-24px)/2)] text-key-1000 forced-colors:text-inherit group-open/disclosure:rotate-180"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <circle
          className="group-hover/summary:fill-[Canvas]"
          cx="12"
          cy="12"
          r="8"
          fill="currentColor"
        />
        <path
          className="group-hover/summary:fill-current"
          d="M17 10H7L12 15L17 10Z"
          fill="Canvas"
        />
      </svg>
      {summary}
    </summary>
    <div className="mt-8">{children}</div>
  </details>
))
SearchBoxDetail.displayName = "SearchBoxDetail"

// --- Detail actions ---

const SearchBoxDetailActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="search-box-detail-actions"
    className={cn("flex flex-col items-center gap-4", className)}
    {...props}
  />
))
SearchBoxDetailActions.displayName = "SearchBoxDetailActions"

// --- Submit ---

export type SearchBoxSubmitProps = ButtonProps

const SearchBoxSubmit = React.forwardRef<
  HTMLButtonElement,
  SearchBoxSubmitProps
>(({ className, variant, ...props }, ref) => (
  <Button
    ref={ref}
    data-slot="search-box-submit"
    className={cn(
      `
        [grid-area:submit] cursor-pointer
        group-has-[details[open]]/search-box:invisible
      `,
      className
    )}
    variant={variant ?? "solid-fill"}
    {...props}
  />
))
SearchBoxSubmit.displayName = "SearchBoxSubmit"

export {
  SearchBox,
  SearchBoxFields,
  SearchBoxSelect,
  SearchBoxInput,
  SearchBoxDetail,
  SearchBoxDetailActions,
  SearchBoxSubmit,
}
