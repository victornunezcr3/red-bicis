var nodemailer = require('nodemailer');

const nodemailerConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wellington.koepp@ethereal.email',
        pass: 'S3RfuhhgVpPqN3J1bR'
    }
};

module.exports = nodemailer.createTransport(nodemailerConfig);