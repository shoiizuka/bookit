//予約レデューサ
import {
  CHECK_BOOKING_REQUEST,
  CHECK_BOOKING_SUCCESS,
  CHECK_BOOKING_RESET,  
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
  DELETE_BOOKING_RESET,  
  DELETE_BOOKING_FAIL,

  CLEAR_ERRORS,
  } from '../constants/bookingConstants'

//予約確認 reducer利用可能かは初期は無しになる
export const checkBookingReducer = (state = { available:null },action) => {
  switch (action.type) {
    case CHECK_BOOKING_REQUEST:
      return{
        loading:true,
      }
    case CHECK_BOOKING_SUCCESS:
      return{
        loading:false,
        available:action.payload//利用可能かどうか
      }
    case CHECK_BOOKING_RESET:
      return{
        loading:false,
        available:null
      }
    case CHECK_BOOKING_FAIL:
      return{
        loading:false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return{
        ...state,
        error: null
      }
    default: //それ以外の時
      return state
  }
}

//予約されたすべての日を取得
export const bookedDatesReducer = (state = { dates:[] },action) => {
  switch (action.type) {
   
    case BOOK_DATES_SUCCESS:
      return{
        loading:false,
        dates:action.payload
      }
   
    case BOOK_DATES_FAIL:
      return{
        loading:false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return{
        ...state,
        error: null
      }
    default: 
      return state
  }
}

//予約された部屋を取得
export const bookingsReducer = (state = { bookings:[] },action) => {//予約したものを空に入れる
  switch (action.type) {
   
    case ADMIN_BOOKINGS_REQUEST://ここに書く
      return{
        loading:true,
      }
    case MY_BOOKINGS_SUCCESS:
    case ADMIN_BOOKINGS_SUCCESS://追加
      return{
        loading:false,
        bookings:action.payload
      }
    case MY_BOOKINGS_FAIL:
    case ADMIN_BOOKINGS_FAIL://同じ処理なのでここで良いっぽい
      return{
        loading:false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return{
        ...state,
        error: null
      }
    default: 
      return state
  }
}

//予約された部屋の詳細を取得
export const bookingDetailsReducer = (state = { booking:{} },action) => {//bookingでオブにする
  switch (action.type) {
    case BOOKING_DETAILS_SUCCESS:
      return{
        loading:false,
        booking:action.payload
      }
   
    case BOOKING_DETAILS_FAIL:
      return{
        loading:false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return{
        ...state,
        error: null
      }
    default: 
      return state
  }
}

//管理者用 予約ルームの削除 reducer
export const bookingReducer = (state = { },action) => {//第一引数は消すっぽい
  switch (action.type) {
    case DELETE_BOOKING_REQUEST:
      return{
        loading:true,
      }
    case DELETE_BOOKING_SUCCESS:
      return{
        loading:false,
        isDeleted:action.payload
      }
    case DELETE_BOOKING_RESET:
      return{
        loading:false,
        isDeleted:false//falseらしい
      }
    case DELETE_BOOKING_FAIL:
      return{
        loading:false,
        error: action.payload
      }
    case CLEAR_ERRORS:
      return{
        ...state,
        error: null
      }
    default: //それ以外の時
      return state
  }
}