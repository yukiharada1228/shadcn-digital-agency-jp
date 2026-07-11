import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Digital Agency design tokens define both `--color-*` and `--text-*`
 * in the Tailwind v4 `@theme` block. Both generate `text-*` utilities
 * (color vs font-size), but tailwind-merge's default config treats all
 * `text-*` as a single group—causing one to be stripped when they coexist.
 *
 * We patch the `text-color` validator to exclude the DA font-size tokens
 * (dsp-*, std-*, dns-*, oln-*, mono-*) and register them under `font-size`.
 */
const daFontSizePattern = /^(dsp|std|dns|oln|mono)-\S+$/

const twMerge = extendTailwindMerge((config) => {
  // Wrap existing text-color validators so they reject our font-size tokens
  const textColorGroup = config.classGroups["text-color"][0] as { text: any[] }
  const origValidators = textColorGroup.text
  config.classGroups["text-color"] = [
    {
      text: origValidators.map((v) => {
        if (typeof v === "function") {
          return (value: string) => {
            if (daFontSizePattern.test(value)) return false
            return (v as (value: string) => boolean)(value)
          }
        }
        return v
      }),
    },
  ]

  // Register DA font-size tokens in the font-size group
  const fontSizeGroup = config.classGroups["font-size"][0] as { text: any[] }
  fontSizeGroup.text.push(daFontSizePattern)

  return config
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
