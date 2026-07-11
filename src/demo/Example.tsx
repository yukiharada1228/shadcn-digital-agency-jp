import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="mb-8 rounded-8 border border-solid-gray-300 bg-white p-8">
      <h2 className="mb-4 text-xl font-bold">Zenn記事用のデモ実装</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="solid">送信</Button>
        <Button variant="outline" size="lg">
          戻る
        </Button>
        <Button asChild>
          <a href="#next">次へ</a>
        </Button>
      </div>
    </div>
  )
}
