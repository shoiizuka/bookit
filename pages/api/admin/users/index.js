//管理者用全ユーザー取得ファイル
import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect';
import onError from '../../../../middlewares/errors'
import { allAdminUsers } from '../../../../controllers/authControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser,authorizeRoles} from '../../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .get(allAdminUsers)

export default handler;