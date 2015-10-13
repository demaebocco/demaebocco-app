# 出前 Bocco 開発者向け
## セットアップ
```
git clone git@github.com:demaebocco/demaebocco-app.git
cd demaebocco-app
npm install
```

もしくは、GitHub より zip ファイルをダウンロードして展開後に、カレントディレクトリを移動して `npm install` としてください。


## 実行
```
npm start
```

実行されたら、`http://localhost:3000` をブラウザーで開いてください。


## 設定
設定で Bocco などの出力先を変更できます。`config.json` ファイルを作成してください。(修正後はアプリの再起動をおねがいします)

```json
{
  "bocco": {
    "type": "niseBocco",
    "options": {
      "name": "#Bocco政倉"
    }
  },
  "restaurant": {
    "type": "niseRestaurant",
    "options": {
      "name": "@銀のさら政倉店"
    }
  }
}
```


### Bocco を使う
設定によって Bocco の実機を使うことができます。

```json
{
  "bocco": {
    "type": "bocco",
    "options": {
      "roomId": "Your room id",
      "accessToken": "your access token"
    }
  }
}
```

## 備考
現在は、Bocco の実機や店舗への電話はかけません。テキストメッセージのみのやり取りなので、すぐに試すことができます。

* Bocco はニセ Bocco を使うようにしています
* 店舗も同様にニセ店舗を使うようにしています (電話かけません)
* お昼は`とんかつ`のみです
