//管理者用予約ルーム取得ファイル
import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect';
import onError from '../../../../middlewares/errors'
import { allAdminBookings } from '../../../../controllers/bookingControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser,authorizeRoles} from '../../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .get(allAdminBookings)

export default handler;
