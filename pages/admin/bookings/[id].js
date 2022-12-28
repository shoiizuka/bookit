//管理者用：予約した部屋の詳細コンポーネントをページに表示
import React from 'react'
import {getSession} from 'next-auth/react'
import Layout from '../../../components/layout/Layout'
import {wrapper} from '../../../redux/store'
import BookingDetails from '../../../components/bookings/BookingDetails'
import { getBookingDetails } from "../../../redux/actions/bookingActions";

const BookingDetailsPage = () =>{
  return(
    <Layout title="予約の詳細：管理者用">
      <BookingDetails/>
    </Layout>   
  )
}

//ログインしてなければログインさせるdevtoolと連携
export const getServerSideProps = wrapper.getServerSideProps(store => async({req, params}) =>{
  const session = await getSession({ req })//リクエスト送る
  if(!session || session.user.role === 'admin' ){//ユーザーでないか管理ユーザーでない場合
    return{
      redirect:{
        destination: '/login',
        parmanent:false 
      }
    }
  }
  //バックエンドクッキーを維持したままidを渡すからparams？
  await store.dispatch(getBookingDetails(req.headers.cookie , req, params.id))

})

export default BookingDetailsPage