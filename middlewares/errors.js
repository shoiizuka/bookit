//errorハンドラクラスをインポート exppressだとデフォルトでついてる。今回は使用しないので自分で作る

import ErrorHandler from "../utils/errorHandler";

const errMiddlewar = (err,req,res,next) => {

  err.statusCode = err.statusCode || 500;//エラーステータス

  let error = {...err}
  
  error.message = err.message

  //IDの違うモングースオブジェクトエラー
  if(err.name === 'CastError'){
      const message = `リソースが見つかりません。無効な${err.path}です`
      error = new ErrorHandler(message,400)
  }

  //モングースのバリデーションエラー
  if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(value => value.message)
    error = new ErrorHandler(message,400)
  }


  res.status(err.statusCode).json({
    success: false,
    error,
    message: error.message,
    stack: error.stack

  })

}

export default errMiddlewar
//非同期用のエラーステータスファイル（本来ならExpressについてる）



