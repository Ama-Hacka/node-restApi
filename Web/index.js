fetch('http://localhost:3000/movies')
.then(res => res.json())
.then(movies => {
    const html = movies.map(movie => {
        return `<article data-id = "${movie.id}">
        <h2>${movie.title} (${movie.year})</h2>
        <p>Directed by: ${movie.director}</p>
        <img src="${movie.poster}" alt="${movie.title} poster" width="200"/>
    </article>` }).join('');
    document.querySelector('main').innerHTML = html;
})
.catch(err => {
    console.error('Error fetching movies:', err);
    document.body.innerHTML = '<p>Failed to load movies.</p>';
});
