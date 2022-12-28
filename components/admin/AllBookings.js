//管理者用:全予約を表示させるコンポーネント.myBookingsのコピペ
import React, {useEffect} from 'react'
import Link from 'next/link';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { useRouter } from 'next/router';
import Loader from '../layout/Loader'
import { getAdminBookings,deleteBooking,clearErrors } from '../../redux/actions/bookingActions';
import { MDBDataTable } from 'mdbreact';
import easyinvoice from 'easyinvoice';
import { DELETE_BOOKING_RESET } from '../../redux/constants/bookingConstants';//リセットは別

const AllBookings = () =>{
  const dispatch = useDispatch()
  const router = useRouter()
  const {bookings , error, loading} = useSelector(state => state.bookings)
  const {isDeleted, error:deleteError } = useSelector(state => state.booking)//追加deleteErrorとは？

  useEffect(()=>{
    dispatch(getAdminBookings())

    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(deleteError){
      toast.error(deleteError);
      dispatch(clearErrors())
    }
    if(isDeleted){
      router.push('/admin/bookings')
      dispatch({type: DELETE_BOOKING_RESET})
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,deleteError,isDeleted])

  const setBookings = () => {
    const data = {
      columns:[//列
        {
          label: 'Booking ID',
          field: 'id',
          sort: 'asc',//昇順
        },
        {
          label: 'Check In',
          field: 'checkIn',
          sort: 'asc',
        },
        {
          label: 'Check Out',
          field: 'checkOut',
          sort: 'asc',
        },
        {
          label: 'Amount Paid',
          field: 'amount',
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

    bookings && bookings.forEach(booking => {
      data.rows.push({
        id: booking._id,
        checkIn:new Date(booking.checkInDate).toLocaleString('ja-JP'),
        checkOut:new Date(booking.checkOutDate).toLocaleString('ja-JP'),
        amount:`$${booking.amountPaid}`,
        actions:
        <>
          <Link href={`/admin/bookings/${booking._id}`}>
            <a  className='btn btn-primary'>
              <i className='fa fa-eye'></i>
            </a>
          </Link>

          <button 
            className='btn btn-success mx-2'//請求書ダウンロード
            onClick={() =>downloadInvoice(booking)}
          >
            <i className='fa fa-download'></i>
          </button>
          
          <button 
            className='btn btn-danger mx-2'//管理者用なので削除できるように
            onClick = {() => deleteBookingHandler(booking._id)}
          >
            <i className='fa fa-trash'></i>
          </button>
        </>
      })
    });
    return data;
  }

  //削除トリガー
  const deleteBookingHandler = (id)=>{
    dispatch(deleteBooking(id))
  }

//請求書ダウンロード
  const downloadInvoice = async (booking) =>{
    //文字は全部英語でないと表示されない
    var data = {
      "images": {
        "logo":"https://res.cloudinary.com/df4fkanqq/image/upload/v1670391052/bookit/images/uploaded/bookit_logo_hupvu9.png"
      },

      "sender":{
        "company": "originDiamond",
        "address": "Clientstreet 456",
        "zip": "4567 CD",
        "city": "nagoya",
        "country": "japan"
      },
      "client": {
        "company": `YourName: ${booking.user.name}`,//日本語なので表示されない
        "address": `Email: ${booking.user.email}`,
        "zip": "",
        "city": `check In: ${new Date(booking.checkInDate).toLocaleString('ja-JP')}`,
        "country": `check Out: ${new Date(booking.checkOutDate).toLocaleString('ja-JP')}`,
      },

      "information": {//請求書に表示されない！！！！！
        "number":`${booking._id}`,
        "date":`${new Date(Date.now()).toLocaleString('ja-JP')}`,
        "due-date": "",
      },

      "products":[//請求書に表示されない！！！！
        {
          "quantity":`${booking.dayOfStay}`,
          "description":`${booking.room.name}`,
          "tax-rate": 0,
          "price":`${booking.room.pricePerNight}`,
        }
      ],
      "bottom-notice":`this is auto generated Invoice of booking on Book It予約時に自動で請求書が作られます`,

      "settings": {
        currency: "USD", 
        "tax-notation": "vat",
      },
      "translate": {
        "invoice": "BooK it Invoice",
        "number": "Invoice Numver",
      }
    };
    const result = await easyinvoice.createInvoice(data);//上記をまとめる
    easyinvoice.download(`請求書_${booking._id}.pdf`,result.pdf)
  }

  return(
    <div className='container container-fluid'>
      {loading ? <Loader/> : 
      <>
        <h1 className='my-5'>{`${bookings && bookings.length}の予約`}</h1>
        <MDBDataTable
          data={setBookings()}//アニメーション表示
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

export default AllBookings