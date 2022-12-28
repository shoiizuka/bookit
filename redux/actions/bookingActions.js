//ユーザー情報dbと通信
import axios from 'axios'
import absoluteUrl from 'next-absolute-url'//originを使うため
import { 
  CHECK_BOOKING_REQUEST,
  CHECK_BOOKING_SUCCESS,
  CHECK_BOOKING_FAIL,
  BOOK_DATES_SUCCESS,
  BOOK_DATES_FAIL,
  MY_BOOKINGS_SUCCESS,
  MY_BOOKINGS_FAIL,
  BOOKING_DETAILS_SUCCESS,
  BOOKING_DETAILS_FAIL,
  ADMIN_BOOKINGS_REQUEST,
  ADMIN_BOOKINGS_SUCCESS, 
  ADMIN_BOOKINGS_FAIL,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAIL,
  CLEAR_ERRORS,
    } from '../constants/bookingConstants'

  //予約確認
  export const checkBooking = ( roomId,checkInDate,checkOutDate ) => async(dispatch) =>{
    try {
      dispatch({ type:CHECK_BOOKING_REQUEST })

      let link = `/api/bookings/check?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`//bookingControllerに繋がってる

      const {data} = await axios.get(link)

      dispatch({
        type: CHECK_BOOKING_SUCCESS,
        payload: data.isAvailable
      })
      
    } catch (error) {
      dispatch({
        type: CHECK_BOOKING_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //予約日の取得
  export const getBookedDates = ( id ) => async(dispatch) =>{
    try {

      const {data} = await axios.get(`/api/bookings/check_booked_dates?roomId=${id}`)

      dispatch({
        type: BOOK_DATES_SUCCESS,
        payload: data.bookedDates
      })
      
    } catch (error) {
      dispatch({
        type: BOOK_DATES_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //予約した部屋
  export const myBookings = ( authCookie , req) => async(dispatch) =>{
    try {
      //共通サーバ
      const {origin} = absoluteUrl(req)
      //pages/me.jsのCookie用
      const config = {
        headers:{
          cookie: authCookie
        }
      }
      //クッキー情報渡す
      const {data} = await axios.get(`${origin}/api/bookings/me`,config)

      dispatch({
        type: MY_BOOKINGS_SUCCESS,
        payload: data.bookings
      })
      
    } catch (error) {
      dispatch({
        type: MY_BOOKINGS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理者用予約した部屋
  export const getAdminBookings = ( ) => async(dispatch) =>{
    try {
      dispatch({type: ADMIN_BOOKINGS_REQUEST})//リクエスト

      const {data} = await axios.get(`/api/admin/bookings/`)//ここからのデータ

      dispatch({
        type: ADMIN_BOOKINGS_SUCCESS,//サクセス
        payload: data.bookings
      })
      
    } catch (error) {
      dispatch({
        type: ADMIN_BOOKINGS_FAIL,//サクセス
        payload: error.response.data.message
      })
    }
  }

  //管理者用予約した部屋の削除
  export const deleteBooking = (id) => async(dispatch) =>{//予約id?
    try {
      dispatch({type: DELETE_BOOKING_REQUEST})

      const {data} = await axios.delete(`/api/admin/bookings/${id}`)

      dispatch({
        type: DELETE_BOOKING_SUCCESS,
        payload: data.success
      })
      
    } catch (error) {
      dispatch({
        type: DELETE_BOOKING_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //予約した部屋の詳細　予約した部屋とほぼ同じ
  export const getBookingDetails = ( authCookie, req, id) => async(dispatch) =>{
    try {
    
      const {origin} = absoluteUrl(req);
      //pages/me.jsのCookie用
      const config = {
        headers:{
          cookie: authCookie
        }
      }
      //クッキー情報渡す
      const {data} = await axios.get(`${origin}/api/bookings/${id}`,config)

      dispatch({
        type: BOOKING_DETAILS_SUCCESS,
        payload: data.booking
      })
      
    } catch (error) {
      dispatch({
        type: BOOKING_DETAILS_FAIL,
        payload: error.response.data.message
      })
    }
  }



  //CLEAR_ERRORS
  export const clearErrors = () => async(dispatch) => {
    dispatch({
      type: CLEAR_ERRORS,
    })
  }