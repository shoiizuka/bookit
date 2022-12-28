import axios from 'axios'//非同期暗号通信
import absoluteUrl from 'next-absolute-url'//localhostURLが取得できるっぽい

//roomconstansを入れる
import {
  ALL_ROOMS_SUCCESS,
  ALL_ROOMS_FAIL,
  ROOM_DETAILS_SUCCESS,
  ROOM_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  REVIEW_AVAILABILITY_REQUEST,
  REVIEW_AVAILABILITY_SUCCESS, 
  REVIEW_AVAILABILITY_FAIL,
  ADMIN_ROOMS_REQUEST,
  ADMIN_ROOMS_SUCCESS, 
  ADMIN_ROOMS_FAIL,
  NEW_ROOM_REQUEST,//actionにはリセットはいらない
  NEW_ROOM_SUCCESS, 
  NEW_ROOM_FAIL,
  UPDATE_ROOM_REQUEST,
  UPDATE_ROOM_SUCCESS, //actionにはリセットはいらない
  UPDATE_ROOM_FAIL,
  DELETE_ROOM_REQUEST,
  DELETE_ROOM_SUCCESS, 
  DELETE_ROOM_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS, 
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,  
  DELETE_REVIEW_FAIL,

  CLEAR_ERRORS,
    } from '../constants/roomConstants'

  //全てのroomを取得
  export const getRooms = ( req,currentPage = 1, location='',guests,category ) => async(dispatch) =>{
    try {
      //localhostになる
      const {origin} = absoluteUrl(req)
      //dataの中
      let link =`${origin}/api/rooms?page=${currentPage}&location=${location}`
        if(guests)link = link.concat(`&guestCapacity=${guests}`) //条件分岐でリンクに足す
        if(category)link = link.concat(`&category=${category}`) //条件分岐でリンクに足す

      const {data} = await axios.get(link)

      dispatch({//運ぶ
        type: ALL_ROOMS_SUCCESS,
        payload:data//全roomのデータが入る
      })
      
    } catch (error) {
      dispatch({
        type: ALL_ROOMS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //roomの詳細を取得
  export const getRoomDetails = (req,id) => async(dispatch) =>{
    try {
      
      const {origin} = absoluteUrl(req)

      //リクエストの場合??
      let url;
      if(req){
        url = `${origin}/api/rooms/${id}`
      }else{
        //idが入ってた場合
        url = `/api/rooms/${id}`
      }

      const {data} = await axios.get(url)

      dispatch({
        type: ROOM_DETAILS_SUCCESS,
        payload:data.room
      })
      
    } catch (error) {
      dispatch({
        type: ROOM_DETAILS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理者用roomを取得
  export const getAdminRooms = ( ) => async(dispatch) =>{
    try {
      //コンステンスと接続にはdispatch使う
      dispatch({type: ADMIN_ROOMS_REQUEST})

      const {data} = await axios.get(`/api/admin/rooms`)

      dispatch({
        type: ADMIN_ROOMS_SUCCESS,
        payload:data.rooms
      })
      
    } catch (error) {

      dispatch({
        type: ADMIN_ROOMS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理者用roomの削除
  export const deleteRoom = (id) => async(dispatch) =>{//roomのidを渡す
    try {
      dispatch({ type:DELETE_ROOM_REQUEST})
      
      const {data} = await axios.delete(`/api/rooms/${id}` )//idのルームを削除

      dispatch({
        type: DELETE_ROOM_SUCCESS,
        payload:data.success
      })
      
    } catch (error) {
      dispatch({
        type: DELETE_ROOM_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //roomに新しいレビュ投稿
  export const newReview = (reviewData) => async(dispatch) =>{//コントローラのデータ
    try {
      dispatch({ type:NEW_REVIEW_REQUEST})
      
      const config = {
        headers:{
          'Content-Type':'application/json'
        }
      }
      const {data} = await axios.put(`/api/reviews`,reviewData, config)//dbに保存

      dispatch({
        type: NEW_REVIEW_SUCCESS,
        payload:data.success
      })
      
    } catch (error) {
      dispatch({
        type: NEW_REVIEW_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //新しいroomを追加
  export const newRoom = (roomData) => async(dispatch) =>{//コントローラのデータ
    try {
      dispatch({ type: NEW_ROOM_REQUEST})
      
      const config = {
        headers:{
          'Content-Type':'application/json'
        }
      }
      const {data} = await axios.post(`/api/rooms`,roomData, config)//apiのルームデータ

      dispatch({
        type: NEW_ROOM_SUCCESS,
        payload:data, //データだけ渡す
      })
      
    } catch (error) {
      dispatch({
        type: NEW_ROOM_FAIL,
        payload: error.response.data.message
      })
    }
  }

  // 管理者用roomの更新
  export const updateRoom = (id,roomData) => async(dispatch) =>{//idはどこから？
    try {
      dispatch({ type: UPDATE_ROOM_REQUEST})
      
      const config = {
        headers:{
          'Content-Type':'application/json'
        }
      }
      const {data} = await axios.put(`/api/rooms/${id}`,roomData, config)//apiのルームデータ

      dispatch({
        type: UPDATE_ROOM_SUCCESS,
        payload:data.success, //このサクセスは何？
      })
      
    } catch (error) {
      dispatch({
        type: UPDATE_ROOM_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //レビュ投稿制限
  export const checkReviewAvailability = (roomId) => async(dispatch) =>{
    try {
      dispatch({ type:REVIEW_AVAILABILITY_REQUEST})
      
      //ルームID指定ってこと？
      const {data} = await axios.get(`/api/reviews/check_review_Availability?roomId=${roomId}`)

      dispatch({
        type: REVIEW_AVAILABILITY_SUCCESS,
        payload:data.isReviewAvailable//??
      })
      
    } catch (error) {
      dispatch({
        type: REVIEW_AVAILABILITY_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理者用レビュ取得
  export const getRoomReviews = (id) => async(dispatch) =>{
    try {
      dispatch({ type:GET_REVIEWS_REQUEST})
      
      const {data} = await axios.get(`/api/reviews/?id=${id}`)//このidは検索？違いわからん

      dispatch({
        type: GET_REVIEWS_SUCCESS,
        payload:data.reviews
      })
      
    } catch (error) {
      dispatch({
        type: GET_REVIEWS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理者用レビュ削除
  export const deleteReview = (id,roomId) => async(dispatch) =>{//roomidとは？？
    try {
      dispatch({ type:DELETE_REVIEW_REQUEST})
      
      const {data} = await axios.delete(`/api/reviews/?id=${id}&roomId=${roomId}`)//このurl指定謎

      dispatch({
        type: DELETE_REVIEW_SUCCESS,
        payload:data.success
      })
      
    } catch (error) {
      dispatch({
        type: DELETE_REVIEW_FAIL,
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