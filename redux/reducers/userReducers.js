//ユーザーレデューサ
import {
  REGISTER_USER_REQUEST, //登録
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,//ロード
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,//ユーザー更新
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_FAIL,
  CLEAR_ERRORS,
  FORGOT_PASSWORD_REQUEST,//パスワード再発行
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST, //パスワードリセット
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ADMIN_USERS_REQUEST,//管理ユーザー
  ADMIN_USERS_SUCCESS,
  ADMIN_USERS_FAIL,
  USER_DETAILS_REQUEST,//管理ユーザー詳細
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  UPDATE_USER_REQUEST,//管理ユーザー更新
  UPDATE_USER_SUCCESS,
  UPDATE_USER_RESET,
  UPDATE_USER_FAIL,
  DELETE_USER_REQUEST,//管理ユーザー更新
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,
  DELETE_USER_FAIL,
  } from '../constants/userConstants'


//処理を統一して切り替えバグをなくす
//auth reducer
export const authReducer = (state = { user:null },action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
      return{
        loading:true,
      }
    case REGISTER_USER_SUCCESS:
      return{
        loading:false,
        success:true,
      }
    case REGISTER_USER_FAIL:
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

//loadUser reducer
export const loadedUserReducer = (state = {loading:true,user:null },action) => {
  switch (action.type) {
    case LOAD_USER_REQUEST:
      return{
        loading:true,
        isAuthenticated:false,
      }
    case LOAD_USER_SUCCESS:
      return{
        loading:false,
        isAuthenticated:true, 
        user:action.payload
      }
    case LOAD_USER_FAIL:
      return{
        loading:false,
        isAuthenticated:false, 
        error:action.payload
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

//ユーザーreducer
export const userReducer = (state = {  },action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST://何でこのレデュにまとめるの？
      return{
        loading:true,
      }
    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return{
        loading:false,
        isUpdated:action.payload,
      }
    case DELETE_USER_SUCCESS://追加
      return{
        loading:false,
        isDeleted:action.payload,
      }
    case UPDATE_PROFILE_RESET:
    case UPDATE_USER_RESET:
      return{
        loading:false,
        isUpdated:false,
      }
    case DELETE_USER_RESET://追加
      return{
        loading:false,
        isUpdated:false,
      }
    case UPDATE_PROFILE_FAIL:
    case UPDATE_USER_FAIL:
    case DELETE_USER_FAIL://追加
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

//パスワード再発行とリセットパス
export const forgotPasswordReducer = (state = { }, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST://リセットパス
      return{
        loading:true,
      }
    case FORGOT_PASSWORD_SUCCESS:
      return{
        loading:false,
        message:action.payload,
      }
    case RESET_PASSWORD_SUCCESS://リセットパス
      return{
        loading:false,
        success:action.payload,
      }
    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL://リセットパス
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

//管理ユーザー全員 
export const allUsersReducer = (state = {users:[] },action) => {//usersは配列で管理
  switch (action.type) {
    case ADMIN_USERS_REQUEST:
      return{
        loading:true,
      }
    case ADMIN_USERS_SUCCESS:
      return{
        loading:false,
        users:action.payload
      }
    case ADMIN_USERS_FAIL:
      return{
        loading:false,
        error:action.payload
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

//管理ユーザー詳細 
export const userDetailsReducer = (state = {user:{} },action) => {//userは情報なのでオブジェクト 
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return{
        ...state,//追加
        loading:true,
      }
    case USER_DETAILS_SUCCESS:
      return{
        loading:false,
        user:action.payload
      }
    case USER_DETAILS_FAIL:
      return{
        loading:false,
        error:action.payload
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
