//内容登録
function saveData(){
    //入力内容取得
    const deadline = document.getElementById("deadline").value;
    const task = document.getElementById("task").value;

    //どちらかが空欄なら保存処理を中断
    if(!deadline||!task) return;

    //localstorageから"todolist"というキーワード取得
    let storeData=localStorage.getItem("todoList");
    //nullかどうか確認
    if(storeData==null){
        storeData="[]";
    }
    //文字列をjavascriptの配列に変換
    const data=JSON.parse(storeData);

    //新しいタスクをオブジェクトとして配列に追加
    data.push({deadline,task});

    //配列全体をJSON.stringifyで文字列にして，localstrageに保存
    const json=JSON.stringify(data);
    localStorage.setItem("todoList",json);

    //フォーム欄をクリア
    document.getElementById("deadline").value="";
    document.getElementById("task").value="";

    //登録後に自動的に表紙ページ遷移
    location.href='index.html'

}

//画面表示
function showData(){

    console.log("表示関数呼び出し成功");

    //表示範囲のid取得
    const display = document.getElementById("displayArea");
    //表示ページ以外で呼び出されたらなにもしない
    if(!display) return;

    //前の表示内容をクリア
    display.innerHTML="";

    //localstorageに保存されているtodoListの名前で保存されている文字列を取得
    let rawData=localStorage.getItem("todoList");
    //nullはどうか確認
    if(rawData==null){
        rawData="[]";
    }
    //文字列をjavascriptの配列に変換
    const data=JSON.parse(rawData);

    for(let index=0;index<data.length;index++){
        //item.~ってつけるようになる
        const item=data[index];

        //div要素（表紙用の箱）のをjavascriptで作る．1件のtodo表示させるため
        const div = document.createElement("div");
        //クラス名つけてcssでいじれるように
        div.className="todo-list";

        //左端にテキストをまとめるラッパーを作成
        const textWrapper=document.createElement("div");
        textWrapper.className="text-wrapper";

        //期限表示用のdiv作成
        const deadline=document.createElement("div");
        //クラス作成
        deadline.className="deadline";
        //テキスト追加
        deadline.textContent=`期限: ${item.deadline}`;

         //内容表示用のdiv作成
        const task=document.createElement("div");
        //クラス作成
        task.className="task";
        //テキスト追加
        task.textContent=`内容: ${item.task}`;

        //ラッパーにテキスト追加
        textWrapper.appendChild(deadline);
        textWrapper.appendChild(task);
     
        //checkbox作成
        const checkbox=document.createElement("input"); 
        checkbox.type="checkbox";
        checkbox.className="todo-checkbox";

        // 「完了」ボタンを追加
        const doneButton = document.createElement("button");
        doneButton.textContent = "完了";
        doneButton.className = "done-button";
        doneButton.onclick = () => {
            if (confirm("削除しますか？")) {
                data.splice(index, 1); // 削除
                localStorage.setItem("todoList", JSON.stringify(data));
                showData(); // 表示を更新
            }
        };


        //横並びの行（1行に，左テキスト＋右チェックボックス）
        const row=document.createElement("div");
        row.className="todo-row";
        row.appendChild(textWrapper);
        row.appendChild(checkbox);
        row.appendChild(doneButton); // ← ここでボタン追加

        //行をtodo-list全体に追加
        div.appendChild(row);

        //displayareaに表示
        display.appendChild(div);
    }

}
//ページが読み込まれたときに関数実行
window.onload=showData;

//削除関数
function deleteCheck(){
    //全てのtodolistを取得
    const todoItems=document.querySelectorAll(".todo-list");
    //保存データ読み込み
    let rawData=localStorage.getItem("todoList");
    if(rawData==null){
        rawData="[]";
    }
    let data=JSON.parse(rawData);

    //新しいデータを入れる配列
    const newData=[];

    //各todoをチェックして，チェック入ってないものだけ残す
    for(let i=0;i<todoItems.length;i++){
        const checkbox=todoItems[i].querySelector(".todo-checkbox");
        if(!checkbox.checked){
            newData.push(data[i]);
        }
    }

    //localstorageを更新
    localStorage.setItem("todoList",JSON.stringify(newData));

    //表示を更新
    showData();
}

//編集対象を保存してページ移動
function edit(){
    //全てのtodoリスト取得
    const todoItems=document.querySelectorAll(".todo-list");
    //保存データ読み込み
    let rawData=localStorage.getItem("todoList");
    if(rawData==null){
        rawData="[]";
    }
    let data=JSON.parse(rawData);

    //チェックが入ったtodoを探す
    point=-1;
    for(let i=0;i<todoItems.length;i++){
        const check=todoItems[i].querySelector(".todo-checkbox");
        if(check.checked){
            if(point!==-1){
                alert("編集できるのは1件だけです。1つだけチェックしてください。");
                return;
            }
            point=i;
        }
    }

    if(point===-1){
        alert("編集したいToDoを1件選んでください。");
        return;
    }

    //編集対象を保存して編集ページ
    localStorage.setItem("editIndex",point);
    localStorage.setItem("editItem",JSON.stringify(data[point]));
    location.href="edit.html";
}

//編集内容更新
function updateData(){
    //期限と内容取得
    const deadline=document.getElementById("deadline").value;
    const task=document.getElementById("task").value;

    //どちらかが空欄なら更新を中断
    if(!deadline||!task){
        return;
    }

    //保尊データの読み込み
    let rawData=localStorage.getItem("todoList");
    if(rawData==null){
        rawData="[]";
    }
    let data=JSON.parse(rawData);

    //編集対象を示す値取得．parseInt()で文字列を数値に変換
    const index=parseInt(localStorage.getItem("editIndex"));

    //配列dataの指定位置を変更
    data[index]={deadline,task};

    //dataをまたJSONに変換して，localstorageに上書き保存
    localStorage.setItem("todoList",JSON.stringify(data));

    //編集時に保存したもの削除
    localStorage.removeItem("editItem");
    localStorage.removeItem("editIndex");

    //index.htmlへ
    location.href = "index.html";

}