//登録のコンポーネント
import React,{useState, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/router";//?

import {toast} from "react-toastify"
import ButtonLoader from "../layout/ButtonLoader";

import { useDispatch,useSelector } from "react-redux";
import { registerUser,clearErrors } from "../../redux/actions/userActions";


const Register =() =>{

  const dispatch = useDispatch();
  const router = useRouter();

  const [user,setUser] = useState({//set　　は更新用
    name:'',
    email:'',
    password:'',
  })

  const {name,email,password} = user//空のが入ってる

  const [avatar,setAvatar] = useState('');
  const [avatarPreview,setAvatarPreview] = useState('/images/default_avatar.png');

  const {success, error,loading} =  useSelector(state=>state.auth)//?

  useEffect(()=>{//後処理?
    if(success){
      router.push('/login')//ログイン画面に遷移// window.location.href='/login'
    }
    if(error){
      toast.error(error);//メッセージ表示
      dispatch(clearErrors())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,success,error])
   
  //入力送信メソ
  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name, email ,password, avatar
    } 
    dispatch(registerUser(userData))
  }

  //入力補助
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

  //html表示
  return(
    <div className="container container-fluid">
      <div className="row wrapper"> 
        <div className="col-10 col-lg-5">
            <form className="shadow-lg"
              onSubmit={submitHandler}
            >
                <h1 className="mb-3">Join Us</h1>

                <div className="form-group">
                    <label htmlFor="name_field">Full Name</label>
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
                    name='password'//key追加
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
                  disabled={loading ? true : false}//ボタンロード追加
                >
                  {loading ? <ButtonLoader/> : 'REGISTER'}
                </button>
              </form>
        </div>
      </div>
    </div>
  )
}

export default Register