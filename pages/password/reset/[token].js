// 新しいパスワード表示ページ　リセットパスワード
import React from "react";

import NewPassword from '../../../components/user/NewPassword'
import Layout from '../../../components/layout/Layout'

const NewPasswordPage = () =>{
  return(
  <Layout title="リセットして新しいパスワード">
    <NewPassword/>
  </Layout>   
  )
}

export default NewPasswordPage