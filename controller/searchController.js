// const Movie = require('../model/movieModel');
// const Series = require('../model/seriesModel');
// const Actor = require('../model/actorModel');
// const Director = require('../model/directorModel');
// const Review = require('../model/reviewModel');

// const searchController = async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ status: 400, message: "Query is required" });
//     }

//     try {
//         const movieResults = await Review.aggregate([
//             {
//                 $lookup: {
//                     from: 'movies',
//                     localField: 'media',
//                     foreignField: '_id',
//                     as: 'movieDetails'
//                 }
//             },
//             { $unwind: '$movieDetails' },
//             { $match: { 'movieDetails.title': { $regex: query, $options: 'i' } } },
//             {
//                 $group: {
//                     _id: '$media',
//                     rate: { $avg: '$rating' },
//                     movieDetails: { $first: '$movieDetails' }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     type: 'movie',
//                     data: {
//                         _id: '$_id',
//                         title: '$movieDetails.title',
//                         description: '$movieDetails.description',
//                         thumbnail: '$movieDetails.thumbnail',
//                         genres: '$movieDetails.genres',
//                         rate: '$rate'
//                     }
//                 }
//             }
//         ]);

//         const seriesResults = await Review.aggregate([
//             {
//                 $lookup: {
//                     from: 'series',
//                     localField: 'media',
//                     foreignField: '_id',
//                     as: 'seriesDetails'
//                 }
//             },
//             { $unwind: '$seriesDetails' },
//             { $match: { 'seriesDetails.title': { $regex: query, $options: 'i' } } },
//             {
//                 $group: {
//                     _id: '$media',
//                     rate: { $avg: '$rating' },
//                     seriesDetails: { $first: '$seriesDetails' }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     type: 'series',
//                     data: {
//                         _id: '$_id',
//                         title: '$seriesDetails.title',
//                         description: '$seriesDetails.description',
//                         thumbnail: '$seriesDetails.thumbnail',
//                         genres: '$seriesDetails.genres',
//                         rate: '$rate'
//                     }
//                 }
//             }
//         ]);

//         const actorResults = await Actor.find({ fullName: { $regex: query, $options: 'i' } })
//             .select("fullName profile birthDate country birthPlace");
//         const directorResults = await Director.find({ fullName: { $regex: query, $options: 'i' } })
//             .select("fullName profile birthDate country birthPlace");

//         const combinedResults = [
//             ...movieResults.map(result => result),
//             ...seriesResults.map(result => result),
//             ...actorResults.map(result => ({ type: 'actor', data: result })),
//             ...directorResults.map(result => ({ type: 'director', data: result }))
//         ];

//         res.status(200).json({
//             status: 200,
//             message: "Search results fetched successfully",
//             results: combinedResults
//         });
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//         res.status(500).send({ status: 500, message: "Internal Server Error" });
//     }
// };

// module.exports = searchController;
// 63 80



// 30 45
const Actor = require('../model/actorModel');
const Director = require('../model/directorModel');
const Review = require('../model/reviewModel');

