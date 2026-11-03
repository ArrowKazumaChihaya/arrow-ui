/** ARROW の線のアイコン（24×24・線の太さ1.8・角は丸）。名前 → SVG の中身。 */
export const icons = {
  "cal": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M16 2v4M8 2v4M3 10h18\"></path>", // カレンダー・シフト
  "brief": "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\"></rect><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path>", // 勤怠
  "calc": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"></rect><path d=\"M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01\"></path>", // 給与賞与報酬年調
  "files": "<path d=\"M15 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z\"></path><path d=\"M14 2v5h5M4 7v13a2 2 0 0 0 2 2h10\"></path>", // 書類集計
  "mega": "<path d=\"m3 11 18-5v12L3 14v-3z\"></path><path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\"></path>", // お知らせ（拡声器）
  "bld": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"></rect><path d=\"M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01\"></path>", // 会社情報
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\"></path>", // 社員情報・メンバー
  "gear": "<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>", // 設定
  "todo": "<path d=\"m3 7 2 2 4-4M3 17l2 2 4-4M13 6h8M13 12h8M13 18h8\"></path>", // やることリスト
  "bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"></path><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"></path>", // 通知・お知らせを送る
  "cd": "<path d=\"m6 9 6 6 6-6\"></path>", // 下向き（開く）
  "cl": "<path d=\"m15 18-6-6 6-6\"></path>", // 左（前へ）
  "cr": "<path d=\"m9 18 6-6-6-6\"></path>", // 右（次へ）
  "plus": "<path d=\"M5 12h14M12 5v14\"></path>", // 追加
  "x": "<path d=\"M18 6 6 18M6 6l12 12\"></path>", // 閉じる・消す
  "pen": "<path d=\"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\"></path>", // 変更
  "trash": "<path d=\"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>", // 削除
  "more": "<circle cx=\"5\" cy=\"12\" r=\"1.3\"></circle><circle cx=\"12\" cy=\"12\" r=\"1.3\"></circle><circle cx=\"19\" cy=\"12\" r=\"1.3\"></circle>", // その他
  "lock": "<rect x=\"4\" y=\"11\" width=\"16\" height=\"10\" rx=\"2\"></rect><path d=\"M8 11V7a4 4 0 0 1 8 0v4\"></path>", // ロック
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 7v5l3 2\"></path>", // 時刻・しめきり
  "layers": "<rect x=\"8\" y=\"8\" width=\"13\" height=\"13\" rx=\"2\"></rect><path d=\"M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2\"></path>", // 複製
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12\"></path>", // 取り込む
  "sheet": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z\"></path><path d=\"M14 2v5h5M8 13h8M8 17h8M12 13v8\"></path>", // 表・フォーム
  "print": "<path d=\"M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"></rect>", // 印刷
  "chart": "<path d=\"M3 3v18h18M8 16v-4M13 16V8M18 16v-7\"></path>", // グラフ・サマリー
  "gantt": "<path d=\"M3 4v16h18\"></path><path d=\"M7 8h7M10 12h8M8 16h6\"></path>", // チャート
  "check": "<path d=\"M20 6 9 17l-5-5\"></path>", // 決定・選択中
  "pin": "<path d=\"M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z\"></path><circle cx=\"12\" cy=\"10\" r=\"2.5\"></circle>", // 位置情報
  "yen": "<path d=\"M6 3l6 8 6-8M12 11v10M7 13h10M7 17h10\"></path>", // 人件費
  "minus": "<path d=\"M5 12h14\"></path>", // 減らす
  "info": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 16v-4M12 8h.01\"></path>", // 説明
  "alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"></path><path d=\"M12 9v4M12 17h.01\"></path>", // 注意・間違い
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>", // 夜勤
  "play": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8.5 5.5 3.5-5.5 3.5z\"></path>", // 説明動画
  "store": "<path d=\"M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6M3 9h18\"></path>", // 店舗
  "grid": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 9h18M3 15h18M9 3v18\"></path>", // テーブル
  "eye": "<path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>", // 公開・表示
  "note": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><path d=\"M14 2v6h6M8 13h8M8 17h5\"></path>", // イベント・備考
  "repeat": "<path d=\"m17 2 4 4-4 4\"></path><path d=\"M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4\"></path><path d=\"M21 13v1a4 4 0 0 1-4 4H3\"></path>", // 繰り返し
  "menu": "<path d=\"M4 6h16M4 12h16M4 18h16\"></path>", // メニュー
  "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"></circle><path d=\"M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1\"></path>", // 従業員
  "coffee": "<path d=\"M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z\"></path>", // 休憩
  "grip": "<circle cx=\"9\" cy=\"6\" r=\"1\"></circle><circle cx=\"15\" cy=\"6\" r=\"1\"></circle><circle cx=\"9\" cy=\"12\" r=\"1\"></circle><circle cx=\"15\" cy=\"12\" r=\"1\"></circle><circle cx=\"9\" cy=\"18\" r=\"1\"></circle><circle cx=\"15\" cy=\"18\" r=\"1\"></circle>", // ドラッグ
  "undo": "<path d=\"M3 7v6h6\"></path><path d=\"M21 17a9 9 0 0 0-15-6.7L3 13\"></path>", // 元に戻す
  "redo": "<path d=\"M21 7v6h-6\"></path><path d=\"M3 17a9 9 0 0 1 15-6.7L21 13\"></path>", // やり直す
  "layout": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 9h18M9 21V9\"></path>", // レイアウト
  "panel": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M9 3v18\"></path>", // パネル
  "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"m21 21-4.3-4.3\"></path>", // 検索
  "out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9\"></path>", // ログアウト
  "eyeoff": "<path d=\"M10.7 5.1A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.7 2.7M6.6 6.6A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2\"></path>", // 非公開・隠す
  "hand": "<path d=\"M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8\"></path><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L2.3 16a2 2 0 0 1 2.9-2.8L7 15\"></path>", // 操作
  "filter": "<path d=\"M22 3H2l8 9.46V19l4 2v-8.54L22 3z\"></path>", // 表示内容
  "swap": "<path d=\"m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16\"></path>", // 入れ替え
  "inbox": "<path d=\"M22 12h-6l-2 3h-4l-2-3H2\"></path><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"></path>", // 提出・空
  "help": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17h.01\"></path>", // ヘルプ
  "sort": "<path d=\"m8 9 4-4 4 4M8 15l4 4 4-4\"></path>", // 並べ替え
  "phone": "<path d=\"M3 14v-2a9 9 0 0 1 18 0v2\"></path><path d=\"M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z\"></path>", // 電話
  "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"></rect><path d=\"m3 7 9 6 9-6\"></path>", // お問い合わせ
  "bug": "<path d=\"M8 2l1.9 1.9M16 2l-1.9 1.9M9 7.1V6a3 3 0 1 1 6 0v1.1\"></path><path d=\"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.5 13H3M21 13h-3.5M6 9.5 3.5 8M18 9.5 20.5 8M6 17l-2.5 1.5M18 17l2.5 1.5\"></path>", // 問題報告
  "speaker": "<path d=\"M11 5 6 9H2v6h4l5 4z\"></path><path d=\"M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14\"></path>", // システムからのお知らせ・通知
  "hand2": "<path d=\"M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.3 13.6a1.5 1.5 0 0 1 2.4-1.8L9 15\"></path>", // 手動
  "dl": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3\"></path>", // ダウンロード・書き出す
  "send": "<path d=\"m22 2-7 20-4-9-9-4z\"></path><path d=\"M22 2 11 13\"></path>", // 送る
  "xls": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><path d=\"M14 2v6h6M9 12l6 6M15 12l-6 6\"></path>", // Excel
  "star": "<path d=\"m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z\"></path>", // お気に入り・評価
  "copy": "<rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"></rect><path d=\"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2\"></path>", // コピー
  "image": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"></rect><circle cx=\"9\" cy=\"10\" r=\"2\"></circle><path d=\"m21 16-5-5-9 9\"></path>", // 画像
  "folder": "<path d=\"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>", // フォルダ
  "file": "<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"></path><path d=\"M14 3v5h5\"></path>", // ファイル
  "home": "<path d=\"m3 11 9-7 9 7\"></path><path d=\"M5 10v10h14V10\"></path>", // ホーム
  "up": "<path d=\"M12 19V5\"></path><path d=\"m5 12 7-7 7 7\"></path>", // 上へ（上へ戻る）
  "down": "<path d=\"M12 5v14\"></path><path d=\"m19 12-7 7-7-7\"></path>", // 下へ
  "zoom": "<circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"m20 20-4-4\"></path><path d=\"M11 8v6M8 11h6\"></path>", // 拡大
  "reload": "<path d=\"M20 11a8 8 0 1 0-2.3 5.7\"></path><path d=\"M20 4v7h-7\"></path>", // 読み込み直す
  "qmark": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6\"></path><path d=\"M12 17h.01\"></path>", // はてな（問い合わせ）
  "smile": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M8.5 14a4 4 0 0 0 7 0\"></path><path d=\"M9 9.5h.01M15 9.5h.01\"></path>", // 満足・結果
  "drag": "<path d=\"M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01\"></path>", // つまみ（ドラッグ）
  "camera": "<path d=\"M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5z\"></path><circle cx=\"12\" cy=\"13\" r=\"3.5\"></circle>", // カメラ（写真を撮る・変える）
  "unlock": "<rect x=\"4\" y=\"11\" width=\"16\" height=\"10\" rx=\"2\"></rect><path d=\"M8 11V7a4 4 0 0 1 7.75-1.4\"></path>", // ロック解除（鍵が開いている）
  "pointer": "<path d=\"M10.5 2v2.2M5.6 4.1l1.5 1.5M15.4 4.1l-1.5 1.5\"></path><path d=\"M9 14.5V9.3a1.5 1.5 0 0 1 3 0v4.2\"></path><path d=\"M12 13v-1.2a1.5 1.5 0 0 1 3 0V13.5\"></path><path d=\"M15 13.2v-.4a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-1a5.2 5.2 0 0 1-4.2-2.1l-2.4-3.2a1.5 1.5 0 0 1 2.4-1.8L9 17\"></path>", // 操作（指で押す手）
  "movie": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"></rect><path d=\"m10 9 5 3-5 3z\"></path>", // 動画
  "money": "<circle cx=\"15.5\" cy=\"7\" r=\"4\"></circle><path d=\"M2 15h3.5l3-1.5h4a1.5 1.5 0 0 1 0 3H9\"></path><path d=\"m12.5 16.5 5-2.5a1.6 1.6 0 0 1 1.8 2.5L15 20H6l-4-1\"></path>", // お金（給与の受け取り）
  "checkcircle": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m8 12 3 3 5-6\"></path>", // 済み・選ばれている（丸の中のチェック）
  "exclaim": "<path d=\"M12 4v11M12 20h.01\"></path>", // 注意（「！」だけ）
  "list": "<path d=\"M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01\"></path>", // 一覧
  "schedule": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4\"></path>", // 予定・確定したシフト
  "shift": "<path d=\"M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6\"></path><path d=\"M16 2v4M8 2v4M3 10h18\"></path><circle cx=\"17.5\" cy=\"17.5\" r=\"4.5\"></circle><path d=\"M17.5 15.5v2l1.3 1\"></path>", // シフト（カレンダーと時計）
  "comment": "<path d=\"M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path><path d=\"M8 8h8M8 12h5\"></path>", // コメント
  "notice": "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22z\"></path><path d=\"M8 10h8M8 14h5\"></path>", // お知らせ（丸い吹き出し）
  "cut": "<circle cx=\"6\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><path d=\"M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12\"></path>", // 切り取り
  "paste": "<rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\"></rect><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path>", // 貼り付け
  "save": "<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"></path><path d=\"M17 21v-8H7v8M7 3v5h8\"></path>", // 保存
  "return": "<path d=\"m9 10-5 5 5 5\"></path><path d=\"M4 15h10.5a5.5 5.5 0 0 0 0-11H11\"></path>", // 戻す（折り返しの矢印）
  "zoomout": "<circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"m20 20-4-4\"></path><path d=\"M8 11h6\"></path>", // 縮小
  "zoomreset": "<circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"m20 20-4-4\"></path><path d=\"M8.5 11a2.5 2.5 0 1 0 .8-1.8M8.5 8v1.5H10\"></path>", // 大きさを戻す
  "silhouette": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><circle cx=\"12\" cy=\"10\" r=\"3\"></circle><path d=\"M6.5 21a5.5 5.5 0 0 1 11 0\"></path>", // 顔写真の場所（人の影）
  "twoperson": "<circle cx=\"7.5\" cy=\"8\" r=\"3\"></circle><circle cx=\"16.5\" cy=\"8\" r=\"3\"></circle><path d=\"M2 20a5.5 5.5 0 0 1 11 0M11 20a5.5 5.5 0 0 1 11 0\"></path>", // 二人
  "manager": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 7h18\"></path><circle cx=\"12\" cy=\"12\" r=\"2.5\"></circle><path d=\"M7.5 19a4.5 4.5 0 0 1 9 0\"></path>", // 管理者
  "card": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"></rect><circle cx=\"8\" cy=\"11\" r=\"2\"></circle><path d=\"M5 16a3 3 0 0 1 6 0M14 10h5M14 14h4\"></path>", // 社員証・カード
  "nocard": "<path d=\"M8 5h12a2 2 0 0 1 2 2v10M18 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2\"></path><path d=\"m2 2 20 20\"></path>", // カードなし
  "keyboard": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"></rect><path d=\"M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10\"></path>", // キーボード（打刻の番号入力）
  "punchin": "<circle cx=\"16\" cy=\"5\" r=\"2.2\"></circle><path d=\"M13 21v-6l-1-1v-3a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 20 11v3l-1 1v6\"></path><path d=\"M2 13h7M6 10l3 3-3 3\"></path>", // 出勤
  "punchout": "<circle cx=\"8\" cy=\"5\" r=\"2.2\"></circle><path d=\"M5 21v-6l-1-1v-3a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 12 11v3l-1 1v6\"></path><path d=\"M15 13h7M19 10l3 3-3 3\"></path>", // 退勤
  "bank": "<path d=\"M3 21h18M3 10h18M5 6l7-3 7 3\"></path><path d=\"M6 10v8M10 10v8M14 10v8M18 10v8\"></path>", // 銀行・口座
  "hierarchy": "<rect x=\"9\" y=\"2\" width=\"6\" height=\"5\" rx=\"1\"></rect><rect x=\"2\" y=\"17\" width=\"6\" height=\"5\" rx=\"1\"></rect><rect x=\"9\" y=\"17\" width=\"6\" height=\"5\" rx=\"1\"></rect><rect x=\"16\" y=\"17\" width=\"6\" height=\"5\" rx=\"1\"></rect><path d=\"M12 7v10M5 17v-3h14v3\"></path>", // 階層図
  "status": "<path d=\"m15 5 4 4\"></path><path d=\"M13 7 8.7 2.7a2.4 2.4 0 0 0-3.4 0L2.7 5.3a2.4 2.4 0 0 0 0 3.4L7 13\"></path><path d=\"m8 6 2-2\"></path><path d=\"m2 22 5.5-1.5L21.2 6.8a2.8 2.8 0 0 0-4-4L3.5 16.5z\"></path><path d=\"m18 16 2-2\"></path><path d=\"m17 11 4.3 4.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L11 17\"></path>", // 状態・設定の項目（鉛筆と定規）
  "chevrons": "<path d=\"m6 4 6 5 6-5M6 10l6 5 6-5M6 16l6 5 6-5\"></path>", // 下へ進む（三重の下向き矢印。書類の流れ）
  "umbrella": "<path d=\"M22 12a10 10 0 0 0-20 0z\"></path><path d=\"M12 12v8a2 2 0 0 0 4 0M12 2v1\"></path>", // 有給（傘）
  "contract": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><path d=\"M14 2v6h6M8 9h2M8 13h8\"></path><path d=\"M8 18c1-1.4 2-1.4 2.6 0s1.6 1.4 2.4 0M15.5 18H17\"></path>", // 契約（署名のある書類）
  "switch-user": "<circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M2 21v-1a6 6 0 0 1 6-6h2\"></path><path d=\"M14 14h7M18.5 11.5 21 14l-2.5 2.5M21 19h-7M16.5 16.5 14 19l2.5 2.5\"></path>", // マイページ／管理ページの切り替え
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18\"></path>", // 言葉の切り替え（地球）
  "walk": "<circle cx=\"13\" cy=\"4\" r=\"2\"></circle><path d=\"m9 20 3-6 3 3v4M7 12l3-4 4 1 3 3M10 8l-1 6\"></path>", // 出勤（歩く人。打刻の出勤ボタン）
} as const;
export type ArIconName = keyof typeof icons;
