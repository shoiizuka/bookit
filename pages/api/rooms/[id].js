
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import { getSingleRoom,updateRoom,deleteRoom } from '../../../controllers/roomControllers'
//errハンドルmiddlewareを読み込み
import onError from '../../../middlewares/errors'

//認証ユーザー読込、管理ユーザー読み込み
import {isAuthenticatedUser, authorizeRoles} from '../../../middlewares/auth'

const handler = nc({onError});//これでエクスプレス使ったと同等になる

dbConnect();

handler.get(getSingleRoom)

handler
.use(isAuthenticatedUser,authorizeRoles('admin'))//認証を追加
.put(updateRoom)

handler
.use(isAuthenticatedUser,authorizeRoles('admin'))//認証を追加
.delete(deleteRoom)


export default handler;
//個別ルームファイルidで管理する//ダイナミックルーティーンで[id]にURLが入る