const searchController = async (req, res) => {
    const { query } = req.body;
    const limit = parseInt(req.query.limit) || 6;

    if (!query) {
        return res.status(400).json({ status: 400, message: "Query is required" });
    }

    try {
        const [movieResults, seriesResults, actorResults, directorResults] = await Promise.all([
            Review.aggregate([
                {
                    $lookup: {
                        from: 'movies',
                        localField: 'media',
                        foreignField: '_id',
                        as: 'movieDetails'
                    }
                },
                { $unwind: '$movieDetails' },
                { $match: { 'movieDetails.title': { $regex: query, $options: 'i' } } },
                {
                    $group: {
                        _id: '$media',
                        rate: { $avg: '$rating' },
                        movieDetails: { $first: '$movieDetails' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: 'movie',
                        data: {
                            _id: '$_id',
                            title: '$movieDetails.title',
                            description: '$movieDetails.description',
                            thumbnail: '$movieDetails.thumbnail',
                            genres: '$movieDetails.genres',
                            rate: '$rate'
                        }
                    }
                },
                { $limit: limit }
            ]),
            Review.aggregate([
                {
                    $lookup: {
                        from: 'series',
                        localField: 'media',
                        foreignField: '_id',
                        as: 'seriesDetails'
                    }
                },
                { $unwind: '$seriesDetails' },
                { $match: { 'seriesDetails.title': { $regex: query, $options: 'i' } } },
                {
                    $group: {
                        _id: '$media',
                        rate: { $avg: '$rating' },
                        seriesDetails: { $first: '$seriesDetails' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: 'series',
                        data: {
                            _id: '$_id',
                            title: '$seriesDetails.title',
                            description: '$seriesDetails.description',
                            thumbnail: '$seriesDetails.thumbnail',
                            genres: '$seriesDetails.genres',
                            rate: '$rate'
                        }
                    }
                },
                { $limit: limit }
            ]),
            Actor.find({ fullName: { $regex: query, $options: 'i' } })
                .select("fullName profile birthDate country birthPlace bio")
                .limit(limit),
            Director.find({ fullName: { $regex: query, $options: 'i' } })
                .select("fullName profile birthDate country birthPlace bio")
                .limit(limit)
        ]);

        const combinedResults = [
            ...movieResults,
            ...seriesResults,
            ...actorResults.map(result => ({ type: 'actor', data: result })),
            ...directorResults.map(result => ({ type: 'director', data: result }))
        ];

        res.status(200).json({
            status: 200,
            message: "Search results fetched successfully",
            results: combinedResults.slice(0, limit)
        });
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};

module.exports = searchController;




// const Movie = require('../model/movieModel');
// const Series = require('../model/seriesModel');
// const Actor = require('../model/actorModel');
// const Director = require('../model/directorModel');
// const Review = require('../model/reviewModel');

// const searchController = async (req, res) => {
//     const { query } = req.body;

//     if (!query) {
//         return res.status(400).json({ status: 400, message: "Query is required" });
//     }

//     try {
//         // Execute queries in parallel
//         const [movieResults, seriesResults, actorResults, directorResults] = await Promise.all([
//             Review.aggregate([
//                 {
//                     $lookup: {
//                         from: 'movies',
//                         localField: 'media',
//                         foreignField: '_id',
//                         as: 'movieDetails'
//                     }
//                 },
//                 { $unwind: '$movieDetails' },
//                 { $match: { 'movieDetails.title': { $regex: query, $options: 'i' } } },
//                 {
//                     $group: {
//                         _id: '$media',
//                         rate: { $avg: '$rating' },
//                         movieDetails: { $first: '$movieDetails' }
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         type: 'movie',
//                         data: {
//                             _id: '$_id',
//                             title: '$movieDetails.title',
//                             description: '$movieDetails.description',
//                             thumbnail: '$movieDetails.thumbnail',
//                             genres: '$movieDetails.genres',
//                             rate: '$rate'
//                         }
//                     }
//                 },
//                 { $limit: 10 } // Limit the number of results
//             ]),
//             Review.aggregate([
//                 {
//                     $lookup: {
//                         from: 'series',
//                         localField: 'media',
//                         foreignField: '_id',
//                         as: 'seriesDetails'
//                     }
//                 },
//                 { $unwind: '$seriesDetails' },
//                 { $match: { 'seriesDetails.title': { $regex: query, $options: 'i' } } },
//                 {
//                     $group: {
//                         _id: '$media',
//                         rate: { $avg: '$rating' },
//                         seriesDetails: { $first: '$seriesDetails' }
//                     }
//                 },
//                 {
//                     $project: {
//                         _id: 0,
//                         type: 'series',
//                         data: {
//                             _id: '$_id',
//                             title: '$seriesDetails.title',
//                             description: '$seriesDetails.description',
//                             thumbnail: '$seriesDetails.thumbnail',
//                             genres: '$seriesDetails.genres',
//                             rate: '$rate'
//                         }
//                     }
//                 },
//                 { $limit: 10 } // Limit the number of results
//             ]),
//             Actor.find({ fullName: { $regex: query, $options: 'i' } })
//                 .select("fullName profile birthDate country birthPlace")
//                 .limit(10), // Limit the number of results
//             Director.find({ fullName: { $regex: query, $options: 'i' } })
//                 .select("fullName profile birthDate country birthPlace")
//                 .limit(10) // Limit the number of results
//         ]);

//         // Combine and score the results
//         const combinedResults = [
//             ...movieResults.map(result => ({ ...result, score: result.data.title.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1 })),
//             ...seriesResults.map(result => ({ ...result, score: result.data.title.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1 })),
//             ...actorResults.map(result => ({ type: 'actor', data: result, score: result.fullName.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1 })),
//             ...directorResults.map(result => ({ type: 'director', data: result, score: result.fullName.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1 }))
//         ];

//         // Sort by score and limit to 6 results
//         const sortedResults = combinedResults.sort((a, b) => b.score - a.score).slice(0, 6);

//         res.status(200).json({
//             status: 200,
//             message: "Search results fetched successfully",
//             results: sortedResults
//         });
//     } catch (error) {
//         console.error("Error fetching search results:", error);
//         res.status(500).send({ status: 500, message: "Internal Server Error" });
//     }
// };

// module.exports = searchController;