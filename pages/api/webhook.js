import nc from 'next-connect'
import dbConnect from '../../config/dbConnect';
import onError from '../../middlewares/errors'
import { webhookCheckout } from '../../controllers/paymentControllers'

const handler = nc({onError});

dbConnect();

//rawBody //これは？
export const config = {
  api:{
    bodyParser:false, //htmlの情報（body）を受け取れる
  }
}

//dbに予約情報を保存
handler.post(webhookCheckout)

export default handler;