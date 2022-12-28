//非同期のエラー処理ファイル

const catchAsyncErrors = func => (req,res,next)=>{
  Promise.resolve(func(req,res,next)).catch(next)
}

//roomControllerに繋げる
export default catchAsyncErrors;