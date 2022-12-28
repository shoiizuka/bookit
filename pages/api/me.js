import nc from 'next-connect'
import dbConnect from '../../config/dbConnect';
import onError from '../../middlewares/errors'
import { currentUserProfile } from '../../controllers/authControllers'

import { isAuthenticatedUser } from '../../middlewares/auth'//ミドルウェアを入れる

const handler = nc({onError});

dbConnect();

//現在ユーザーをdbから取得
handler.use(isAuthenticatedUser).get(currentUserProfile)//useを使う

export default handler;