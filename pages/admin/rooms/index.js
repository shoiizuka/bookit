//管理者画面の表示
import React from "react";
import {getSession} from 'next-auth/react'
import AllRooms from '../../../components/admin/AllRooms'
import Layout from '../../../components/layout/Layout'

const AllRoomsPage = () =>{
  return(
    <Layout title="管理者用全ルーム">
      <AllRooms/>
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

export default AllRoomsPage