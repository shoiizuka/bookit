//管理者ルーム作成コンポーネント
import React, {useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import Image from "next/image";
import ButtonLoader from '../layout/ButtonLoader'
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'

import { newRoom,clearErrors } from '../../redux/actions/roomActions';
import { NEW_ROOM_RESET } from '../../redux/constants/roomConstants';

const NewRoom =()=>{
  const router = useRouter()
  const dispatch = useDispatch()
// dbへの登録項目
  const [name,setName] = useState('')
  const [price,setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [address, setAddress]= useState('')
  const [category,setCategory] = useState('King')
  const [guestCapacity,setGuestCapacity] = useState(1)
  const [numOfBeds,setNumOfBeds] = useState(1)
  const [internet,setInternet] = useState(false)
  const [breakfast, setBreakfast] = useState(false)
  const [airConditioned, setAirConditioned] = useState(false)
  const [petsAllowed,setPetsAllowed] = useState(false)
  const [roomCleaning,setRoomCleaning] = useState(false)

  const [images, setImages] = useState([])
  const [imagesPreview, setImagesPreview] = useState([])


  const {loading, error, success} = useSelector(state => state.newRoom)

  useEffect( () => {
    if(error){
      toast.error(error);
      dispatch(clearErrors());
    }
    if(success){
      router.push('/admin/rooms')//リダイレクトされない！！！
      dispatch({type: NEW_ROOM_RESET})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,success])

  // 送信処理
  const submitHandler = (e) =>{
    e.preventDefault()

    const roomData={
      name,
      pricePerNight: price,
      description,
      address,
      category,
      guestCapacity: Number(guestCapacity),
      numOfBeds: Number(numOfBeds),
      internet,
      breakfast,
      airConditioned,
      petsAllowed,
      roomCleaning,
      images,
    }
//updateRoom用
    if(images.length === 0) return toast.error('写真をアップロードしてください')

    dispatch(newRoom(roomData))
  }

  //imgのリアル変更これがうまくいかない！！！！！！！！！！
  const onChange = (e) => {//eは関数という意味

    const files = Array.from(e.target.files)//全ファイルから選ぶ
    
    setImages([]);//最初の写真
    setImagesPreview([]);//プレビュー写真これが表示されない！！！！！

    files.forEach(file =>{  

      const reader = new FileReader();
      
      reader.onload = () => {//選択ファイルの呼び出し
        if(reader.readyState === 2){//２枚目の画像?
          setImages(oldArray => [...oldArray, reader.result ]);  //写真セット
          setImagesPreview(oldArray =>[...oldArray, reader.result ]);
        }
      }
      reader.readAsDataURL(file)
    })
  }


  return(
    <div className="container container-fluid">
         <div className="row wrapper">
            <div className="col-10 col-lg-8">
               <form 
                className="shadow-lg" 
                onSubmit={submitHandler}//送信
                 
                encType="multipart/form-data">
                  <h1 className="mb-4">New Room</h1>
                  <div className="form-group">
                     <label htmlFor="name_field">Name</label>
                     <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        value={name}//入力欄
                        onChange={(e) =>{setName(e.target.value)}}//自動反映
                        required
                        />
                  </div>
                  <div className="form-group">
                     <label htmlFor="price_field">Price</label>
                     <input
                        type="text"
                        id="price_field"
                        className="form-control"
                        value= {price}//入力
                        onChange={(e) =>{setPrice(e.target.value)}}//自動反映
                        required
                        />
                  </div>
                  <div className="form-group">
                     <label htmlFor="description_field">Description</label>
                     <textarea
                        className="form-control"
                        id="description_field"
                        rows="8"
                        value= {description}//入力
                        onChange={(e) =>{setDescription(e.target.value)}}//自動反映
                        required
                        ></textarea>
                  </div>
                  <div className="form-group">
                     <label htmlFor="address_field">Address</label>
                     <input
                        type="text"
                        id="address_field"
                        className="form-control"
                        value= {address}//入力
                        onChange={(e) =>{setAddress(e.target.value)}}//自動反映
                        required
                        />
                  </div>
                  <div className="form-group">
                     <label htmlFor="category_field">Category</label>
                     <select 
                        className="form-control" //searchjsコピペ
                        id="room_type_field" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        >
                        {['King','Single','Twins'].map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                     <label htmlFor="category_field">Guest Capacity</label>
                     <select 
                        className="form-control" //searchjsコピペ
                        id="guest_field" 
                        value={guestCapacity}
                        onChange={(e)=>setGuestCapacity(e.target.value)}
                        >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                  </div>
                  <div className="form-group">
                     <label htmlFor="category_field">Number of Beds</label>
                     <select 
                        className="form-control" //searchjsコピペ
                        id="numofbeds_field" 
                        value={numOfBeds}
                        onChange={(e)=>setNumOfBeds(e.target.value)}
                        >
                        {[1,2,3].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                  </div>

                  <label className="mb-3">Room Features</label>
                  <div className="form-check">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="internet_checkbox"
                        value= {internet}//チェックボックス
                        onChange={(e) =>{setInternet(e.target.checked)}}//これで切り替え
                        />
                     <label className="form-check-label" htmlFor="internet_checkbox">
                     Internet
                     </label>
                  </div>
                  <div className="form-check">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="breakfast_checkbox"
                        value= {breakfast}//チェックボックス
                        onChange={(e) =>{setBreakfast(e.target.checked)}}//これで切り替え
                        />
                     <label className="form-check-label" htmlFor="breakfast_checkbox">
                     Breakfast
                     </label>
                  </div>
                  <div className="form-check">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="airConditioned_checkbox"
                        value= {airConditioned}//チェックボックス
                        onChange={(e) =>{setAirConditioned(e.target.checked)}}//これで切り替え
                        />
                     <label className="form-check-label" htmlFor="airConditioned_checkbox">
                     Air Conditioned
                     </label>
                  </div>
                  <div className="form-check">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="petsAllowed_checkbox"
                        value= {petsAllowed}//チェックボックス
                        onChange={(e) =>{setPetsAllowed(e.target.checked)}}//これで切り替え
                        />
                     <label className="form-check-label" htmlFor="petsAllowed_checkbox">
                     Pets Allowed
                     </label>
                  </div>
                  <div className="form-check">
                     <input
                        className="form-check-input"
                        type="checkbox"
                        id="roomCleaning_checkbox"
                        value= {roomCleaning}//チェックボックス
                        onChange={(e) =>{setRoomCleaning(e.target.checked)}}//これで切り替え
                        />
                     <label className="form-check-label" htmlFor="roomCleaning_checkbox">
                     Room Cleaning
                     </label>
                  </div>

                  <div className="form-group mt-4">
                     <label>写真</label>
                     <div className="custom-file">
                        <input 
                           type="file"//部屋の写真をアップロード
                           name="room_images"
                           className="custom-file-input"
                           id="customFile"
                           onChange={onChange} //これでいいっぽい
                           multiple
                           />
                        <label className="custom-file-label" htmlFor="customFile">
                        写真を選ぶ
                        </label>
                     </div>

                      {imagesPreview.map(img =>(
                        <Image
                          src={img}
                          key={img}
                          alt="Images Preview"
                          className="mt-3 mr-2"
                          width="55"
                          height="52"
                          />
                          ))}
                    </div>
                  <button 
                    type="submit" 
                    className="btn btn-block new-room-btn py-3"
                    disabled = {loading ? true:false}
                    >
                    {loading ? <ButtonLoader/> : 'ルームを作成する'}
                  </button>
               </form>

            </div>
         </div>
      </div >
  )
}

export default NewRoom