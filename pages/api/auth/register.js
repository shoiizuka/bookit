import nc from 'next-connect'
import dbConnect from '../../../config/dbConnect';
import onError from '../../../middlewares/errors'

//登録ファイル読込
import { registerUser } from '../../../controllers/authControllers'

const handler = nc({onError});

dbConnect();

handler.post(registerUser)//データベースに送信

export default handler;
//全ルーム取得ファイル