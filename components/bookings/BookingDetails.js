import React, {useEffect} from 'react'
import Link from 'next/link';
import Image from 'next/image';

import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { clearErrors} from '../../redux/actions/bookingActions';



//全予約を表示させるコンポーネント
const BookingDetails = () =>{
  const dispatch = useDispatch()

  //storeのステートにアクセスつまりレデューサの全情報ディスパッチで使える
  const {booking , error} = useSelector(state => state.bookingDetails)
  const {user } = useSelector(state => state.loadedUser)//認証ユーザー

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
  },[dispatch,error])

  // 支払い情報を追加するtrue,falseで
  const isPaid = booking.paymentInfo && booking.paymentInfo.status === 'paid' ? true:false

  return(
    <div className="container">
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 booking-details">
         {booking && booking.room && booking.user && //両方trueの場合
          <>
            <h2 className="my-5">予約 # {booking._id}</h2>
            <h4 className="mb-4">ユーザー情報</h4>
            <p><b>Name:</b> {booking.user && booking.user.name}</p>
            <p><b>Email:</b> {booking.user && booking.user.email}</p>
            <p><b>Amount:</b> ${booking.amountPaid}</p>
            
            <hr />
            
            <h4 className="mb-4">Booking Info</h4>
            <p><b>Check In:</b>{new Date(booking.checkInDate).toLocaleString('ja-JP')}</p>
            <p><b>Check Out:</b> {new Date(booking.checkOutDate).toLocaleString('ja-JP')}</p>
            <p><b>Days of Stay:</b> {booking.dayOfStay}</p>

            <hr />

            <h4 className="my-4">Payment Status</h4>
              <p className={isPaid ? 'greenColor':'redColor'}//支払いで表示変更
                >
                  <b> {isPaid ? 'Paid':'NoT Paid'} </b></p>
              

              {user && user.role === 'admin' && //管理者かつユーザかつ支払い済み
                <>
                 <h4 className="my-4">Stripe Payment ID</h4>
                  <p className={'redColor'} >
                    <b> {booking.paymentInfo.id } </b>
                  </p>
                </>
              }



            <h4 className="mt-5 mb-4">Booked Room:</h4>

            <hr />
            <div className="cart-item my-1">
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <Image 
                    src={booking.room.images[0].url}//最初の画像 
                    alt={booking.room.name}
                    height={45}
                    width={65}
                    />
                </div>

                <div className="col-5 col-lg-5">
                  <Link href={`/room/${booking.room._id}`}>{booking.room.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>${booking.room.pricePerNight}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{booking.dayOfStay} Day(s)</p>
                </div>
              </div>
            </div>
            <hr />
          
          </>
         }
        </div>
      </div>
    </div>
  )
}

export default BookingDetails