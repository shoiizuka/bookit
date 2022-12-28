//予約用エラーポップアップ
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'
//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser} from '../../../middlewares/auth'

import { stripeCheckoutSession } from '../../../controllers/paymentControllers'

const handler = nc({onError});

dbConnect();

handler
.use(isAuthenticatedUser)//ログインしている状態
.get(stripeCheckoutSession)

export default handler;