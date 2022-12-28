import {
  ALL_ROOMS_SUCCESS,
  ALL_ROOMS_FAIL,
  ROOM_DETAILS_SUCCESS,
  ROOM_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_RESET,  
  NEW_REVIEW_FAIL,
  REVIEW_AVAILABILITY_REQUEST,
  REVIEW_AVAILABILITY_SUCCESS, 
  REVIEW_AVAILABILITY_FAIL,
  ADMIN_ROOMS_REQUEST,
  ADMIN_ROOMS_SUCCESS, 
  ADMIN_ROOMS_FAIL,
  NEW_ROOM_REQUEST,
  NEW_ROOM_SUCCESS,
  NEW_ROOM_RESET,  
  NEW_ROOM_FAIL,
  UPDATE_ROOM_REQUEST,
  UPDATE_ROOM_SUCCESS,
  UPDATE_ROOM_RESET,  
  UPDATE_ROOM_FAIL,
  DELETE_ROOM_REQUEST,
  DELETE_ROOM_SUCCESS,
  DELETE_ROOM_RESET,  
  DELETE_ROOM_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS, 
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,  
  DELETE_REVIEW_FAIL,

  CLEAR_ERRORS
  } from '../constants/roomConstants'

//ALL rooms reducer
export const allRoomsReducer = (state = {rooms:[] },action) => {//dataとaction渡す
  switch (action.type) {
    case ADMIN_ROOMS_REQUEST://追加
      return{
        loading: true,
      }
    case ALL_ROOMS_SUCCESS:
      return{ //payloadはデータ
        roomsCount: action.payload.roomsCount,
        resPerPage: action.payload.resPerPage,
        filteredRoomsCount: action.payload.filteredRoomsCount,
        rooms: action.payload.rooms,
      }
    
    case ADMIN_ROOMS_SUCCESS://追加
      return{
        loading: false,
        rooms: action.payload
      }
      
    case ALL_ROOMS_FAIL:
    case ADMIN_ROOMS_FAIL://追加
      return{
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

//Room詳細 deteils reducer
export const roomDetailsReducer = (state = {room: {} },action) => {//roomは空オブ
  switch (action.type) {
    case ROOM_DETAILS_SUCCESS:
      return{
        //roomのactionだけ渡す
        room: action.payload
      }
      
    case ROOM_DETAILS_FAIL:
      return{
        error: action.payload
      }

    case CLEAR_ERRORS://一回クリアする
      return{
        ...state,
        error: null
      }
  
    default: //それ以外の時
      return state
  }
}

//新しいレビューreducer
export const newReviewReducer = (state = {},action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST://リクエストでロードする
      return{
        loading: true,
      }
    case NEW_REVIEW_SUCCESS:
      return{
        loading: false,//成功したらロード止める
        success: action.payload,
      }
    case NEW_REVIEW_RESET:
      return{
        success: false,//リセットしたら成功を止める
      }
    case NEW_REVIEW_FAIL:
      return{
        loading: false,//失敗したら成功を止める
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

//ルームの更新
export const roomReducer = (state = {},action) => {
  switch (action.type) {
    case UPDATE_ROOM_REQUEST:
    case DELETE_ROOM_REQUEST://更新と同時にデリート
      return{
        loading: true,
      }
    case UPDATE_ROOM_SUCCESS:
      return{
        loading: false,
        isUpdated: action.payload,
      }
    case DELETE_ROOM_SUCCESS://追加
      return{
        loading: false,
        isDeleted: action.payload
      }
    case UPDATE_ROOM_RESET:
      return{
        isUpdated: false,
      }
    case DELETE_ROOM_RESET://追加
    return{
      loading: false,
      isDeleted: false
    }
    case UPDATE_ROOM_FAIL:
    case DELETE_ROOM_FAIL://追加
      return{
        loading: false,
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

//新ルーム登録reducer
export const newRoomReducer = (state = { room:{} },action) => {//roomは空
  switch (action.type) {
    case NEW_ROOM_REQUEST:
      return{
        loading: true,
      }
    case NEW_ROOM_SUCCESS:
      return{
        loading: false,
        success: action.payload.success,//メッセージか？
        room: action.payload.room//room情報
      }
    case NEW_ROOM_RESET:
      return{
        success: false,//リセットしたら成功を止める
      }
    case NEW_ROOM_FAIL:
      return{
        loading: false,//失敗したら成功を止める
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

//レビュー制限reducer
export const checkReviewReducer = (state = { reviewAvailable: null },action) => {//null??

  switch (action.type) {
    case REVIEW_AVAILABILITY_REQUEST:
      return{
        loading: true,
      }
    case REVIEW_AVAILABILITY_SUCCESS:
      return{
        loading: false,
        reviewAvailable: action.payload,
      }
    case REVIEW_AVAILABILITY_FAIL:
      return{
        loading: false,
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

//管理者用レビューreducer
export const roomReviewsReducer = (state = { reviews: [] },action) => {//配列

  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return{
        loading: true,
      }
    case GET_REVIEWS_SUCCESS:
      return{
        loading: false,
        reviews: action.payload,
      }
    case GET_REVIEWS_FAIL:
      return{
        loading: false,
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

//管理者用レビュー削除
export const reviewReducer = (state = {},action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return{
        loading: true,
      }
    case DELETE_REVIEW_SUCCESS:
      return{
        loading: false,
        isDeleted: action.payload
      }
    case DELETE_REVIEW_RESET:
    return{
      loading: false,
      isDeleted: false
    }
    case DELETE_REVIEW_FAIL:
      return{
        loading: false,
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