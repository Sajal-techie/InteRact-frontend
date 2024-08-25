import React, { useEffect, useState } from 'react'
import userApi from '../services/axios'
import { fetchUserList } from '../services/chatServices'

const useFetchUsers = () => {
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [error, setError] = useState(null)

  const fetchUsers = async ()=>{
    setLoading(true)
    try{
        const data = await fetchUserList()
        setUserList(data)
    }catch(error){
        setError(error)
    }finally{
        setLoading(false)
    }
  }   
  useEffect(()=>{
    fetchUsers()
  },[])
  return {userList, loading, error}
}


export default useFetchUsers
