const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const cors = require('cors');
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use(cors()); // Allow all origins
app.disable('x-powered-by');      



app.get('/', (req, res) => {
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // 'localhost:3000' or 'node-restapi-pyre.onrender.com'
    const baseUrl = `${protocol}://${host}`;
    
    res.type('html');
    res.send(`<h1>Welcome to the Movies API</h1>
        <a href="${baseUrl}/movies">Watch movies here</a>`);
        
});


app.get('/movies', (req, res) => {
    const {genre} = req.query;
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase() )
        )
        return res.json(filteredMovies)
    }
    return res.json(movies);
    // const allMovies = movies.map(({id, title, year, director, poster}) => ({
    //     id,
    //     title,
    //     year,
    //     director,
    //     poster
    // }));
    // res.type('html');
    // res.send(allMovies.map(movie => {
    //     return `<div>
    //         <h2>${movie.title} (${movie.year})</h2>
    //         <p>Directed by: ${movie.director}</p>
    //         <img src="${movie.poster}" alt="${movie.title} poster" width="200"/>
    //     </div>`;
    // }).join(''));
}   );



app.get('/movies/:id', (req, res) => { //path to regexp
    const{id} = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) {
        return res.json(movie);
    } else {
        res.status(404).json({error: 'Movie not found'});
    }
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);
    if (result.error){
        return res.status(400).json({errors: JSON.parse(result.error.message)});
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie); 
});

app.patch('/movies/:id',(req, res) => {
   
    const result = validatePartialMovie(req.body);
     if(!result.success){
        return res.status(400).json({errors: JSON.parse(result.error.message)});
     }

    const {id}  = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({error: 'Movie not found'});
    }
    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    };
    movies[movieIndex] = updatedMovie;
   return  res.json(updatedMovie);
    

});



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});