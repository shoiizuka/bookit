import React, {useEffect} from 'react'

import Pagination from 'react-js-pagination';//ページネーション
import { useRouter } from 'next/router';//ペジネ用

import {useDispatch,useSelector} from 'react-redux'
import  RoomItem from './room/RoomItem';
import {toast} from 'react-toastify'
import { clearErrors } from "../redux/actions/roomActions";
import Link from 'next/link';

const Home = () => {
  const dispatch = useDispatch()
  const router = useRouter()//


  //データを渡す　ペジネ用データ
  const {rooms,resPerPage,roomsCount,filteredRoomsCount,error} = useSelector(state=> state.allRooms);
  console.log(rooms)

  //表示の上書き
  let { location,page = 1 } = router.query;
  page = Number(page)//現在ページ

  useEffect(()=>{
      toast.error(error)
      dispatch(clearErrors)
    })

  //ページNoが最後にくる
  let queryParams;
  if(typeof window !== 'undefined'){
    queryParams = new URLSearchParams(window.location.search)
  }

  //ペジネ機能
  const handlePagination = (pageNumber) =>{
    // router.push(`/?page=${pageNumber}`)
    //ページNo.が最後に来るようになった
    if(queryParams.has('page')){
      queryParams.set('page',pageNumber)
    }else{
      queryParams.append('page',pageNumber)
    }
    router.replace({
      search: queryParams.toString()
    })
  }

  //検索
  let count = roomsCount;
  if(location){
    count = filteredRoomsCount
  }

  return(
    <>
      <section id="rooms" className="container mt-5">
        <h2 className='mb-3 ml-2 stays-heading'>{location ? `Rooms in ${location}` : '全ての部屋'}</h2>

        <Link href='/search' >
          <a className='ml-2 back-to-search'>
            <i className='fa fa-arrow-left'></i> Back to Search
          </a>
        </Link>

    {/* ルーム取得表示 */}
        <div className="row">
          {rooms && rooms.length === 0 ?//roomない
            <div className='alert alert-danger mt-5 w-100'><b>ルームがありません</b></div>
            ://room有り
            rooms && rooms.map(room =>(
              <RoomItem key={room._id} room={room}/>
            ))
          }
        </div>    
      </section>

    {/* ページネーション表示 */}
    {resPerPage < count && //旧rooomsCount
      <div className='d-flex justify-content-center mt-5'>
        <Pagination
          activePage={page}
          itemsCountPerPage={resPerPage}
          totalItemsCount={roomsCount}
          onChange={handlePagination}//関数作成
          nextPageText={'Next'}
          prevPageText={'Prev'}
          firstPageText={'First'}
          lastPageText={'Last'}
          itemClass='page-item'//cssの色に
          linkClass='page-link'//cssの色に 
        ></Pagination>
      </div>
    }
  </>
  )
}

export default Home