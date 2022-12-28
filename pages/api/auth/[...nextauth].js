//ログイン認証
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";//google,facebookログイン用
import User from "../../../modals/user"
import dbConnect from "../../../config/dbConnect"

export default NextAuth({
  // session:{
  //   jwt:true//トークン
  // },
  session:{
    strategy:'jwt'//トークンが文字列になる
  },
  providers:[//ここでgoogle Twitterを指定したログインができる
    CredentialsProvider({//?
      async authorize(credentials){

        dbConnect();//データベースmailを引っ張る
        const {email,password} = credentials

        //メールパスが入力されているか確認
        if(!email || !password){
          throw new Error('メールアドレスとパスワードを入力してください')
        }

        //データベースからユーザを見つける
        const user = await User.findOne({email}).select('+password')//パスはフィールド名
        if(!user){
          throw new Error('メールアドレスかパスワードが無効です')
        }

        //パスワードが正しいか確認
        const isPasswordMatched = await user.comparePassword(password);
        if(!isPasswordMatched){
          throw new Error('メールアドレスかパスワードが無効です')
        }

        //問題ない場合authorize出力
        return Promise.resolve(user)
      }
    })
  ],
  callbacks:{//もう一回使う時jwtを使うから必要
    jwt:async({token,user})=>{
      user && (token.user = user)
      return Promise.resolve(token)
    },
    session: async({session,token})=>{
      session.user = token.user//セッションユーザーとトークンユーザー
      return Promise.resolve(session)
    }
  }
})