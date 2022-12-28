//userファイル
// import mongoose from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs"
//エラーによりこっちに修正
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//パスワード忘れた用
const crypto = require('crypto');



const userSchema = new mongoose.Schema({//userデータ新規作成
  name:{
    type:String,
    required: [true,'名前を入れてください'],
    maxLength:[50,'50文字以内にして下さい']
  },
  email:{
    type:String,
    required: [true,'メールアドレスを入れてください'],
    unique:true,
    validate:[validator.isEmail,'有効なメールにしてください'],
  },
  password:{
    type:String,
    required: [true,'パスワードを入れてください'],
    minLength:[6,'６文字以上にして下さい'],
    select: false
  },
  avatar:{
    public_id:{
      type:String,
      required:true,
    },
    url:{
      type:String,
      required:true,
    },
  },
  role:{//役割
    type:String,
    default:'user'
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
})

//ユーザ登録前にパスワード暗号化
userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next()
  }
  this.password = await bcrypt.hash(this.password,10)
})

//ユーザーパスワードを合わせるログイン用
userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)//thisはdbから
}

//パスワードリセットトークン生成
userSchema.methods.getResetPasswordToken = function() {
  //トークン作成20文字暗号
  const resetToken = crypto.randomBytes(20).toString('hex')

  //リセットトークンをセットするsha258はアルゴリズム
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //トークンの有効期限30分
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 

  return resetToken;
  
}


//ユーザが存在する場合かユーザーにスキーマを新規登録する
module.exports = mongoose.models.User || mongoose.model('User', userSchema)