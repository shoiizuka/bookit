import React,{useState} from "react";//steteを使う
import Link from "next/link";

import {signIn} from 'next-auth/react'//ログインメソ

import {toast} from "react-toastify"//バナー
import ButtonLoader from "../layout/ButtonLoader";

const Login =() => {
  const [email, setEmail] = useState('')
  const [password,setPassword]= useState('')
  const [loading,setLoading]= useState(false)

  const submitHandler = async(e)=>{
    e.preventDefault();//一回で終わり
    setLoading(true)//ロードマーク始

    //credenはプロバイダが入る
    const result = await signIn('credentials',{
      redirect:false,
      email,
      password,
    })
    setLoading(false)//ロードマーク終

    console.log(result)//確認

    if(result.error){
      toast.error(result.error)
    }else{
      window.location.href='/'//メインページに遷移
    }
  }

  return(
    <div className="container container-fluid">
      <div className="row wrapper"> 
        <div className="col-10 col-lg-5">
            <form className="shadow-lg"
              onSubmit={submitHandler}//送信トリガー
            >
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}//入力内容
                  />
                </div>
      
                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}//入力内容
                  />
                </div>

                <Link href="/password/forgot" className="float-right mb-4">パスワードを忘れましたか？</Link>
      
                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true:false}//ロードリングトリガ条件分岐
                >
                  {loading ? <ButtonLoader/> : 'LOGIN'}
                </button>
                
                <Link href="/register" className="float-right mt-3">New User?</Link>
              </form>
          </div>
        </div>
    </div>
  )
}

export default Login