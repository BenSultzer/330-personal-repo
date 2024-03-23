const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/random-word', function (req, res) {
	let words = ["apple", "orange", "silence", "jud", "kumquat"];
	let word = words[(Math.floor(Math.random() * words.length))];
	res.send(word)
	})

app.listen(3000)
