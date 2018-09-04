const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/persons')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] :response-time ms'))

app.get('/info', (req, res) => {
  Person
	.find({}, {__v: 0})
	.then(persons => {
	    const length = persons.length
	    const day = new Date()
		  
	    const text = '<div>Puhelinluettelossa ' + length + ' henkilön tiedot</div><div>' + day + '</div>'
		  
	    res.send(text)
	})
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
	Person
	  .find({}, {__v: 0})
	  .then(result => {
	    persons = result.map(Person.format)
	    res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if ( person ) {
	    res.json(Person.format(person))
	  } else {
	    res.status(400).send({ error: 'malformatted id' })
	  }
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
	res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  
  const person = {
	name: body.name,
	number: body.number
  }
  
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (body.name === '') {
    return res.status(400).json({error: 'name missing'})
  }
  
  if (body.number === '') {
    return res.status(400).json({error: 'number missing'})
  }

  Person
	.find({name: body.name})
	.then(result => {
		if (result.length === 0) {
			const person = new Person ({
			    name: body.name,
			    number: body.number
			})
		
			person
			    .save()
			    .then(savedPerson => {
			      res.json(Person.format(savedPerson))
			    })
		} else {
			return res.status(400).json({error: 'name already taken'})
		}
	})
})

const error = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})