import React from 'react'
import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'

import {ToastContainer} from 'react-toastify';//追加
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children, title='休日のベストのホテルを予約'}) => {
  return(
    //ヘッダーフッターは固定でチルドレンの内容が変わる
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>

      <Header/>
        <ToastContainer position='bottom-right'/>
   
        {children}
      <Footer/>
    </div>
  )
}

export default Layout