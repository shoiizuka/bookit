//管理者用予約した部屋削除なのでidが必要

import nc from 'next-connect'
import dbConnect from '../../../../config/dbConnect';
import onError from '../../../../middlewares/errors'
import { deleteBooking } from '../../../../controllers/bookingControllers'

//認証ユーザー読込ミドルウェア
import {isAuthenticatedUser,authorizeRoles} from '../../../../middlewares/auth'

const handler = nc({onError});

dbConnect();

handler
  .use(isAuthenticatedUser,authorizeRoles('admin'))
  .delete(deleteBooking)

export default handler;
