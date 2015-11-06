# 出前 Bocco 開発者向け
## セットアップ
Node.js v4.0.0 以降が必要です。

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


### 設定例
#### テスト用
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
  },
  "restaurantChooser": {
    "type": "niseRestaurantChooser",
    "options": {
    }
  }
}
```

ボタンを押すとニセの実装の `#Bocco政倉` にメッセージを飛ばします。何度かの応答のあと、ニセの実装の `@銀のさら政倉店` にメッセージを飛ばします。メニューも `寿司` で `銀のさら政倉店` 固定です。

電話をかけたり、Bocco 実機にメッセージを飛ばしたりするわけではありませんので、開発やテストのときに便利です。

なお、テスト用に向いたこの設定はあらかじめ `config.default.json` ファイルで設定されています。特に何も設定しなくても、テストに便利なようになっています。


#### 本番用設定
```json
{
  "bocco": {
    "type": "multiBocco",
    "options": {
    }
  },
  "restaurantChooser": {
    "type": "smartRestaurantChooser",
    "options": {
    }
  },
  "twilio": {
    "accountSid": "Twilio Account SID",
    "authToken": "Twilio AuthToken",
    "to": "destination phone number (optional?)",
    "from": "Twilio phone number",
    "url": "http://my-server.example.com:3001/",
    "server": "my-server.example.com",
    "port": "3001",
    "path": "/"
  },
  "gNavi": {
    "accessKey": "ぐるなび API access key"
  },
  {
  "kintone": {
    "subdomain": "kintone sub domain",
    "loginName": "kintone login name",
    "password": "kintone password",
    "apps": {
      "bocco": {
        "app": 15,
        "api_token": "bocco app api token"
      },
      "menu": {
        "app": 17,
        "api_token": "menu app api token"
      }
    }
  }
}
```

* `お昼どうする?` 対象の Bocco を kintone bocco アプリから取得します
* メニューの選択は kintone とぐるなびを併用します
* Twilio で店舗に出前を依頼します


### Twilio 設定
Twilio のアカウントを設定してください。

```json
{
  "twilio": {
    "accountSid": "Twilio Account SID",
    "authToken": "Twilio AuthToken",
    "to": "destination phone number (optional?)",
    "from": "Twilio phone number",
    "url": "http://my-server.example.com:3001/",
    "server": "my-server.example.com",
    "port": "3001",
    "path": "/"
  }
}
```

* **Twilio で電話をかけるときはグローバル IP Address が必要になります。**


### ぐるなび API 設定
ぐるなび API を設定してください。

```json
{
  "gNavi": {
    "accessKey": "ぐるなび API access key"
  }
}
```


### kintone 設定
kintone のログイン名やアプリケーションの API Token などを設定してください。

```json
{
  "kintone": {
    "subdomain": "kintone sub domain",
    "loginName": "kintone login name",
    "password": "kintone password",
    "apps": {
      "bocco": {
        "app": 15,
        "api_token": "bocco app api token"
      },
      "menu": {
        "app": 17,
        "api_token": "menu app api token"
      }
    }
  }
}
```

`bocco アプリ`で Bocco の一覧を、`menu アプリ`で店舗・メニューの一覧を管理しています。


### Bocco を使う
設定によって Bocco の実機を使うことができます。


#### bocco - 設定された一台の実機

```json
{
  "bocco": {
    "type": "bocco",
    "options": {
      "roomId": "Your room id",
      "accessToken": "your access token"
    },
    "name": "Your name",
    "address": "Your address",
    "tel": "Your phone number"
  }
}
```


#### niseBocco - ニセの実装を一台使う
ニセの実装を使ってメッセージを送信します。Bocco へのメッセージ送信をエミュレートします。

```json
{
  "bocco": {
    "type": "niseBocco",
    "options": {
      "name": "#Boccoさくらハウス"
    },
    "name": "さくらハウス",
    "address": "鹿児島県鹿児島市荒田1丁目16-7 イイテラス403",
    "tel": "00000000000"
  }
}
```


#### multiBocco - kintone bocco アプリを使う
kintone bocco アプリから Bocco の一覧を取得して、それぞれにメッセージを送信します。本番用はこれです。

```json
{
  "bocco_": {
    "type": "multiBocco",
    "options": {
    }
  }
}
```


### お店・メニューを決める
#### gNaviRestaurantChooser - ぐるなびレストラン検索APIを使ってお店を決める
[ぐるなび Web Service - 新規アカウント発行](https://ssl.gnavi.co.jp/api/regist.php)からアカウントを作成し、アクセスキーを取得します。

```json
{
  "restaurantChooser": {
    "type": "gNaviRestaurantChooser",
    "options": {
      "accessKey": "Your access key"
    }
  }
}
```


#### kintone menu アプリでお店を決める
kintone menu アプリの店舗・メニュー一覧からお店を決めます。設定は `kintone` の設定を利用しますので不要です。

```json
{
  "kintoneRestaurantChooser" {
  "type": "kintoneRestaurantChooser",
  "options": {
  }
}
```


#### smartRestaurantChooser - 出前か外かで戦略を切り替える
出前の時は `kintoneRestaurantChooser` を、外の時は `gNaviRestaurantChooser` を選択して使用します。

```json
{
  "restaurantChooser": {
    "type": "smartRestaurantChooser",
    "options": {
    }
  }
}
```
