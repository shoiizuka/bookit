import mongoose from "mongoose";

const dbConnect = () =>{

  if(mongoose.connection.readyState >= 1){//マングースの接続ができている
    return
  }
  mongoose.connect(process.env.DB_URI,{//本番用DBに変更
    // useNewUrlParser:true,今はもう必要ないらしい
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
  }).then(con =>console.log("connected to local databese"))

}

export default dbConnect