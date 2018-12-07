const express = require('express'),
      request = require('request'),
      bodyParser = require('body-parser'),
      path = require('path');

const app = express();

// Body parser middleware to accept form data
app.use(bodyParser.urlencoded({extended: true}));


// Static folder
app.use(express.static(path.join(__dirname, 'public')));


// Signup route

app.post('/signup', (req, res) => {
    const {firstName, lastName, email} = req.body;

    if(!firstName || !lastName || !email) {
        res.redirect('/fail.html');
        return;
    }

    // Construct request data
    const data = {
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

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/d4423dbd21',
        method: 'POST',
        headers: {
            Authorization: 'auth 5b1826bfbf37c4eb9dc916398bb17f8f-us19'
        },
        body: postData
    };

    request(options, (err, response, body) => {
        if(err) {
            res.redirect('/fail.html');
        } else {
            if(response.statusCode === 200) {
                res.redirect('/success.html');
            } else {
                res.redirect('/fail.html');
            }
        }
    });
});


app.listen(3000, () => {
    console.log('Mailchimp is awaiting information...');
});