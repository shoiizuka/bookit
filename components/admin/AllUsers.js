//管理者ページコンポーネント
import React, {useEffect} from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import {useDispatch,useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader'

import { getAdminUsers,deleteUser, clearErrors} from '../../redux/actions/userActions';
import {DELETE_USER_RESET } from '../../redux/constants/userConstants';

const AllUsers = () =>{

  const dispatch = useDispatch()
  const router = useRouter()

  const {loading , error, users} = useSelector(state => state.allUsers)
  const { error:deleteError,isDeleted} = useSelector(state => state.user)//deleteErroeは新規

  useEffect(()=>{
    dispatch(getAdminUsers())
    if(error){
      toast.error(error);
      dispatch(clearErrors())
    }
    if(deleteError){//追加
      toast.error(deleteError);
      dispatch(clearErrors())
    }
    if(isDeleted){//追加
      router.push('/admin/users')
      dispatch({type: DELETE_USER_RESET})
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,error,deleteError,isDeleted])

//ここでユーザーを表示させる
  const setUsers = () => {
    const data = {
      columns:[
        {
          label: 'User ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },
        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows:[//行
      ]
    }

    //行の配列に追加していく
    users && users.forEach(user => {
      data.rows.push({
        id: user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        actions:
        <>
          <Link 
            href={`/admin/users/${user._id}`}>
            <a className='btn btn-primary'>
              <i className='fa fa-pencil'></i>
            </a>
          </Link>

          <button 
            className='btn btn-danger mx-2' //ユーザー削除
            onClick={(e)=>deleteUserHandler(user._id)}
            >
            <i className='fa fa-trash'></i>
          </button>
        </>
      })
    });
    return data;
  }

  //削除処理
  const deleteUserHandler = (id) =>{
    dispatch(deleteUser(id))//action
  }

  return(
    <div className='container container-fluid'>
      {loading ? <Loader/> : //ロード中であればロード画面
        <>
          <h1 className='my-5'>{`${users && users.length} ユーザー`}
     
          </h1>

          <MDBDataTable
            data={setUsers()}//アニメーション表示
            className='px-3'
            bordered
            striped
            hover
            />
        </>
      }
    </div>
  )
}

export default AllUsers