//ユーザー情報のコンポーネント
//バックエンドはユーザー登録と共通する
import React,{useState, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {toast} from "react-toastify"
import ButtonLoader from "../layout/ButtonLoader";
//追加
import Loader from "../layout/Loader";
import { useDispatch,useSelector } from "react-redux";

import { updateProfile,clearErrors } from "../../redux/actions/userActions";
//リセットだけコンステンスから直読み込み
import { UPDATE_PROFILE_RESET } from "../../redux/constants/userConstants";


const Profile =() =>{

  const dispatch = useDispatch();
  const router = useRouter();
  const [ user ,setUser] = useState({//set　　は更新用
    name:'',
    email:'',
    password:'',
  })

  const {name,email,password} = user
  const [avatar,setAvatar] = useState('');
  const [avatarPreview,setAvatarPreview] = useState('/images/default_avatar.png');

  //更新用//セレクターとは？
  //ユーザをロードユーザに　ロードをアップデートロードに
  const { user:loadedUser , loading } =  useSelector(state=>state.auth)
  const { error , isUpdated , loading:updateLoading } =  useSelector(state=>state.user)

  useEffect(()=>{
    if(loadedUser){//ユーザが入っていれば更新
      setUser({
        name:loadedUser.name,
        email:loadedUser.email
      })
      setAvatarPreview(loadedUser.avatar.url)
    }
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    //アップデート完了後
    if(isUpdated){
      router.push('/')//ホームに遷移
      dispatch({type: UPDATE_PROFILE_RESET})//リセット情報
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,isUpdated,error,loadedUser])
   
  //入力送信メソ
  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name, email ,password, avatar
    } 
    dispatch(updateProfile(userData))
  }

  //入力
  const onChange = (e) => {
    if(e.target.name ==='avatar'){
      const reader = new FileReader();

      reader.onload = () => {//読み込み反映
        if(reader.readyState === 2 ){//??
          setAvatar(reader.result);
          setAvatarPreview(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])

    }else{//avatar以外ならvalueに入力を入れる
      setUser({...user,[e.target.name]: e.target.value})
    }
  }

  return(
    <>
    {loading ? <Loader/> : //ローダーファイルか更新ファイルか

      <div className="container container-fluid">
        <div className="row wrapper"> 
          <div className="col-10 col-lg-5">
              <form className="shadow-lg"
                onSubmit={submitHandler}
              >
                  <h1 className="mb-3">プロフィール更新</h1>

                  <div className="form-group">
                      <label htmlFor="name_field">名前</label>
                      <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        name='name'//key追加
                        value={name}
                        onChange= {onChange}
                      />
                    </div>

                  <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="email"
                      id="email_field"
                      className="form-control"
                      name='email'//key追加
                      value={email}
                      onChange= {onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    <input
                      type="password"
                      id="password_field"
                      className="form-control"
                      name='password'
                      value={password}
                      onChange= {onChange}
                    />
                  </div>

                  <div className='form-group'>
                      <label htmlFor='avatar_upload'>Avatar</label>
                      <div className='d-flex align-items-center'>
                          <div>
                              <figure className='avatar mr-3 item-rtl'>
                                  <Image
                                      src={avatarPreview}//ユーザがアップロードする
                                      className='rounded-circle'
                                      alt='image'
                                      height={40}
                                      width={40}
                                  />
                              </figure>
                          </div>
                          <div className='custom-file'>
                              <input
                                  type='file'
                                  name='avatar'
                                  className='custom-file-input'
                                  id='customFile'
                                  accept="images/*"//追加
                                  onChange={onChange}
                              />
                              <label className='custom-file-label' htmlFor='customFile'>
                                  Choose Avatar
                              </label>
                          </div>
                      </div>
                  </div>


                  <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={updateLoading ? true : false}
                  >
                    {updateLoading ? <ButtonLoader/> : '更新する'}
                  </button>
                </form>
          </div>
        </div>
      </div>
   }
   </>
  )
}

export default Profile