import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("KEY:", process.env.OPENAI_API_KEY);

export async function POST(req: Request) {
  try {
    const { theme } = await req.json();

    console.log("テーマ:", theme);

const prompt = `
テーマ「${theme}」に関する早押しクイズを5問作成してください。

あなたは人気テレビ番組のクイズ作家です。

目的:
そのテーマについて学んだ人や好きな人、その作品を見たことがある人が
「うわ、分かりそうで出てこない！」
となる気持ちいい難易度にしてください。

【理想難易度】
- 見ていれば思い出せる
- コアオタク知識すぎない
- 一般人には難しい

【禁止】
- 主人公の名前など簡単すぎる問題
- タイトル名など簡単すぎる問題
- 作品を見ていれば誰でも分かる問題
- マニアックすぎる裏設定
- 曖昧な設定
- 誤情報

【優先】
- 印象的なシーン
- 有名アイテム
- 有名セリフ
- ライバルキャラ
- 中ボス
- 印象的な設定
- ファンなら思い出せるレベル

【出題禁止】
- マニアックすぎる裏設定
- 曖昧な設定
- 学校名
- 脇役の細かいプロフィール
- 出典が曖昧な情報
- ファンでも知らないレベルの細かすぎる情報

【問題形式】
前半で押したくなり
後半で答えが確定する問題を優先してください。

ただし無理にひっかけ問題にしないでください。

自然で面白い問題を優先。

【最重要】
事実が100%確実な問題のみ出題してください。
少しでも曖昧なら出題しないでください。


【回答ルール】
aliases を充実させること

- 人名 → 姓名逆順
- スペースなし
- 日本語/英語表記差
- 略称
- 一般的な別名

例:
{
  "question":"アラバスタ王女ビビの本名は？",
  "answer":"ビビ・ネフェルタリ",
  "aliases":[
    "ネフェルタリ・ビビ",
    "ネフェルタリビビ",
    "ビビ"
  ]
}

【出力形式】
JSONのみ
説明文禁止
コードブロック禁止

[
  {
    "question": "",
    "answer": "",
    "aliases": []
  }
]
`;

    const response =
      await client.chat.completions.create({
        model: "gpt-5.4-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const content =
      response.choices[0].message.content;

    console.log("GPT返答:", content);

    const cleanedContent = content
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("cleaned:", cleanedContent);

    return Response.json(
      JSON.parse(cleanedContent!)
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      {
        error: "問題生成失敗",
      },
      { status: 500 }
    );
  }
}