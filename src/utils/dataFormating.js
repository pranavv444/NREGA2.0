function timestampToDate (timestamp) {
  // Create a new JavaScript Date object from the PostgreSQL timestamp.
  const date = new Date(timestamp)

  // Extract the date components from the JavaScript Date object.
  const year = date.getFullYear()
  const month = date.getMonth() // Months are zero-indexed in JavaScript.
  const day = date.getDate()

  // Create a new string in the format `yyyy-mm-dd` using the extracted date components.
  const dateString = `${getDay(day)} ${getMonth(month)}, ${year}`

  // Return the new string.
  return dateString
}
function getDay (num) {
  const lastDigit = num % 10
  if (lastDigit == 1 || num == 1) return num + 'st'
  else if (lastDigit == 2 || num == 2) return num + 'nd'
  else if (lastDigit == 3 || num == 3) return num + 'rd'
  else return num + 'th'
}
function getMonth (num) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return months[num]
}

function jobDuration (startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timestamp = Date.now()
  const diff = Math.abs(end - start)
  const spent = Math.abs(timestamp - start)
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const spentDays = Math.ceil(spent / (1000 * 60 * 60 * 24))
  const percentage = spentDays >= days ? 100 : ((spentDays / days) * 100).toFixed(2)
  return { days, percentage }
}
function formatLocation (locationObj) {
  return `${locationObj.panchayat}, ${locationObj.block}, ${locationObj.district}, ${locationObj.state}`
}
function formatLocationShort (locationObj) {
  return `${locationObj.panchayat}, ${locationObj.block}`
}
export { timestampToDate, jobDuration, formatLocation, formatLocationShort }
