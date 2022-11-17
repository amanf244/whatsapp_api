/* eslint-disable prettier/prettier */
const response = (res, statusCode = 200, success = false, message = '', data = {}) => {
    res.status(statusCode)
    res.send({
        success,
        message,
        data,
    })

    // res.end()
}

export default response
