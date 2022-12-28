import User from '../modals/user'//userファイル読込
import cloudinary from 'cloudinary';
import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';

//リセットパスワード発行URL
import absoluteUrl from 'next-absolute-url'
import sendEmail from '../utils/sendEmail';
import crypto from 'crypto'//認証トークン使用


//cloudinaryのセットアップconfigから引っ張るimgに使う
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


// ユーザー登録 => /api/auth/register
const registerUser = catchAsyncErrors(async (req,res,) =>{ 

  const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder: 'bookit/avatars',
    width:'150',//px
    crop:'scale',
  })

  const { name , email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar:{
      public_id: result.public_id,//imgを入れる
      url:result.secure_url,//imgcloudのurl
    }
  })

  res.status(200).json({
    success:true,
    message:'アカウント登録完了しました',
  })

})

// 現在ユーザー => /api/me
const currentUserProfile = catchAsyncErrors(async (req,res,) =>{

  const user = await User.findById(req.user._id)//大文字？

  res.status(200).json({
    success:true,
    user
  })
})


// ユーザープロフィール => /api/me/update
const updateProfile = catchAsyncErrors(async (req,res,) =>{ 

  const user = await User.findById(req.user._id)//現在ユーザ情報をそのまま使う
  
  if(user){
    user.name = req.body.name;//更新情報
    user.email = req.body.email;
    //パスは別ifにする
    if(req.body.password)
      user.password = req.body.password;
  }
  //avatarの更新
  if(req.body.avatar !== ''){//空でなければ
    const image_id = user.avatar.public_id;

      //ユーザーの前画像削除クラウドのやつ
      await cloudinary.v2.uploader.destroy(image_id)

      const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'bookit/avatars',
        width:'150',
        crop:'scale',
      })
      //画像の更新
      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      }
  }
  await user.save();//ユーザー情報保存

  res.status(200).json({
    success:true,
    // user　消す 
  })
})


// パスワード忘れた時 => /api/password/forgot
const forgotPassword = catchAsyncErrors(async (req,res,next) =>{

  const user = await User.findOne({email:req.body.email})//メールだけで調べる

  if(!user){//メールがない場合
    return next(new ErrorHandler('そのメールのユーザーが見つかりません',404))
  }

  //リセットトークン取得
  const resetToken = user.getResetPasswordToken();
  //データベース保存
  await user.save({validateBeforeSave: false })

  //原点に帰る
  const {origin} = absoluteUrl(req)

  //リセットパスワードURLを作る npm i next-absolute-url
  const resetUrl = `${origin}/password/reset/${resetToken}`

  const message = `あなたのパスワードリセットURLは以下の通りです \n\n 
                  ${resetUrl} \n\n 
                  もし身に覚えがなければ無視してください
                  `

  try {//メール送信
    await sendEmail({
      email: user.email,
      subject: 'BooKITのパスワードリカバリーです', 
      message
    })
    
    res.status(200).json({
        success:true,
        message: `メールを送信しました：${user.email}`
      })

  } catch (error) {//送信エラーの場合
    user.resetPasswordToken = undefined//modalインポ？
    user.resetPasswordExpire = undefined 

    await user.save({validateBeforeSave: false})//保存

    return next(new ErrorHandler(error.message, 500))
  }


})


// リセットパスワード => /api/password/reset/:token　通知
const resetPassword = catchAsyncErrors(async (req,res,next) =>{

  //ハッシュURLトークン
  const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex')
  //ユーザtokenを探す
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}//mongodbの日付保存ルール期限
    })

  if(!user){
    return next(new ErrorHandler('パスワードリセットトークンが無効か期限切れです',400))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler('パスワードが一致しません',400))
  }

  //新しいパスワードをセット
  user.password = req.body.password
  user.resetPasswordToken = undefined//トークンは消す
  user.resetPasswordExpire = undefined//トークン期限も消す

  await user.save()
  //成功したら
  res.status(200).json({
    success: true,
    message:'パスワードの更新が完了しました'
  })
})


// 全管理ユーザー取得 => /api/admin/users
const allAdminUsers = catchAsyncErrors(async (req,res,) =>{

  const users = await User.find()

  res.status(200).json({
    success:true,
    users
  })
})

// 管理ユーザーの詳細 => /api/admin/users/:id
const getUserDetails = catchAsyncErrors(async (req,res,) =>{

  const user = await User.findById(req.query.id)

  if(!user){
    return next(new ErrorHandler('そのIDのユーザーは見つかりません',404))
  }
  res.status(200).json({
    success:true,
    user
  })
})

// 管理ユーザーの詳細のupdate => /api/admin/users/:id
const updateUser = catchAsyncErrors(async (req,res,) =>{

  //更新用データ
  const newUserData = {
    name: req.body.name,
    email:req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.query.id, newUserData,{//更新用関数
    //オプション
    new: true,//?
    runValidators:true,//?
    useFindAndModify: false//?
  })

  res.status(200).json({
    success:true,//サクセスだけで良いっぽい
  })
})

// 管理ユーザーの削除 => /api/admin/users/:id
const deleteUser = catchAsyncErrors(async (req,res,) =>{

  const user = await User.findById(req.query.id)

  if(!user){
    return next(new ErrorHandler('そのIDのユーザーは見つかりません',404))
  }
  //アバタ削除
  const image_id = user.avatar.public_id
  await cloudinary.v2.uploader.destroy(image_id)

  await user.remove()


  res.status(200).json({
    success:true,
    user
  })
})

export{
  registerUser,
  currentUserProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  allAdminUsers,
  getUserDetails,
  updateUser,
  deleteUser,
}
