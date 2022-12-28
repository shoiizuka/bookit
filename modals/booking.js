// 大元の予約ファイル
const mongoose = require('mongoose');
const timeZone = require('moment-timezone');//別のにしたけどわからん

//db保存
const bookingSchema = new mongoose.Schema({
  room:{
    type: mongoose.Schema.Types.ObjectId,//モング内のIDって事か？
    require: true,
    ref:'Room'//既に作ってあるから？
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref:'User'
  },
  checkInDate:{
    type:Date,
    require:true,
  },
  checkOutDate:{
    type:Date,
    require:true,
  },
  amountPaid:{//支払い金額
    type:Number,
    require:true,
  },
  dayOfStay:{//滞在日
    type:Number,
    require:true,
  },
  paymentInfo:{//支払い情報
    id: {
      type:String,
      require:true,
    },
    status:{
      type:String,
      require:true,
    }
  },
  paidAt:{
    type:Date,
    require:false
  },
  createdAt:{//日付
    type:Date,
    default:Date.now
  }
})
//timezoneでdb保存の現時間にする
bookingSchema.plugin(timeZone );

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema );