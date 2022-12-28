//ルーム管理指示ファイルどのようなデータを格納するのかの定義。管理者用入力欄

const mongoose = require('mongoose');//データベース接続

//スキーマ関数で保存時の定義ができる
const roomSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'部屋名を入力してください Please ente room name'],
    trim:true,//空白削除
    maxLength:[100,'部屋名は１００文字超えてはいけません Room name cannot exceed 100 characters'],
  },
  pricePerNight:{
    type:Number,
    required:[true,'部屋名を入力してください Please ente room price per night'],
    maxLength:[4,'部屋名は4文字超えてはいけません Room name cannot exceed 4 characters'],
    default:0.0
  },
  description:{
    type:String,
    required:[true,'詳細を入力してください Please ente room description'],
  },
  address:{
    type:String,
    required:[true,'住所を入力してください Please ente room address'],
  },
  guestCapacity:{
    type:Number,
    required:[true,'最大人数を入力してください Please ente room guest capacity'],
  },
  numOfBeds:{
    type:Number,
    required:[true,'部屋のベッド数を入力してください Please ente number of beds in room'],
  },
  internet:{
    type:Boolean,
    default:false,
  },
  breakfast:{
    type:Boolean,
    default:false,
  },
  airConditiond:{
    type:Boolean,
    default:false,
  },
  petsAllowed:{
    type:Boolean,
    default:false,
  },
  roomCleaning:{
    type:Boolean,
    default:false,
  },
  ratings:{
    type:Number,
    default:0,
  },
  numOfReviews:{
    type:Number,
    default:0,
  },
  images:[//要素２つなので配列
    {
      public_id:{
        type:String,
        required:true
      },
      url:{
        type:String,
        required:true
      },
    }
  ],
  category:{
    type:String,
    required:[true,'部屋の種類を入力して下さい。Please enter room category'],
    enum:{
      values:[//サイズは３種類から選択
        'King',
        'Single',
        'Twins'
      ],
      message:'Please select correct category for room'
    }
  },
  reviews:[//使ったユーザー用
    {
      user:{
        type:mongoose.Schema.ObjectId,//後でユーザースキーマをを作る
        ref:'User',//参照
        required:true
      },
      name:{
        type:String,
        required:true
      },
      rating:{
        type:Number,
        required:true
      },
      comment:{
        type:String,//numberから修正
        required:true
      },
      
    }
  ],
  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required: false//まだ作ってないので一時的にfalse
  },
  createdAt:{
    type:Date,
    default:Date.now
  }


})

//roomモデルがある場合はそれで、存在しない場合はroomschemaを使って作成出力
module.exports = mongoose.models.Room || mongoose.model('Room',roomSchema);