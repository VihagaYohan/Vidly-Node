const { urlencoded } = require("express");
const express = require("express");
const Joi = require("joi");
const helmet = require('helmet')
const morgan = require('morgan')

// import middleware functions
const logger = require('./middleware/logger')

const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}))
app.use(express.static('public'))
app.use(helmet())
app.use(morgan('tiny'))

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
}

// impliment middleware
app.use(logger)

const genres = [
  {
    id: 1,
    name: "Action",
  },
  {
    id: 2,
    name: "Horror",
  },
  {
    id: 3,
    name: "Animation",
  },
];

app.get("/api/genres", (req, res) => {
  res.status(200).json({
    sucess: true,
    data: genres,
  });
});

app.get("/api/genres/:id", (req, res) => {   
  const genreId = req.params.id;
  const genre = genres.find((g) => g.id === parseInt(genreId));

  console.log(genre);
  if (genre === null) {
    /* res.status(404).json({ sucess: false, data: "Genre not found" });
    return; */
    console.log("not found");
  }

  res.status(200).json({
    sucess: true,
    data: genre,
  });
});

app.post("/api/genres", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);

  res.status(200).send(genres);
});

app.put("/api/genres/:id", (req, res) => {
  // find genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).json({
      sucess: false,
      data: "The course with the given ID was not found",
    });
  }

  // validation

  const { error } = validationGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } 

  genre.name = req.body.name
  res.send(genre)
});

app.delete('/api/genres/:id', (req, res) => {
    // find genre
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if(!genre){
        return res.status(404).json({sucess:false,data:'The genre for the for the prodived ID was not found'})
    }

    // remove genre
    const index = genres.indexOf(genre)
    genres.splice(index,1)

    res.status(200).json({
        sucess:true,
        data:genres
    })
})

const validationGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(3),
  });

  return schema.validate(genre);
};

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development'

app.listen(port, () => {
  console.log(`Server is running on port ${port} on ${environment}`);
});
