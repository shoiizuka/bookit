const Room = require('../modals/room');
const mongoose = require('mongoose');
const rooms = require( '../data/rooms');//データの読み込み.jsonじゃなくていい？

//ウェブDBに変更
mongoose.connect('mongodb+srv://bookit:bookit@cluster0.yvazsab.mongodb.net/?retryWrites=true&w=majority',{
})
//mongodb://localhost:27017/bookit


const seedRooms = async() =>{
  try {

    await Room.deleteMany()//コレクションを消せるモングメソ
    console.log('Rooms are deleted ルームデータを削除しました')

    await Room.insertMany(rooms)//新しく追加モングメソ
    console.log('All Rooms are added 全てのルームを追加しました')

    process.exit()
    
  } catch (error) {
    console.log(error.mongoose)
    process.exit()
  }
}

seedRooms()