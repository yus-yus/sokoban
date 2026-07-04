# Sokoban Puzzle

倉庫番風のパズルゲームです。
プレイヤーを操作して箱を押し、すべての箱をゴール地点に置くとステージクリアになります。

このプロジェクトは、Webエンジニアとしての基礎力を示すポートフォリオとして作成しています。
単にゲームを動かすだけでなく、ゲームロジックとUIの分離、状態管理、Undo、テスト、スマホ対応、デプロイを意識して実装しています。

## Demo

Coming soon.

## Screenshots

Coming soon.

## Features

* プレイヤーの上下左右移動
* 壁との衝突判定
* 箱押し処理
* 箱の先が壁または別の箱の場合は押せない判定
* クリア判定
* 手数カウント
* リスタート機能
* 複数ステージ対応
* ステージ選択
* Next Stage 機能
* Undo 機能
* キーボード操作
* スマホ向け方向ボタン操作
* ゲームロジックの単体テスト

## Tech Stack

* TypeScript
* React
* Vite
* CSS Modules
* Vitest

## How to Play

PCではキーボードの矢印キーで操作します。

| Key      | Action |
| -------- | ------ |
| ↑        | 上に移動   |
| ↓        | 下に移動   |
| ←        | 左に移動   |
| →        | 右に移動   |
| Ctrl + Z | Undo   |

スマホでは、画面上に表示される方向ボタンで操作できます。

## Game Rules

* プレイヤーは上下左右に1マスずつ移動できます。
* 壁のマスには移動できません。
* プレイヤーの移動先に箱がある場合、箱を1マス押します。
* 箱の先が壁または別の箱の場合、箱は押せません。
* すべての箱がゴール上に置かれるとステージクリアです。
* 有効な移動のみ手数としてカウントされます。
* Undoにより、1手前の状態に戻れます。

## Project Structure

```txt
src/
├─ components/
│  ├─ Board.tsx
│  ├─ Board.module.css
│  ├─ Cell.tsx
│  ├─ DirectionControls.tsx
│  ├─ DirectionControls.module.css
│  ├─ StageSelector.tsx
│  ├─ StageSelector.module.css
│  ├─ StatusPanel.tsx
│  └─ StatusPanel.module.css
├─ game/
│  ├─ levels.ts
│  ├─ logic.ts
│  ├─ logic.test.ts
│  ├─ stageParser.ts
│  └─ types.ts
├─ hooks/
│  └─ useGame.ts
├─ App.tsx
├─ index.css
└─ main.tsx
```

## Design Policy

このプロジェクトでは、ゲームロジックとUIをできるだけ分離しています。

### `src/game`

ゲームのルールやデータ構造を管理します。

* `types.ts`

  * 位置、方向、ステージ、ゲーム状態などの型定義
* `levels.ts`

  * 文字列ベースのステージデータ
* `stageParser.ts`

  * ステージ文字列を内部データ構造に変換
* `logic.ts`

  * 移動処理、衝突判定、箱押し処理、クリア判定
* `logic.test.ts`

  * ゲームロジックの単体テスト

### `src/hooks`

ゲームの状態管理を担当します。

* `useGame.ts`

  * 現在のステージ
  * 現在のゲーム状態
  * Undo履歴
  * 移動
  * リスタート
  * ステージ選択
  * Next Stage

### `src/components`

ReactのUI部品を管理します。

* `Board.tsx`

  * 盤面全体の表示
* `Cell.tsx`

  * 1マスの表示
* `StatusPanel.tsx`

  * 手数、Undo、Restart、Next Stageの表示
* `StageSelector.tsx`

  * ステージ選択UI
* `DirectionControls.tsx`

  * スマホ向け方向ボタン

## Stage Data Format

ステージは文字列配列として定義しています。

```ts
{
  id: "level-1",
  name: "First Box",
  map: [
    "#######",
    "#     #",
    "# .$. #",
    "#  @  #",
    "#######",
  ],
}
```

各文字の意味は以下です。

| Character | Meaning    |
| --------- | ---------- |
| `#`       | 壁          |
| space     | 床          |
| `.`       | ゴール        |
| `$`       | 箱          |
| `@`       | プレイヤー      |
| `*`       | ゴール上の箱     |
| `+`       | ゴール上のプレイヤー |

ステージ文字列は `stageParser.ts` によって、壁・床・ゴール・プレイヤー初期位置・箱の初期位置に変換されます。

## Game Logic

ゲームの移動処理は、Reactコンポーネントから独立した `movePlayer` 関数として実装しています。

```ts
movePlayer(currentState, direction)
```

この関数は、現在のゲーム状態と入力方向を受け取り、次のゲーム状態を返します。

無効な移動の場合は、元の状態をそのまま返します。
これにより、React側では「状態が変化した場合だけUndo履歴に積む」という実装ができます。

## Undo Design

Undo機能は、移動前の `GameState` を履歴として保持することで実装しています。

```txt
現在の状態
  gameState

過去の状態
  history: GameState[]
```

有効な移動が発生したときだけ、移動前の状態を `history` に追加します。
Undo時には、`history` の最後の状態を取り出して現在の状態に戻します。

## Responsive Design

PCではキーボード操作、スマホでは画面上の方向ボタンによるタッチ操作に対応しています。

キーボード操作とタッチ操作はどちらも同じ `move(direction)` 関数を呼び出すため、入力方法が変わってもゲームロジックは共通です。

## Testing

ゲームロジックは Vitest で単体テストしています。

テスト対象の例は以下です。

* 初期状態が正しく作られる
* 壁には移動できない
* 床には移動できる
* 箱を押せる
* 箱の先が壁なら押せない
* 箱の先に別の箱があるなら押せない
* すべての箱がゴール上にあるとクリアになる
* クリア後は移動できない

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

ローカル環境で開発サーバーを起動します。

スマホで同じWi-Fiから確認する場合は、以下のように起動します。

```bash
npm run dev -- --host 0.0.0.0
```

表示された `Network` のURLをスマホのブラウザで開きます。

## Test

```bash
npm run test:run
```

監視モードでテストを実行する場合は以下を使います。

```bash
npm run test
```

## Build

```bash
npm run build
```

## Future Improvements

* デプロイ
* クリア済みステージの保存
* 最短手数の保存
* ステージバリデーション
* ステージエディタ
* アニメーション追加
* 画面デザイン改善
* Reactコンポーネントのテスト追加
* Redo機能
