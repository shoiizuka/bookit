//予約用エラーポップアップ
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'

import { checkRoomBookingsAvailability } from '../../../controllers/bookingControllers'

const handler = nc({onError});

dbConnect();

handler
//予約可能日を調べるコントローラ
.get(checkRoomBookingsAvailability)

export default handler;