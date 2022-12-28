import Room from '../modals/room'
import User from '../modals/user'
import Booking from '../modals/booking'

import getRawBody from 'raw-body';//追加

import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import absoluteUrl from 'next-absolute-url';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//決済処理 session => /api/checkout_session/:roomId
const stripeCheckoutSession = catchAsyncErrors(async (req,res,) =>{ 

  //ルーム詳細を取得
  const room = await Room.findById(req.query.roomId)

  const {checkInDate,checkOutDate,daysOfStay} = req.query;

  //originのurlを作る
  const {origin} = absoluteUrl(req);

  //check out sessionの作成
  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    success_url:`${origin}/bookings/me`,//マイbookingページに移す
    cancel_url:`${origin}/room/${room._id}`,//現在のページに戻す
    customer_email: req.user.email,
    client_reference_id: req.query.roomId,
    metadata:{//追加情報を保存できる
      checkInDate,checkOutDate,daysOfStay
    },
    line_items:[
      {
        price_data:{
          currency:'usd',
          unit_amount:req.query.amount * 100,//ドルは小数点があるから
          product_data:{
            name: room.name,
            images:[`${room.images[0].url}`],
          }
        },
        quantity: 1,
      }
    ],
    mode:'payment'
  })
  res.status(200).json(session)
})

//決済後に新しい予約を作成 => /api/webhook
const webhookCheckout = catchAsyncErrors(async (req,res,) =>{ 

  const rawBody = await getRawBody(req)

  try {
    const signature = req.headers['stripe-signature']//署名

    const event = stripe.webhooks.constructEvent(rawBody,signature,process.env.STRIPE_WEBHOOK_SECRET)//署名確認

    if(event.type === 'checkout.session.completed'){//決済成功
      const session = event.data.object;//bookingControllの全データ

      //DBカラム
      const room = session.client_reference_id;//?
      const user = (await User.findOne({emeil: session.customer_email})).id;
      const amountPaid = session.amount_total / 100//ドル計算で掛けてた
      const paymentInfo = {//boControlleの項目
        id: session.payment_intent,//ストライプの項目
        status: session.payment_status,
      }
      const checkInDate = session.metadata.checkInDate;
      const checkOutDate = session.metadata.checkOutDate;
      const daysOfStay = session.metadata.daysOfStay

      //新しい予約作成　bookingContコピペ
      const booking = await Booking.create({
        room,
        user,//user単体で良い
        checkInDate,
        checkOutDate,
        amountPaid,
        daysOfStay,
        paymentInfo,
        paidAt: Date.now(),
      })
    
      res.status(200).json({//bookingデータベースに保存
        success:true,
      })
    }
    
  } catch (error) {
    console.log('ストライプ決済エラーです=>',error)
  }
})



export{
  stripeCheckoutSession,
  webhookCheckout,
}