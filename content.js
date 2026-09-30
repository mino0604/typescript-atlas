const GROUPS = [
{name:'はじめてのTypeScript',level:'入門',icon:'TS',desc:'型のある世界へ。基本の考え方と書き方を身につける。'},
{name:'型でデータを表現する',level:'基礎',icon:'{ }',desc:'関数・オブジェクト・Unionで、データの形を正確に伝える。'},
{name:'型を安全に扱う',level:'基礎',icon:'✓',desc:'絞り込みと型設計で、不正な状態や思い込みを減らす。'},
{name:'型を組み立てる',level:'応用',icon:'<T>',desc:'ジェネリクスと型演算で、再利用できる型をつくる。'},
{name:'アプリケーション開発',level:'実践',icon:'↗',desc:'非同期処理・API・モジュールを実務につなげる。'},
{name:'設計とエコシステム',level:'発展',icon:'⊞',desc:'高度な型、設定、テスト、移行まで理解を広げる。'}];
const CHAPTERS = [];
function chapter(group,title,summary,sections,code,walkthrough,pitfall,questions,exercise,solution,reason){CHAPTERS.push({id:CHAPTERS.length+1,group,title,summary,sections,code,walkthrough,pitfall,questions,exercise,solution,reason});}
chapter(0,'TypeScriptの考え方','型の役割とJavaScriptとの関係を知る。',[
['型は、値の使い方の約束','TypeScriptはJavaScriptに型の検査を加えた言語です。型は「この値にどんな操作ができるか」を表します。数値なら計算、文字列なら文字列操作ができるという約束を、実行する前に確かめます。たとえば価格に文字列を渡す間違いを、エディターやコンパイラーが教えてくれます。'],
['型検査と実行は別の仕事','型注釈やinterfaceは通常、JavaScriptへの変換で取り除かれます。実行時にネットワークから届く値が正しいかどうかは、型だけでは検証されません。型検査は開発時の道具、入力検証は実行時の処理として区別しましょう。'],
['JavaScriptの理解が土台になる','const・let、関数、配列、オブジェクト、条件分岐はJavaScriptの仕組みです。TypeScriptを使っても、参照の共有や非同期処理の動作は変わりません。この教科書ではstrictを有効にした型検査を基本とし、設定が影響する箇所は明記します。']
],`function total(price: number, count: number): number {
  return price * count;
}

total(120, 3);     // 360
// total("120", 3); // 型エラー
`, '引数の後ろの「: number」は受け取る値の型、括弧の後ろの「: number」は戻り値の型です。計算自体はJavaScriptです。文字列を渡す行をコメント解除すると、型検査が不一致を検出します。','型エラーがあれば常に出力が止まるとは限りません。tscの出力停止にはnoEmitOnErrorなどの設定が関係します。型検査の成功だけで、バグがないことも保証されません。',[
['TypeScriptの型注釈は通常、実行時にどうなる？',['JavaScriptへの変換で取り除かれる','すべての入力を自動検証する','文字列に変換されて残る'],0,'型注釈は開発時の検査に使われます。外部データの安全性には、実行時の検証が別途必要です。'],
['total("120", 3) が型エラーになる理由は？',['関数を2回呼べないため','第1引数がnumberではなくstringだから','戻り値が360だから'],1,'priceはnumberという約束です。見た目が数字の文字列でもnumberとは異なります。']
],'数値の価格と税率を受け取り、税込価格を返すwithTax関数を書いてください。税率は0.1のように渡すものとします。',`function withTax(price: number, rate: number): number {
  return price * (1 + rate);
}`, '引数と戻り値をnumberで表します。金額の端数処理は別の業務ルールなので、この関数では丸めていません。');
chapter(0,'開発環境と最初の型検査','tsc・strict・エディターの役割を分けて理解する。',[
['プロジェクトにコンパイラーを入れる','Node.jsとnpmを用意したら、npm init -yでプロジェクトを作り、npm install -D typescriptで開発用依存として追加します。npx tsc --initで設定ファイルを作れます。グローバル導入だけに頼らず、プロジェクトでバージョンとロックファイルを管理すると、共同開発の結果を揃えやすくなります。'],
['エディターとコマンドの両方で確認','エディターの赤い波線は素早いフィードバックです。最後にはnpx tsc --noEmitを実行して、プロジェクト全体の型検査結果を確認しましょう。ファイルを直接指定する呼び方ではtsconfigが読み込まれない点に注意します。'],
['まずstrictを有効にする','strictは複数の厳密な検査をまとめて有効にします。導入時から有効にすると、nullの扱いや暗黙のanyを放置しにくくなります。変換と実行は別なので、JavaScript出力が必要なのか、別のビルドツールに任せるのかも決めます。']
],`// tsconfig.json（型検査を行う学習用設定）\n{\n  "compilerOptions": {\n    "target": "ES2022",\n    "strict": true,\n    "moduleDetection": "force",\n    "noEmit": true\n  },\n  "include": ["src/**/*.ts"]\n}\n\n// ターミナルで実行: npx tsc -p .`, 'includeで検査対象を指定し、noEmitで出力を省略しています。この設定だけでWebアプリの実行環境が整うわけではありません。モジュール設定は「tsconfigとモジュール解決」で扱います。','tscが正常終了してもアプリを実行したことにはなりません。また新しいstrictの検査追加で、更新後にエラーが増える場合があります。',[
['型検査だけをしてJavaScriptを出力しないオプションは？',['noEmit','skipLibCheck','sourceMap'],0,'noEmitはファイルの出力を止めます。skipLibCheckは宣言ファイルの検査を省く別の設定です。'],
['チームでTypeScriptのバージョンを揃える基本は？',['全員のグローバル版に任せる','プロジェクトの依存とロックファイルで管理する','型注釈を削除する'],1,'プロジェクトごとの依存を固定することで、型検査結果の再現性が高まります。']
],'strictを有効にし、src以下の.tsを型検査だけするtsconfigを書いてください。',`{\n  "compilerOptions": { "strict": true, "noEmit": true },\n  "include": ["src/**/*.ts"]\n}`, 'strict・noEmit・includeが目的をそれぞれ担当します。実際のプロジェクトでは実行環境に合わせたtargetやmoduleも必要です。');
chapter(0,'基本型と型推論','string・number・booleanと、型を省略できる場面。',[
['値から型を推論する','let count = 0と書くと、countの型はnumberになります。TypeScriptが初期値を手がかりに型を推論するため、すべての変数に注釈を付ける必要はありません。再代入できないconstのプリミティブ値は、より具体的なリテラル型を保つ場合があります。'],
['注釈は境界と意図の表明に','関数の引数や公開するデータの形には型を明示すると、呼び出し側との約束が読みやすくなります。内部の単純な変数は推論に任せても構いません。numberは整数専用ではなく小数も含みます。bigintは別の数値型で、numberとそのまま混ぜて計算できません。'],
['ラッパー型を避ける','通常の値には小文字のstring・number・booleanを使います。Stringなどの大文字の型はオブジェクトのラッパーに関係し、普段のプリミティブ型注釈には不適切です。symbolは一意なキーにも使われます。']
],`let count = 0;             // number\nconst mode = "learn";      // "learn"\nconst user = { name: "Mio" }; // { name: string }\nuser.name = "Ren";         // オブジェクトの中身は変更可能\nconst active: boolean = true;`, 'constは変数への再代入を禁止しますが、参照先オブジェクトを凍結しません。そのためuser.nameはstringと推論され、別の文字列に変更できます。','型注釈は値の変換ではありません。"42"をnumberにするにはNumberなどの実際の変換処理と、変換結果の検証が必要です。',[
['let score = 10 のscoreの通常の推論型は？',['10','number','Number'],1,'letは再代入を想定し、数値リテラル10からnumberへ型が広がります。'],
['const item = { count: 1 } について正しいものは？',['item.countは変更できる','オブジェクトは実行時に凍結される','itemに別のオブジェクトを再代入できる'],0,'constが禁止するのは変数itemへの再代入です。プロパティの変更は禁止しません。']
],'文字列を受け取り、その長さをnumberで返すlengthOf関数を書いてください。',`function lengthOf(value: string): number {\n  return value.length;\n}`, '引数をstringとするとlengthプロパティを安全に参照できます。文字列のlengthはUTF-16コード単位数で、見た目の文字数と一致しない場合があります。');
chapter(0,'配列・タプル・読み取り専用','同じ型の集合と、位置に意味を持つデータ。',[
['配列は要素の型を指定する','string[]とArray<string>は通常同じ意味です。配列には0個以上の要素が入ります。添字でアクセスした先に値がある保証はありません。noUncheckedIndexedAccessを有効にすると、通常の配列要素の取得型にundefinedが加わり、境界を意識しやすくなります。'],
['タプルは位置ごとに型を持つ','[string, number]は1番目が文字列、2番目が数値という契約です。固定した組を表すときに便利で、名前付き要素を使うと位置の意味も伝えられます。要素数が増えて意味を覚えにくくなったら、オブジェクトで名前を付ける方が読みやすいこともあります。'],
['readonlyは型による変更制限','readonly string[]はその参照を通じたpushや代入を禁止します。readonlyは実行時の凍結ではなく、深いコピーでもありません。ネストしたオブジェクトまで自動で読み取り専用にはなりません。']
],`const tags: string[] = ["types", "practice"];\nconst point: readonly [x: number, y: number] = [3, 4];\nfunction first(items: readonly string[]): string | undefined {\n  return items[0];\n}\nconst empty = first([]); // undefined`, '読み取り専用の配列引数なら、関数が配列を書き換えない意図を伝えられます。firstは空配列も受け取るので戻り値にundefinedを含めています。','通常の配列でitems[0]が常に存在すると思い込まないこと。タプルにも可変要素や省略可能要素があり、常に固定長とは限りません。',[
['文字列と数値の順序付きの組を表す型は？',['string | number','[string, number]','string[]'],1,'タプルは要素の位置ごとに型を指定できます。Unionはどちらか一方の値です。'],
['readonly配列が保証することは？',['実行時の完全な凍結','その型の参照を通じた変更の禁止','ネストした全オブジェクトの不変性'],1,'型検査の制限です。実行時のObject.freezeや深い不変性とは別です。']
],'数値の読み取り専用配列を受け取り、合計を返すsumを書いてください。',`function sum(values: readonly number[]): number {\n  let total = 0;\n  for (const value of values) total += value;\n  return total;\n}`, '合計を0から始め、for...ofで各値を足します。sum([2, 3])は5、sum([])は0となり、入力配列を変更しません。');
chapter(0,'null・undefined・安全な値の取得','値がない可能性を型で表現し、分岐で処理する。',[
['「ない」を含めて設計する','strictNullChecksが有効なとき、nullとundefinedはstringやnumberと区別されます。検索で見つからない、まだ入力されていないなど、値がない状態は特別な失敗ではなく通常の状態として型に含めましょう。'],
['オプショナルチェーンで安全にたどる','obj?.nameはobjがnullまたはundefinedならundefinedを返します。すべてのエラーを吸収する機能ではなく、実在しないメソッドの呼び出しや他の例外まで防ぐわけではありません。ネストのどこが欠け得るかに合わせて使います。'],
['??と||を使い分ける','??は左辺がnullまたはundefinedのときだけ右辺を使います。||は0、空文字、falseなどのfalsyな値でも右辺を使います。入力された0を有効な値として残したい場合、??が適しています。']
],`function label(name: string | null | undefined): string {\n  return name?.trim() ?? "ゲスト";\n}\nlabel(null); // "ゲスト"\nlabel("");   // ""\nfunction countOrDefault(value: number | undefined): number {\n  return value ?? 10;\n}\ncountOrDefault(0); // 0`, 'trimは文字列があるときだけ実行されます。空文字はnullishではないため、ゲストには置き換わりません。空文字も無効にしたいなら明示的に条件を追加します。','非nullアサーションの!は実行時の検証をしません。user!.nameと書いても、userがundefinedなら実行時に失敗します。',[
['valueが0のとき value ?? 10 の結果は？',['10','0','undefined'],1,'??はnullとundefinedのみを代替します。0はそのまま残ります。'],
['値の後ろの!は何をする？',['実行時にnullを除去する','型検査上でnullとundefinedを除外する','必ず例外を投げる'],1,'非nullアサーションは検査器への主張であり、実行時の安全性を追加しません。']
],'string | undefinedを受け取り、undefinedのときだけ「未入力」を返す関数を書いてください。',`function display(value: string | undefined): string {\n  return value ?? "未入力";\n}`, '空文字を保持する要件なので||ではなく??を使います。');
chapter(1,'関数の型とコールバック','引数・戻り値・関数を受け取る関数の契約。',[
['関数全体にも型がある','(value: number) => stringは数値を受け取り文字列を返す関数型です。関数宣言と関数型では戻り値の書き方が異なります。配列のmapのように、関数を別の関数へ渡すときに特に役立ちます。'],
['省略可能・デフォルト・残余引数','引数に?を付けると呼び出しで省略でき、関数内ではundefinedを考慮します。デフォルト値は省略時やundefinedを渡したときに使われます。残余引数は...values: number[]のようにまとめて受け取れます。'],
['voidは戻り値を利用しない契約','戻り値がvoidのコールバック型は、呼び出し側が結果を使わないことを表します。値を返す関数をこの型へ代入できる場合がありますが、その戻り値をvoid型の参照から利用することはできません。voidとundefinedを同一視しないでください。']
],`type Formatter = (value: number) => string;\nfunction formatAll(values: number[], format: Formatter): string[] {\n  return values.map(format);\n}\nconst labels = formatAll([1, 2], n => n.toFixed(2));\n// ["1.00", "2.00"]`, 'mapに渡すnは文脈からnumberと推論されます。コールバックにも毎回注釈を書く必要はありません。','コールバックの引数を?にすると、呼び出す側がその引数を省略できる契約になります。「受け取る側が使わなくてもよい」の意味で付けないこと。',[
['数値を受け取り文字列を返す関数型は？',['(x: number) => string','number => (string)','(x: string) => number'],0,'引数リストの後の矢印で戻り値の型を指定します。'],
['デフォルト引数が使われるのは？',['nullを渡したときだけ','省略またはundefinedを渡したとき','0を渡したとき'],1,'nullや0は渡された値として扱われ、デフォルト値に置き換わりません。']
],'number配列と判定関数を受け取り、条件に合う要素だけ返すselectを書いてください。',`function select(values: number[], test: (n: number) => boolean): number[] {\n  return values.filter(test);\n}`, '判定関数の戻り値をbooleanにすることで、trueの要素を残す契約を表します。');
chapter(1,'オブジェクト・type・interface','プロパティの形と、型の共有方法を学ぶ。',[
['オブジェクトの契約を定義する','typeやinterfaceでプロパティの名前と型を定義できます。name?: stringはプロパティの省略を認めます。readonlyはその型の参照を通した再代入を禁止します。exactOptionalPropertyTypesを使うと、省略とundefinedの明示代入をより厳密に区別できます。'],
['typeとinterfaceの使いどころ','interfaceはオブジェクトの形を表し、extendsで拡張できます。同名宣言のマージも可能です。typeはUnion、タプル、条件型などにも名前を付けられます。優劣を決めるより、公開APIを拡張可能にしたいか、型演算が必要かで選びます。'],
['余分なプロパティの検査','オブジェクトリテラルを直接渡すと、意図しない余分なプロパティが検出されることがあります。一方、変数経由では構造が合えば受け取れることがあります。この仕組みは「実行時に余分なキーが存在しない」という保証ではありません。']
],`interface User {\n  readonly id: number;\n  name: string;\n  nickname?: string;\n}\nconst user: User = { id: 1, name: "Mio" };\nuser.name = "Ren";\n// user.id = 2; // 型エラー`, 'idは安定した識別子としてreadonlyにしています。nicknameを読む場合は、省略されている可能性があるためundefinedを考慮します。','readonlyは浅い制約です。プロパティが配列なら、その配列の変更も禁止したい場合はreadonly配列などが別途必要です。',[
['Union型に名前を付けられるのは？',['type','interfaceのみ','どちらも不可能'],0,'type Status = "open" | "closed" のように書けます。interfaceはUnionそのものの別名にはできません。'],
['nickname?: string を読み取るときに考える必要がある値は？',['symbol','undefined','必ずnull'],1,'省略できるプロパティなので、取得した値がundefinedの可能性があります。']
],'idがreadonly number、titleがstring、descriptionが省略可能stringのTask型を書いてください。',`interface Task {\n  readonly id: number;\n  title: string;\n  description?: string;\n}`, '省略可能な値と、変更できない識別子を別々の修飾子で表します。');
chapter(1,'Union・リテラル・Intersection','「どちらか」と「両方」を使って状態を表現する。',[
['Unionは候補の集合','string | numberは文字列または数値です。絞り込む前に使える操作は、どちらでも安全な操作だけになります。"draft" | "published"のようなリテラルUnionなら、任意の文字列ではなく決めた候補だけを許可できます。'],
['Intersectionは両方の条件を満たす','A & BはAとBの両方を満たす型です。複数のオブジェクト型を合成する用途で便利ですが、同じプロパティにstringとnumberを要求すると、そのプロパティがneverになってしまう場合があります。上書きの構文ではありません。'],
['状態を具体的な候補にする','status: stringでは誤字も通ります。status: "idle" | "loading" | "done"なら使用可能な状態が明確です。実行時のデータは別途検証が必要ですが、コード内部の状態管理は読みやすくなります。']
],`type Status = "draft" | "published";\ntype Identified = { id: string };\ntype Article = Identified & { title: string; status: Status };\nconst article: Article = {\n  id: "a1", title: "型を学ぶ", status: "draft"\n};`, 'Articleはidとtitleとstatusをすべて必要とします。statusは2つの文字列リテラルのどちらかです。','A | Bが両方のプロパティを無条件で使える型だと思わないこと。Unionの値は片方しか満たさない場合があります。',[
['"small" | "large" が許可する値は？',['任意のstring','"small"と"large"のいずれか','両方を結合した文字列のみ'],1,'リテラルUnionは値の候補を限定します。'],
['A & B の基本的な意味は？',['AかBのどちらか','AからBを削除','AとBの両方の条件を満たす'],2,'Intersectionは交差です。プロパティを上書きする演算ではありません。']
],'方向をup・down・left・rightの4つに限定するDirection型を書いてください。',`type Direction = "up" | "down" | "left" | "right";`, '文字列型全体ではなく、必要な値の集合を型で表現します。');
chapter(1,'構造的型付けと互換性','名前よりも、必要な構造があるかで判断する。',[
['同じ名前の型でなくても渡せる','TypeScriptでは通常、必要なプロパティが揃っていれば型に互換性があります。宣言した型名が違っても、id: stringを持つオブジェクトをid: stringが必要な関数に渡せます。これを構造的型付けと呼びます。'],
['代入の向きが大切','必要なプロパティより多く持つ値は受け入れられることがありますが、必要なプロパティが欠けた値は渡せません。関数型では引数と戻り値の方向も関係するため、単に「多い方が安全」とだけ覚えるのは不十分です。'],
['見かけ上の互換性と意味の違い','UserIdもOrderIdもstringの別名だけなら区別されません。取り違えを防ぎたい場合は、オブジェクトに種類を付ける、あるいはブランド型を使う設計が考えられます。クラスのprivate・protectedには通常の公開プロパティとは違う互換性の制約があります。']
],`type HasId = { id: string };\nfunction showId(value: HasId): string { return value.id; }\nconst full = { id: "u1", name: "Mio" };\nshowId(full); // OK\n// showId({ name: "Mio" }); // idがない`, 'fullは余分なnameを持ちますが、必要なidの型を満たします。直接のオブジェクトリテラルでは余剰プロパティ検査が別途働く点は「オブジェクト・type・interface」を参照してください。','type UserId = stringとしても名目的な別の型にはなりません。読みやすい別名と、取り違え防止の制約は分けて考えます。',[
['構造的型付けで主に確認するのは？',['型名の一致だけ','必要なメンバーの構造','ファイル名の一致'],1,'互換性は通常、必要なプロパティや呼び出しシグネチャの構造から判定されます。'],
['type UserId = string と type OrderId = string は？',['通常は相互に代入できる','必ず別の型として拒否される','実行時のクラスを作る'],0,'どちらもstringの別名であり、意味の違いは型検査器に追加されていません。']
],'name: stringだけを必要とするgreetを定義し、idも持つ変数を渡してください。',`function greet(user: { name: string }): string {\n  return "こんにちは、" + user.name;\n}\nconst user = { id: 1, name: "Mio" };\ngreet(user);`, '関数は使う情報だけを要求すると再利用しやすくなります。');
chapter(2,'型の絞り込みと型ガード','条件分岐で、値の候補を少しずつ減らす。',[
['実行時の条件が型に伝わる','typeof、instanceof、in、等値比較などで条件分岐すると、TypeScriptは制御フローを追って型を狭めます。文字列か数値かわからない値でも、typeof value === "string"の中では文字列操作ができます。'],
['truthinessの落とし穴','if (value)はnullやundefinedだけでなく、0や空文字も除外します。値が存在するかだけを確認したいなら、value !== undefinedやvalue != nullなど、意図が正確に伝わる条件を使います。typeof nullは"object"である点にも注意しましょう。'],
['型述語は検証を約束する','function isUser(x: unknown): x is Userは、trueならUserと見なせるという宣言です。その実装が正しいことをTypeScriptが完全に証明するわけではありません。返り値の条件と型の定義を一致させ、必要なプロパティを実際に確認します。']
],`function normalize(value: string | number): string {\n  if (typeof value === "string") {\n    return value.trim();\n  }\n  return value.toFixed(0);\n}`, 'ifの中でstring、早期return後ではnumberだけが残ります。asで押し切らなくても、条件が型の安全性を伝えます。','独自の型ガードが常にtrueを返しても、型述語の宣言により誤った絞り込みが起き得ます。型ガードの実装こそ入力検証の責任を持ちます。',[
['typeof null の結果は？',['"null"','"object"','"undefined"'],1,'JavaScriptの歴史的な挙動です。オブジェクト判定時にはnullを別に除外します。'],
['number | undefinedに対するif (value)で除外されるものは？',['undefinedだけ','undefinedと0（NaNもfalsy）','number全体'],1,'truthiness判定は有効な0も落とすため、存在確認との違いに注意します。']
],'string | numberを受け取り、文字列なら大文字化、数値なら文字列化して返してください。',`function display(value: string | number): string {\n  if (typeof value === "string") return value.toUpperCase();\n  return String(value);\n}`, '分岐によって文字列操作ができることを検査器に示します。');
chapter(2,'判別可能Unionと網羅性','状態ごとに必要なデータを揃え、不可能な組をなくす。',[
['共通のタグで候補を区別する','kindやstatusのような共通プロパティをリテラル型にすると、判別可能Unionを作れます。成功時はdata、失敗時はerrorを必要とする形にすれば、成功なのにdataがない状態をコード内で作りにくくなります。'],
['分岐すると必要なデータが現れる','status === "success"と比較した分岐では、そのメンバーにあるdataだけを安全に使えます。複数のbooleanと省略可能な値で表現するより、状態とデータの関係を型に持たせられます。'],
['neverで分岐漏れを検出する','全候補を処理した後の値はneverになります。引数にneverを要求する関数を置くと、新しい状態を追加した際に未処理の分岐が型エラーになります。実行時の未知の値も考慮して、関数は例外を投げるなどの処理にします。']
],`type Result =\n  | { status: "success"; data: string }\n  | { status: "error"; message: string };\nfunction render(result: Result): string {\n  switch (result.status) {\n    case "success": return result.data;\n    case "error": return result.message;\n    default: return assertNever(result);\n  }\n}\nfunction assertNever(value: never): never {\n  throw new Error("未対応の状態: " + JSON.stringify(value));\n}`, 'Resultに新しいstatusを足すと、defaultでresultがneverでなくなり、分岐漏れを発見できます。','すべてのプロパティを?にしてstatusだけ追加しても、状態とデータの依存関係は表現できません。候補ごとのオブジェクト型に分けます。',[
['判別可能Unionのタグに適しているのは？',['各候補で異なるリテラル値','全候補で任意のstring','any'],0,'共通のプロパティが候補ごとに異なるリテラル型であると、比較で絞り込めます。'],
['網羅性チェックで使う型は？',['unknown','never','object'],1,'全候補を処理した後に残る値がないことをneverで確認します。']
],'通信状態をidle、loading、success（data: number）の3種類で表してください。',`type State =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "success"; data: number };`, '成功時にだけdataが必要になります。loadingとdataの矛盾した組を同じ型にまとめずに済みます。');
chapter(2,'any・unknown・never','未知の値、検査の回避、存在しない値を区別する。',[
['anyは型検査を回避する','anyはほぼ任意の操作を許し、その結果にもanyを広げます。一時的な移行には便利でも、入力から処理の奥まで伝播すると型の恩恵が失われます。必要な場合は境界を小さくし、理由を残しましょう。'],
['unknownは使う前に確認する','unknownには任意の値を入れられますが、プロパティアクセスや呼び出しには絞り込みが必要です。外部入力やcatchした値など、「まだ正体がわからない値」に向いています。型がわからないことを明示し、安全な操作へ導きます。'],
['neverは値が存在しない型','常に例外を投げる関数や、処理済みで候補がなくなった場所などでneverが現れます。unknownは候補があらゆる値、neverは候補がない状態です。Unionの中のneverは通常消え、型のフィルタリングにも使えます。']
],`function message(error: unknown): string {\n  if (error instanceof Error) return error.message;\n  if (typeof error === "string") return error;\n  return "不明なエラー";\n}\nfunction fail(text: string): never {\n  throw new Error(text);\n}`, 'unknownに対していきなりerror.messageとは書かず、Errorのインスタンスであることを調べます。failは正常な値を返さない関数です。','unknownをas SomeTypeで即座に断定すると、せっかく設けた検証の境界を飛び越えてしまいます。まず実際の値を検査します。',[
['外部から来た未検証の値に適した型は？',['any','unknown','never'],1,'unknownなら、操作前に検証する必要があることを型検査で保てます。'],
['string | never は通常どの型になる？',['string','never','unknown'],0,'neverは値を持たないため、Unionに候補を追加しません。']
],'unknownを受け取り、numberなら2倍、それ以外ならundefinedを返す関数を書いてください。',`function double(value: unknown): number | undefined {\n  return typeof value === "number" ? value * 2 : undefined;\n}`, 'typeofでnumberに絞り込みます。有限数に限定したい用途ではNumber.isFiniteの検査も追加します。');
chapter(2,'as・as const・satisfies','型の断定、リテラルの保持、形の確認を使い分ける。',[
['asは検証も変換もしない','value as Userは、検査器にUserとして扱うよう伝える型アサーションです。値がUserであると確認する実行時処理は追加されません。二重アサーションで無理に通すより、正しい絞り込みや入力検証で前提を示しましょう。'],
['as constで具体的な情報を保つ','オブジェクトや配列リテラルにas constを使うと、文字列などのリテラルを広げずに保持し、オブジェクトのプロパティをreadonly、配列をreadonlyタプルとして扱います。外部参照まで再帰的に実行時凍結する機能ではありません。'],
['satisfiesで契約に合うか確認する','satisfiesは式が目的の型に適合するか確認しつつ、変数をその型の注釈だけで広くしてしまうことを避けられます。ただし文脈による型付けは推論に影響するので「推論を一切変えない」とは考えないでください。設定オブジェクトに便利です。']
],`const routes = {\n  home: "/",\n  about: "/about"\n} as const satisfies { home: string; about: string };\ntype Home = typeof routes.home; // "/"\n// routes.home = "/new"; // readonlyなのでエラー`, 'as constでパスの具体的な文字列を残し、satisfiesで各値がstringであることを検査しています。','JSON.parse(text) as Userだけでは入力検証になりません。型の主張をデータの安全性と混同しないことが重要です。',[
['as Userが追加するのは？',['実行時のスキーマ検証','型検査上の主張','JSONからの自動変換'],1,'asは実行時のコードを追加せず、値を変換しません。'],
['as constを配列リテラルに付けると通常どうなる？',['any[]になる','readonlyタプルとして扱われる','Object.freezeが呼ばれる'],1,'型のレベルで要素のリテラルと読み取り専用の位置情報を保持します。']
],'GETとPOSTをこの順で含むreadonlyタプルを、as constを使って定義してください。',`const methods = ["GET", "POST"] as const;`, 'as constで各要素のリテラルを保持します。methods[0]への再代入が型エラーになることも確かめましょう。');
chapter(3,'ジェネリクスの基本','入力と出力の型の関係を保って再利用する。',[
['型を引数として受け取る','ジェネリクスはTのような型パラメーターを使って、複数の型に対応する関数や型を定義します。単に「何でも受け取る」のではなく、受け取った型と返す型、複数の引数間の関係を保つための仕組みです。'],
['anyとの違いは関係を残すこと','anyを受け取りanyを返すと、何を渡したかの情報が失われます。Tを受け取りTを返すなら、文字列を渡した結果は文字列の型を保てます。多くの場合、型引数は実際の引数から推論されます。'],
['制約なしではTの中身はわからない','Tは必ずstringではないため、制約なしにtoUpperCaseを呼べません。ジェネリック関数の本体は、許可するすべての型に対して安全である必要があります。特定の操作が必要なら次章のextends制約を使います。']
],`function identity<T>(value: T): T {\n  return value;\n}\nconst a = identity("hello");\nconst b = identity({ id: 1 });\ntype Box<T> = { value: T };\nconst box: Box<number> = { value: 42 };`, 'Tには呼び出しごとに異なる型が入り、戻り値に引き継がれます。Boxは型を受け取り、値を包むオブジェクト型を作っています。','型パラメーターが1か所にしか登場しない場合は、ジェネリクスが本当に必要か検討しましょう。不要な複雑さは利用側にも伝わります。',[
['ジェネリクスで保ちたいものは？',['入力と出力などの型の関係','すべての値をanyにすること','実行時の型名'],0,'Tで同じ型を参照し、呼び出しごとの関係を表現します。'],
['制約のないTでvalue.lengthを使える？',['常に使える','Tがlengthを持つとは限らないので使えない','実行時に自動追加される'],1,'numberなどlengthのない値も渡せるため、安全な操作ではありません。']
],'T型の値を受け取り、{ value: T }で包むwrapを書いてください。',`function wrap<T>(value: T): { value: T } {\n  return { value };\n}`, '入力とプロパティの型をTで結び付けます。');
chapter(3,'制約・keyof・typeof・Indexed Access','既存の型や値から、必要な情報を取り出す。',[
['extendsで必要条件を伝える','T extends { length: number }は、Tが少なくともnumber型のlengthを持つことを要求します。Tが制約型そのものと同じという意味ではなく、より多くの情報を持った型を渡すこともできます。'],
['keyofとIndexed Access','keyof Tはキーの型を得ます。T[K]はKで指定したプロパティの型です。K extends keyof Tと組み合わせると、存在するキーだけを受け取り、そのキーに対応する値の型を返す関数を作れます。インデックスシグネチャがある型ではキーがstringやnumberなどに広がります。'],
['型の文脈で使うtypeof','type Config = typeof configは変数configの型を取り出します。実行時のtypeofが"string"などを返すのとは別です。配列型に[number]を適用すると要素型、タプルなら要素型のUnionが得られます。']
],`function get<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { id: 1, name: "Mio" };\nconst displayName = get(user, "name"); // string\n// get(user, "age"); // 存在しないキー`, 'Tがオブジェクト全体、Kが指定したキーを保持するので、戻り値は単にstring | numberではなく選んだプロパティに対応します。','keyof Tは常にstringだけとは限りません。numberやsymbolのキーもあり得ます。文字列演算に使う場合は適切に制約します。',[
['Tのキーに対応する型を得る演算子は？',['keyof T','typeof T()','T.keys'],0,'keyofは型からキーの型を作ります。'],
['type U = { id: number }; U["id"] は？',['"id"','number','U'],1,'Indexed Accessは指定プロパティの値の型を取り出します。']
],'配列の要素型を取り出すElementOf<T extends readonly unknown[]>を定義してください。',`type ElementOf<T extends readonly unknown[]> = T[number];\ntype N = ElementOf<number[]>; // number`, 'readonly配列の制約は、通常の配列とreadonlyタプルの両方を受け取れます。');
chapter(3,'Mapped TypesとUtility Types','既存の型を加工して、重複を減らす。',[
['キーを走査して型を作る','Mapped Typeは[K in keyof T]のようにキーを順番に扱い、新しいオブジェクト型を作ります。実行時のループではありません。?やreadonlyを付けたり、-?や-readonlyで修飾子を取り除いたりできます。'],
['標準のUtility Typesを使う','Partialは全プロパティを省略可能、Requiredは必須、Readonlyは読み取り専用にします。Pickは選んだキーだけを残し、Omitは選んだキーを除きます。Record<K, V>はキーKに対し値Vを持つ形を定義します。いずれも実行時のデータを加工しません。'],
['変換は通常、浅い','Partial<User>でもネストしたaddressの内部は自動でPartialになりません。深い変換が必要ならデータの構造と例外を決める必要があります。更新APIでは「省略は変更なし」「nullは削除」など、意味を型だけでなく仕様として決めます。']
],`type User = { id: string; name: string; age: number };\ntype UpdateUser = Partial<Pick<User, "name" | "age">>;\ntype Flags<T> = { [K in keyof T]: boolean };\ntype UserFlags = Flags<User>;\nconst patch: UpdateUser = { name: "Ren" };`, '更新を許可するnameとageだけを選び、それぞれを省略可能にしています。idの変更を型の段階で制限できます。','Omitで型からpasswordを消しても、実際のオブジェクトからpasswordは消えません。外部に送るデータの削除は実行時に行います。',[
['Pick<T, K>は何をする？',['指定したキーだけを型に残す','実行時にプロパティを削除','全プロパティを省略可能にする'],0,'Pickは型の変換です。実際のオブジェクトを変更しません。'],
['Partial<T>は通常どこまで作用する？',['ネストの最深部まで','Tの直下のプロパティ','配列要素だけ'],1,'標準のPartialは浅い変換で、ネストした型を再帰的には変えません。']
],'nameとemailを持つUserから、emailだけを更新対象とするPatch型を作ってください。emailも省略可能とし、nameは含めません。',`type User = { name: string; email: string };\ntype Patch = Partial<Pick<User, "email">>;`, 'まず許可するキーを絞り、それを省略可能にします。');
chapter(3,'条件型・infer・分配','型を条件で分け、構造から一部分を推論する。',[
['型の条件分岐','T extends U ? X : Yは、TがUに代入可能かによって型を選びます。値のif文ではありません。APIの戻り値など、入力の型に応じて結果の型を変えたい場面で使えます。'],
['inferで一部の型を取り出す','条件型のextends側でinfer Rと書くと、パターンに対応する型を推論できます。{ value: infer R }ならvalueプロパティの型を取り出せます。入力の構造と型の関係を保つための道具です。非同期処理を学んだ後は、Promiseの結果を取り出すAwaitedも調べてみましょう。'],
['Unionへの分配を理解する','チェック側が裸の型パラメーターTの条件型は、Unionの各候補に分配されます。Tを[T]のように包むと全体を一度に比較できます。ExcludeやExtractはこの仕組みを利用した型の選別です。']
],`type ToArray<T> = T extends unknown ? T[] : never;\ntype A = ToArray<string | number>; // string[] | number[]\ntype Together<T> = [T] extends [unknown] ? T[] : never;\ntype B = Together<string | number>; // (string | number)[]\ntype Unwrap<T> = T extends { value: infer R } ? R : T;`, 'Aは文字列だけの配列または数値だけの配列です。Bは同じ配列の中に文字列と数値を混在できます。分配の有無で契約が変わります。','条件型を使うほど設計が優れるわけではありません。エラーが読みにくくなる場合は、具体的な型やオーバーロードで表すことも検討します。',[
['inferを主に使う場所は？',['条件型のextends側','通常のif文','tsconfigのinclude'],0,'型の構造を照合するパターン内で、一部を推論するために使います。'],
['条件型の分配を抑える代表的な方法は？',['比較する型を[T]のように包む','anyに変える','型名を大文字にする'],0,'裸の型パラメーターでなくすることで、Union全体を比較できます。']
],'valueプロパティを持つ型ならそのプロパティ型、それ以外なら元の型を返すUnwrap<T>を書いてください。',`type Unwrap<T> = T extends { value: infer U } ? U : T;`, 'これは1段階だけの展開です。Unwrap<{ value: number }>はnumber、Unwrap<string>はstringになります。');
chapter(3,'テンプレートリテラル型とキーの変換','文字列の規則を型で組み立てる。',[
['文字列リテラルを合成する','テンプレートリテラル型はバッククォートと${...}を使い、既存のリテラルから新しい文字列型を作ります。Unionを埋め込むと組み合わせの集合になります。イベント名や設定キーの規則を表現できます。'],
['キーをasで変換する','Mapped Typeのas節で、元のキーから新しいキーに変換できます。Capitalizeなどの組み込み文字列操作型を組み合わせると、nameからgetNameのような規則的なAPIの型を作れます。'],
['型の複雑さを管理する','候補が多いUnion同士の組み合わせは急増し、型検査が重くなる場合があります。任意のユーザー入力まで巨大なUnionで表すより、実行時の検証と適度に抽象化した型を組み合わせましょう。']
], 'type Entity = "user" | "post";\ntype EntityEvent = `${Entity}:created`; // "user:created" | "post:created"\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]\n};\ntype G = Getters<{ name: string }>; // { getName: () => string }', 'string & Kで文字列キーを対象にし、先頭を大文字化してgetを付けています。実際のgetName関数が自動生成されるわけではありません。','テンプレートリテラル型は正規表現エンジンではありません。型が合うと主張するだけでは、外部から来た文字列の内容を検証できません。',[
['型の中の`${"a" | "b"}_id`は？',['"a_id" | "b_id"','string[]','実行時の文字列生成'],0,'Unionの各候補と文字列を組み合わせて、リテラルUnionを作ります。'],
['Mapped Typeのキー変換で使うキーワードは？',['as','new','await'],0,'[K in keyof T as 新しいキー]という形式で変換します。']
],'"open" | "close"から"onOpen" | "onClose"を作る型を書いてください。','type Action = "open" | "close";\ntype Handler = `on${Capitalize<Action>}`;', 'Capitalizeは各文字列リテラルの先頭を大文字にします。実行時の変換は別途必要です。');
chapter(4,'Promise・async / await','非同期の結果と、失敗の経路を扱う。',[
['Promiseは将来の結果を表す','Promise<T>は、成功したときTの値を得られる非同期処理を表します。処理の開始を遅らせる箱ではありません。通常、Promiseを作る処理や非同期関数を呼ぶと、その処理が始まります。失敗する可能性はPromise<T>のTには含まれません。'],
['async関数はPromiseを返す','asyncを付けた関数は、returnで数値を返していても呼び出し側にはPromise<number>を返します。awaitはその非同期関数の続きの実行を待ちますが、JavaScript全体の処理を同期的に停止させるわけではありません。'],
['並列に待つときの判断','独立した処理はPromise.allでまとめて待てます。1つがrejectすると全体がrejectしますが、他の処理が自動で中止されるわけではありません。すべての成功・失敗を集めるならPromise.allSettled、通信を中止したいなら対応するAPIのAbortSignalなどを使います。']
],`async function doubleLater(value: number): Promise<number> {\n  return value * 2;\n}\nasync function run(): Promise<void> {\n  try {\n    const [a, b] = await Promise.all([doubleLater(2), doubleLater(3)]);\n    console.log(a + b); // 10\n  } catch (error: unknown) {\n    console.error(error);\n  }\n}`, 'await後のaとbはnumberです。例では独立した2つの処理を開始してからまとめて待ちます。実際に失敗し得る処理ではcatchや呼び出し側での処理が必要です。','forEach(async () => ...)は中のPromiseを待ちません。順番に待つならfor...of、まとめて待つならmapとPromise.allを使います。',[
['async関数がreturn 1すると、呼び出し結果の型は？',['number','Promise<number>','void'],1,'async関数は返した値をPromiseの結果として扱います。'],
['Promise.allが1つの失敗でrejectしたら、他の処理は？',['自動で必ず中止される','自動では中止されない','成功に変換される'],1,'待機の結果と処理のキャンセルは別です。']
],'数値配列を非同期関数doubleLaterに渡し、結果をまとめて返すdoubleAllを書いてください。',`async function doubleAll(values: number[]): Promise<number[]> {\n  return Promise.all(values.map(doubleLater));\n}`, 'mapでPromiseの配列を作り、Promise.allで結果の配列を待ちます。大量の外部通信では同時実行数も制限します。');
chapter(4,'APIと実行時の入力検証','外から届くデータを、信用する前に確かめる。',[
['外部データは型を持って届かない','API、フォーム、localStorage、ファイルから得た値は、期待した形とは限りません。TypeScriptの型は実行時に消えるため、レスポンスに型を付けただけでは検証になりません。まずunknownとして扱い、必要な条件を調べます。'],
['構造と業務ルールを確認する','オブジェクトか、nullでないか、プロパティが正しい型かを調べます。さらに年齢は非負、IDは空でないなどの業務ルールも必要です。検証に通った値だけを内部の型として扱うと、安全性の境界が明確になります。複雑な形はスキーマ検証ライブラリの採用も検討します。'],
['HTTPの成功とデータの正しさは別','fetchは404や500だけでは通常rejectしないためresponse.okを確認します。その後JSONの構文解析に成功しても、形の検証が必要です。ネットワーク・HTTP・構文・スキーマの失敗を区別して扱うと、調査しやすくなります。']
],`type User = { id: number; name: string };\nfunction isUser(value: unknown): value is User {\n  return typeof value === "object" && value !== null\n    && "id" in value && typeof value.id === "number"\n    && Number.isFinite(value.id)\n    && "name" in value && typeof value.name === "string";\n}\nasync function loadUser(url: string): Promise<User> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error("HTTP " + response.status);\n  const data: unknown = await response.json();\n  if (!isUser(data)) throw new Error("ユーザー形式が不正です");\n  return data;\n}`, 'isUserは必要なプロパティを実際に検証します。追加のプロパティは許可しています。厳密に禁止したい場合はキーの検査も必要です。','fetch<User>(url)という標準fetch APIはありません。型パラメーターを受け取る独自のラッパーでも、検証処理があるか確認してください。',[
['JSON.parse(text) as Userは入力検証になる？',['なる','ならない','strictなら必ずなる'],1,'asは実行時の処理を追加しません。解析した値の構造を確認する必要があります。'],
['HTTP 404を受け取った標準fetchは通常？',['その理由だけではrejectしない','必ずrejectする','User型へ変換する'],0,'response.okやstatusを確認してHTTPエラーを扱います。']
],'unknownがstring配列か確認するisStringArray型ガードを書いてください。',`function isStringArray(value: unknown): value is string[] {\n  return Array.isArray(value) && value.every(x => typeof x === "string");\n}`, '配列であることと各要素の型を検証します。空配列は条件を満たします。疎な配列の穴はeveryが訪問しないため、JSON以外の配列で密な配列を要求する用途では別途検査します。');
chapter(4,'モジュールと型のimport','値の依存と、型だけの依存を分ける。',[
['ファイルをモジュールとして分割する','トップレベルにimportまたはexportを持つファイルは通常モジュールとして扱われ、その宣言はファイルに閉じたスコープになります。必要な値や型をexportし、利用側でimportします。moduleDetectionなどの設定によって判定は変わります。'],
['import typeは実行時に残らない','型だけに使うものはimport typeで読み込めます。型の依存関係を明示し、実行時のimportとは区別できます。副作用のためのimportは別に必要です。クラスのように型と実行時の値の両方を持つものは、使い方に応じて読み込みます。'],
['実行環境と解決規則を揃える','Node.js、ブラウザー、バンドラーではimportを探す規則が異なります。拡張子、package.jsonのtype、exportsなども影響します。型検査だけ通るのに実行時に見つからない場合は、実際の実行環境とmodule・moduleResolutionの対応を確認します。']
],`// user.ts\nexport interface User { id: number; name: string }\nexport function display(user: User): string { return user.name; }\n\n// main.ts（Node ESMで.jsとして出力して使う例）\nimport { display } from "./user.js";\nimport type { User } from "./user.js";\nconst user: User = { id: 1, name: "Mio" };\nconsole.log(display(user));`, 'displayは実行時に必要な関数、Userは型検査だけに必要な型です。.js指定はNode ESMの出力を想定しています。バンドラーなど別環境では設定に合わせます。','pathsは基本的に型検査時の解決を助ける設定であり、出力されたimport文字列を自動で書き換えません。実行側の対応も必要です。',[
['import typeで読み込んだものは？',['実行時の値として必ず使える','型の用途に限定され、通常出力から消える','HTTPで自動取得される'],1,'型専用のimportなので実行時の副作用にも使えません。'],
['pathsを指定するとimportの文字列は必ず書き換わる？',['はい','いいえ','strict時だけ書き換わる'],1,'実行側やバンドラーで同じ対応が必要です。']
],'types.tsからTaskを型として読み込む構文を書いてください。Node ESMで.jsへ出力する構成とします。',`import type { Task } from "./types.js";`, '実行環境に合わせた拡張子を使い、型専用であることを明示します。');
chapter(4,'クラス・アクセス制御・継承','オブジェクトの生成と、型としてのクラス。',[
['クラスには値と型の側面がある','classは実行時にインスタンスを作る構文であり、TypeScriptではインスタンスの型にもなります。constructorでプロパティを初期化し、メソッドで振る舞いを定義します。implementsは契約の実装を検査しますが、メソッドの中身や引数型を自動生成しません。'],
['privateと#privateは別','TypeScriptのprivateは主に型検査によるアクセス制限です。JavaScriptの#フィールドは実行時にもプライベートの仕組みを持ちます。protectedはクラスと派生クラスで利用できます。公開APIと内部状態を分けて設計しましょう。'],
['継承と合成を選ぶ','extendsで振る舞いを継承できますが、共通化のために必ず継承する必要はありません。別のオブジェクトを持って仕事を任せる合成の方が、依存を減らしテストしやすい場合があります。overrideは上書きの意図を明示し、noImplicitOverrideでチェックできます。']
],`interface CounterLike { increment(): number }\nclass Counter implements CounterLike {\n  #value = 0;\n  increment(): number {\n    this.#value += 1;\n    return this.#value;\n  }\n}\nconst counter = new Counter();\ncounter.increment(); // 1`, '#valueはクラスの外から直接使えない内部状態です。対応するtargetと実行環境で利用します。','implementsは型の形をチェックするだけで、実行時の入力検証や既定の実装を提供する仕組みではありません。',[
['implementsが行うのは？',['宣言した契約との適合チェック','全メソッドの自動実装','実行時のJSON検証'],0,'契約に必要なメンバーがあるかを型検査します。'],
['実行時にもプライベートなフィールド構文は？',['#value','private valueだけ','readonly value'],0,'#フィールドはJavaScriptの実行時のプライベート機構です。']
],'nameをconstructorで受け取り、挨拶を返すgreetメソッドを持つPersonを書いてください。',`class Person {\n  constructor(public readonly name: string) {}\n  greet(): string { return "こんにちは、" + this.name; }\n}`, 'パラメータープロパティで宣言と代入をまとめています。この構文は変換を必要とし、型の除去だけを行う実行系では制限されることがあります。');
chapter(4,'DOM・イベント・フォーム','画面の要素があるか、正しい種類かを確かめる。',[
['DOM取得には見つからない場合がある','querySelectorやgetElementByIdは要素がない場合にnullを返します。HTML側の変更や呼び出す時点の違いで存在しない可能性があるため、nullを処理しましょう。取得した要素にvalueがあるかは、要素の種類にも依存します。'],
['instanceofで要素の種類を確認する','HTMLInputElementなどの実行時のクラスで判定すると、その要素に固有のプロパティを安全に使えます。querySelector<HTMLInputElement>は便利ですが、セレクター先が本当にinputかを実行時に保証するわけではありません。'],
['イベントのtargetと入力値','event.targetはクリック元の子要素になることがあり、常にボタンとは限りません。currentTargetとの違いを理解します。フォームの値は通常文字列なので、数値に変換してからNaNや範囲を確認する必要があります。']
],`const input = document.querySelector("#age");\nif (input instanceof HTMLInputElement) {\n  input.addEventListener("input", () => {\n    const age = input.valueAsNumber;\n    if (Number.isFinite(age) && age >= 0) {\n      console.log(age);\n    }\n  });\n}`, 'inputが本当にHTMLInputElementかを確認しています。valueAsNumberは適切なinput種別で使い、空欄や不正な値によるNaNも確認します。','as HTMLInputElementや!でnullや種類の違いを隠しても、HTMLが変われば実行時に失敗します。',[
['querySelectorが要素を見つけないときは？',['undefined','null','空のHTMLElement'],1,'DOM APIではnullが返るため、その可能性を扱います。'],
['イベントのtargetは必ずリスナーを付けた要素？',['はい','いいえ、子要素などの場合がある','常にdocument'],1,'イベントが発生した元と、リスナーの要素は異なることがあります。']
],'#nameを取得し、input要素なら現在のvalueをログに出してください。',`const element = document.querySelector("#name");\nif (element instanceof HTMLInputElement) {\n  console.log(element.value);\n}`, 'nullチェックと種類の確認をinstanceofでまとめて行います。');
chapter(4,'エラー設計とResult型','失敗を例外にするか、戻り値にするかを決める。',[
['例外も正常な失敗も設計する','通信が失敗する、入力が不正、レコードが見つからないなど、失敗には種類があります。呼び出し側で必ず扱ってほしい結果をUnionにすると、分岐を型で促せます。一方、続行できない不変条件の破綻などには例外が適することもあります。'],
['Resultで成功と失敗を表す','{ ok: true; value: T } | { ok: false; error: E }は典型的なResult型です。成功と失敗で必要な情報が異なることを表現し、okを調べると対応する値へ絞り込めます。エラーをただの文字列でなく種類付きの型にすることもできます。'],
['失敗を隠さず伝える','catchで何もせずundefinedを返すと、原因が失われます。復旧する、利用者向けに変換する、ログを記録して再スローするなど、その層の責任を決めましょう。Result型でも関数が絶対にthrowしないことをTypeScriptが保証するわけではありません。']
],`type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };\nfunction parseAge(text: string): Result<number, string> {\n  if (text.trim() === "") return { ok: false, error: "未入力" };\n  const age = Number(text);\n  if (!Number.isInteger(age) || age < 0) {\n    return { ok: false, error: "0以上の整数を入力してください" };\n  }\n  return { ok: true, value: age };\n}`, 'Number("")は0になるので、先に空入力を検査しています。整数かつ非負という業務上の条件も型検査とは別に確認します。','Promise<Result<T, E>>にしても、ネットワークや実装ミスの例外まで自動でResultに変換されません。境界での処理が必要です。',[
['Result型の主な利点は？',['成功と失敗に必要な情報を分けて表現する','throwを言語として禁止する','型検査を省略する'],0,'判別可能Unionを使って結果に応じた処理を促せます。'],
['Number("")の結果は？',['NaN','0','例外'],1,'入力検証では空文字を別途処理しないと0として受け入れてしまいます。']
],'Result<number, string>を受け取り、成功なら値を文字列化、失敗ならerrorを返す関数を書いてください。',`function describe(result: Result<number, string>): string {\n  return result.ok ? String(result.value) : result.error;\n}`, 'okが判別キーとして働き、対応するプロパティだけを参照できます。');
chapter(5,'tsconfigとモジュール解決','型検査・出力・実行環境の設定を区別する。',[
['targetとlibの役割','targetは主に出力するJavaScript構文の基準です。libは利用可能と見なす組み込みAPIの型宣言を選びます。libに新しいAPIを含めても、実行環境へpolyfillが自動追加されるわけではありません。必要なAPIが本当に存在するか確認します。'],
['moduleとmoduleResolution','moduleはモジュールの扱い・出力方式などに影響し、moduleResolutionはimport先をどう探すかを制御します。バンドラー用とNode.js用の設定を混ぜないことが重要です。Nodeの方式はpackage.jsonやファイル拡張子と連動します。'],
['厳密さを追加する','strictに加え、noUncheckedIndexedAccessで添字取得の欠損を、exactOptionalPropertyTypesで省略と明示undefinedの差を意識できます。skipLibCheckは宣言ファイル間の問題を隠す可能性があります。更新時はリリースノートと公式設定リファレンスを確認します。']
],`// バンドラーが変換・解決を担当する例\n{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "strict": true,\n    "noEmit": true,\n    "noUncheckedIndexedAccess": true,\n    "exactOptionalPropertyTypes": true\n  }\n}`, 'これはバンドラー向けの例で、Node.js直接実行の万能設定ではありません。対応するバンドラー側の設定と合わせて使います。','targetやlibを上げただけでは古いブラウザーに新しいAPIは追加されません。構文変換と実行時機能の補完は別です。',[
['libに新しいAPIを含めると実行環境にも追加される？',['自動で追加される','型宣言が使えるだけで自動追加されない','strict時だけ追加される'],1,'実行環境やpolyfillは別途用意する必要があります。'],
['noUncheckedIndexedAccessの主な目的は？',['添字アクセスで値がない可能性を型に反映する','配列を凍結する','importを高速化する'],0,'通常の配列やインデックスシグネチャによる取得にundefinedの可能性を加えます。']
],'辞書からキーで値を取得した後、値がないときだけ0を返す関数を書いてください。',`function lookup(values: Record<string, number>, key: string): number {\n  return values[key] ?? 0;\n}`, 'noUncheckedIndexedAccess有効時はvalues[key]がnumber | undefinedとなり、??で欠損を扱えます。');
chapter(5,'型宣言・.d.ts・宣言のマージ','ライブラリの実装と、利用者へ見せる型の境界。',[
['.d.tsは実装の説明書','宣言ファイルはJavaScriptの値やモジュールにどんな型があるかを記述します。通常は実行コードを含まず、既存の実装に対する契約です。declareと書いても、その値が実行時に作られるわけではありません。'],
['依存パッケージの型を探す','ライブラリが型を同梱していれば、その型を使います。同梱していない場合は対応する@typesパッケージがあることがあります。実装と型のバージョンがずれると、実行時に存在しないAPIが型上では使えるように見える場合があります。'],
['宣言のマージと拡張','同名のinterfaceなどは一定のルールで宣言をマージできます。module augmentationで既存モジュールを拡張する場合、型だけでなく対応する実行時の機能が本当にあることを確認します。グローバル拡張は影響が広いため、小さな範囲で管理します。']
],`// math.d.ts: math.jsの実装に対応する宣言\nexport declare function add(a: number, b: number): number;\n\n// 同一スコープでのinterfaceマージ\ninterface Settings { theme: string }\ninterface Settings { language: string }\nconst settings: Settings = { theme: "dark", language: "ja" };`, '2つのSettings宣言が合わさり、themeとlanguageの両方が必要になります。addの実装は別途JavaScriptに必要です。','declare const api: Apiと宣言しただけでapiを呼び出すと、実物がなければReferenceErrorになります。宣言は存在の主張です。',[
['declareが行うのは？',['実行時に値を作る','既存の値などの型を宣言する','自動でAPIを呼び出す'],1,'型宣言だけなので、実際の実装や値の用意は別途必要です。'],
['同名interfaceの宣言は条件が合うと？',['マージされる','常に後ろが上書きする','必ずanyになる'],0,'同じプロパティの矛盾などには制約がありますが、宣言を合成できます。']
],'文字列を受け取りPromise<number>を返す既存関数countを.d.tsで宣言してください。',`export declare function count(text: string): Promise<number>;`, '関数の型のみを公開し、関数本体は書きません。');
chapter(5,'オーバーロードと高度な関数型','入力に応じた戻り値と、呼び出し契約の設計。',[
['複数の呼び出し形を宣言する','オーバーロードは1つの関数に複数の呼び出しシグネチャを与えます。実装はそれらを処理できる必要があります。呼び出し側から見えるのはオーバーロードの宣言であり、広い実装シグネチャがそのまま呼べるわけではありません。'],
['Unionで済むなら簡潔にする','引数の違いが戻り値の型に影響しないなら、Unionで1つのシグネチャにした方が単純です。入力と出力の関係が重要な場合にオーバーロードを使います。関数型にはthis引数、呼び出しシグネチャ、newシグネチャを表す方法もあります。'],
['可変長タプルで関係を表す','タプルのrest要素やジェネリックなスプレッドにより、引数列の関係を保つことができます。高度な関数合成に便利ですが、推論結果とエラーメッセージを確認し、公開APIを複雑にしすぎないことが大切です。']
],`function convert(value: string): number;\nfunction convert(value: number): string;\nfunction convert(value: string | number): string | number {\n  return typeof value === "string" ? Number(value) : String(value);\n}\nconst n = convert("12"); // number\nconst s = convert(12);   // string`, '呼び出し側は入力の型に対応した戻り値を得られます。数値変換のNaNなど実行時の条件はこの型だけでは保証されません。','string | number型の変数をそのままこのconvertへ渡すと、どちらのオーバーロードにも一致せずエラーになります。必要ならUnion用の公開シグネチャも設計します。',[
['呼び出し側が使うシグネチャは？',['宣言されたオーバーロード','実装の広いシグネチャだけ','常にany'],0,'実装シグネチャは外部向けの追加オーバーロードではありません。'],
['オーバーロードよりUnionが適することが多いのは？',['入力の違いで戻り値の型が変わらない場合','型を読みにくくしたい場合','実装をなくしたい場合'],0,'同じ結果型なら、1つのUnion引数が簡潔で利用しやすい場合が多いです。']
],'stringまたはreadonly string[]を受け取り、どちらも長さを返す関数を書いてください。',`function size(value: string | readonly string[]): number {\n  return value.length;\n}`, '両方がnumber型のlengthを持ち、戻り値も同じなのでオーバーロードは不要です。');
chapter(5,'ブランド型・再帰型・型の限界','複雑な型を、目的に応じた大きさに保つ。',[
['意味の異なる同型を区別する','ブランド型は構造に目印を加えて、同じstringのID同士などの取り違えを減らす方法です。入力の検証を行う生成関数にアサーションを閉じ込めます。実行時の保護や絶対に偽造できない型ではありません。'],
['再帰的な構造を表す','ツリーやJSONのように自分自身を含む型は再帰型で表せます。再帰的な条件型で深い変換もできますが、配列、関数、Date、循環参照などをどう扱うか決める必要があります。型検査には計算量や深さの限界もあります。'],
['安全性と使いやすさを両立する','TypeScriptには互換性のために完全には健全でない部分があります。型の高度さを目的にせず、どんな間違いを防ぎたいかを決めましょう。複雑な型で検査が遅くなるなら、中間型に名前を付けたり、公開境界を簡潔にしたりして調整します。']
],`declare const userIdBrand: unique symbol;\ntype UserId = string & { readonly [userIdBrand]: true };\nfunction createUserId(value: string): UserId {\n  if (!value.startsWith("user_") || value.length <= 5) {\n    throw new Error("不正なユーザーID");\n  }\n  return value as UserId;\n}\ntype Tree<T> = { value: T; children: Tree<T>[] };`, 'ブランドは型だけの目印です。createUserIdでここで定めた形式を検証し、その境界だけでアサーションを使います。','DeepReadonlyなどをあらゆる値へ無条件に適用すると、関数やクラスの意味を壊す型になり得ます。対象範囲を限定して設計しましょう。',[
['ブランド型は実行時に絶対偽造できない？',['できない','型だけでは保証しない','自動暗号化される'],1,'アサーションで回避もできるため、実行時の検証と運用上の境界が必要です。'],
['再帰型が適する例は？',['子ノードも同じ構造のツリー','一度だけ使うboolean','HTTP接続の自動再試行'],0,'自分自身を部分構造として含むデータを表現できます。']
],'number値と子ノードの配列を持つ再帰的なNode型を書いてください。DOMのNodeと名前が衝突しないようNumberNodeとします。',`type NumberNode = {\n  value: number;\n  children: NumberNode[];\n};`, '末端はchildren: []で表せます。循環しないことまではこの型だけで保証しません。');
chapter(5,'enum・デコレーター・周辺機能','型だけでない構文と、環境依存の機能を見分ける。',[
['enumとリテラルUnion','enumは名前付きの値を定義し、通常は実行時のオブジェクトも生成します。数値enumには逆引きの仕組みがあり、文字列enumとは挙動が異なります。値の一覧が必要ならas constのオブジェクト、型の候補だけならリテラルUnionも選択肢です。const enumはビルドや配布との互換性に注意が必要です。'],
['デコレーターには異なる方式がある','デコレーターはクラスやメンバーに振る舞いを追加する仕組みです。現行の標準方式とexperimentalDecoratorsによる従来方式は、呼び出し契約や対応機能が異なります。ライブラリがどちらを要求するか確認し、古い例をそのまま混ぜないようにします。'],
['必要になった機能を深掘りする','namespaceは既存のグローバルライブラリで見かけますが、新しいファイル分割には通常ES Modulesを使います。iterableやgeneratorはJavaScriptの反復プロトコルと型が結び付きます。usingは破棄プロトコルに関わるため、型宣言だけでなく実行時の対応も必要です。これらは利用環境を確認して公式リファレンスへ進みましょう。']
],`const Role = { Admin: "admin", Member: "member" } as const;\ntype Role = typeof Role[keyof typeof Role];\nconst role: Role = Role.Admin;\n\nfunction* numbers(): Generator<number, void, unknown> {\n  yield 1;\n  yield 2;\n}`, 'Roleは値と型の両方の名前として使っています。numbersはnumberをyieldし、正常終了の戻り値はvoidです。','デコレーターやusingを使う場合は、対応するTypeScript版・設定・実行環境を確認します。型チェックが通ることだけを実行可能性の根拠にしないでください。',[
['通常のenumは？',['常に型だけで出力から消える','実行時のオブジェクトも生成する','文字列の入力検証を自動生成する'],1,'通常のenumはJavaScript出力を伴います。const enumなどとは区別します。'],
['従来方式と標準方式のデコレーターは？',['すべて同じ契約で使える','方式とライブラリの対応確認が必要','tsconfigに関係しない'],1,'呼び出し契約や対応機能が異なり、単純な入れ替えはできません。']
],'as constのオブジェクトから"light" | "dark"型を取り出してください。',`const Theme = { Light: "light", Dark: "dark" } as const;\ntype Theme = typeof Theme[keyof typeof Theme];`, '実行時の選択肢と型の定義を同じ値から作れます。');
chapter(5,'型テスト・移行・保守','型検査だけに頼らず、安全に変更を積み重ねる。',[
['型と実行時の両方を確認する','型検査は契約の整合性、実行時テストは計算や分岐の振る舞いを確認します。型がnumberでも計算結果が間違う場合はあります。公開する型が意図せず広がる変更は、型テストで検出できます。'],
['@ts-expect-errorで拒否すべき例を残す','意図的な型エラーを次の行に書くと、@ts-expect-errorはその診断を期待します。エラーがなくなると未使用の指示として報告されます。@ts-ignoreより変更に気付きやすい一方、期待した種類の診断かまでは指示だけでは固定できません。理由を添えましょう。'],
['JavaScriptから段階的に移行する','allowJsでJavaScriptを含め、checkJsやJSDocで検査を導入する方法があります。境界の型、純粋な関数、依存が小さいモジュールから順に改善し、anyは局所的に管理します。CIで型検査と実行時テストを行い、更新時には公式リリースノートを確認します。']
],`function square(value: number): number { return value * value; }\nsquare(3);\n// @ts-expect-error: 文字列を受け取らない契約を確認\nsquare("3");\n\n// 実行時テストの最小例\nif (square(3) !== 9) throw new Error("計算結果が不正です");`, '正しく拒否されるべき入力と、正しい計算結果は別の確認です。実際の型テスト用ファイルは実行しない構成に分けることもできます。','@ts-expect-errorを日常のエラー隠しに使わないこと。理由と除去条件を記録し、正常系の型も併せて確認します。',[
['@ts-expect-errorの次の行からエラーが消えると？',['未使用の指示として診断される','何も起きない','自動でコードが消える'],0,'拒否されるべき契約が変わったことを検出できます。'],
['型検査が成功した計算処理は？',['必ず業務要件も正しい','計算の正しさには実行時テストも必要','テストが禁止される'],1,'型が合っていても計算式や境界条件の間違いはあり得ます。']
],'numberだけを受け取るdouble関数について、文字列を拒否する型テストを書いてください。',`function double(value: number): number { return value * 2; }\n// @ts-expect-error: 文字列は許可しない\ndouble("2");`, 'このテストは型検査向けです。@ts-expect-errorは実行時の例外を抑える機能ではありません。');
// はじめてコードを書く人向けの導入。公開順は末尾で固定する。
chapter(0,'はじめの準備：コードを試す','インストールせず、1行を動かすところから始める。',[
['まずはブラウザーだけで始める','このサイトは教科書と問題集です。コードを書いて実際に動かす場所には、TypeScript公式Playgroundを使います。下の「コードをコピー」を押してからPlaygroundを開き、編集欄のコードを置き換えてください。最初はパソコンでの学習がおすすめです。スマートフォンでは解説と確認問題を進められます。'],
['コード・コメント・出力','console.log(...)は括弧の中の値を確認するための命令です。文字列は引用符で囲み、数値はそのまま書きます。//から行末までは人向けの説明で、実行されません。PlaygroundのRunで実行し、Logsで表示を確認します。画面の配置は更新で変わる場合があります。'],
['エラーを観察して学ぶ','"こんにちは"を別の言葉に変えて再実行しましょう。次に閉じる引用符を1つ消すと、文法のエラーが表示されます。元に戻せば直ります。間違いは学習の手がかりです。このサイトの記述欄は解答メモで、実行や自動型検査は行いません。']
],`// 最初のプログラム\nconsole.log("こんにちは、TypeScript");\nconsole.log(2 + 3); // 5`, '1行目のlogは文字列、2行目のlogは計算結果5を表示します。「書く→実行する→結果を比べる」を毎回繰り返します。','例は1章ずつPlaygroundに貼って使います。複数章を同じ欄へ継ぎ足すと、同じ名前の変数や型が重複する場合があります。',[
['console.log(2 + 3)で確認できる値は？',['5','"2 + 3"','23'],0,'引用符のない2と3は数値なので加算して5になります。'],
['//から行末までの文字は？',['実行される関数','人向けのコメント','必ずエラー'],1,'コメントは実行する処理に含まれません。意図を説明できます。']
],'自分の好きな言葉と、10 - 4の計算結果を別々の行に表示してください。',`console.log("学ぶのは楽しい");\nconsole.log(10 - 4);`, '言葉の内容は自由です。出力が2行になり、2行目が6になることを確認してください。');
chapter(0,'値・変数・計算の基礎','名前を付けて値を保存し、組み合わせて使う。',[
['値に名前を付ける','const price = 120は、120という値にpriceという名前を付けます。=は代入で、数学の「等しい」とは違います。あとで値を入れ替えるならletを使います。まずconstを基本にし、変化が必要な場所だけletにすると、読み手が変化を追いやすくなります。'],
['数値と文字列は違う','120は数値、"120"は文字列です。数値同士の+は加算、文字列が関係する+は文字列連結になる場合があります。*は掛け算、/は割り算、%は余りです。括弧を使うと計算のまとまりを明示できます。'],
['比較の結果はboolean','===は等しいかどうかを比較し、trueまたはfalseを返します。!==は等しくない、>=は以上です。trueとfalseという真偽値の型をbooleanと呼びます。値の違いがわかると、次の章の条件分岐につながります。']
],`const price = 120;\nlet count = 2;\ncount = count + 1;\nconsole.log(price * count); // 360\nconsole.log(count === 3);   // true\nconsole.log("120" + 3);     // "1203"`, 'countの古い値2に1を足し、新しい値3を代入しています。最後の行は文字列連結であり、数値の加算ではありません。','constに再代入はできません。変数名を同じスコープで重複宣言してもエラーになります。例を試す際は前のコードを置き換えましょう。',[
['let n = 2; n = n + 3; の後のnは？',['2','5','23'],1,'古いnに3を足して新しい値を保存するので5です。'],
['値が等しいか比較する演算子は？',['=','===','=>'],1,'=は代入、===は比較です。=>は後の章で扱うアロー関数の記号です。']
],'priceを200、countを3として、合計600と「600以上か」のtrueを表示してください。',`const price = 200;\nconst count = 3;\nconst total = price * count;\nconsole.log(total);\nconsole.log(total >= 600);`, '600とtrueが出れば正解です。countを2に変えて400とfalseになることも確認します。');
chapter(0,'条件分岐と関数の基礎','条件で処理を選び、名前を付けて再利用する。',[
['ifで処理を選ぶ','if (条件)の中は条件がtrueのときに動きます。elseはfalseのときの処理です。波括弧{ }で処理のまとまりを作ります。空白や改行を整えると、どの処理がどの条件に属するか読みやすくなります。'],
['関数は入力から結果を作るまとまり','function greet(name: string)はgreetという関数を定義します。nameは受け取る値の名前で引数と呼び、: stringは文字列を要求する型注釈です。greet("Mio")と書くと呼び出せます。returnで結果を呼び出し元に返し、その関数の処理を終えます。'],
['戻り値と表示は別','returnは結果を返すだけで、画面には表示しません。console.logは値の確認に使います。関数の戻り値を別の計算に渡すこともできます。括弧の後の: stringなどは戻り値の型を表します。型を省略できる場面も後で学びます。']
],`function shipping(total: number): number {\n  if (total >= 3000) {\n    return 0;\n  }\n  return 500;\n}\nconsole.log(shipping(3000)); // 0\nconsole.log(shipping(2999)); // 500`, '3000以上なら0を返して終了します。そのため下のreturn 500は、3000未満のときだけ実行されます。境界の前後を試すと条件の間違いを見つけやすくなります。','関数を定義しただけでは本体の処理は実行されません。関数名の後に括弧を付けて呼び出します。',[
['shipping(2999)の戻り値は？',['0','500','2999'],1,'3000以上の条件を満たさないため500を返します。'],
['returnを実行すると？',['関数の結果を返してその呼び出しを終える','常にログが表示される','変数を削除する'],0,'結果を利用するか表示するかは呼び出し側が決めます。']
],'数値を受け取り、0以上なら"非負"、それ以外なら"負"を返すsignLabelを書いてください。',`function signLabel(value: number): string {\n  if (value >= 0) return "非負";\n  return "負";\n}`, 'signLabel(0)とsignLabel(5)は「非負」、signLabel(-1)は「負」です。0を忘れずに確かめます。');
chapter(0,'配列と繰り返しの基礎','複数の値をまとめ、ひとつずつ処理する。',[
['配列で値を並べる','[100, 200, 300]のように角括弧で値を並べると配列になります。配列名[0]は最初の要素です。添字は0から始まり、lengthで要素数がわかります。空配列[]は要素数0です。'],
['for...ofで要素を順番に使う','for (const price of prices)はpricesの要素を1つずつpriceとして扱います。合計を作るときは、ループの外でlet total = 0と用意し、ループの中で足していきます。total += priceはtotal = total + priceの省略形です。'],
['読むことと変更することを分ける','配列をたどって合計するだけなら元の配列を変更する必要はありません。pushは末尾に追加する操作です。配列を書き換える処理なのか、新しい結果だけを作る処理なのか、意識すると不具合を減らせます。']
],`const prices = [100, 200, 300];\nlet total = 0;\nfor (const price of prices) {\n  total += price;\n}\nconsole.log(total);         // 600\nconsole.log(prices.length); // 3`, '合計は0→100→300→600と変化します。空配列ならループの中へ入らず、合計は初期値0のままです。','最初の要素は[1]ではなく[0]です。存在しない添字ではundefinedになり得るため、後の型の章で安全な取得も学びます。',[
['[10, 20, 30][0]は？',['10','20','30'],0,'配列の添字は0から始まります。'],
['空配列をfor...ofで処理すると本体は何回動く？',['1回','0回','無限回'],1,'要素がないので繰り返し本体は実行されません。']
],'[2, 4, 6]をfor...ofで合計して12を表示してください。',`const values = [2, 4, 6];\nlet total = 0;\nfor (const value of values) total += value;\nconsole.log(total);`, '配列を[]に変えて0になること、元の配列を変更していないことも確認します。');
chapter(0,'オブジェクトとコールバックの基礎','名前付きのデータと、関数を渡す考え方。',[
['オブジェクトで情報をまとめる','{ name: "Mio", score: 80 }のように、名前と値の組を波括弧でまとめます。nameやscoreをプロパティと呼び、user.nameのようにドットで参照します。配列の位置ではなく名前で意味を伝えられます。'],
['アロー関数を読む','(n: number) => n * 2は、数値を受け取り2倍した結果を返す関数です。式だけならreturnを省略できます。波括弧の本体にした場合は、値を返すためにreturnを書きます。関数を変数に入れたり、別の関数へ渡したりできます。'],
['mapとfilterに仕事を渡す','mapは各要素を変換して新しい配列を作り、filterは条件がtrueの要素を残した新しい配列を作ります。このとき渡す関数をコールバックと呼びます。元の配列自体はこれらの操作だけでは置き換わりませんが、関数の中でオブジェクトを変更することはできます。']
],`const user = { name: "Mio", score: 80 };\nconsole.log(user.name);\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2); // [2, 4, 6]\nconst selected = numbers.filter(n => n >= 2); // [2, 3]`, 'mapやfilterがnumber配列の要素を渡すことがわかるので、nの型は推論されます。関数を呼んだ結果ではなく、関数そのものを渡しています。','配列をコピーしても中のオブジェクトへの参照は共有される場合があります。元データも変わったと感じたら、何をコピーしたか確かめましょう。',[
['[1,2,3].map(n => n * 2)の結果は？',['[2,4,6]','[2,3]','6'],0,'各要素を2倍した新しい配列を作ります。'],
['filterに渡す関数がtrueを返した要素は？',['残る','必ず削除される','文字列に変換される'],0,'条件に一致した要素を結果の配列に残します。']
],'[50, 80, 100]から80以上の数値だけを残すコードを書いてください。',`const scores = [50, 80, 100];\nconst passed = scores.filter(score => score >= 80);\nconsole.log(passed); // [80, 100]`, '結果が[80, 100]であること、元のscoresが3要素のままであることを確認します。');
// 初学者の順序を固定。以後の教材追加でもslugを保存キーに用いる。
const introductions=CHAPTERS.splice(-5);
CHAPTERS.unshift(...introductions);
CHAPTERS.forEach((c,i)=>{c.id=i+1;c.slug='chapter-'+(i+1);c.goal=c.summary.replace(/。$/,'')+'ことができる';});
const environmentChapter=CHAPTERS.find(c=>c.title==='開発環境と最初の型検査');
environmentChapter.sections.push(['手元のパソコンで試す手順','ターミナルはコマンドを入力するアプリです。作業フォルダーを作ってそこで開き、npm init -y、npm install -D typescript、npx tsc --initを順に実行します。srcフォルダーとsrc/main.tsを作り、最初のconsole.logの例を保存してください。tsconfig.jsonを下の設定に置き換え、npx tsc -p .を実行します。問題がなければ通常は何も表示されず終了します。この例は型検査だけです。実行結果はPlaygroundで確認できます。Node.jsやnpmが使えない場合はPlaygroundだけで学習を進めて構いません。']);
const foundations=CHAPTERS.find(c=>c.title==='null・undefined・安全な値の取得');
foundations.sections.unshift(['初めて出る記号：|','string | undefinedの縦棒は「文字列、またはundefined」を表します。候補をまとめるUnionという型で、詳しくは後の章で学びます。ここでは値がない可能性を加える記号として読みましょう。']);
CHAPTERS.find(c=>c.title==='関数の型とコールバック').sections.unshift(['初めて出る記号：typeと=>','type Formatter = ...は型に名前を付ける宣言です。関数型の=>は「この引数から、この型の結果を返す」という契約です。値としてのアロー関数と形が似ていますが、ここでは型を書いています。']);
CHAPTERS.find(c=>c.title==='型の絞り込みと型ガード').sections.push(['初めて出る型：unknown','unknownは、まだ値の正体がわからないことを示す型です。自由に操作せず、条件で確かめてから使います。次の章群でanyやneverとの違いを詳しく学びます。']);
CHAPTERS.find(c=>c.title==='判別可能Unionと網羅性').sections.unshift(['初めて出る構文：switchとthrow','switchは値に応じてcaseの処理を選ぶ分岐です。defaultは他のcaseに一致しない場合です。throw new Error(...)は例外を発生させ、通常の処理を中断します。neverは「該当する値がない」型としてこの章で使い、次章で詳しく比較します。']);
const runtimeChapter=CHAPTERS.find(c=>c.title==='APIと実行時の入力検証');
runtimeChapter.code=runtimeChapter.code.replace('\n    && Number.isFinite(value.id)','').replace('  return data;','  if (!Number.isFinite(data.id)) throw new Error("IDが有限数ではありません");\n  return data;');
runtimeChapter.walkthrough='isUserは型の構造だけを確認します。有限数という業務条件はloadUser側で別に検査し、型の判定と追加の制約を区別しています。追加のプロパティは許可しています。';
CHAPTERS.find(c=>c.title==='型宣言・.d.ts・宣言のマージ').code=CHAPTERS.find(c=>c.title==='型宣言・.d.ts・宣言のマージ').code.replace('// 同一スコープでのinterfaceマージ','// settings.ts（上のmath.d.tsとは別ファイル）\n// 同一スコープでのinterfaceマージ');
const CHECKPOINTS=[
{title:'買い物の合計を計算する',task:'priceとcountを持つ商品の配列から合計を求めてください。200円×2個と100円×3個なら700、空配列なら0です。',checks:['引数と戻り値に型がある','空配列で0を返す','元の商品や配列を変更しない'],solution:'type Item = { price: number; count: number };\nfunction total(items: readonly Item[]): number {\n  let result = 0;\n  for (const item of items) result += item.price * item.count;\n  return result;\n}'},
{title:'タスクの状態をモデル化する',task:'Taskはreadonlyなid、title、"todo" | "done"のstatusを持ちます。Task配列からdoneの件数を返す関数を作ってください。',checks:['statusに任意のstringを許していない','空配列で0を返す','入力のstatusを書き換えない'],solution:'type Task = { readonly id: number; title: string; status: "todo" | "done" };\nfunction countDone(tasks: readonly Task[]): number {\n  return tasks.filter(task => task.status === "done").length;\n}'},
{title:'通信結果の表示を安全に分ける',task:'loading・success（data: string）・error（message: string）の3状態を定義し、表示する文字列を返してください。',checks:['各状態で必要なプロパティを必須にする','成功以外ではdataを参照しない','neverを使って分岐漏れを検出する'],solution:'type State = { status: "loading" } | { status: "success"; data: string } | { status: "error"; message: string };\nfunction display(state: State): string {\n  switch (state.status) {\n    case "loading": return "読み込み中";\n    case "success": return state.data;\n    case "error": return state.message;\n    default: { const check: never = state; return check; }\n  }\n}'},
{title:'型を保ったプロパティ取得を作る',task:'任意のオブジェクトと存在するキーを受け取り、対応する値を返すgetを書いてください。{ id: 1, name: "Mio" }のnameを取得するとstringになります。',checks:['キーをkeyofで制限する','戻り値にT[K]を使う','存在しないキーが型エラーになる'],solution:'function get<T, K extends keyof T>(value: T, key: K): T[K] {\n  return value[key];\n}'},
{title:'外部データの検証を通して使う',task:'unknownから、nameが文字列のオブジェクトだけを受け入れて{name: string}を返すparseUserを書いてください。不正なら例外を投げます。',checks:['nullを除外する','nameの存在と型を実行時に確認する','asだけで入力を信用しない'],solution:'function parseUser(value: unknown): { name: string } {\n  if (typeof value !== "object" || value === null || !("name" in value) || typeof value.name !== "string") {\n    throw new Error("不正なユーザーです");\n  }\n  return { name: value.name };\n}'},
{title:'公開する関数の契約をテストする',task:'readonly number[]を受け取り最大値またはundefinedを返すmaxを実装してください。空配列、負の数、文字列配列の拒否を確認してください。',checks:['max([])はundefinedになる','max([-4, -2])は-2になる','文字列配列を@ts-expect-errorで確認する'],solution:'function max(values: readonly number[]): number | undefined {\n  let result: number | undefined;\n  for (const value of values) {\n    if (result === undefined || value > result) result = value;\n  }\n  return result;\n}\n// @ts-expect-error: 文字列配列を拒否\nmax(["1"]);'}
];

