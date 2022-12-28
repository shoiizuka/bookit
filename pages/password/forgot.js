// パスワード忘れ送信ページ
import React from "react";
import ForgotPassword from '../../components/user/ForgotPassword'
import Layout from '../../components/layout/Layout'

const ForgotPasswordPage = () =>{
  return(
  <Layout title="パスワードを忘れ送信ページ">
    <ForgotPassword/>
  </Layout>   
  )
}

export default ForgotPasswordPage