const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const { data: user, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
    if (err) throw err
    if (user.length !== 0)
      throw new Error('A user with this email already exists.')
    const { data: newUser, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) {
      throw error
    }

    return res.status(201).send({
      data: newUser.user,
      error: null,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err,
    })
  }
}
exports.createEmployee = async (req, res) => {
  try {
    let newEmplyee = req.body
    let { first_name, last_name, email, id } = req.body
    const { file } = req.body
    let newProfile = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      id: id,
      user_type: 'worker',
    }
    const { data: createdProfile, error: errAtPr } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
    if (errAtPr) throw errAtPr
    const filename = `${id}`
    const fileContent = await fs.promises.readFile(file.image.filepath)
    const { data, error: errAtFile } = await supabase.storage
      .from('worker_profile')
      .upload(`avatars/${filename}`, fileContent, {
        contentType: file.image.mimetype,
        cacheControl: '3600',
        upsert: true,
      })
    if (errAtFile) throw errAtFile
    const { data: url, error: errAtUrl } = supabase.storage
      .from('worker_profile')
      .getPublicUrl(`avatars/${filename}`)
    if (errAtUrl) throw errAtUrl
    newEmplyee = { ...newEmplyee, [photo]: url }
    const { data: createdEmp, error: errAtEmp } = await supabase
      .from('worker')
      .insert([newEmplyee])
      .select()
    if (errAtEmp) throw errAtEmp
    return res.status(201).send({
      data: { profile: createdProfile, employee: createdEmp },
      error: null,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      data: null,
      error: err,
    })
  }
}
exports.fetchAadhaar = async (req, res) => {
  try {
    const { aadhaar: aadhaarNo } = req.body
    const { data: aadhaar, error } = await supabase
      .from('aadhaar_db')
      .select(`*`)
      .eq('aadhaar_no', aadhaarNo)
    if (error) throw error
    if (aadhaar.length === 0) {
      throw new Error('No data found for Aadhaar Number.')
    } else {
      const { data: workerExist, error } = await supabase
        .from('worker')
        .select('aadhar_no')
        .eq('aadhar_no', aadhaarNo)
      if (error) throw error
      if (workerExist.length !== 0)
        throw new Error('Worker all ready exists with this Aadhaar.')
    }
    return res.status(201).send({
      data: aadhaar[0],
      error: null,
    })
  } catch (err) {
    return res.status(403).send({ data: null, error: err.message })
  }
}
