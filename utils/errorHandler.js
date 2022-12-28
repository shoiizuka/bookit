//エラーが出たときの処理を決めておく。クラスの継承を使う

class ErrorHandler extends Error {//childclass
  constructor(message, statusCode){//最初に実行される
    super(message)//superは親クラスのコンストラクタ

    this.statusCode = statusCode//コンストラクターのステータスコードと同じ
    Error.captureStackTrace(this, this.constructor)//エラーの場所を特定するメソ

  }

}

export default ErrorHandler;