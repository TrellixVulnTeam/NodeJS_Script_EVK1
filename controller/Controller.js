var express = require('express');
const createError = require('http-errors');
var router = express.Router();
const fs = require('fs')
const XLSX = require('node-xlsx');
const axios = require('axios').default;

const submitFeedback = async (req, res, next) => {
  const id = req.params.id;
  const file = `${__dirname}/../public/feedback${id}.xlsx`;

  // Logs
  const log_path = `${__dirname}/../public/log_feedback_${id}_${Date.now()}.txt`;
  const myConsole = new console.Console(fs.createWriteStream(log_path));

  try {
    if (!fs.existsSync(file)) return next(createError({ message: 'File not found' }))
  } catch (err) {
    console.error(err)
  }

  const sheet = XLSX.parse(fs.readFileSync(file));

  const sheetData = sheet[0].data;
  const newSheet = [['S.No.', 'Mobile Number', 'Age', 'Status']]

  for (var x = 0; x < sheetData.length; x++) {
    const data = sheetData[x];
    const age = Math.floor(Math.random() * (30 - 15 + 1)) + 15;

    var response = await feedbackData(data[0], age);
    newSheet.push([x, data[0], age, response])

    let buffer = XLSX.build([{ name: 'Sheet', data: newSheet }]);
    fs.writeFileSync(`${__dirname}/../public/complete_feedback_${id}.xlsx`, buffer);

    myConsole.log(x);

    if (x == sheetData.length - 1) {
      console.log('Feedback Completed!');
    }
  }

  res.status(200).json({})
}

const submitRegister = async (req, res, next) => {
  const id = req.params.id;
  const file = `${__dirname}/../public/register${id}.xlsx`;

  // Logs
  const log_path = `${__dirname}/../public/log_register_${id}_${Date.now()}.txt`;
  const myConsole = new console.Console(fs.createWriteStream(log_path));

  try {
    if (!fs.existsSync(file)) return next(createError({ message: 'File not found' }))
  } catch (err) {
    console.error(err)
  }

  const sheet = XLSX.parse(fs.readFileSync(file));

  const sheetData = sheet[0].data;
  const newSheet = [['S.No.', 'Mobile Number', 'Status']]

  for (var x = 0; x < sheetData.length; x++) {
    const data = sheetData[x];

    var response = await registerData(data[0]);
    newSheet.push([x, data[0], response])

    let buffer = XLSX.build([{ name: 'Sheet', data: newSheet }]);
    fs.writeFileSync(`${__dirname}/../public/complete_registration_${id}.xlsx`, buffer);

    myConsole.log(x);

    if (x == sheetData.length - 1) {
      console.log('Registration Completed!');
    }
  }

  res.status(200).json({})
}

/**
 * 
 * @param {mobile} mobile 
 * @returns 
 */
const registerData = async (mobile) => {
  return axios.post(`http://97.74.85.82/bhopal-first/register`, {
    mobile: mobile
  })
    .then((response) => {
      return response.data.message
    })
    .catch((error) => {
      console.log(error.response);
      return 'Already registered!'
    });
}

const feedbackData = async (mobile, age) => {
  return axios.post(`http://97.74.85.82/bhopal-first/postPolls`, {
    mobile: mobile,
    30: 135,
    31: 137,
    32: 139,
    33: 141,
    46: age
  })
    .then((response) => {
      return response.data.message
    })
    .catch((error) => {
      console.log(error.response);
      return 'Error'
    });
}

module.exports = {
  submitFeedback: submitFeedback,
  submitRegister: submitRegister
}