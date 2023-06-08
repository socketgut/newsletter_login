// jshint esversion:6

const express = require('express')
const bodyParser = require('body-parser')
const request = require("request")
const https = require('https')

const app = express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html")

})

app.post("/", function(req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    const url = 'https://us17.api.mailchimp.com/3.0/lists/83a08e405c'

    const data= {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }

        ]
    }

    const jsonData= JSON.stringify(data);

    options= {
        method: 'POST',
        auth: "socket101:3d43b8cede778ea60d2d7052371c6add-us17"
    }

    var request= https.request(url, options, function(response) {
        
        
        response.on("data", function(data){
            var postData = JSON.parse(data)
            var errorCode = postData.error_count
            console.log(postData)
            // console.log(errorCode)

            if (errorCode === 0) {
                res.sendFile(__dirname + "/success.html")
            }else{
                res.sendFile(__dirname + "/failure.html")
            }
        })
        

    })

    request.write(jsonData)
    request.end()

})

app.post('/failure', function(req, res) {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, function() {
    console.log('Server is active on port')
})


// API Key
// 3d43b8cede778ea60d2d7052371c6add-us17

// List / Audience ID
// 83a08e405c

