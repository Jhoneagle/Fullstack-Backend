const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
      "name": String,
      "number": String
})

const params = process.argv

if (params.length === 4) {
	const person = new Person ({
	      "name": params[2],
	      "number": params[3]
	})
	
	person
	  .save()
	  .then(result => {
	    console.log('lisätään henkilö ', result.name,' numero ', result.number, ' luetteloon')
	    mongoose.connection.close()
	  })
} else {
	console.log('puhelinluettelo:')
	Person
	  .find({}, {__v: 0})
	  .then(result => {
	    result.forEach(person => {
	      console.log(person.name, ' ', person.number)
	    })
	    mongoose.connection.close()
	  })
}
