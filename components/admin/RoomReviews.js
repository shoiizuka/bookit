//管理者ルームレビューコンポーネント
import React, {useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader'

import { getRoomReviews,deleteReview ,clearErrors} from '../../redux/actions/roomActions';
import {DELETE_REVIEW_RESET } from '../../redux/constants/roomConstants';

const RoomReviews = () =>{

  const [roomId, setRoomId] = useState('')//これは新しく設定するやつか？
  const dispatch = useDispatch()
  const router = useRouter()

  const {loading , error, reviews} = useSelector(state => state.roomReviews)//roomReducerから
  const {error:deleteError, isDeleted} = useSelector(state => state.review)//deleteErroeは新規

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(roomId !== ''){//roomidが空でないなら
      dispatch(getRoomReviews(roomId))//roomAction接続
    }
    if(deleteError){//追加
      toast.error(deleteError);
      dispatch(clearErrors())
    }
    if(isDeleted){//追加
      toast.success('レビューを削除しました')
      dispatch({type: DELETE_REVIEW_RESET})
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,roomId,deleteError,isDeleted])

//ここでレビューのデータを定義
  const setReviews = () => {
    const data = {
      columns:[
        {
          label: 'Review ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Rating',
          field: 'rating',
          sort: 'asc',
        },
        {
          label: 'Comment',
          field: 'comment',
          sort: 'asc',
        },
        {
          label: 'User',
          field: 'user',
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
    reviews && reviews.forEach(review => {
      data.rows.push({
        id: review._id,
        rating:review.rating,
        comment:review.comment,
        user:review.name,
        actions:
        
        <button 
          className='btn btn-danger mx-2' 
          onClick={()=>deleteReviewHandler(review._id)}//削除ボタン
          >
          <i className='fa fa-trash'></i>
        </button>
      })
    });
    return data;
  }
  //削除処理
  const deleteReviewHandler = (id) =>{
    dispatch(deleteReview(id,roomId))//actionからなので２つ必要
  }
  return(
    <div className='container container-fluid'>
      <div className='row justify-content-center mt-5'>
        <div className='col-5'>
          <form>
            <div className="form-group">
                <label htmlFor="roomId_field">RoomIDを入れてください</label>
                <input
                    type="email"//emailなのか？ 検索窓になってる
                    id="roomId_field"
                    className="form-control"
                    value={roomId}//これはどこからのやつ
                    onChange={(e)=> setRoomId(e.target.value)}
                />
            </div>
          </form> 
        </div>
      </div>
      {reviews && reviews.length > 0  ? 
        //レビューがあるなら
        <MDBDataTable
          data={setReviews()}//データを表示させる
          className='px-3'
          bordered
          striped
          hover
        />
      ://レビューがないなら
      <div className='alert alert-danger mt-5 text-center'>レビューがありません</div>
      }
    </div>
  )
}

export default RoomReviews