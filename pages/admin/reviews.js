//管理者用ユーザーレビューの表示ページ
import React from "react";
import {getSession} from 'next-auth/react'
import RoomReviews from '../../components/admin/RoomReviews'
import Layout from '../../components/layout/Layout'

const RoomReviewsPage = () =>{
  return(
    <Layout title="管理者ルームレビュー">
      <RoomReviews/>
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
        destination: '/login',
        parmanent:false 
      }
    }
  }
  return {
    props: { }
  }
}

export default RoomReviewsPage