//管理者用ルーム
import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect';
import onError from '../../../../middlewares/errors'
import { getUserDetails,updateUser ,deleteUser} from '../../../../controllers/authControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser,authorizeRoles} from '../../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

//処理を分けてる
handler//詳細取得
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .get(getUserDetails)

handler//更新
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .put(updateUser)

handler//削除
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .delete(deleteUser)

export default handler;
//これって何でpagesなのか？