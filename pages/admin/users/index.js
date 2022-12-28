//管理者ユーザーの表示
import React from "react";
import {getSession} from 'next-auth/react'
import AllUsers from '../../../components/admin/AllUsers'
import Layout from '../../../components/layout/Layout'

const AllUsersPage = () =>{
  return(
    <Layout title="全管理者ユーザー">
      <AllUsers/>
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

export default AllUsersPage