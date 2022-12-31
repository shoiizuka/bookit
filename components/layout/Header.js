import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch,useSelector } from 'react-redux'
import { loadUser } from '../../redux/actions/userActions'

//ログアウト読込
import {signOut} from 'next-auth/react'

const Header = () => {
  const dispatch = useDispatch()
  //何でレデューサが入るの？
  const {user,loading} = useSelector(state => state.loadedUser)
   
  useEffect(()=>{
    if(!user){
      dispatch(loadUser())
    }
  },[dispatch,user])

  const logoutHandler = () => {
    signOut();
  }

    return (
      <nav className="navbar row justify-content-center sticky-top">
      <div className="container">
        <div className="col-3 p-0">
          <div className="navbar-brand">
              <Link href='/'>
                <Image style={{cursor: 'pointer'}} src="/images/bookit_logo.png" alt="BookIT" width="100%" height="50%"
                />
             </Link>
          </div>
        </div>
      <div className="col-3 mt-3 mt-md-0 text-center">
        {user ? (
          <div className="ml-4 dropdown d-inline">
            <a 
              className="btn dropdown-toggle mr-4"
              id='dropDownMenuButton'
              data-toggle="dropdown"
              role='button'
              aria-haspopup='true'
              aria-expanded='false'
            >
              <figure className='avatar avatar-nav'>
                <Image 
                  className='rounded-circle'
                  src={user.avatar && user.avatar.url}
                  alt={user && user.name}
                  width="100%"
                  height="100%"
                ></Image>
              </figure>
              <span>{user && user.name}</span>
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby='dropDownMenuButton'>
                {user.role === 'admin' &&//管理者用ページ移動
                  <>
                    <Link href='/admin/rooms'>
                      <a className='dropdown-item'>作成Room</a>
                    </Link>
                    <Link href='/admin/bookings'>
                      <a className='dropdown-item'>予約Room</a>
                    </Link>
                    <Link href='/admin/users'>
                      <a className='dropdown-item'>管理ユーザ</a>
                    </Link>
                    <Link href='/admin/reviews'>
                      <a className='dropdown-item'>管理レビュー</a>
                    </Link>

                    <hr/>
                  </>
                }
                <Link href='/bookings/me'>
                  <a className='dropdown-item'>My Bookings</a>
                </Link>
                
                <Link href='/me/update'>
                  <a className='dropdown-item'>Profile</a>
                </Link>
                
                <Link href='/'>
                  <a 
                    className='dropdown-item text-danger' 
                    onClick={logoutHandler}>ログアウト</a>
                </Link>
            </div>
          </div>
        ) :
          !loading &&  //ログインしてなければログインを表示
          <Link href='/login'>
          <a className="btn btn-danger px-4 text-white login-header-btn float-right">Login</a>
        </Link>
        }
      
      </div>
    </div>
    </nav>
    )
}

export default Header