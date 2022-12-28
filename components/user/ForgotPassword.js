// パスワード再発行ページ
import React,{useState, useEffect} from "react";
import {toast} from "react-toastify"
import ButtonLoader from "../layout/ButtonLoader";
import { useDispatch,useSelector } from "react-redux";
import { forgotPassword,clearErrors } from "../../redux/actions/userActions";


const ForgotPassword = () =>{

  const [ email, setEmail ] =  useState('')//更新

  const dispatch = useDispatch()//ディスパッチ使用

  const { error , loading, message } =  useSelector(state=>state.forgotPassword)//??

  useEffect(() => {//ポップアップ
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    //メッセージ送れば
    if(message){
      toast.success(message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,message])
   
  //入力送信メソ
  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      email
    } 
    dispatch(forgotPassword(userData))
  }

  return(
    <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">パスワードを再発行する</h1>
                <div className="form-group">
                    <label htmlFor="email_field">メールアドレスを入力してください</label>
                    <input
                        type="email"
                        id="email_field"
                        className="form-control"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>

                <button
                  id="forgot_password_button"
                  type="submit"
                  className="btn btn-block py-3" 
                  //ボタンロード、ボタン名追加
                  disabled={loading ? true : false}
                  >
                    {loading ? <ButtonLoader/> : '送信する'}

                </button>
            </form>
        </div>
      </div>
  )
}

export default ForgotPassword