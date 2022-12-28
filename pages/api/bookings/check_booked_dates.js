//予約用エラーポップアップ
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'

import { checkBookedDatesOfRoom } from '../../../controllers/bookingControllers'

const handler = nc({onError});

dbConnect();

handler
//予約可能範囲
.get(checkBookedDatesOfRoom)

export default handler;