//管理者ユーザ情報更新コンポーネント
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import Loader from '../layout/Loader'

//作ったやつを２つとも追加
import { updateUser, getUserDetails,clearErrors} from '../../redux/actions/userActions';
//ユーザリセットはこっちも追加
import {UPDATE_USER_RESET } from '../../redux/constants/userConstants';


const UpdateUser = () =>{

  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [role,setRole] = useState('')//管理者かユーザか切り替え

  const dispatch = useDispatch()
  const router = useRouter()

  const { error, isUpdated } = useSelector(state => state.user)//userReducerからloadingは消しても良い？
  const { loading, user} = useSelector(state => state.userDetails)//userDeteilsから

  const userId = router.query.id//？？

  useEffect(()=>{
    if(user && user._id !== userId){//ルータと一致しない場合
      dispatch(getUserDetails(userId))//これはわからん？？
    }else{//更新情報をセット
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
    }
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(isUpdated){
      router.push('/admin/users')
      dispatch({type: UPDATE_USER_RESET})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,user,userId,isUpdated])

  const submitHandler = (e) =>{
    e.preventDefault();
    const userData = {//これ何で必要なの？
      name,email,role
    }

    dispatch(updateUser(user._id,userData))//これが最終処理？
  }

  return(
    <>
      {loading ? <Loader/> : //ロード中であればロード画面
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form 
                className="shadow-lg"
                onSubmit={submitHandler}
              >
                <h1 className="mt-2 mb-5">管理者情報更新</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}//追加
                    onChange={(e)=>setName(e.target.value)}//これでセットする
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}//追加
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role_field">Role</label>
                  <select 
                    id="role_field" 
                    className="form-control" name="role" 
                    value={role}//追加
                    onChange={(e)=>setRole(e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                  </select>
                </div>

                <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default UpdateUser