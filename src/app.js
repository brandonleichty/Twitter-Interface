const express = require('express')
const pug = require('pug');
const twit = require('twit');

const port = 3030;


const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
  res.render('main.pug');
});


app.listen(port, () => {
  console.log('The server is now running on port 3030. Press CTRL+C to quit.');
});
