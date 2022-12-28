// 予約の処理振り分けファイル
import Booking from '../modals/booking'//bookingDB読込
import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';

//日付の範囲を調べる
import Moment from 'moment'
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);


//新しい予約の作成 => /api/bookings
const newBooking = catchAsyncErrors(async (req,res,) =>{ 
  //dbのカラム
  const {
    room,
    checkInDate,
    checkOutDate,
    amountPaid,
    daysOfStay,//修正
    paymentInfo,
  } = req.body;

  const booking = await Booking.create({
    room,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    amountPaid,
    daysOfStay,
    paymentInfo,
    paidAt:Date.now(),//追加
  })

  res.status(200).json({
    success:true,
    booking,
  })
})

//予約可能な部屋検索 => /api/bookings/check
const checkRoomBookingsAvailability = catchAsyncErrors(async (req,res,) =>{ 
  let { roomId , checkInDate , checkOutDate} = req.query//上書き可能

  checkInDate = new Date(checkInDate)
  checkOutDate = new Date(checkOutDate)

  //dbから予約日を探してくる??
  const bookings = await Booking.find({
    room:roomId,
    //複数条件モンゴdbのルール
    //予約可能日を探すアルゴ
    $and:[{
      checkInDate:{
        $lte: checkOutDate,
      }
    },{
      checkOutDate:{
        $gte: checkInDate
      }
    }]
  })

//予約可能か確認
let isAvailable;

if(bookings && bookings.length === 0){
  isAvailable = true;
}else{
  isAvailable = false;
}
  res.status(200).json({
    success:true,
    isAvailable,
  })
})

//予約された日付の確認 => /api/bookings/check_booked_dates
const checkBookedDatesOfRoom = catchAsyncErrors(async (req,res,) =>{
  const {roomId} = req.query;

  const bookings = await Booking.find({ room: roomId })//全ルーム取得
 
  let bookedDates = [];

  //時差
  const timeDifference = moment().utcOffset() / 60 
  console.log(timeDifference)

  bookings.forEach(booking => {
    //時差修正での予約時間
    const checkInDate = moment(booking.checkInDate).add(timeDifference,'hours')
    const checkOutDate = moment(booking.checkOutDate).add(timeDifference,'hours')
    //range修正
    const range = moment.range(moment(checkInDate),moment(checkOutDate))

    const dates = Array.from(range.by('day'))

    bookedDates = bookedDates.concat(dates)
    
  });
  res.status(200).json({
    success:true,
    bookedDates,
  })
})

//ユーザの予約をすべて取得 => /api/bookings/me
const myBookings = catchAsyncErrors(async (req,res,) =>{

  const bookings = await Booking.find({ user: req.user._id })
    .populate({//userにも使えるように追加する
      path:'room',
      select:'name pricePerNight images'
    })
    .populate({
      path:'user',
      select:'name email'
    })

  res.status(200).json({
    success:true,
    bookings,
  })
})

//予約の詳細取得 => /api/bookings/:id
const getBookingDetails = catchAsyncErrors(async (req,res,) =>{

  const booking = await Booking.findById(req.query.id)
    .populate({//mongu関数特定フィールドを返す
      path:'room',
      select:'name pricePerNight images'
    })
    .populate({
      path:'user',
      select:'name email'
    })

  res.status(200).json({
    success:true,
    booking,
  })
})

//管理者用：予約をすべて取得 => /api/admin/bookings
const allAdminBookings = catchAsyncErrors(async (req,res,) =>{

  const bookings = await Booking.find()
    .populate({//詳細を請求書に反映する
      path:'room',
      select:'name pricePerNight images'
    })
    .populate({
      path:'user',
      select:'name email'
    });

  res.status(200).json({
    success:true,
    bookings,
  })
})

//管理者用：予約を削除 => /api/admin/bookings/id
const deleteBooking = catchAsyncErrors(async (req,res,next) =>{

  const booking = await Booking.findById(req.query.id)

  if(!booking){//予約がなければ
    //エラーハンドラでメッセージ表示？
    return next(new ErrorHandler('このIDの予約は見つかりません',404))
  }

  await booking.remove()//削除

  res.status(200).json({
    success:true,
  })
})

export {
  newBooking,
  checkRoomBookingsAvailability,
  checkBookedDatesOfRoom,
  myBookings,
  getBookingDetails,
  allAdminBookings,
  deleteBooking
}