import Home from '../components/Home'
import Layout from '../components/layout/Layout'
//全roomactionを読み込む
import {getRooms} from '../redux/actions/roomActions'
//storeの機能読み込み
import {wrapper} from '../redux/store'

export default function Index() {
  return (
    <Layout>
      <Home/>
    </Layout>
  )
}
//プリレンダリングstoreにgetroomアクションをつなぐnoteで修正
//queryでストア管理
export const getServerSideProps = wrapper.getServerSideProps(store=> async ({req,query}) =>{

  await store.dispatch(getRooms(
    req,
    query.page,
    query.location,
    query.guests,
    query.category
    ))

})