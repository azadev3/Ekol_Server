const MailConfigModel = require('../models/MailConfigModel');
const nodemailer = require('nodemailer');

const getTransporter = async () => {
  const config = MailConfigModel.findOne();
  console.log(config, 'config!1!!!!');
  if (!config) {
    throw new Error('Mail config not found!');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

module.exports = getTransporter;