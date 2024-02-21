import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../api/store'
import { FormLoading } from '../../Errors'

export default function AddEmployee () {
  const { lastAddedUser, lastAadhaarData, setAadhaarData, profile } =
    useAdminStore()
  const [aadhaarNo, setAadhaarNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ...lastAadhaarData,
    first_name: '',
    last_name: '',
    mgnrega_id: '',
    address: '',
    photo: '',
    street: '',
    mobile: ''
  })
  console.log(lastAddedUser)
  async function handleSubmit () {
    console.log('Cant change')
  }
  function handleChange (e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    console.log(name, value)
  }
  function cantChange (e) {
    e.preventDefault()
  }
  async function handleAadhaarClick (e) {
    e.preventDefault()
    console.log('clicked aadhaar button')
    await setAadhaarData(aadhaarNo)
  }
  useEffect(() => {
    if (lastAddedUser) {
      setLoading(true)
      ;async () => {
        console.log('hello')
      }
      setLoading(false)
    }
  }, [aadhaarNo])
  return (
    <main>
      {/* The Form with all the fields. */}
      <div className='px-6'>
        <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Fill New Worker's Details
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          This information will be will be used only for this system.{' '}
          <strong>All fields are required.</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6 px-12'>
          <div className='border-b border-gray-900/10 pb-6'>
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3 sm:col-start-1'>
                <label
                  htmlFor='uuid'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Worker ID
                </label>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                    <input
                      type='text'
                      name='uuid'
                      id='uuid'
                      value={lastAddedUser.id}
                      onChange={cantChange}
                      disabled
                      className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6'
                      placeholder='id'
                    />
                    <p className='px-3 py-0.5 invisible peer-disabled:visible text-gray-400 text-sm'>
                      Last Created User ID
                    </p>
                  </div>
                </div>
              </div>
              {/* Aadhaar Number */}
              <div className='sm:col-span-3'>
                <label
                  htmlFor='aadhaar'
                  className='block text-sm font-medium leading-6 text-gray-900 whitespace-nowrap'
                >
                  Aadhaar Number
                </label>
                <div className='mt-2 flex items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='text'
                    name='aadhaar'
                    id='aadhaar'
                    value={aadhaarNo}
                    onChange={e => setAadhaarNo(e.target.value)}
                    className='block w-full border-gray-300 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='0000-0000-0000'
                    required
                  />
                  <button onClick={handleAadhaarClick}>
                    <p className='flex px-6'>
                      <ion-icon
                        style={{ color: 'red' }}
                        size='large'
                        name='cloud-download-outline'
                      ></ion-icon>
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Fill in the actual details of the worker except those auto filled.
            </p>
            {loading ? (
              <div className='mt-12'>
                <FormLoading />
              </div>
            ) : (
              <div>
                <div className='border-b border-gray-900/10 pb-12 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                  {/* MGNREGA ID */}
                  <div className='sm:col-span-2 sm:col-start-1'>
                    <label
                      htmlFor='aadhaar'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      MGNREGA ID
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='aadhaar'
                        id='aadhaar'
                        value={formData.mgnrega_id}
                        onChange={handleChange}
                        className='block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        placeholder='MG-00-00'
                        required
                      />
                    </div>
                  </div>
                  {/* Profile Picture */}
                  <div className='sm:col-start-1 sm:col-span-4'>
                    <label
                      htmlFor='cover-photo'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Profile photo
                    </label>
                    <div className='mt-2 flex items-center gap-6'>
                      <div className='shrink-0 '>
                        <span className='inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                      </div>
                      <label className='block'>
                        <span className='sr-only'>Choose profile photo</span>
                        <input
                          type='file'
                          name='photo'
                          id='photo'
                          value={formData.photo}
                          onChange={handleChange}
                          className='block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                 file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100'
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className='sm:col-start-1 sm:col-span-2'>
                    <label
                      htmlFor='first-name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      First name
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='first-name'
                        id='first-name'
                        value={formData.first_name}
                        onChange={handleChange}
                        autoComplete='given-name'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        required
                      />
                    </div>
                  </div>
                  {/* Last Name */}
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='last-name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Last name
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='last-name'
                        id='last-name'
                        value={formData.last_name}
                        onChange={handleChange}
                        autoComplete='family-name'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        required
                      />
                    </div>
                  </div>
                  {/* Father's Name */}
                  <div className='sm:col-span-2 sm:col-start-1'>
                    <label
                      htmlFor='father_name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Father's Name
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='father_name'
                        id='father_name'
                        value={lastAadhaarData.father_name}
                        onChange={cantChange}
                        placeholder="Worker's Father Name"
                        disabled
                        className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                        required
                      />
                      <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
                        Prefilled with Aadhaar Data
                      </p>
                    </div>
                  </div>
                  {/* Email address */}
                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Email address
                    </label>
                    <div className='mt-2'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        value={lastAddedUser.email}
                        onChange={cantChange}
                        disabled
                        autoComplete='email'
                        className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                        required
                      />
                      <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
                        Prefilled with Worker's Data
                      </p>
                    </div>
                  </div>

                  {/* Age/ DOB */}
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='age'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Age / DOB
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='age'
                        id='age'
                        value={`${lastAadhaarData.dob}`}
                        onChange={cantChange}
                        placeholder='00 / DD-MM-YYYY'
                        disabled
                        className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                        required
                      />
                      <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
                        Prefilled with Aadhaar Data
                      </p>
                    </div>
                  </div>
                  {/* Bank Account Number*/}
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='account-number'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Bank Account Number
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='account-number'
                        id='account-number'
                        value={lastAadhaarData.bank_account}
                        onChange={cantChange}
                        disabled
                        className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                        required
                      />
                      <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
                        Prefilled with Aadhaar Data
                      </p>
                    </div>
                  </div>
                  {/* Mobile Number */}
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='mobile'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Mobile Number
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='mobile'
                        id='mobile'
                        value={formData.mobile}
                        onChange={handleChange}
                        autoComplete='family-name'
                        placeholder='10 Digits'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        required
                      />
                    </div>
                  </div>
                  {/* Street Address */}
                  <div className='col-span-3'>
                    <label
                      htmlFor='street-address'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Street address
                    </label>
                    <div className='mt-2'>
                      <textarea
                        type='text'
                        name='street-address'
                        id='street-address'
                        value={formData.street}
                        onChange={handleChange}
                        cols={20}
                        rows={3}
                        autoComplete='street-address'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        required
                      />
                    </div>
                  </div>
                  {/* Location ID */}
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='location_id'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Location ID
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='location_id'
                        id='location_id'
                        value={profile.location_id.id}
                        onChange={cantChange}
                        disabled
                        className='peer block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm'
                        required
                      />
                      <p className='mt-2 invisible peer-disabled:visible text-gray-400 text-sm'>
                        Autofilled with Sachiva Data
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-6 flex items-center justify-end gap-x-6 pb-12'>
                  <Link
                    to='..'
                    className='text-sm font-semibold leading-6 text-gray-900'
                  >
                    Cancel
                  </Link>
                  <button
                    type='submit'
                    className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
