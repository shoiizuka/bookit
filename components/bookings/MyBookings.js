//全予約を表示させるコンポーネント
import React, {useEffect} from 'react'
import Link from 'next/link';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { clearErrors } from '../../redux/actions/bookingActions';
import { MDBDataTable } from 'mdbreact';

import easyinvoice from 'easyinvoice';//pdfDL

const MyBookings = () =>{
  const dispatch = useDispatch()
  //storeのステートにアクセスつまりレデューサ
  const {bookings , error} = useSelector(state => state.bookings)

  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
  },[dispatch,error])

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

    //行の配列に追加していく
    bookings && bookings.forEach(booking => {
      data.rows.push({
        id: booking._id,
        checkIn:new Date(booking.checkInDate).toLocaleString('ja-JP'),
        checkOut:new Date(booking.checkOutDate).toLocaleString('ja-JP'),
        amount:`$${booking.amountPaid}`,
        actions:
        <>
          <Link href={`/bookings/${booking._id}`}>
            <a href='' className='btn btn-primary'>
              <i className='fa fa-eye'></i>
            </a>
          </Link>

          <button 
            className='btn btn-success mx-2'
            onClick={() =>downloadInvoice(booking)}//請求書ダウンロード
          >
            <i className='fa fa-download'></i>
          </button>
        </>
      })
    });

    return data;
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

      "information": {
        "number":`${booking._id}`,
        "date":`${new Date(Date.now()).toLocaleString('ja-JP')}`,
        "due-date": "",
      },

      "products":[
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
      <h1 className='my-5'>予約一覧</h1>

      <MDBDataTable
        data={setBookings()}//アニメーション表示
        className='px-3'
        bordered
        striped
        hover
      />
    </div>
  )
}

export default MyBookings