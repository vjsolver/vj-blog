import express from 'express'
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from 'path'


// const articlesInfo = {
//     'learn-react': {upVotes: 0, comments: [] },
//     'learn-node': {upVotes: 0, comments: [] },
//     'my-thoughts-on-resumes': {upVotes: 0, comments: [] }
// }

let db
const start = async () => {
    const client = await MongoClient.connect(
        'mongodb://localhost:27017', 
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    
     db = client.db('react-blog-db')
}

start()

const app = express()



app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/build')))
app.get('/hello', (req, res) => {
    res.send('Hello!')
})



// {name: "Shaun"}
app.post('/hello', (req, res) => {
    const {name} = req.body
    res.send(`Hello ${name}`)
})

app.get('/api/articles/:name', async (req, res) => {
    const { name: articleName} = req.params
    
    const articleInfo = await db.collection('articles')
    .findOne({name: articleName})

    res.status(200).send(articleInfo)

})


app.post('/api/articles/:name/upvotes', async (req, res) => {
    const articleName = req.params.name
    const currentArticle = await db.collection('articles').findOne({name: articleName})

    await db.collection('articles').updateOne(
        { name: articleName },
        { $inc: {upVotes: 1}}
    )

    const updatedArticle = await db.collection('articles').findOne({name: articleName})
    
    res.status(200).send(updatedArticle)

    
})

app.post('/api/articles/:name/comments', async (req, res) => {
    const articleName = req.params.name
    const {postedBy, text} = req.body

    await db.collection('articles').updateOne(
        { name: articleName },
        { $push: {comments: {postedBy, text } } },
    )

    const updatedArticle = await db.collection('articles').findOne({name: articleName})

    res.status(200).send(updatedArticle)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'))
})

app.listen(8000, () => console.log('Server is listening on port 8000'))