import { useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { workerLinks } from '../utils/sidelinks'

// Importing all the components
import {
  Sidebar,
  Profile,
  Jobs,
  Payment,
  Tasks,
  Attendance
} from '../components/Worker'
import supabase from '../api'
import Addjobs from '../components/Admin/Addjobs'

export const Dashboard = () => {
  const [worker, setWorkers] = useState({}) //worker state
  const { dashboard } = useParams()
  // console.log(dashboard)

  useEffect(() => {
    async function fetchData () {
      // You can await here
      const { data, error } = await supabase.from('worker').select()
      setWorkers(data[0])
      // ...
    }
    fetchData()
  }, [])

  return (
    <div className='flex'>
      <Sidebar links={workerLinks} />
      {dashboard === 'profile' ? (
        <Profile worker={worker} />
      ) : dashboard === 'jobs' ? (
        <Jobs />
      ) : dashboard === 'addjobs' ? (
        <Addjobs />
      ) : dashboard === 'payment' ? (
        <Payment />
      ) : dashboard === 'tasks' ? (
        <Tasks />
      ) : dashboard === 'attendance' ? (
        <Attendance />
      ) : (
        <Navigate replace to='/' />
      )}
    </div>
  )
}
