import React, { useEffect, useState } from 'react'
import { useWorkerStore } from '../../api/store'
import { DataTable } from '../Errors'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar () {
  const {
    setAttendancePopup,
    isFormatingPopup,
    attndMonths,
    attndDates,
    setAttndDates,
    setFormatingPopup,
    currActiveDates
  } = useWorkerStore()

  // State Variables
  const [selectedMonth, setSelectedMonth] = useState()
  const [months, setMonths] = useState([])
  const [active, setActive] = useState(0)
  const [dataInitialize, setDataInitialize] = useState(false)
  const [changeDates, setChangeDates] = useState(true)
  const [prev, setPrev] = useState(null)
  const [next, setNext] = useState(null)

  // Functions
  async function setupAttnd () {
    try {
      const fetchedMonths = [...attndMonths.values()]
      setMonths(fetchedMonths)
      setSelectedMonth(fetchedMonths[active])
      await setAttndDates(fetchedMonths[active].uniqueID)
      if (active < fetchedMonths.length - 1) {
        const id = fetchedMonths[active + 1].uniqueID
        const nextDates = attndDates.get(id)
        setNext({ month: fetchedMonths[active + 1].str, dates: nextDates })
      }
      setDataInitialize(true)
      setChangeDates(false)
    } catch (err) {
      console.log(err)
    }
  }
  async function handleMonthChange (dir) {
    if (dir === 'N') {
      setActive(prev => prev + 1)
      if (active + 2 < months.length) {
        const id = months[active + 1].uniqueID
        const nextDates = attndDates.get(id)
        setNext({ month: months[active + 2].str, dates: nextDates })
      } else {
        setNext(null)
      }
      setPrev({ month: months[active].str, dates: currActiveDates })
    } else if (dir === 'P') {
      setNext({ month: months[active].str, dates: currActiveDates })
      if (active >= 2) {
        const prevDates = attndDates.get(months[active - 2].uniqueID)
        setPrev({ month: months[active - 2].str, dates: prevDates })
      } else {
        setPrev(null)
      }
      setActive(prev => prev - 1)
    }
  }
  async function onMonthChange () {
    setChangeDates(true)
    setSelectedMonth(months[active])
    await setAttndDates(months[active].uniqueID)
    setFormatingPopup(false)
    setChangeDates(false)
  }
  useEffect(() => {
    if (!dataInitialize) {
      setupAttnd()
    } else {
      onMonthChange()
    }
  }, [active])

  return isFormatingPopup ? (
    <div className=' bg-white text-center shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
      <DataTable />
    </div>
  ) : (
    <div className='min-h-1/2'>
      <div className='bg-white shadow-md px-6 py-6 rounded-md border-1 border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Daily Attendances <span className='text-gray-400'>of the site</span>
        </h2>

        {/* The calendar codes */}
        <div className='mt-6 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9'>
          <div className='flex items-center text-gray-900 '>
            {selectedMonth?.idx >= 1 && (
              <button
                type='button'
                onClick={() => handleMonthChange('P')}
                className='-m-1.5 px-2 py-2 rounded-full bg-gray-50 flex flex-none items-center justify-center p-1.5 text-gray-900 hover:bg-gray-100'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}

            <div className='flex-auto font-semibold'>{selectedMonth?.str}</div>
            {selectedMonth?.idx < months?.length - 1 && (
              <button
                type='button'
                onClick={() => handleMonthChange('N')}
                className='-m-1.5 px-2 py-2 rounded-full bg-gray-50 flex flex-none items-center justify-center p-1.5 text-gray-900 hover:bg-gray-100'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            )}
          </div>
          <div className='isolate mt-4 grid grid-cols-7 rounded-lg px-1 py-1 grid-rows-5 gap-px gap-y-0.5 bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
            {changeDates ? (
              <div>Changing dates...</div>
            ) : (
              currActiveDates?.map((day, dayIdx) => {
                return (
                  <button
                    key={dayIdx}
                    type='button'
                    className={classNames(
                      'py-1.5 ',
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      day.status === 'absent' && 'bg-red-200',
                      day.status === 'present' && 'bg-green-200',
                      dayIdx % 7 === 0 && 'rounded-tl-lg',
                      dayIdx % 7 === 6 && 'rounded-tr-lg',
                      dayIdx % 7 === 0 && 'rounded-bl-lg',
                      dayIdx % 7 === 6 && 'rounded-br-lg'
                    )}
                  >
                    <time
                      dateTime={day.date}
                      className={classNames(
                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                        day.isSelected && day.isToday && 'bg-indigo-600',
                        day.isSelected && !day.isToday && 'bg-gray-900'
                      )}
                    >
                      {day.date}
                    </time>
                  </button>
                )
              })
            )}
          </div>
        </div>
        <div className='mt-2'>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-green-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Present</span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-red-500 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Absent</span>
          </div>
          <div className='flex  items-center'>
            <div className='w-6 h-3 bg-gray-200 inline-block rounded-sm' />{' '}
            <span className='whitespace-pre'> Not Given</span>
          </div>
        </div>
        <button
          type='button'
          onClick={() => setAttendancePopup(false)}
          className='mt-8 text-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Close
        </button>
      </div>
    </div>
  )
}
