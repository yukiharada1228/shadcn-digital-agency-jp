# Runtime Updates

`.github/runtime-versions.json` を唯一の管理元にします。Node.js と npm の版、npm 配布物の SHA-512 を記録し、`.node-version`、`.nvmrc`、`package.json` の `packageManager` を生成します。保守スクリプトも Node.js 標準 API で実行し、追加パッケージのインストールは不要です。

現在の系列の修正更新と、新しい系列への更新は別 PR です。Node.js は現在のメジャー内の最新版、および現在より新しい LTS を対象にします。npm は現在のメジャー内の最新版と次の安定メジャーを分離します。プレリリースとダウングレードは対象外です。

更新 PR は自動マージしません。互換性エラーは通常の CI で検出し、人が確認します。人が修正した更新 PR や同名の管理外ブランチを上書きしません。main が途中で変わった場合は次回実行で再確認します。

```sh
node .github/scripts/runtime-versions.cjs check
node .github/scripts/runtime-versions.cjs sync
node .github/scripts/runtime-versions.cjs plan --runtime node --output runtime-plan.json
node .github/scripts/runtime-versions.cjs plan --runtime npm --upgrade --output runtime-plan.json
node --test .github/scripts/*.test.cjs
```

`plan` は変更案を JSON に出力し、管理対象ファイルを変更しません。Node.js の配布情報は nodejs.org、npm は npm registry を参照します。npm のインストール前に、レビュー済み manifest の URL と SHA-512 を検証し、配布物を展開して利用します。ハッシュが一致しない配布物は実行しません。
