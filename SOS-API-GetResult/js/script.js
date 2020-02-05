/*****************************************************************************

  web上からjavascriptを使ってSOS API(GetResult)を発行してその結果を受け取る例


*****************************************************************************/
/* */

// ボタンのオブジェクトを取得・初期化
var response = document.getElementById("res");
response.innerHTML='応答';
var reset = document.getElementById("rest-button");
reset.onclick = function(){
  response.innerHTML='応答'
};

/* SOS API GetResultを作る元となるtextデータ 開始時刻%START%，終了時刻%END%を次のtableで指定する */
var GetResult =`{
  "request": "GetResult",
  "service": "SOS",
  "version": "2.0.0",
  "offering": "offering0",
  "observedProperty": "https://www.kantei.go.jp/jp/singi/it2/senmon_bunka/shiryo/agro-env.html#air_temperature",
  "featureOfInterest": "Kyouinshitu-3",
  "temporalFilter": [
    {
      "during": {
        "ref": "om:phenomenonTime",
        "value": [
          "%START%",
          "%END%"
        ]
      }
    }    
  ]
}`;

/*  Getresultのデータ取得時刻の範囲を指定  */
var table = {
  START:"2020-02-04T16:00:00+09:00",
  END:  "2020-02-04T16:10:00+09:00"
};

var getresult = new ReplaceStrings_text(GetResult); //クラスのインスタンス


/* jQueryを使ったajax通信の例　クリックしたら通信開始 */
$( function() {
    $('#ajax-button').click(
      function() {
//        var hostUrl= 'https://httpbin.org/post';  //POST内容の確認用webサイト
        var hostUrl = 'http://eeciot.tsuruoka-nct.ac.jp:8080/52nSOS/service';　//SOSサーバURL
        var post_body = getresult.replace_table(table); //POST用データ(body)の文字列
        console.log("POST BODY:\n"+post_body);

        $.ajax({
            url: hostUrl,
            contentType: "application/json;charset=UTF-8",
            type: 'POST',
            processData:false,    //ここが重要：デフォルトでtureはdataに指定したオブジェクトを
                                  //クエリ文字列に変換に変換する．falseでdataの内容をそのまま送信
            data : post_body,
            timeout:3000,

        }).done(function(data) { //通信成功
          response.innerHTML='開始時刻: '+table.START+"<br>";
          response.innerHTML+='終了時刻: '+table.END+"<br>";
          response.innerHTML+='SOS応答(BODY部):<br>';
          response.innerHTML+='<pre>'+JSON.stringify(data,null,'    ')+'</pre>';
//          alert("ok");

        }).fail(function(XMLHttpRequest, textStatus, errorThrown) { //通信失敗
           console.log("Status: "+textStatus);
           console.log("XML:\n"+XMLHttpRequest.response);
           console.log("errorThrown:\n"+errorThrown);
//           alert("error");
        })
        }
    );
});