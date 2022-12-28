//部屋の詳細
import React,{useEffect,useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from 'next/head';
import { Carousel } from "react-bootstrap";
import RoomFetures from "./RoomFeatures";
//review
import NewReview from "../review/NewReview";
import ListReviews from "../review/ListReviews";//追加

//riactカレンダー
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import {toast} from 'react-toastify'
import {useDispatch,useSelector} from 'react-redux'
import { clearErrors } from "../../redux/actions/roomActions";
import axios  from "axios";
//予約詳細
import { checkBooking,getBookedDates } from "../../redux/actions/bookingActions"; 
import { CHECK_BOOKING_RESET } from  "../../redux/constants/bookingConstants"
//決済フォーム
import getStripe from "../../utils/getStripe";


const RoomDetails = () =>{
  const [checkInDate , setCheckInDate] = useState();//カレンダー機能
  const [checkOutDate , setCheckOutDate] = useState();
  const [dayOfStay, setDaysOfStay] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);//決済機能
  const router = useRouter(); //遷移機能

  const onChange = (dates) =>{
    const [checkInDate,checkOutDate] = dates
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if(checkInDate && checkOutDate){//滞在日86400000ミリ秒は24時間
      const days =  Math.floor(((new Date(checkOutDate) - new Date(checkInDate)) / 86400000) + 1 )
      setDaysOfStay(days)

      //予約可能アクション呼び出し
      dispatch(checkBooking(id, checkInDate.toISOString(), checkOutDate.toISOString()))
    }
  }
  //??
  const { id } = router.query;

  //表示で使えるように。state.はレデューサを読み込んでる
  const dispatch = useDispatch()
  const {user} = useSelector(state=> state.loadedUser);
  const {dates} = useSelector(state=> state.bookedDates);
  const {room,error} = useSelector(state=> state.roomDetails);
  const {available , loading:bookingLoading} = useSelector(state => state.checkBooking); 

  // 除外日も同時に追加してく
  const excludedDates = []
  dates.forEach( date => {
    excludedDates.push( new Date(date))
  })

  //予約処理//ストライプ決済後に変更した
  const newBookingHandler = async () => {
    const bookingData = {
      room: router.query.id,//既にあるルームIDって事？
      checkInDate,
      checkOutDate,
      amountPaid:90,//一時的
      dayOfStay,
      paymentInfo:{
        id:'STRIPE_PAYMENT_ID',//ストライプのidになる
        status:'STRIPE_PAYMENT_STATUS',//ストライプのidになる
      }
    }
    try {
      const config = { //configとは？？
        headers :{
          'Content-Type':'application/json'
        }
      }
      //ポップアップ
      const {data} = await axios.post('/api/bookings', bookingData , config)
      console.log(data)
      
    } catch (error) {
      //確認
      console.log*(error.responce)
    }
  }

  //決済処理
  const bookRoom = async(id , pricePerNight)=>{
    setPaymentLoading(true)//予約完了したらtrueに
    const amount = pricePerNight * dayOfStay;
    try {
      //ルームID,チェックインはなぜ必要？
      const link = `/api/checkout_session/${id}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&dayOfStay=${dayOfStay}`

      const {data} = await axios.get(link,{params:{amount}})//全部決まった後の最終データ＋金額

      const stripe = await getStripe()//決済フォーム読み込み

      //決済完了後はリダイレクトする
      stripe.redirectToCheckout({sessionId: data.id})//クリエイトセッションの自動生成されたやつ？

      setPaymentLoading(false);//成功したらfalseに

      
    } catch (error) {
      setPaymentLoading(false)//エラーが出たらfalseに
      console.log(error)
      toast.error(error.message)
    }
  }
  
  //ポップアップ
  useEffect(()=>{
      //予約されている日付
      dispatch(getBookedDates(id))
      toast.error(error)
      dispatch(clearErrors)

      //予約リセット
      return () =>{
        dispatch({type:CHECK_BOOKING_RESET})
      }
    },[dispatch,id,error])//エラーを独自追加した

  return(
  <>
  <Head>
    <title>{room.name}-BookIT</title>
  </Head>
    <div className="container container-fluid">
        <h2 className='mt-5'>{room.name}</h2>
        <p>{room.address}</p>
        <div className="ratings mt-auto mb-3">
            <div className="rating-outer">
              <div className="rating-inner"
                   style={{width:`${(room.ratings / 5) * 100}%`}}
              ></div>
            </div>
            <span id="no_of_reviews">({room.numOfReviews} レビューReviews)</span>
          </div>

          <Carousel hover='pause'>
            {room.images && room.images.map(image => (
              <Carousel.Item key={image.public_id}>
                <div style={{width:'100%',height:'440px'}}>
                  <Image
                    className="d-block mauto"
                    src={image.url}
                    alt={room.name}
                    layout='fill'
                    //今はURLに画像がないだけ
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
       
          <div className="row my-5">
              <div className="col-12 col-md-6 col-lg-8">
                  <h3>Description</h3>
                  <p>{room.description}</p>
                  <RoomFetures room={room}></RoomFetures>
               
              </div>

              <div className="col-12 col-md-6 col-lg-4">
                  <div className="booking-card shadow-lg p-4">
                    <p className='price-per-night'><b>${room.pricePerNight}</b> / night</p>
                    <hr/>
                    <p className="btn btn-block py-3">
                      チェックインとチェックアウトを選択
                    </p>
                    <DatePicker
                      className="w-100"
                      selected={checkInDate}
                      onChange={onChange}
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={new Date()}
                      excludeDates={excludedDates}//追加
                      selectsRange
                      inline
                    />
                    {available === true && //予約可能だったら
                      <div className='alert alert-success my-3 font-weight-bold'>予約可能</div>
                    }
                    {available === false && //予約不可だったら
                      <div className='alert alert-danger my-3 font-weight-bold'>予約できません</div>
                    }
                    {available && !user && //ログインしていない
                      <div className='alert alert-danger my-3 font-weight-bold'>ログインして予約してください</div>
                    }
                    {available && user && //可能かつログインしているボタン表示
                     <button 
                      className="btn btn-block py-3 booking-btn"
                      onClick={()=>bookRoom(room._id, room.pricePerNight)}//ここでroomidと金額を渡す
                      disabled={bookingLoading || paymentLoading ? true : false}//ボタンロードを使用不可に
                      >Pay - ${dayOfStay * room.pricePerNight}
                      </button>
                    }
                  </div>
              </div>
          </div>

          <NewReview/>

          {room.reviews && room.reviews.length > 0 ?
            <ListReviews reviews = { room.reviews }/>
            :
            <p><b>まだレビューがありませんno reviews</b></p>
          }
    </div>
</>
)
}

export default RoomDetails