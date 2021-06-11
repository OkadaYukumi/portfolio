var LINE_API_REPLY = 'https://api.line.me/v2/bot/message/reply'; // 応答メッセージ用のAPI URL
var CHANNEL_ACCESS_TOKEN = '**************************************************'; // Botのアクセストークン

var _reply_token;
var _message;

// リプライメッセージを送信
function postReplyMessage( ) {
  debugLog( "CHANNEL_ACCESS_TOKEN : " + CHANNEL_ACCESS_TOKEN );
  debugLog( "_reply_token : " + _reply_token );
  debugLog( "_message : " + getMessage( ) );

  UrlFetchApp.fetch( LINE_API_REPLY, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify( {
      'replyToken': _reply_token,
      'messages': [ {
        'type': 'text',
        'text': getMessage( ),
      } ],
    } ),
  } );
  return ContentService.createTextOutput(JSON.stringify( { 'content': 'post ok' } ) ).setMimeType( ContentService.MimeType.JSON );
}

// トークン用オブジェクトを保存
function setTokenObj( json ) {
  _reply_token = json.events[ 0 ].replyToken;
    if ( typeof _reply_token === 'undefined' ) {
      log( "リプレイトークンが存在しませんでした。" );
      return;
    }
}

function setMessage( message ) {
  _message = message;
}

function getMessage( ) {
  return _message;
}