import express from 'express'
import bodyParser from "body-parser";

const articlesInfo = {
    'learn-react': {upVotes: 0, comments: [] },
    'learn-node': {upVotes: 0, comments: [] },
    'my-thoughts-on-resumes': {upVotes: 0, comments: [] }
}


const app = express()
app.use(bodyParser.json())
app.get('/hello', (req, res) => {
    res.send('Hello!')
})

// {name: "Shaun"}
app.post('/hello', (req, res) => {
    const {name} = req.body
    res.send(`Hello ${name}`)
})


app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name
    if(articlesInfo[articleName] != undefined) {
        
        articlesInfo[articleName].upVotes += 1
        res.status(200).send(`Success! ${articleName} now has ${articlesInfo[articleName].upVotes} votes`)

    } else {
        res.status(404).send('Not Found')
    }
})

app.post('/api/articles/:name/comments', (req, res) => {
    const articleName = req.params.name
    if(articlesInfo[articleName] != undefined) {
        const {postedBy, text} = req.body
        articlesInfo[articleName].comments.push({
            postedBy, 
            text 
        })
        res.status(200).send(articlesInfo[articleName])
    } else {
        res.status(404).send('Not Found')
    }
})


app.listen(8000, () => console.log('Server is listening on port 8000'))