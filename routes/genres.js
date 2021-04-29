const express = require('express')

const router = express.Router()

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
  
  // get all genres
  router.get("/", (req, res) => {
    res.status(200).json({
      sucess: true,
      data: genres,
    });
  });
  
  // get a single genre
  router.get("/:id", (req, res) => {   
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
  
  // create a genre
  router.post("/", (req, res) => {
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
  
  // update a genre
  router.put("/:id", (req, res) => {
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
  
  // delete a genre
  router.delete(':id', (req, res) => {
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
  
  // user input validation for genre
  const validationGenre = (genre) => {
    const schema = Joi.object({
      name: Joi.string().min(3),
    });
  
    return schema.validate(genre);
  };

  module.exports = router