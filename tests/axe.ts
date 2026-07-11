import { configureAxe } from "vitest-axe"

export const axe = configureAxe({
  rules: {
    "color-contrast": { enabled: false },
  },
})
