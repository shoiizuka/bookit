import React from "react";
import {getSession} from 'next-auth/react'
import MyBookings from '../../components/bookings/MyBookings'
import Layout from '../../components/layout/Layout'

import {wrapper} from '../../redux/store'//これ何
import { myBookings } from "../../redux/actions/bookingActions";

//予約コンポーネントをページに表示
const MyBookingsPage= () =>{
  return(
    <Layout title="予約の表示">
      <MyBookings/>
    </Layout>   
  )
}

//ログインしてなければログインさせるdevtoolと連携
export const getServerSideProps = wrapper.getServerSideProps(store => async({req}) =>{
    const session = await getSession({ req })
  if(!session){
    //ログインしていない状態
    return{
      redirect:{
        destination: '/login',//ページに飛ばす
        parmanent:false //常にリセットさせる？
      }
    }
  }

  await store.dispatch(myBookings(req.headers.cookie,req))//バックエンドクッキー
})

export default MyBookingsPage