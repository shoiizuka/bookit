//管理者ルームコンポーネント
import React, {useEffect} from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader'

import { getAdminRooms,deleteRoom } from '../../redux/actions/roomActions';

import {DELETE_ROOM_RESET } from '../../redux/constants/roomConstants';//追加


const AllRooms = () =>{

  const dispatch = useDispatch()
  const router = useRouter()

  const {loading , error, rooms} = useSelector(state => state.allRooms)
  const { error:deleteError, isDeleted} = useSelector(state => state.room)//roomから持ってくるっぽい

  useEffect(()=>{
    dispatch(getAdminRooms())
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(deleteError){//追加
      toast.error(deleteError);
      dispatch(clearErrors())
    }
    if(isDeleted){//追加
      router.push('/admin/rooms')
      dispatch({type: DELETE_ROOM_RESET})//何でこれなのかはわからん
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,deleteError,isDeleted])

  const setRooms = () => {
    const data = {
      columns:[
        {
          label: 'Room ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Price/Night',
          field: 'price',
          sort: 'asc',
        },
        {
          label: 'Category',
          field: 'category',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows:[//行
      ]
    }

    //行の配列に追加していく
    rooms && rooms.forEach(room => {
      data.rows.push({
        id: room._id,
        name:room.name,
        price:`$${room.pricePerNight}`,
        category:room.category,
        actions:
        <>
          <Link href={`/admin/rooms/${room._id}`}>
            <a href='' className='btn btn-primary'>
              <i className='fa fa-pencil'></i>
            </a>
          </Link>

          <button 
            className='btn btn-danger mx-2' 
            onClick={() => deleteRoomHandler(room._id)}//_idとidの違いがわからん
            >
            <i className='fa fa-trash'></i>
          </button>
        </>
      })
    });
    return data;
  }

  //削除処理
  const deleteRoomHandler = (id) =>{//ルームidを渡す
    dispatch(deleteRoom(id))//action
  }

  return(
    <div className='container container-fluid'>
      {loading ? <Loader/> : //ロード中であればロード画面
        <>
          <h1 className='my-5'>{`${rooms && rooms.length} 部屋あります`}
            <Link href='/admin/rooms/new'>
              <a className='mt-0 btn text-white float-right new-room-btn'>部屋を登録する</a>
            </Link>
          </h1>

          <MDBDataTable
            data={setRooms()}//アニメーション表示
            className='px-3'
            bordered
            striped
            hover
            />
        </>
      }
    </div>
  )
}

export default AllRooms