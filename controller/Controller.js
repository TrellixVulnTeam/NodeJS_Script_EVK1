var express = require('express');
const createError = require('http-errors');
var router = express.Router();
const fs = require('fs')
const XLSX = require('node-xlsx');
const axios = require('axios').default;
const FormData = require('form-data');

const timer = ms => new Promise(res => setTimeout(res, ms))

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

const submitComplaint = async (req, res, next) => {
  const fromId = req.query.from ?? 0;
  const interval = req.query.interval ?? 30000;
  const file = `${__dirname}/../public/complaints.xlsx`;

  // Logs
  const log_path = `${__dirname}/../public/log_complaints_${Date.now()}.txt`;
  const myConsole = new console.Console(fs.createWriteStream(log_path));

  try {
    if (!fs.existsSync(file)) return next(createError({ message: 'File not found' }))
  } catch (err) {
    console.error(err)
  }

  const sheet = XLSX.parse(fs.readFileSync(file));

  const sheetData = sheet[0].data;
  const newSheet = [['mobile', 'complaintId', 'latitude', 'longitude', 'status']]

  for (var x = 1; x < sheetData.length; x++) {
    const data = sheetData[x];
    const randomFile = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const photo = `${__dirname}/../public/images/before/${randomFile}.jpg`;

    var response = await complaintData(data, photo);
    newSheet.push([data[1], response.complaint.comId, data[4], data[5], response.message])

    let buffer = XLSX.build([{ name: 'Sheet', data: newSheet }]);
    fs.writeFileSync(`${__dirname}/../public/complete_complaints.xlsx`, buffer);

    myConsole.log(`${x} | ${data[1]} | ${response.complaint.comId}`);

    await timer(interval)

    if (x == sheetData.length - 1) {
      console.log('Complaints Completed!');
    }
  }

  res.status(200).json({})
}

const solvedComplaint = async (req, res, next) => {
  const fromId = req.query.from ?? 0;
  const interval = req.query.interval ?? 60000;
  const file = `${__dirname}/../public/solved_complaints.xlsx`;

  // Logs
  const log_path = `${__dirname}/../public/log_solved_complaints_${Date.now()}.txt`;
  const myConsole = new console.Console(fs.createWriteStream(log_path));

  try {
    if (!fs.existsSync(file)) return next(createError({ message: 'File not found' }))
  } catch (err) {
    console.error(err)
  }

  const sheet = XLSX.parse(fs.readFileSync(file));

  const sheetData = sheet[0].data;
  const newSheet = [['complaintId', 'status']]

  for (var x = 1; x < sheetData.length; x++) {
    const data = sheetData[x];
    const randomFile = 1//Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const photo = `${__dirname}/../public/images/after/${randomFile}.jpg`;

    var response = await solvedData(data, photo);
    newSheet.push([data[0], response.message])

    let buffer = XLSX.build([{ name: 'Sheet', data: newSheet }]);
    fs.writeFileSync(`${__dirname}/../public/complete_solved_complaints.xlsx`, buffer);

    myConsole.log(`${x} | ${data[0]}`);

    if (x == sheetData.length - 1) {
      console.log('Complaints Solved!');
    } else {
      await timer(interval)
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

const complaintData = async (data, photo) => {
  const form = new FormData();
  form.append('categoryId', data[0]);
  form.append('mobile', data[1]);
  form.append('name', data[2]);
  form.append('complaint', data[3]);
  form.append('latitude', data[4]);
  form.append('longitude', data[5]);
  form.append('address', data[6]);
  form.append('landmark', data[7]);
  form.append('photo', fs.createReadStream(photo));

  return axios.post(`http://97.74.85.82/bhopal-first/complaint`, form, { headers: form.getHeaders() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response);
      return error.response;
    });
}

const solvedData = async (data, photo) => {
  const form = new FormData();
  form.append('complaintId', data[0]);
  form.append('remark', data[1]);
  form.append('latitude', data[2]);
  form.append('longitude', data[3]);
  form.append('photo', fs.createReadStream(photo));

  return axios.post(`http://97.74.85.82/bhopal-first/solved-complaint`, form, { headers: form.getHeaders() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response);
      return error.response;
    });
}

module.exports = {
  submitFeedback: submitFeedback,
  submitRegister: submitRegister,
  submitComplaint: submitComplaint,
  solvedComplaint: solvedComplaint
}