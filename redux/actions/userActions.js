//ユーザー情報dbと通信
import axios from 'axios'
import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,//リセットはいらない
  UPDATE_PROFILE_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST, 
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ADMIN_USERS_REQUEST, 
  ADMIN_USERS_SUCCESS,
  ADMIN_USERS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  UPDATE_USER_REQUEST,//リセットはいらない
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_REQUEST,//管理ユーザー更新
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,//リセットはいらない
  DELETE_USER_FAIL,
  CLEAR_ERRORS
  } from '../constants/userConstants'

  //ユーザー登録
  export const registerUser = ( userData ) => async(dispatch) =>{
    try {
      dispatch({ type:REGISTER_USER_REQUEST })
      const config ={//?
        headers:{
          'Content-Type':'application/json'//?
        }
      }

      const {data} = await axios.post('/api/auth/register',userData, config )

      dispatch({
        type: REGISTER_USER_SUCCESS,
      })
      
    } catch (error) {
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //ロードユーザー
  export const loadUser = (  ) => async(dispatch) =>{
    try {
      dispatch({ type:LOAD_USER_REQUEST });

      //meからデータを引っ張る
      const {data} = await axios.get('/api/me')

      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: data.user
      })
      
    } catch (error) {
      dispatch({
        type: LOAD_USER_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //ユーザープロフィール更新
  export const updateProfile = ( userData ) => async(dispatch) =>{
    try {
      dispatch({ type:UPDATE_PROFILE_REQUEST })
      const config ={//?
        headers:{
          'Content-Type':'application/json'//?
        }
      }

      const {data} = await axios.put('/api/me/update',userData, config )

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: data.success//追加
      })
      
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //パスワード再発行
  export const forgotPassword = ( email ) => async(dispatch) =>{
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST })
      const config ={//?
        headers:{
          'Content-Type':'application/json'//?
        }
      }

      // このURLはpagesだよな？
      const {data} = await axios.post('/api/password/forgot',email, config )

      dispatch({
        type:   FORGOT_PASSWORD_SUCCESS,
        payload: data.message
      })
      
    } catch (error) {
      dispatch({
        type:   FORGOT_PASSWORD_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //パスワードリセット
  export const resetPassword = ( token,passwords ) => async(dispatch) =>{//passwordsになる
    try {
      dispatch({ type: RESET_PASSWORD_REQUEST })
      const config ={
        headers:{
          'Content-Type':'application/json'
        }
      }
      // 更新
      const {data} = await axios.put(`/api/password/reset/${token}`,passwords, config )

      dispatch({
        type:   RESET_PASSWORD_SUCCESS,
        payload: data.success
      })
      
    } catch (error) {
      dispatch({
        type:   RESET_PASSWORD_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理ユーザー全て取得
  export const getAdminUsers = ( ) => async(dispatch) =>{//passwordsになる
    try {
      dispatch({ type: ADMIN_USERS_REQUEST })
  
      const {data} = await axios.get(`/api/admin/users` )

      dispatch({
        type:   ADMIN_USERS_SUCCESS,
        payload: data.users//ユーザーズを吐き出し
      })
      
    } catch (error) {
      dispatch({
        type:   ADMIN_USERS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理ユーザー詳細取得
  export const getUserDetails = (id ) => async(dispatch) =>{//何でここidなの？渡すやつって事？
    try {
      dispatch({ type: USER_DETAILS_REQUEST })
  
      const {data} = await axios.get(`/api/admin/users/${id}` )//ここでidを使うから

      dispatch({
        type:   USER_DETAILS_SUCCESS,
        payload: data.user
      })
      
    } catch (error) {
      dispatch({
        type:   USER_DETAILS_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理ユーザー情報更新
  export const updateUser = (id ,userData) => async(dispatch) =>{//idとuserデータ
    try {
      dispatch({ type: UPDATE_USER_REQUEST })

      const config ={
        headers:{
          'Content-Type':'application/json'
        }
      }
      //更新にはid　userデータ、コンフィグ
      const {data} = await axios.put(`/api/admin/users/${id}`,userData, config)

      dispatch({
        type:   UPDATE_USER_SUCCESS,
        payload: data.success//サクセスらしい
      })
      
    } catch (error) {
      dispatch({
        type:   UPDATE_USER_FAIL,
        payload: error.response.data.message
      })
    }
  }

  //管理ユーザー削除
  //レデュは同じだけどアクションは分けるっぽい
  export const deleteUser = (id ) => async(dispatch) =>{//何でここidなの？渡すやつって事？
    try {
      dispatch({ type: DELETE_USER_REQUEST })
  
      const {data} = await axios.delete(`/api/admin/users/${id}` )

      dispatch({
        type:   DELETE_USER_SUCCESS,
        payload: data.success
      })
      
    } catch (error) {
      dispatch({
        type:   DELETE_USER_FAIL,
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