CHAPTERS.find(c=>c.title==='型の絞り込みと型ガード').sections.push(['型述語はfalse側にも約束する','x is UserはtrueならUser、falseならUserではないと扱う双方向の約束です。number型なのに0やNaNだけを拒否するような追加の業務条件は、構造の型ガードとは分けて検証します。']);
CHAPTERS.find(c=>c.title==='Promise・async / await').code+='\nvoid run(); // runを呼び出して結果を確認';
CHAPTERS.find(c=>c.title==='DOM・イベント・フォーム').sections.push(['対応するHTML','この例はブラウザーで動かします。HTMLに <input id="age" type="number" min="0"> を用意し、その要素が読み込まれた後にコードを実行してください。type="number"だからvalueAsNumberで数値を取得でき、空欄はNaNになります。']);
CHECKPOINTS[0].task+=' ひな型の波括弧内は商品の名前付きプロパティと型、[]はその配列を表します。ひな型の本体を埋めてください。';
CHECKPOINTS[0].starter='function total(items: readonly { price: number; count: number }[]): number {\n  // 合計を計算して返す\n}';
CHECKPOINTS[0].solution='function total(items: readonly { price: number; count: number }[]): number {\n  let result = 0;\n  for (const item of items) result += item.price * item.count;\n  return result;\n}';
CHAPTERS.find(c=>c.title==='配列・タプル・読み取り専用').sections.unshift(['初めて出る記号：|','string | undefinedは「文字列、または値がないundefined」を表します。縦棒は候補をまとめるUnionの記号です。空配列の最初の要素が存在しない可能性を、この型で表します。']);
CHAPTERS.find(c=>c.title==='any・unknown・never').solution='function double(value: unknown): number | undefined {\n  if (typeof value === "number") return value * 2;\n  return undefined;\n}';
