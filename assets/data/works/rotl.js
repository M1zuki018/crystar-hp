/**
 * ROTL 作品データ
 *
 * 画像は名前だけ書けばよく、Resources/rotl/rotl_(名前).png に解決される。
 * 解決の規約は assets/data/works.config.js の resourceOf() にある。
 *
 * ※ alphabet 表記・未確定項目（誕生日/身長/血液型など）は TODO コメント参照。
 */
export default {
  /* ============ STORYブロック ============ */
  story: {
    visuals: ['story_01', 'story_02', 'story_03'],

    text: `王暦1231年、7月20日。

戦勝を祝う祝祭の夜、リディアンス王ヴァンセールは、民衆の目の前で殺された。
バルコニーに立った王を焼いたのは、蒼い炎をまとう異形。
——異形は人間を殺せない。それが、この世界を千年支えてきた規則だったはずだった。

王を喪った国は、宰相ラズワルド・ゼファーニアの手のひらの上で回り始める。
異形討伐令。魔核の独占。神への懐疑。
人々は歓呼し、守り手であったはずの異形を狩り始めた。

王太子ヴィクター・ヴェネディクスは、その夜のうちに王都から攫われ、名も知らぬ森に落ちる。
剣と、王家の指輪と、血と泥にまみれた寝着だけを持って。

これは、変わらない世界に抗おうとした者たちの話である。
本質を見た者は、見ていない者に殺される。神を殺せば、世界はより酷くなる。
それでも足掻く姿だけが、この世界で唯一美しい。

そして——それを外側から眺めているあなたも、いずれ滑稽になる。`,
  },

  /* ============ WORLDブロック ============ */
  world: {
    visuals: ['world_01', 'world_02'],
    text: `七つの大陸を持つ世界、アトラス・ティアナ。
その一つ、リディアンス王国は、人間と異形が共に在ることで千年を保ってきた国である。

異形は人間を殺せない。神が定めた規則が、人と異形の距離を成り立たせていた。
アペクサリアとの戦を前に、人すら資源として扱った圧政の時代を、王ヴァンセールが終わらせ、
神が降りて加護を授け、宰相ラズワルドの魔道具が国を躍進させた。

リディアンスは強くなった、と誰もが思っていた。
だが実際には、神と王と宰相という三つの支柱に凭れきった、脆い構造でしかなかった。
人は異形と支え合う努力を忘れ、力を振るうことだけを覚えていた。

1231年、王が死に、規則が書き換わる。
支柱が一本折れたとき、国は驚くほど呆気なく、崩れ方の作法を思い出せなくなる。`,

    characters: ['victor', 'razwald', 'stage', 'griese'],
  },

  /* ============ 陣営（CHARACTERブロックのタブ） ============ */
  characterGroups: [
    { id: 'royal', label: '王家・王太子府' },
    { id: 'zephania', label: '宰相府・ゼファーニア' },
    { id: 'knights', label: 'リディアンス騎士団' },
    { id: 'divine', label: '神と異形' },
    { id: 'cortege', label: '葬列' },
  ],

  /* ============ キャラクター ============ */
  characters: [
    {
      id: 'victor',
      group: 'royal',
      color: '#b5313a', // 王家の赤

      name: 'ヴィクター',
      realName: 'ヴィクター・ヴェネディクス',
      alphabet: 'VICTOR', // TODO: 姓の綴り要確定（VENEDIX / VENEDICS 等）
      quote: '異形もまた、この国の民だ',

      affiliation: 'リディアンス王国 王太子',
      gender: '男性',
      age: '18',
      birthday: '11月26日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '俺（公の場では「私」）',
      residence: '王都ヴィルエスタ／ヴィルエスタ城',

      intro:
          '王家の証である赤い髪と赤い目を持つ、リディアンス第一王子。稚拙で受動的、争いを好まぬ素直な王子と見られている。だがその姿は計算され尽くした演技であり、見抜いた者は世界にただ一人しかいない。夜明け前の廃練兵場で剣を振り、痕跡を消し、何食わぬ顔で従者を迎える。\n' +
          '父の死と自らの拉致を経て王都の外に投げ出され、異形が狩られていく国を、初めて自分の足で見て回ることになる。掲げるのは、神に選ばれた王ではなく、民に選ばれた王。',
    },
    {
      id: 'razwald',
      group: 'zephania',
      color: '#2f6fa8', // 蒼炎

      name: 'ラズワルド',
      realName: 'ラズワルド・ゼファーニア',
      alphabet: 'RAZWALD', // TODO: 姓の綴り要確定（ZEPHANIA）
      quote: '必要な死などない',

      affiliation: 'リディアンス王国 宰相／ゼファーニア公爵家',
      gender: '男性',
      age: '21',
      birthday: '1月17日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '私',
      residence: '王都ヴィルエスタ（ゼファーニア家別邸）',

      intro:
          '若くして宰相の座に就いた、ゼファーニア公爵家の当主。魔道具を世に広め、死なずに済む人間の数を桁違いに増やした男。夜が明けるより先に一日を組み上げ、起きうる全てを既に予測していたかのように国を回す。\n' +
          '目的は神と、そして世界を書き、眺める者たちを消し去ること。そのために王を殺し、異形を狩り、民の信頼を積み上げる。「必要な死などない」という信念だけは、演技ではない。',
    },
    {
      id: 'vanceil',
      group: 'royal',
      color: '#8a1c22',

      name: 'ヴァンセール',
      realName: 'ヴァンセール・ヴェネディクス',
      alphabet: 'VANCEIL',
      quote: '明日も、明後日も、城で待っていなさい',

      affiliation: 'リディアンス王国 国王',
      gender: '男性',
      age: '41',
      birthday: '3月18日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: 'ヴィルエスタ城',

      intro:
          '人すら資源として扱った圧政の時代を終わらせ、民を救った王。神の加護を授かり、ゲートの前線にも自ら立つ。祈りの言葉に迷いはなく、国のことならいくらでも語れる。ただ、隣に立つ息子とだけは目を合わせない。\n' +
          '1231年7月20日、戦勝祝祭を締めるその瞬間、民衆の前で蒼炎に焼かれる。',
    },
    {
      id: 'lucia',
      group: 'royal',
      color: '#9b6f8c',

      name: 'ルシア',
      realName: 'ルシア・セルヴェイ',
      alphabet: 'LUCIA',
      quote: '今、リディアンスで最も優先すべきなのは殿下ではないのですか',

      affiliation: '王太子府 親衛長',
      gender: '女性',
      age: '',
      birthday: '',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: 'ヴィルエスタ城',

      intro:
          '王太子親衛隊を預かる長。忠誠は王冠にではなく、その人に向いている。王子が消えた朝、宰相府に真っ向から食い下がり、捜索の許可を求めて拒まれる。',
    },
    {
      id: 'cyril',
      group: 'royal',
      color: '#c2a878',

      name: 'シリル',
      realName: '',
      alphabet: 'CYRIL',
      quote: '',

      affiliation: '王太子府 従者',
      gender: '',
      age: '',
      birthday: '',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: 'ヴィルエスタ城',

      intro:
          'ヴィクター付きの従者。手ぬぐいと水桶を持って、朝の部屋で主を待つ。窓の掛け金がいつも少しだけ緩いことを知っていて、何も言わない。',
    },
    {
      id: 'oeven',
      group: 'knights',
      color: '#6b7a8f',

      name: 'オーヴェン',
      realName: '',
      alphabet: 'OEVEN',
      quote: '',

      affiliation: 'リディアンス騎士団 本部',
      gender: '',
      age: '42',
      birthday: '10月14日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          '騎士団を束ねる者。王でも宰相でもなく、国そのものに仕えるという騎士のあり方を、体現しようとし続けている。',
    },
    {
      id: 'alvis',
      group: 'knights',
      color: '#7f6a55',

      name: 'アルヴィス',
      realName: '',
      alphabet: 'ALVIS',
      quote: '',

      affiliation: 'リディアンス騎士団 第一連隊長（対大型魔物）',
      gender: '',
      age: '',
      birthday: '2月18日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          'リディアンス一の騎士と呼ばれる男。大型魔物討伐を専門とする第一連隊を率いる。やがてその肩書きを、自ら捨てることになる。',
    },
    {
      id: 'floes',
      group: 'knights',
      color: '#c98a3c',

      name: 'フロース',
      realName: '',
      alphabet: 'FLOES',
      quote: '殿下を援護する！',

      affiliation: 'リディアンス騎士団 第二連隊長（軽騎兵）',
      gender: '',
      age: '18',
      birthday: '4月8日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '僕',
      residence: '',

      intro:
          '機動力に全てを賭けた軽騎兵、第二連隊を率いる若き連隊長。学院ではヴィクターの一つ上。感情の上下が激しい部隊を、感情の上下が激しいまま率いている。逆境から這い上がってきた、泥臭い勇気の人。',
    },
    {
      id: 'leanhardt',
      group: 'knights',
      color: '#a8b0bd',

      name: 'リーンハルト',
      realName: '',
      alphabet: 'LEANHARDT',
      quote: '',

      affiliation: 'リディアンス騎士団 第三連隊長（中央歩兵隊）',
      gender: '女性',
      age: '24',
      birthday: '9月9日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          '平民の生まれから、リディアンス最大の歩兵連隊を預かるまでに上り詰めた騎士。栄光の名の重さを、誰よりも自分で量っている。',
    },
    {
      id: 'euge',
      group: 'knights',
      color: '#5d7a5f',

      name: 'ユージェ',
      realName: 'ユージェ・クロヴァード',
      alphabet: 'EUGE CROVARD',
      quote: '',

      affiliation: 'リディアンス騎士団 第四連隊長（辺境猟騎連隊）',
      gender: '',
      age: '38',
      birthday: '6月30日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          '辺境を駆ける猟騎連隊の長。かつて王家の護衛騎士として、王国の秘密を抱え続けてきた。管轄を越えることも、事の重さ次第では自分の判断で踏み越える。',
    },
    {
      id: 'adelaide',
      group: 'knights',
      color: '#8f7f9e',

      name: 'アデライド',
      realName: '',
      alphabet: 'ADELAIDE',
      quote: '',

      affiliation: 'リディアンス騎士団 第五連隊長（工兵）',
      gender: '',
      age: '',
      birthday: '12月12日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          '剣ではなく技術で戦場を支える工兵連隊の長。橋を架け、陣を組み、退路を作る。記録に残りにくい仕事を、記録に残す価値のあるやり方で続けている。',
    },
    {
      id: 'leor',
      group: 'knights',
      color: '#4e8a92',

      name: 'レオール',
      realName: '',
      alphabet: 'LEOR',
      quote: '',

      affiliation: 'リディアンス騎士団 第六連隊長（沿岸警備）',
      gender: '',
      age: '',
      birthday: '8月1日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '',
      residence: '',

      intro:
          '貴族の身分を捨てて騎士になった男。沿岸の警備という地味な職務の果てに、捨てたはずの貴族すら救う立場へ辿り着く。',
    },
    {
      id: 'stage',
      group: 'divine',
      color: '#d8d2c4',

      name: 'ステージ',
      realName: '原初ステラージュ',
      alphabet: 'STELLAGE', // TODO: 通称表記を STAGE とするか要確定
      quote: '俺たちは、人を殺せない。だから、人は、俺たちを恐れなくていい',

      affiliation: '原初の異形',
      gender: '',
      age: '約1200年',
      birthday: '12月11日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '俺',
      residence: '',

      intro:
          '異形の頂点にただ一体だけ立つ、原初の存在。かつて「王に仕える」という役目を持っていたが、それは神の手で消された。以来、能動的な目的を持たないまま在り続けている。\n' +
          '騎士団が総出で剣を抜いても近寄ることすらできない力を持ちながら、戦うかどうかは常に意思の問題でしかない。理由がないと言いながら、それでも王子の隣を歩く。',
    },
    {
      id: 'astaldia',
      group: 'divine',
      color: '#d4b25c',

      name: 'アスタルディア',
      realName: '',
      alphabet: 'ASTALDIA',
      quote: '戦って、ね',

      affiliation: 'リディアンスの神',
      gender: '女性',
      age: '',
      birthday: '',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: 'わたくし',
      residence: '',

      intro:
          'リディアンスに祀られる神。世界を書き、そして観る者。1231年、「異形は人間を殺せない」という世界の土台を自ら書き換え、130年分の国家の構造を一行で無効にした。\n' +
          '苦しむ姿には興味がない。戦う姿だけが面白い。だから手がかりを与える。舞台に降りてきた観客ほど、質の悪いものはない。',
    },
    {
      id: 'griese',
      group: 'cortege',
      color: '#4a3f52', // 黒泥

      name: 'グリーゼ',
      realName: 'グリーゼ・ルーデン',
      alphabet: 'GRIESE RUDEN',
      quote: '逃げなくていいんだよ。キミは鍵だから',

      affiliation: '葬列 第二位・弔鐘',
      gender: '',
      age: '',
      birthday: '7月18日',
      bloodType: '',
      height: '',
      weight: '',
      firstPerson: '僕',
      residence: '',

      intro:
          '葬列九席の第二位、弔鐘。黒泥の道化を率いる者。全てを予測して積み上げるラズワルドとは対照的に、結果を読まずに場を掻き回す。\n' +
          '殺したいのではなく、欲しい。王子も、原初も、彼にとっては将来よく育つ種でしかない。倒される敵にすらならず、物語の外側に残り続ける——世界が変わらないということの、そのものの形。',
    },
  ],
};