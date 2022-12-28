//ルーム編集
import React from "react";
import {getSession} from 'next-auth/react'
import UpdateRoom from '../../../components/admin/UpdateRoom'
import Layout from '../../../components/layout/Layout'

const UpdateRoomPage = () =>{
  return(
    <Layout title="管理者ルームの編集">
      <UpdateRoom/>
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

export default UpdateRoomPage