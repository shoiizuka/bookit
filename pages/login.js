//ログインページ
import Login from '../components/auth/Login'
import Layout from '../components/layout/Layout'
//切り替えのバックエンド
import {getSession} from 'next-auth/react'

export default function LoginPage() {
  return (
    <Layout title='ログインページ'>
      <Login/>
    </Layout>
  )
}

//ログインしてなければログインさせる
export async function getServerSideProps(context) {
  
  const session = await getSession({ req:context.req })

  if(session){
    //ログインしている状態
    return{
      redirect:{
        destination: '/',//ホームページに飛ばす
        parmanent:false //常にリセットさせる？
      }
    }
  }

  return {
    props: { }
  }

}