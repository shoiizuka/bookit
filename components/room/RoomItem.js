//home.jsのルーム情報を個別に作る
import React from "react"
import Image from 'next/image'
import Link from "next/link"

const RoomItem = ({room}) =>{//Homeからプロップスで渡ってくる
  return(
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-2">
        <Image
          className="card-img-top mx-auto"
          src={room.images[0].url}
          // src="https://a0.muscache.com/im/pictures/a8f6a489-d236-4d2d-a57b-a95d928970af.jpg?im_w=960"
          alt=''
          height={170}
          width={100} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link href={`/room/${room._id}`}>
              <a>{room.name}</a>
            </Link>
          </h5>

          <div className="ratings mt-auto mb-3">
            <p className="card-text"><b>${room.pricePerNight}</b> / night</p>

            <div className="rating-outer">
                <div 
                  className="rating-inner"
                  style={{width:`${(room.ratings / 5) * 100}%`}}
                ></div>
            </div>
            <span id="no_of_reviews">({room.numOfReviews})</span>
        </div>

        <button className="btn btn-block view-btn">
            <Link href={`/room/${room._id}`}>View Details</Link>
        </button>
      </div>
    </div>
  </div>
  )
}

export default RoomItem
