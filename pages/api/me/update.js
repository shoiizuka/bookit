import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'

//更新メソ読み込み
import { updateProfile } from '../../../controllers/authControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser} from '../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
.use(isAuthenticatedUser)//ログインした人だけ使える
.put(updateProfile)//偶発更新

export default handler;
//プロフィール更新