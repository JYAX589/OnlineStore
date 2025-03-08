// middlewares/error-handler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log del error

    res.status(500).json({
        message: 'Ocurrió un error en el servidor.',
        error: err.message
    });
};