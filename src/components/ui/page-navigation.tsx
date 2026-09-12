// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/digital-agency/cn"
import { Button, type ButtonProps } from "@/components/ui/button"

// PageNavigation

export type PageNavigationProps = React.ComponentPropsWithoutRef<"nav">

const PageNavigation = React.forwardRef<HTMLElement, PageNavigationProps>(
  ({ className, ...rest }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center gap-4 text-solid-gray-800 text-oln-16N-100",
        className
      )}
      data-slot="page-navigation"
      {...rest}
    />
  )
)
PageNavigation.displayName = "PageNavigation"

// PageNavigationCounter

export type PageNavigationCounterProps = React.ComponentPropsWithoutRef<"span">

const PageNavigationCounter = React.forwardRef<
  HTMLSpanElement,
  PageNavigationCounterProps
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    className={cn(
      "min-w-[3.75rem] whitespace-nowrap text-center text-solid-gray-900 text-oln-16N-100",
      className
    )}
    data-slot="page-navigation-counter"
    {...rest}
  />
))
PageNavigationCounter.displayName = "PageNavigationCounter"

// PageNavigationButton

export type PageNavigationControl = "prev" | "next"

type PageNavigationButtonVariant = NonNullable<ButtonProps["variant"]>

const pageNavigationButtonControlStyle: Partial<
  Record<PageNavigationButtonVariant, Record<PageNavigationControl, string>>
> = {
  text: {
    prev: "data-[control=prev]:pl-2",
    next: "data-[control=next]:pr-2",
  },
  outline: {
    prev: "data-[control=prev]:pr-6",
    next: "data-[control=next]:pl-6",
  },
}

export type PageNavigationButtonProps = ButtonProps & {
  control: PageNavigationControl
}

const PageNavigationButton = React.forwardRef<
  HTMLButtonElement,
  PageNavigationButtonProps
>(({ className, control, variant, ...rest }, ref) => {
  const controlStyle = variant
    ? pageNavigationButtonControlStyle[variant]?.[control]
    : undefined

  return (
    <Button
      ref={ref}
      className={cn(controlStyle, className)}
      data-control={control}
      data-slot="page-navigation-button"
      variant={variant}
      {...rest}
    />
  )
})
PageNavigationButton.displayName = "PageNavigationButton"

// PageNavigationArrowButton

export type PageNavigationArrowButtonSize = "lg" | "md" | "sm" | "xs"

const pageNavigationArrowButtonSizeStyle: Record<
  PageNavigationArrowButtonSize,
  string
> = {
  lg: "size-11",
  md: "relative size-8 after:absolute after:-inset-full after:m-auto after:size-11",
  sm: "relative size-6 after:absolute after:-inset-full after:m-auto after:size-11",
  xs: "relative size-5 after:absolute after:-inset-full after:m-auto after:size-11",
}

const pageNavigationArrowButtonHoverBorderStyle: Record<
  PageNavigationArrowButtonSize,
  string
> = {
  lg: "hover:border-[3px]",
  md: "hover:border-[3px]",
  sm: "hover:border-2",
  xs: "hover:border-2",
}

const pageNavigationArrowButtonBaseClassName = `
  flex shrink-0 items-center justify-center
  rounded-full border border-current bg-white text-key-1000
  hover:bg-key-200
  active:bg-key-300 active:text-key-1200
  focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300
`

export type PageNavigationArrowButtonProps = {
  className?: string
  size: PageNavigationArrowButtonSize
} & (
  | ({
      asChild?: false
      label: string
    } & React.ComponentPropsWithoutRef<"button">)
  | { asChild: true; children: React.ReactNode }
)

const PageNavigationArrowButton = React.forwardRef<
  HTMLButtonElement,
  PageNavigationArrowButtonProps
>((props, ref) => {
  const { size, className } = props

  const computedClassName = cn(
    pageNavigationArrowButtonBaseClassName,
    pageNavigationArrowButtonSizeStyle[size],
    pageNavigationArrowButtonHoverBorderStyle[size],
    className
  )

  if (props.asChild) {
    const {
      asChild: _asChild,
      children,
      className: _className,
      size: _size,
      ...rest
    } = props

    return (
      <Slot
        ref={ref}
        className={computedClassName}
        data-slot="page-navigation-arrow-button"
        {...rest}
      >
        {children}
      </Slot>
    )
  }

  const {
    asChild: _asChild,
    children,
    className: _className,
    label,
    size: _size,
    ...rest
  } = props

  return (
    <button
      ref={ref}
      className={computedClassName}
      data-slot="page-navigation-arrow-button"
      type="button"
      {...rest}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
})
PageNavigationArrowButton.displayName = "PageNavigationArrowButton"

export {
  PageNavigation,
  PageNavigationCounter,
  PageNavigationButton,
  PageNavigationArrowButton,
}
