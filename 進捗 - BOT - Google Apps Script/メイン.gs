///////////////////////////////////////////
// 定数
///////////////////////////////////////////
// デバッグLOGを書き込むかどうか
const LOG_SHOW = false;
// エラー
const ERROR = -9999;
// コマンドタイプ
const CMD_NONE = -990;
const CMD_USER_ID =-991;
// シート取得
const ACTIVE_SHEET = SpreadsheetApp.getActive( );
// デバッグログ
const DEBUG = ACTIVE_SHEET.getSheetByName( "デバッグログ" );
// 出席
const ATTENDANCE = ACTIVE_SHEET.getSheetByName( "出席" );
// 退席
const LEAVE = ACTIVE_SHEET.getSheetByName( "退席" );
// 名簿
const ID_LIST = ACTIVE_SHEET.getSheetByName( "名簿" );

///////////////////////////////////////////
// グループID定義
///////////////////////////////////////////
// 出席グループID
const ATTENDANCE_GROUP_ID = "**************************************************";
// 退席グループID
const LEAVE_GROUP_ID = "**************************************************";

///////////////////////////////////////////
// グローバル変数
///////////////////////////////////////////
// ユーザー情報
var _user_id = 0;
// グループ情報
var _group_id = 0;
// ユーザー名
var _user_name = "NONE";
// コマンド
var _cmd_type = CMD_NONE;
// LOGの初回記入かどうか
var _first_write_log = true;

function doPost( e ) {
  // ユーザー情報取得
  debugLog( "ユーザー情報取得" );
  setUserInformation( e );

  debugLog( _cmd_type );
  debugLog( _user_name );
  // コマンド処理
  if( _cmd_type != CMD_NONE ) {
    log( "コマンド実行します" );
    executionCommand( );
    return;
  }

  // イベントが無効かどうかを判断
  if( _user_id == 0 && _user_name == "NONE" && _group_id == 0 ) {
    log( "無効なイベントと判断しました" );
    return;
  }

  // メッセージ送信者ログ記録
  debugLog( "メッセージ送信者ログ記録" );
  drawPractitionerLog( _user_id );
  // タイムスタンプの書き込み
  debugLog( "タイムスタンプの書き込み" );
  writeTimeStamp( );
  // リプライメッセージ送信
  debugLog( "リプライメッセージ送信" );
  postReplyMessage( );
}

// ユーザー情報を取得する
function setUserInformation( e ) {
  var contents = e.postData.contents;
  var obj = JSON.parse( contents );
  // リプライメッセージ用にトークンを保存
  setTokenObj( obj );
  var events = obj[ "events" ];
  for( var i = 0; i < events.length; i++ ) {
    if( events[ i ].type == "message" ) {
      textDataAnalysis( events[ i ], e );
    }
  }
}

// テキストの情報を解析
function textDataAnalysis( id, event ) {
  _user_id = getUserID( id );
  debugLog( "UserID : " + _user_id );

  _group_id = getGroupID( id );
  debugLog( "GroupID : " + _group_id );

  // ユーザーのメッセージを取得
  var message = JSON.parse( event.postData.contents ).events[ 0 ].message.text;
  //LINEメッセージを「改行」で分割
  var messageParameter = message.split( /\r\n|\n/ );


  var buf_name = messageParameter[ 0 ];
  // コマンド解析
  if( messageParameter[ 0 ] == "uid_c" ) {
    buf_name = messageParameter[ 1 ];
    debugLog( "cmd解析 : " + buf_name );
    _cmd_type = CMD_USER_ID;
  }

  // 表記ゆれを修正
  _user_name = correctedNotationalFluctuation( buf_name );
  debugLog( "UserName : " + _user_name );
}

// ユーザーIDを解析・返却
function getUserID( e ) {
  return e.source.userId;
}

// グループIDを解析・返却
function getGroupID( e ) {
  return e.source.groupId;
}

// ユーザー名を取得
function getUserName( ) {
  return _user_name;
}

// 表記ゆれを修正を修正する
function correctedNotationalFluctuation( name ) {
  switch( name ) {
    case "okuty" :
    case "おくてぃ~" :
    case "おくてぃー" :
    case "おくてぃ〜" :
      name = "おくてぃ～";
      break;
    case "林" :
      name = "リン";
      break;
    case "ドラゴン" :
      name = "畑中";
      break;
    case "ピカせん" :
      name = "永瀬";
      break;
    case "おゆき" :
      name = "幸南"
      break;
    default :
      break;
  }
  debugLog( "表記ゆれ修正後 -> " + name );
  return name;
}

// コマンド処理
function executionCommand( ){
  if( _cmd_type == CMD_USER_ID ) {
      var name = getNamedRow( ATTENDANCE, getUserName( ) );

      // エラー確認
      if( name == ERROR ) {
        log( "入力された名前が見つかりませんでした -> " + getUserName( ) );
        return;
      }

    log( "入力された名前を見つけることができました -> " + getUserName( ) );
  }
}