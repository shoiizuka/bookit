//reduxの全てを管理するフォルダ。デバグ等も管理
import {applyMiddleware} from 'redux';//非同期
import {configureStore } from '@reduxjs/toolkit'//createStoreが非推奨だったので独自読込
import {HYDRATE,createWrapper} from 'next-redux-wrapper'//軽い暗号化状態
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers/reducers';


const bindMiddleware = (middleware) => {
  //管理画面モードの時  //中身無いならcromeのdevtoolを使えるようにする
  if(process.env.NODE_ENV !== 'production'){//完全不一致
    const {composeWithDevTools} = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }

  return applyMiddleware(...middleware)
}

//箱
const reducer = (state, action) =>{
  if (action.type === HYDRATE){
    const nextState = {
      ...state,
      ...action.payload//?
    }
    return nextState
  }else{
    return reducers(state,action)
  }
}

//storeの初期化
const initStore = () =>{
  return configureStore({reducer}, bindMiddleware([thunkMiddleware]))
}

export const wrapper = createWrapper(initStore)//デザイン