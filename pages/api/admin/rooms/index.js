import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect';
import onError from '../../../../middlewares/errors'
import { allAdminRooms } from '../../../../controllers/roomControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser,authorizeRoles} from '../../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .get(allAdminRooms)

export default handler;
//管理者用全ルーム取得ファイル