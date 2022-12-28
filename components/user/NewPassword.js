//新しいパスワード作成した時の表示コンポ
import React,{useState, useEffect} from "react";
import { useRouter } from "next/router";
import {toast} from "react-toastify"
import ButtonLoader from "../layout/ButtonLoader";
import { useDispatch,useSelector } from "react-redux";
import { resetPassword,clearErrors } from "../../redux/actions/userActions";

const NewPassword =() =>{
  const [ password, setPassword ] =  useState('')//通常パス
  const [ confirmPassword, setConfirmPassword ] =  useState('')//確認パスauthcontrollerで使う

  const dispatch = useDispatch()
  const router = useRouter()

  const { error , loading, success } =  useSelector(state=>state.forgotPassword)//??

  useEffect(() => {//ポップアップ
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    //メッセージ送れば
    if(success){
      router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,success])
   
  //送信処理
  const submitHandler = (e) => {
    e.preventDefault();

    const passwords = {
      password,
      confirmPassword
    } 
    dispatch(resetPassword(router.query.token , passwords))//?
  }


  return(
    <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">新しいパスワード</h1>

                <div className="form-group">
                    <label htmlFor="password_field">パスワード</label>
                    <input
                        type="password"
                        id="password_field"
                        className="form-control"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm_password_field">確認パスワード</label>
                    <input
                        type="password"
                        id="confirm_password_field"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    id="new_password_button"
                    type="submit"
                    className="btn btn-block py-3" 
                    //ボタンロード、ボタン名追加
                    disabled={loading ? true : false}
                  >
                    {loading ? <ButtonLoader/> : 'パスワードを設定する'}
                </button>

            </form>
        </div>
    </div>
  )
}

export default NewPassword