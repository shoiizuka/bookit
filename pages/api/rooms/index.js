import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'
import { allRooms,newRoom } from '../../../controllers/roomControllers'

//認証ユーザー読込、管理ユーザー読み込み
import {isAuthenticatedUser, authorizeRoles} from '../../../middlewares/auth'

 const handler = nc({onError});

 dbConnect();

 handler.get(allRooms)

 handler
 .use(isAuthenticatedUser,authorizeRoles('admin'))
 .post(newRoom)//データベースに送信

export default handler;
//全ルーム取得ファイル