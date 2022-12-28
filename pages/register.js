//登録ページ
import Register from '../components/auth/Register'
import Layout from '../components/layout/Layout'
//切り替えのバックエンド
import {getSession} from 'next-auth/react'


export default function RegisterPage() {
  return (
    <Layout title='登録ページ'>
      <Register/>
    </Layout>
  )
}

//ログインしてなければログインさせる登録＝ログイン
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
