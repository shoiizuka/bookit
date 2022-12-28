//管理者ユーザー情報更新の表示update user
import React from "react";
import {getSession} from 'next-auth/react'
import UpdateUser from '../../../components/admin/UpdateUser'
import Layout from '../../../components/layout/Layout'

const UpdateUserPage = () =>{
  return(
    <Layout title="管理者ユーザ情報更新">
      <UpdateUser/>
    </Layout>   
  )
}

//ログインしてなければログインさせる
export async function getServerSideProps(context) {
  
  const session = await getSession({ req:context.req })
//ログインしていない状態＋adminさん意外
  if(!session || session.user.role !=='admin'){
    return{
      redirect:{
        destination: '/login',
        parmanent:false 
      }
    }
  }
  return {
    props: { }
  }
}

export default UpdateUserPage