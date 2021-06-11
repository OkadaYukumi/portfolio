var _recorded_time;

// セルを探す + 書き込む
function writeTimeStamp( ) {
  var now_day = Utilities.formatDate(　new Date( ), 'JST', 'yyyy/M/d'　);
  var row = getNamedRow( ATTENDANCE, getUserName( ) );
  var col = getDateCal( ATTENDANCE, now_day );
  var stamp_time = Utilities.formatDate( new Date( ), 'Asia/Tokyo', 'hh:mm a' );
  var reply_time = Utilities.formatDate( new Date( ), 'Asia/Tokyo', 'HH:mm' );

  // エラー確認
  if( row == ERROR ) {
    log( "入力された名前が見つかりませんでした -> " + getUserName( ) );
    setMessage( "「" + getUserName( ) + "」" + "名前が見つかりませんでした" );
    return;
  }
  if( col == ERROR ) {
    log( "該当する日付が見つかりませんでした -> " + now_day );
    setMessage( "日付が見つかりませんでした" );
    return;
  }
  
  // スプレッドシートに書き込み
  if( _group_id == ATTENDANCE_GROUP_ID ) {// 出席入力
    // 記録があるか確認、あった場合書き込みを行わない
    if( !cellIsEmpty( ATTENDANCE, row, col ) ) {
      log( "出席済み" );
      setMessage( getUserName( ) + " " + _recorded_time + "に出席済みです" );
      return;
    }

    setValue( ATTENDANCE, row, col, stamp_time );
    setMessage( reply_time + " " + getUserName( ) + " 出席しました" );
  } 
  if( _group_id == LEAVE_GROUP_ID ) {// 退席入力
    setValue( LEAVE, row, col, stamp_time );
    setMessage( reply_time + " " + getUserName( ) + " 退席しました" );
  }
}

// セルに情報があるか確認する
function cellIsEmpty( sheet, row, col ) {
  var value = sheet.getRange( row, col );
  if( value.isBlank( ) ) {
    return true;
  } else {
    _recorded_time = Utilities.formatDate( sheet.getRange( row, col ).getValue( ), 'Asia/Tokyo', 'HH:mm' );
    return false;
  }
}

// 名前のある列を検索
function getNamedRow ( sheet, target ){
  var expenseData = sheet.getRange( 2, 1, sheet.getLastRow( ) ).getValues( );// 項目列取得
  expenseData.pop( );// 末尾の不要な要素削除

  // targetと一致する行数を返す
  for ( var i = 0; i < expenseData.length; i++ ) {
    if ( expenseData[ i ] == target ) {
      return i + 2;
    }
  }
  return ERROR;
}

// 日付のある行を検索
function getDateCal ( sheet, day ) {
    // 日付行取得
  var date = sheet.getRange( 1, 2, 1, sheet.getLastColumn( ) ).getValues( );
  date[ 0 ].pop( ); // 末尾の不要な要素削除

  // 日付フォーマット変換
  var afterDateData = [ ];
  date[ 0 ].forEach( function ( it ) {
    afterDateData.push( Utilities.formatDate(it, 'JST', 'yyyy/M/d' ) );
  } );
   
  // 実行日と一致した行数を返す
  for ( var i = 0; i < afterDateData.length; i++ ) {
    if ( afterDateData[ i ] == day ) {
      return i + 2;
    }
  }
  return ERROR;
}

// メッセージ送信者ログ記録
function drawPractitionerLog( id ){
  var row = getUserIDRow( id );
  var name = _user_id;
  debugLog( "UID : " + row  );
  if( row != ERROR ) {
    name = ID_LIST.getRange( row, 1 ).getValue( );
  }

  var section;
  if( _group_id == ATTENDANCE_GROUP_ID ) {// 出席入力
    section = "出席";
  }
    if( _group_id == LEAVE_GROUP_ID ) {// 退席入力
    section = "退席";
  }

  log( "入力 : " + name + " / 記入 : " + getUserName( ) + " / 区分 : " + section );
}

// ユーザーID検索
function getUserIDRow( id ) {
  var sheet = ID_LIST;
  var expenseData = sheet.getRange( 1, 2, sheet.getLastRow( ) ).getValues( );// 項目列取得
  expenseData.pop( );// 末尾の不要な要素削除

  // IDと一致する行数を返す
  for ( var i = 0; i < expenseData.length; i++ ) {
    if ( expenseData[ i ] == id ) {
      return i + 1;
    }
  }
  return ERROR;
}

// Logを書き込み
function log( value ) {
  var lastRow = DEBUG.getLastRow( );
  
  if( _first_write_log ) {// 初回書き込みだったらタイムスタンプを書き込み
    var time = "-" + Utilities.formatDate(new Date( ), 'Asia/Tokyo', 'yyyy/MM/dd hh:mm');
    lastRow++;
    setValue( DEBUG, lastRow + 1, 1, time );
    lastRow++;
    _first_write_log = false;
  }
  setValue( DEBUG, lastRow + 1, 1, value );
}

// デバッグログ
function debugLog( value ) {
  if( !LOG_SHOW ) {
    return;
  }

  var lastRow = DEBUG.getLastRow( );
  
  if( _first_write_log ) {// 初回書き込みだったらタイムスタンプを書き込み
    var time = "-" + Utilities.formatDate(new Date( ), 'Asia/Tokyo', 'yyyy/MM/dd hh:mm');
    lastRow++;
    setValue( DEBUG, lastRow + 1, 1, time );
    lastRow++;
    _first_write_log = false;
  }

  var debug_value = "D : " + value;
  setValue( DEBUG, lastRow + 1, 1, debug_value );
}

// スプレッドシートに書き込み
function setValue ( sheet, row, col, value ) {
    sheet.getRange( row, col ).setValue( value );
};