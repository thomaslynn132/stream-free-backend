const Review = require('../model/reviewModel');
const User = require('../model/userModel');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            total: reviews.length,
            data: {
                reviews
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

exports.getMovieReview = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4; // Default to 4 reviews per page
    const skip = (page - 1) * limit;

    try {
        const reviews = await Review.find({ media: req.params.id })
            .skip(skip)
            .limit(limit)
            .select("-email")
        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            total: reviews.length,
            reviews
        });
    }
    catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

//! front-end pagination functionality
// const fetchReviews = async (movieId, page = 1, limit = 4) => {
//     const res = await fetch(`/api/reviews?movieId=${movieId}&page=${page}&limit=${limit}`);
//     const data = await res.json();
//     return data;
// };

exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            data: {
                review
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

exports.createReview = async (req, res) => {
    //! must send review category in the request body => [movie or series]

    try {
        const newReview = await Review.create(req.body);
        res.status(201).json({
            status: 201,
            message: 'Review created successfully',
            data: {
                review: newReview
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 404,
            message: err
        });
    }
};


//! This controller is not very useful in a real-world application
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 200,
            message: 'Review updated successfully',
            data: {
                review
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({
                status: 404,
                message: 'No review found with that ID'
            });
        }

        res.status(200).json({
            status: 204,
            message: 'Review deleted successfully',
        });
    } catch (err) {
        res.status(404).json({
            status: 404,
            message: err
        });
    }
};