import { CheckIcon, ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { AddEmployee, AddUser } from '.'
import { useState } from 'react'

// Helping functions
var steps = [
  { name: 'step 0', status: 'current' },
  { name: 'step 1', status: 'upcoming' }
]
function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Progress () {
  const [active, setActive] = useState(0)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fetchedDetails: null
  })

  function onUserCreation (user) {
    steps[active].status = 'complete'
    steps[active + 1].status = 'current'
    setNewUser(prev => ({ ...prev, fetchedDetails: user }))
    setActive(1)
  }
  return (
    <>
      {/* Bread crumbing to last url */}
      <Link to='..'>
        <ArrowLongLeftIcon
          className='h-12 w-12 text-indigo-600'
          aria-hidden='true'
          title='Back to Employees List'
        />
      </Link>
      {/* Navigation on Progress */}
      <nav aria-label='Progress' className='flex justify-center'>
        <ol role='list' className='flex items-center'>
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={classNames(
                stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                'relative'
              )}
            >
              {step.status === 'complete' ? (
                <>
                  <div
                    className='absolute inset-0 flex items-center'
                    aria-hidden='true'
                  >
                    <div className='h-0.5 w-full bg-indigo-600' />
                  </div>
                  <button
                    onClick={() => {
                      if (steps[active].status !== 'complete')
                        steps[active].status = 'upcoming'
                      setActive(stepIdx)
                      if (steps[stepIdx].status !== 'complete')
                        steps[stepIdx].status = 'current'
                    }}
                    className='relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900'
                  >
                    <CheckIcon
                      className='h-5 w-5 text-white'
                      aria-hidden='true'
                    />
                    <span className='sr-only'>{step.name}</span>
                  </button>
                </>
              ) : step.status === 'current' ? (
                <>
                  <div
                    className='absolute inset-0 flex items-center'
                    aria-hidden='true'
                  >
                    <div className='h-0.5 w-full bg-gray-200' />
                  </div>
                  <button
                    onClick={() => {
                      if (steps[active].status !== 'complete')
                        steps[active].status = 'upcoming'
                      setActive(stepIdx)
                      if (steps[stepIdx].status !== 'complete')
                        steps[stepIdx].status = 'current'
                    }}
                    className='relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white'
                    aria-current='step'
                  >
                    <span
                      className='h-2.5 w-2.5 rounded-full bg-indigo-600'
                      aria-hidden='true'
                    />
                    <span className='sr-only'>{step.name}</span>
                  </button>
                </>
              ) : (
                <>
                  <div
                    className='absolute inset-0 flex items-center'
                    aria-hidden='true'
                  >
                    <div className='h-0.5 w-full bg-gray-200' />
                  </div>
                  <button
                    onClick={() => {
                      if (steps[active].status !== 'complete')
                        steps[active].status = 'upcoming'
                      setActive(stepIdx)
                      if (steps[stepIdx].status !== 'complete')
                        steps[stepIdx].status = 'current'
                    }}
                    className='group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400'
                  >
                    <span
                      className='h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300'
                      aria-hidden='true'
                    />
                    <span className='sr-only'>{step.name}</span>
                  </button>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {active === 0 && <AddUser onUserCreation={onUserCreation} />}
      {active === 1 && <AddEmployee />}
    </>
  )
}
