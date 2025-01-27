import axios from 'axios'
import { Record } from '../models/record.js'

function getRecord(req, res) {  
  axios.get(`https://api.discogs.com/database/search?q=${req.query.word}&{?type,title,release_title,artist,}&key=${process.env.CONSUMER_KEY}&secret=${process.env.CONSUMER_SECRET}`)
  .then(response => {res.json(response.data)})
}

function getDbRecords(req, res) {
  Record.find({})
  .then(records => res.json(records))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function recordDetails(req, res) {  
  Record.findById(req.params.id)
  .then(record => res.json(record))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}


const addRating = async (req, res) => {
  console.log(req.body, "aaahahahahhahahahahahahahahahahahaha")

  try {
  //  req.body.rating = req.user.profile
   const record = await Record.findById(req.params.id)
   record.ratings.push(req.body)
    await record.save()
    return res.status(201).json(record)
  } catch (err) {
    console.log(err, "err")
    res.status(500).json(err)
  }    
}

const createComment = async (req, res) => {
  try {
    req.body.commenter = req.user.profile
    const record = await Record.findById(req.params.id)
    record.comments.push(req.body)
    await record.save()
    return res.status(201).json(record)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const editComment = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  try {
    const updatedRecord = await Record.findById(req.params.id)
   console.log(updatedRecord);
    const idx = updatedRecord.comments.findIndex((comment) =>
      comment._id.equals(req.params.commentId)
      )
      console.log(idx);
      updatedRecord.comments[idx] = req.body
      await updatedRecord.save()
      console.log(updatedRecord)
      return res.status(200).json(updatedRecord)  
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteComment = async(req, res) => {
  try {
   const post = await Post.findById(req.params.recordId)
   record.comments.remove({_id: req.params.commentId})
    await record.save()
    return res.status(204).end()
  } catch (err) {
    res.status(500).json(err)
  }
}

export {
  createComment,
  editComment,
  deleteComment,
  getRecord,
  addRating,
  getDbRecords,
  recordDetails
}