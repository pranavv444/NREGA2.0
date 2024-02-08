import Dropdown from '../Dropdown'
import { filterLoop } from '../../utils/locationDrops'
import { TableRow } from '../TableRow'
import { useWorkerStore } from '../../api/store'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const statusStyles = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-gray-800'
}
const tableHeading = [
  { name: 'Work' },
  { name: 'Location' },
  { name: 'Presence' }
]

export default function Attendance () {
  const { attendances, setAttendance, locations, dataLoaded } = useWorkerStore()
  const [filterInitialized, setFilterInitialized] = useState(false)
  const [fetchedData, setFetchedData] = useState(false)
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [blocks, setBlocks] = useState([])
  const [panchayats, setPanchayats] = useState([])
  const [selected, setSelected] = useState({
    state: '',
    district: '',
    block: '',
    panchayat: ''
  })
  const filterLoopcallback = [
    { callback: setDistricts },
    { callback: setBlocks },
    { callback: setPanchayats }
  ]

  // filter only the required locations
  async function filterData (id, value) {
    return locations.filter(
      location => location[filterLoop[id].landmark] === value
    )
  }
  // looping to fill child filters
  async function getLandmarkData (id, value) {
    return new Promise(async (resolve, reject) => {
      filterLoop[id].landmarkValue = value
      filterLoop[id].callback = filterLoopcallback[id].callback
      var selection = {
        state: '',
        district: '',
        block: '',
        panchayat: ''
      }
      for (let i = id; i < 3; i++) {
        const landmarkValue = i === id ? value : filterLoop[i - 1].landmarkValue
        const newLocations = await filterData(i, landmarkValue)
        const fetchedLandmarkData = await Promise.all(
          newLocations.map(location => location[filterLoop[i].toFetch])
        )
        filterLoopcallback[i].callback([...new Set(fetchedLandmarkData)])
        selection[filterLoop[i].toFetch] = fetchedLandmarkData[0]
        setSelected(prev => ({
          ...prev,
          [filterLoop[i].toFetch]: fetchedLandmarkData[0]
        }))
        filterLoop[i].fetchedDatas = fetchedLandmarkData
        filterLoop[i].landmarkValue = fetchedLandmarkData[0]
      }
      resolve(selection)
    })
  }

  // Initialize filter
  async function initFilter () {
    return new Promise(async (resolve, reject) => {
      try {
        const fetchedStates = locations.map(location => location.state)
        setStates([...new Set(fetchedStates)])
        setSelected(prev => ({ ...prev, state: fetchedStates[0] }))
        var result = await getLandmarkData(0, fetchedStates[0])
        result.state = fetchedStates[0]
        setAttendance(result)
        setFilterInitialized(true)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }
  // Handle filter change
  async function handleChange (id, label, value) {
    var result = await getLandmarkData(id, value)
    setSelected(prev => ({ ...prev, [label]: value }))
    console.log('selected: ', selected)
    const fetchedAttendances = await setAttendance(selected)
    console.log('after change attendances: ', fetchedAttendances)
  }

  // fill the attendances
  async function handlePanchayatChange (id, value) {
    try {
      setSelected(prev => ({ ...prev, panchayat: value }))
      await setAttendance({ ...selected, panchayat: value })
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  useEffect(() => {
    if (dataLoaded && !filterInitialized) {
      initFilter()
    }
  }, [dataLoaded])

  return (
    <main className='flex-1 pb-8'>
      <div className='px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8'>
        <div className='border-b border-gray-200 pb-5'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Your Attendance
          </h3>
          <p className='mt-2 max-w-4xl text-sm text-gray-500'>
            Across locations. Change State, Block, District and Panchayat to
            view specific attendance.
          </p>
        </div>
      </div>

      {/* Filtering seletions */}
      {dataLoaded && (
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            <div>
              <Dropdown
                options={states}
                label='state'
                selected={selected.state}
                onChange={handleChange}
                id={0}
              />
            </div>
            <div>
              <Dropdown
                options={districts}
                label='district'
                selected={selected.district}
                onChange={handleChange}
                id={1}
              />
            </div>
            <div>
              <Dropdown
                options={blocks}
                label='block'
                selected={selected.block}
                onChange={handleChange}
                id={2}
              />
            </div>
            <div>
              <Dropdown
                options={panchayats}
                label='panchayat'
                selected={selected.panchayat}
                id={3}
                onChange={handlePanchayatChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Results */}
      <h2 className='mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8'>
        Found Attendance
      </h2>
      <TableRow
        tableHeading={tableHeading}
        tableData={attendances}
        statusStyles={statusStyles}
        fetchedData={fetchedData}
      />
    </main>
  )
}
