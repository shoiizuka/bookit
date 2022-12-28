//場所の検索用API
class APIFeatures {
  constructor(query,queryStr){ //初期化させる
    this.query = query;
    this.queryStr= queryStr;
  }

  //ロケーション検索
  search(){
    const location = this.queryStr.location ? {//req.queryの値。場所情報が存在するなら
      address: {
        $regex: this.queryStr.location,
        $options:'i'//インセンティブらしい
      }
    } : {//elseの短縮
    }
    this.query = this.query.find({...location  })//スプレット構文は配列全ての中から
    return this;
  }

  //フィルター検索文字をコピーして外していく
  filter(){
    const queryCopy = {...this.queryStr}

    //ロケーションが入ってる可能性があるので外す
    const removeFields = ['location','page']
    removeFields.forEach(el => delete queryCopy[el])

    this.query = this.query.find(queryCopy)
    return this;

  }

  //ページネーション
  pagination(resPerPage){
    //resPerPageは4
    //デフォルトは１ページ目か現在のページ
    const currentPage = Number(this.queryStr.page) || 1;

    //ページを飛ばす
    const skip = resPerPage * (currentPage - 1 ) //resP=5 * 2-1=1

    this.query = this.query.limit(resPerPage).skip(skip)

    return this;
  }




}

export default APIFeatures;