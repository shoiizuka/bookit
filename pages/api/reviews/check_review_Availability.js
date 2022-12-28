//支払いした人だけレビューできるようにするファイル
import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';

//ログイン認証
import { isAuthenticatedUser } from '../../../middlewares/auth'
import { checkReviewAvailability } from '../../../controllers/roomControllers'

import onError from '../../../middlewares/errors'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser)
  .get(checkReviewAvailability)

export default handler;