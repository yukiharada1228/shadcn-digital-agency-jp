import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerMenuLink,
  DrawerTitle,
} from "@/components/ui/drawer"

describe("Drawer accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Drawer open aria-label="ナビゲーション">
        <DrawerHeader>
          <DrawerClose aria-label="閉じる" />
        </DrawerHeader>
        <DrawerTitle>メニュー</DrawerTitle>
        <DrawerBody>
          <li>
            <DrawerMenuLink href="/home">ホーム</DrawerMenuLink>
          </li>
        </DrawerBody>
      </Drawer>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=dialog", () => {
    render(
      <Drawer open aria-label="ナビゲーション">
        <DrawerTitle>メニュー</DrawerTitle>
      </Drawer>
    )
    expect(
      screen.getByRole("dialog", { hidden: true, name: "ナビゲーション" })
    ).toBeInTheDocument()
  })
})
