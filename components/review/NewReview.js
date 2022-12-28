//新しいレビュー投稿のコンポーネント
import React,{useState, useEffect} from "react";
import {useRouter} from "next/router";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { newReview,clearErrors,checkReviewAvailability } from "../../redux/actions/roomActions";
import { NEW_REVIEW_RESET } from "../../redux/constants/roomConstants";

const NewReview = () =>{
  const [rating,setRating] = useState(0);
  const [comment,setComment] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { error,success } =  useSelector(state => state.newReview)
  //レデューサから持ってくる
  const { reviewAvailable } =  useSelector(state => state.checkReview)
  const {id} = router.query;

  useEffect(()=>{
    //レビュー制限
    if(id !== undefined){//ユーザーが入っていれば
      dispatch(checkReviewAvailability(id))//アクション実行
    }
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(success){
      toast.success('レビューが投稿されました')
      dispatch({type: NEW_REVIEW_RESET})
      router.push(`/room/${id}`)//リダイレクト
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,success,error,id])

  //レートとコメントを投稿する
  const submitHandler = () =>{
    const reviewData ={
      rating, comment, roomId: id
    }
    dispatch(newReview(reviewData))//actionで作
  }

  //星の計算と表示
  function setUserRatings(){
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index)=>{
      star.starValue = index + 1;

      ['click','mouseover','mouseout'].forEach(function (e){
        star.addEventListener(e, showRatings)//showRateingの関数がスタート
      });
    })

    function showRatings(e){//クリックしたら
      stars.forEach((star, index) =>{
        //クリックしたら
        if(e.type === 'click'){
          if(index < this.starValue){
            star.classList.add('red')//色を赤にする
            setRating(this.starValue)//星セット
          }else{
            star.classList.remove('red')//赤を外す
          }
        }
        //マウスが当たれば
        if(e.type === 'mouseover'){
          if(index < this.starValue){
            star.classList.add('light-red')//色を赤にする
          }else{
            star.classList.remove('light-red')//赤を外す
          }
        }
        //マウスが外れれば
        if(e.type === 'mouseout'){
          star.classList.remove('light-red')//赤を外す
        }
      })
    }

  }

  return(
    <>
    { reviewAvailable && //レデューサで許可されてるなら表示という事
      <button
        id="review_btn" 
        type="button" 
        className="btn btn-primary mt-4 mb-5" 
        data-toggle="modal" 
        data-target="#ratingModal"
        onClick={setUserRatings}
        >
          Reviewを投稿
      </button>
    }
      <div //ブートストラップモーダル 
        className="modal fade"
        id="ratingModal" 
        tabIndex="-1" 
        role="dialog" 
        aria-labelledby="ratingModalLabel" 
        aria-hidden="true">
          <div className="modal-dialog" role="document">
              <div className="modal-content">
                  <div className="modal-header">
                      <h5 className="modal-title" id="ratingModalLabel">レビューを投稿する</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div className="modal-body">
                      <ul className="stars">
                          <li className="star"><i className="fa fa-star"></i></li>
                          <li className="star"><i className="fa fa-star"></i></li>
                          <li className="star"><i className="fa fa-star"></i></li>
                          <li className="star"><i className="fa fa-star"></i></li>
                          <li className="star"><i className="fa fa-star"></i></li>
                      </ul>

                      <textarea
                        name="review"
                        id="review"
                        className="form-control mt-3"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                      ></textarea>

                      <button 
                        className="btn my-3 float-right review-btn px-4 text-white" 
                        data-dismiss="modal" 
                        aria-label="Close"
                        onClick={submitHandler}
                        >
                          Submit
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}

export default NewReview