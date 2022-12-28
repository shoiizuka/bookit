import Room from '../modals/room'
import Booking from '../modals/booking'
import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import APIFeatures from '../utils/apiFeatures';
import cloudinary from 'cloudinary';


// ルームデータの取得 => /api/rooms
const allRooms = catchAsyncErrors(async (req,res,) =>{
    //ページネーション限界
    const resPerPage = 4;
    const roomsCount = await Room.countDocuments();
    //ロケーション検索メソ
    const apiFeatures = new APIFeatures(Room.find(),req.query)
      .search()
      .filter()

    let rooms = await apiFeatures.query;//Room.find();だったletでペジネ対応

    let filteredRoomsCount = rooms.length;

    apiFeatures.pagination(resPerPage)

    rooms = await apiFeatures.query.clone()

    res.status(200).json({
      success: true,
      roomsCount, //count:rooms.length,
      resPerPage,
      filteredRoomsCount,
      rooms
    })
})


// 新しくルームを作る => /api/rooms
const newRoom = catchAsyncErrors(async (req,res) => {

//クラウディナリに写真を保存
  const images = req.body.images
  const imagesLinks = [];

 //上から順にクラウディナリに追加
  for(let i=0; i<images.length; i++){

    const result = await cloudinary.v2.uploader.upload(images[i],{
      folder: 'bookit/rooms',
    });

    imagesLinks.push({//準備した配列に保存
      public_id: result.public_id,//imgのID
      url:result.secure_url,//imgcloudのurl
    })
  }
  req.body.images = imagesLinks;
  req.body.user = req.user._id//カレントユーザーを設定

    const room = await Room.create(req.body)

    res.status(200).json({
      success: true,
      room
    })
})

// ルームの詳細を取得する => /api/rooms:id
const getSingleRoom = catchAsyncErrors(async (req,res,next) => {
  
    const room = await Room.findById(req.query.id)//ルームのIDを探す
    
    if(!room){//IDがない場合
      return next( new ErrorHandler('そのIDの部屋は見つかりません',404))
    }

    res.status(200).json({
      success: true,
      room
    })

})


// ルームをアップデート編集更新する => /api/rooms:id
const updateRoom = catchAsyncErrors(async (req,res) => {
    let room = await Room.findById(req.query.id)//ルームのID
    
    if(!room){//IDがない
        return next( new ErrorHandler('そのIDの部屋は見つかりません',404))
    }
    if(req.body.images){
      //部屋に関連する画像の削除 ここでやる
      for(let i=0; i<room.images.length; i++){
        await cloudinary.v2.uploader.destroy(room.images[i].public_id)
      }

      let imagesLinks = []//配列準備

      const images = req.body.images;
       //写真を追加
      for(let i=0; i<req.body.images.length; i++){//req.body.imagesはnewで使った値
        const result = await cloudinary.v2.uploader.upload(images[i],{
          folder: 'bookit/rooms',
        });
          imagesLinks.push({
          public_id: result.public_id,
          url:result.secure_url,
        })
      }
      req.body.images = imagesLinks;
    }

    room = await Room.findByIdAndUpdate(req.query.id, req.body,{//１idを指定して２bodyアプデ
          //３オプション
            new: true,
            runValidators:true,
            useFindAndModify: false
    })
    res.status(200).json({
      success: true,
      room
    })
})

// ルームを削除する => /api/rooms:id
const deleteRoom = catchAsyncErrors(async (req,res) => {
    const room = await Room.findById(req.query.id)
    
    if(!room){
      return next( new ErrorHandler('そのIDの部屋は見つかりません',404))
    }

    //部屋の画像全削除
    for(let i=0; i<room.images.length; i++){
      await cloudinary.v2.uploader.destroy(room.images[i].public_id)
    }

    await room.remove();

    res.status(200).json({
      success: true,
      massage:'ルームを削除しました'
    })
})

// レビューを作る => /api/reviews
const createRoomReview = catchAsyncErrors(async (req,res) => {

  const { rating , comment , roomId } = req.body;//入力済
  //レビューのデータ
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }

  const room = await Room.findById(roomId)

  //レビューユーザとカレンとユーザーを一致させる
  const isReviewed = room.reviews.find(//reviewssはmodelのroom
    r => r.user.toString() === req.user._id.toString()
  )
  if(isReviewed){//既にroomレビューがあるなら更新。
    room.reviews.forEach(review=>{
      if(review.user.toString() ===  req.user._id.toString()){//userが一致
        review.comment = comment;//reviewにセットし直す更新
        review.rating = rating;
      }
    })
  }else{//ないなら追加する
    room.reviews.push(review);//レビューさせる
    room.numOfReviews = room.reviews.length//レビュー数
  }
  //レート計算
  room.ratings = room.reviews.reduce((acc,item) => item.rating + acc, 0 ) / room.reviews.length 

  await room.save({ validateBeforeSave:false })// mong専用スキップセーブ

  res.status(200).json({
    success: true,
  })
})

// レビューできるかできないか => /api/reviews/check_review_Availability
const checkReviewAvailability = catchAsyncErrors(async (req,res) => {

  const {roomId} = req.query;

  const bookings = await Booking.find({user: req.user._id, room: roomId})

  let isReviewAvailable = false;

  if(bookings.length > 0){//予約をしている事
    isReviewAvailable = true
  }

  res.status(200).json({
    success: true,
    isReviewAvailable
  })
})

// 管理者用全ルームを取得 => /api/admin/rooms
const allAdminRooms = catchAsyncErrors(async (req,res) => {

  const rooms = await Room.find();

  res.status(200).json({
    success: true,
    rooms
  })
})

// 管理者用全ルームレビューを取得 => /api/reviews レビュー作成と同じ？
const getRoomReviews = catchAsyncErrors(async (req,res) => {

  const room = await Room.findById(req.query.id);//bodyとqueryの違いは何？

  res.status(200).json({
    success: true,
    reviews: room.reviews
  })
})

// 管理者用全ルームレビュー削除 => /api/reviews レビュー作成と同じ？
const deleteReview = catchAsyncErrors(async (req,res) => {
  const room = await Room.findById(req.query.roomId);//roomidは設定済？
  //idを現在一致しないreviewを出す？
  const reviews = room.reviews.filter(review => review._id.toString() !== req.query.id.toString())
  //レビュー数
  const numOfReviews = reviews.length
  //レビュー消すから再計算する？
  const ratings = room.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  //roomのレビューを更新する
  await Room.findByIdAndUpdate(req.query.roomId,{
    reviews,
    ratings,
    numOfReviews
  },{
    //オプション 
    new:true,
    runValidators: true,
    useFindAndModify:false
  })

  res.status(200).json({
    success: true,
  })
})


export {
  allRooms,
  newRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  createRoomReview,
  checkReviewAvailability,
  allAdminRooms,
  getRoomReviews,
  deleteReview
}