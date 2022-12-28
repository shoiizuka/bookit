//どのユーザーが入っているか分ける
import catchAsyncErrors  from './catchAsyncErrors'
import  ErrorHandler from '../utils/errorHandler'
import { getSession } from 'next-auth/react'//cliant

//認証されたユーザー
const isAuthenticatedUser = catchAsyncErrors(async (req,res,next) =>{
  //セッション作成
  const session = await getSession({ req });

  console.log(session)

  if(!session){
    return next(new ErrorHandler('ログインが必要です',401))
  }

  req.user = session.user
  next();

})

//管理者ログインルールを設定
const authorizeRoles = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){//ルール外なら
      return next(new ErrorHandler(`ルール(${req.user.role})のアクセスは許可されてません`,403))
    }
    next()
  }
}

export {
  isAuthenticatedUser,
  authorizeRoles
}