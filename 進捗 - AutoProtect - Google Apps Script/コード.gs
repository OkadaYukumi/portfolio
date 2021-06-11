const _id = [
  '1zXvKzv8-CmmkcUPFvO7bKieo3NsGumb38kZoopEuJgE', // テンプレート
  '1_8n-cHsdEHZnEsgQpZjES4kvSFv5S0BbpNXam5wRLGE', // おくてぃ
  '1eul6sJxjpPEXzCaBoTPk0FcPOo9yk2lst57UeH_Bf9c', // リュウ
  '1KfnXNDNJLE3mcPHTinfKtudvkBKpbPxeRj_g-7w7X8E', // リン
  '1Zh-kOTWRiuTt_fUjewQtMgkH9zBGc4oJC-RDcN5uu1g', // 岡田
  '1h5-mrWy1KvhFV2IYyLU7zITMgi0Y3wP4squDy_4Np0U', // 平澤
  '1KpD-9WYdkFv1lQUAqIIbvFHPcBFZnq9y7kzdj4zjA9c', // ペドロ
  '1ZSgtZB6ATU0MnoRAl_81yyFPeHS3TQFtjqaEc-DtUuk', // 永瀬
  '1F2gfAQL1s6fgnCdi9_pmFFt74kORbrkEejPdsQl8ai0', // 遠藤
  '1O2Z_5XaARD-nN_hQTcgXGB_lUO2XRnAl30_v0vtEhs4', // 久保
  '1dcoJM5GRmYs0g2O9dNw6MqYOheSCivLDRVTZFVQD1NQ', // 君嶋
  '1l-aqTPFdmRAWtdtQU7QNNucnLjXWy5MeD3zDXRhCJPw', // 坂上
  '1mJ8MOXTyHAUHmrLEZ52Ps0HwJj5z6g0gE-_nU6l5YsA', // 大橋
  '1B7gYXc3QKbanDmSI82ITE69SFyCg3na2c3vwyiGjTYI', // 畑中
  '1C9ENiEMhLeZ8YAQ3xd96qgJiyz-PyirSFxC_nhmGWNg', // 磯崎
  '1-CI9DP-a69rpYurSg4-cFQCZl2Kfcz0Ox4LAyuM1iuU', // 笹本
  '1hQFnG4IF-uipU0dEajrGah9jb9zwJ27lyFjAJnkgtfA', // 幸南 
  '1tfHs5mNwCR0Ytpcwg82Rn4aLW0L_S_RKhh1BFd5Pp4g', // 涼太
  '1CIZtKE5gMDuF8LN26ZlBcJR2IZ9tuo3mSpHaKH7RVZY', // ソウ
  '1PmVUgdqkd1DCjNHdmyEQGqwjS0V1fiErp8_j7RUs3_o', // 宮田
  '1Pe3VDoK7-_1HmsUEiACOrmKgFSzlUZ4tBqr63a06yFQ', // 藤井
  '1o4C_xYvuOgXR2rsugc5Vxw1HLGINoji6UVNI3RcEji0', // 堀口
  '1DSZVogMWgg95OWN0B-YuJebAYG8My2-wrVIU00UetLg', // 中村
];

var _protected_value = 0;

function ran( ) {
  init( );

  for( var i = 0; i < _id.length; i++  ) {
    var target = SpreadsheetApp.openById( _id[ i ] ).getSheetByName( 'シート1' );
    var range = target.getRange( 1, 1, 2, _protected_value );

    var protections = target.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    // 取得した保護されたセル範囲の数だけ処理
    for ( var j = 0; j < protections.length; j++ ) {
	    // 保護を取得
	    var protection = protections[ j ];
	    // 保護の種類が編集可能である場合
	    if ( protection.canEdit( ) ) {
		    // 保護を削除
		    protection.remove( );
	    }
    }
    
    var protection = range.protect( ).setDescription( 'protected range' );
    protection.removeEditors( protection.getEditors( ) );
    if ( protection.canDomainEdit ( ) ) {
      protection.setDomainEdit( false );
    }
  }
}

function init( ) {
  // ID からスプレッドシートを開く
  var target = SpreadsheetApp.openById( _id[ 0 ] ).getSheetByName( 'シート1' );

  _protected_value = getDateColumn( target );
}

function getDateColumn( sheet ) {
    var compareDay = Utilities.formatDate(new Date( ), 'JST', 'yyyy/M/d');

    // 日付行取得
    var dateData = sheet.getRange( 1, 1, 1, sheet.getLastColumn( ) ).getValues( );
    dateData[0].pop(); // 末尾の不要な要素削除

    // 日付フォーマット変換
    var afterDateData = [];
    dateData[0].forEach(function (it) {
        afterDateData.push(Utilities.formatDate(it, 'JST', 'yyyy/M/d'));
    });

    for (var i = 0; i < afterDateData.length; i++) {
        if (afterDateData[i] == compareDay) {
            return i + 1;
        }
    }
    return 0;
}