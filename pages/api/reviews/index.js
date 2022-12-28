//レビューファイル。ポップアップ表示
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';

//ログイン認証
import { isAuthenticatedUser } from '../../../middlewares/auth'
import { createRoomReview,getRoomReviews ,deleteReview} from '../../../controllers/roomControllers'

import onError from '../../../middlewares/errors'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser)
  .put(createRoomReview)

handler
  .use(isAuthenticatedUser)
  .get(getRoomReviews)

handler//処理を分ける
  .use(isAuthenticatedUser)
  .delete(deleteReview)

export default handler;