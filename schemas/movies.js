const z = require('zod');

const movieSchema = z.object({
        title: z.string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string'
        }),
        year: z.number().int().positive().min(1888, 'Year must be 1888 or later')
        .max(new Date().getFullYear(), 'Year cannot be in the future'),
        director: z.string(),
        duration: z.number().int().positive(),
        poster: z.string().url('Poster must be a valid URL'),
        genre:z.array(z.string()).nonempty('Genre must have at least one item'),
        rate: z.number().min(0).max(10).optional()
    });

    function validateMovie(data) {
        return movieSchema.safeParse(data);
    }
    function validatePartialMovie(data) {
        return movieSchema.partial().safeParse(data);
    }
    module.exports = {
        validateMovie,
        validatePartialMovie
    };