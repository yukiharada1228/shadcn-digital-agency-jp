# Runtime Updates

`.github/runtime-versions.json` を唯一の管理元にします。Node.js と npm の版、npm 配布物の SHA-512 を記録し、`.node-version`、`.nvmrc`、`package.json` の `packageManager` を生成します。保守スクリプトも Node.js 標準 API で実行し、追加パッケージのインストールは不要です。

現在の系列の修正更新と、新しい系列への更新は別 PR です。Node.js は現在のメジャー内の最新版、および現在より新しい LTS を対象にします。npm は現在のメジャー内の最新版と次の安定メジャーを分離します。プレリリースとダウングレードは対象外です。

現在系列の更新 PR は、出所検証と必須 CI 成功後に videoq と同じ Merge Queue へ自動投入します。新しい系列は人がマージを判断します。両系列の CI 失敗や競合は、検証済みの依頼に限り Claude Worker が最大8回修正します。人が編集した PR や管理外ブランチは上書きしません。main が変わった場合は最新の状態を再検証します。

手動実行では `runtime`（all/node/npm）と `channel`（current/next/both）を選択できます。毎日の探索は両系列を確認します。依存更新の追従とキュー処理はイベント駆動です。

```sh
node .github/scripts/runtime-versions.cjs check
node .github/scripts/runtime-versions.cjs sync
node .github/scripts/runtime-versions.cjs plan --runtime node --output runtime-plan.json
node .github/scripts/runtime-versions.cjs plan --runtime npm --upgrade --output runtime-plan.json
node --test .github/scripts/*.test.cjs
```

`plan` は変更案を JSON に出力し、管理対象ファイルを変更しません。Node.js の配布情報は nodejs.org、npm は npm registry を参照します。npm のインストール前に、レビュー済み manifest の URL と SHA-512 を検証し、配布物を展開して利用します。ハッシュが一致しない配布物は実行しません。
