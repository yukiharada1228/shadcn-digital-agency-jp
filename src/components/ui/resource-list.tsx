// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
//
// upstream はネイティブ input を前提に `:has(:checked)` と `<label for>` で
// 選択状態・クリック範囲を作る。このプロジェクトの checkbox / radio-group は Radix の
// `<button>` なので、選択状態は Radix の `data-state=checked` を、クリック範囲は
// コントロール自身の ::before オーバーレイを使う。詳細は docs/compatibility.md を参照。
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/digital-agency/cn"

export type ResourceListVariant = "list" | "frame"
export type ResourceListInteraction = "whole"

// --- Root ---

export type ResourceListProps = React.ComponentProps<"div"> & {
  variant: ResourceListVariant
  interaction?: ResourceListInteraction
}

const ResourceList = React.forwardRef<HTMLDivElement, ResourceListProps>(
  ({ className, interaction, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="resource-list"
      className={cn(
        `
          group/resource-list
          flex items-center bg-white text-solid-gray-800 [overflow-wrap:anywhere]
          [--border-color:var(--color-solid-gray-420)]
          data-[style=list]:border data-[style=list]:border-transparent data-[style=list]:border-b-[color:var(--border-color)]
          data-[style=frame]:rounded-16 data-[style=frame]:border data-[style=frame]:border-[color:var(--border-color)]
          has-[[data-state=checked]:enabled]:bg-key-50 has-[[data-state=checked]:enabled]:[--border-color:var(--color-solid-gray-500)]
          has-[:disabled]:[--border-color:var(--color-solid-gray-300)]
          has-[[aria-disabled=true]]:[--border-color:var(--color-solid-gray-300)]
          data-[interaction=whole]:has-[:disabled]:bg-solid-gray-50 data-[interaction=whole]:has-[:disabled]:text-solid-gray-420
          data-[interaction=whole]:has-[[aria-disabled=true]]:bg-solid-gray-50 data-[interaction=whole]:has-[[aria-disabled=true]]:text-solid-gray-420
        `,
        className
      )}
      data-style={variant}
      data-interaction={interaction}
      {...props}
    />
  )
)
ResourceList.displayName = "ResourceList"

// --- Body ---

export type ResourceListBodyProps = React.ComponentProps<"div"> & {
  asChild?: boolean
}

const bodyClass = `
  relative z-0 flex grow items-center gap-4 rounded-[inherit] outline-offset-[calc(-1/16*1rem)] p-4
  [&:not(:last-child)]:rounded-r-none
  [&:any-link:hover]:outline [&:any-link:hover]:outline-2 [&:any-link:hover]:outline-black [&:any-link:hover]:bg-solid-gray-50
  [&:any-link:focus-visible]:outline [&:any-link:focus-visible]:outline-4 [&:any-link:focus-visible]:outline-black [&:any-link:focus-visible]:outline-offset-[calc(2/16*1rem)] [&:any-link:focus-visible]:ring-[calc(2/16*1rem)] [&:any-link:focus-visible]:ring-yellow-300
  group-data-[interaction=whole]/resource-list:has-[:enabled]:hover:outline group-data-[interaction=whole]/resource-list:has-[:enabled]:hover:outline-2 group-data-[interaction=whole]/resource-list:has-[:enabled]:hover:outline-black group-data-[interaction=whole]/resource-list:has-[:enabled]:hover:bg-solid-gray-50
`

const ResourceListBody = React.forwardRef<
  HTMLDivElement,
  ResourceListBodyProps
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-slot="resource-list-body"
      className={cn(bodyClass, className)}
      {...props}
    />
  )
})
ResourceListBody.displayName = "ResourceListBody"

// --- Control ---

// upstream は `<label>` でコントロールを包み、クリック範囲を padding 分広げる。
// Radix の `<button>` は `<label>` で活性化できないため、コントロール自身の
// ::before を敷いてクリック範囲を作る。`interaction="whole"` のときは
// `static` に切り替えて、オーバーレイの基準を body（行全体）にする。
// クラス名は静的な文字列で書くこと。Tailwind はソースを文字列として走査するため、
// 実行時に組み立てた名前は CSS が生成されない。
const controlOverlayClass = `
  [&>[data-slot=checkbox]]:before:content-[''] [&>[data-slot=checkbox]]:before:absolute [&>[data-slot=checkbox]]:before:inset-0 [&>[data-slot=checkbox]]:before:z-10 [&>[data-slot=checkbox]]:before:rounded-[inherit]
  [&>[data-slot=radio-group-item]]:before:content-[''] [&>[data-slot=radio-group-item]]:before:absolute [&>[data-slot=radio-group-item]]:before:inset-0 [&>[data-slot=radio-group-item]]:before:z-10 [&>[data-slot=radio-group-item]]:before:rounded-[inherit]
`

const ResourceListControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-control"
    className={cn(
      "relative shrink-0 self-stretch -my-4 -ml-4 py-4 pl-4 flex items-center",
      "group-data-[interaction=whole]/resource-list:static",
      controlOverlayClass,
      className
    )}
    {...props}
  />
))
ResourceListControl.displayName = "ResourceListControl"

// --- Contents ---

const ResourceListContents = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-contents"
    className={cn(
      "w-0 grow shrink flex flex-col gap-1 text-dns-16N-130 [&>*]:max-w-full",
      className
    )}
    {...props}
  />
))
ResourceListContents.displayName = "ResourceListContents"

// --- Title ---

export type ResourceListTitleAs = "h2" | "h3" | "h4" | "h5" | "h6" | "p"

export type ResourceListTitleProps = React.ComponentProps<"h2"> & {
  as: ResourceListTitleAs
}

const ResourceListTitle = React.forwardRef<
  HTMLHeadingElement,
  ResourceListTitleProps
>(({ as: As, className, ...props }, ref) => {
  const Tag = As as React.ElementType

  return (
    <Tag
      ref={ref}
      data-slot="resource-list-title"
      className={cn(
        `
          text-solid-gray-900 text-std-20B-150
          [a_&]:text-blue-1000 [a_&]:underline [a_&]:underline-offset-[calc(3/16*1rem)] [a_&]:decoration-1
          [&_a]:text-blue-1000 [&_a]:underline [&_a]:underline-offset-[calc(3/16*1rem)] [&_a]:decoration-1
          [&_a]:-my-2 [&_a]:block [&_a]:py-2 [&_a]:isolate
          [a:hover_&]:text-blue-900 [a:hover_&]:decoration-[calc(3/16*1rem)]
          [&_a:hover]:text-blue-900 [&_a:hover]:decoration-[calc(3/16*1rem)]
          [a:active_&]:text-orange-800 [a:active_&]:decoration-1
          [&_a:active]:text-orange-800 [&_a:active]:decoration-1
          [&_a:focus-visible]:my-0 [&_a:focus-visible]:py-0 [&_a:focus-visible]:outline [&_a:focus-visible]:outline-4 [&_a:focus-visible]:outline-black [&_a:focus-visible]:outline-offset-[calc(2/16*1rem)] [&_a:focus-visible]:rounded-4 [&_a:focus-visible]:bg-yellow-300 [&_a:focus-visible]:ring-[calc(2/16*1rem)] [&_a:focus-visible]:ring-yellow-300
          [[data-interaction=whole]:has(:disabled)_&]:text-inherit
          [[data-interaction=whole]:has([aria-disabled=true])_&]:text-inherit
        `,
        className
      )}
      {...props}
    />
  )
})
ResourceListTitle.displayName = "ResourceListTitle"

// --- Label ---

const ResourceListLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-label"
    className={cn("order-first", className)}
    {...props}
  />
))
ResourceListLabel.displayName = "ResourceListLabel"

// --- Support ---

const ResourceListSupport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-support"
    className={cn(className)}
    {...props}
  />
))
ResourceListSupport.displayName = "ResourceListSupport"

// --- Sub ---

const ResourceListSub = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-sub"
    className={cn("shrink-0 text-dns-16N-130", className)}
    {...props}
  />
))
ResourceListSub.displayName = "ResourceListSub"

// --- Action ---

const ResourceListAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="resource-list-action"
    className={cn("shrink-0 self-stretch rounded-r-[inherit]", className)}
    {...props}
  />
))
ResourceListAction.displayName = "ResourceListAction"

// --- Action button ---

export type ResourceListActionButtonProps = Omit<
  React.ComponentProps<"button">,
  "type"
>

const ResourceListActionButton = React.forwardRef<
  HTMLButtonElement,
  ResourceListActionButtonProps
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="resource-list-action-button"
    className={cn(
      `
        w-11 h-full flex justify-center items-center rounded-[inherit]
        enabled:hover:outline enabled:hover:outline-2 enabled:hover:outline-black enabled:hover:outline-offset-[calc(-1/16*1rem)] enabled:hover:bg-solid-gray-50
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(-3/16*1rem)] focus-visible:bg-yellow-300 focus-visible:shadow-none
      `,
      className
    )}
    {...props}
  />
))
ResourceListActionButton.displayName = "ResourceListActionButton"

export {
  ResourceList,
  ResourceListBody,
  ResourceListControl,
  ResourceListContents,
  ResourceListTitle,
  ResourceListLabel,
  ResourceListSupport,
  ResourceListSub,
  ResourceListAction,
  ResourceListActionButton,
}
