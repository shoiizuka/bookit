//room詳細ページ
import RoomDetails from '../../components/room/RoomDetails'
import Layout from '../../components/layout/Layout'
import {getRoomDetails} from '../../redux/actions/roomActions'//action
import {wrapper} from '../../redux/store'//store


export default function RoomDetailsPage() {
  return (
    <Layout>
      <RoomDetails title='Room Details'/>
    </Layout>
  )
}
//プリレン
export const getServerSideProps = wrapper.getServerSideProps(store => async ({req,params}) =>{

  await store.dispatch(getRoomDetails(req , params.id))//roomDetails.jsでidを使う為

})