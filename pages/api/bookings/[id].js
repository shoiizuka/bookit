//予約した部屋エラーポップアップ
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'

import { getBookingDetails } from '../../../controllers/bookingControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser} from '../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
.use(isAuthenticatedUser)//ログインした人だけ使える
.get(getBookingDetails)

export default handler;