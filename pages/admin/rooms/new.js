//新規ルーム作成
import React from "react";
import {getSession} from 'next-auth/react'
import NewRoom from '../../../components/admin/NewRoom'
import Layout from '../../../components/layout/Layout'

const NewRoomPage = () =>{
  return(
    <Layout title="管理者用新規ルーム">
      <NewRoom/>
    </Layout>   
  )
}

//ログインしてなければログインさせる
export async function getServerSideProps(context) {
  
  const session = await getSession({ req:context.req })
//ログインしていない状態＋adminさん意外
  if(!session || session.user.role !=='admin'){
    return{
      redirect:{
        destination: '/login',//ページに飛ばす
        parmanent:false //常にリセットさせる？
      }
    }
  }

  return {
    props: { }
  }

}

export default NewRoomPage