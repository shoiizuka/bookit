//ログインユーザーの情報更新
import React from "react";
import {getSession} from 'next-auth/react'//切り替えのバックエンド
//プロファイルを表示させる
import Profile from '../../components/user/Profile'
import Layout from '../../components/layout/Layout'

const UpdateProfilePage= () =>{
  return(
    <Layout title="プロフィール更新">
      <Profile/>
    </Layout>   
  )
}

//ログインしてなければログインさせる
export async function getServerSideProps(context) {
  
  const session = await getSession({ req:context.req })

  if(!session){
    //ログインしていない状態
    return{
      redirect:{
        destination: '/login',//ページに飛ばす
        parmanent:false //常にリセットさせる？
      }
    }
  }

  return {
    props: { session }
  }

}

export default UpdateProfilePage