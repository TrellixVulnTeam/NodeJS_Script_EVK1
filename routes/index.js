var express = require('express');
const createError = require('http-errors');
var router = express.Router();
const fs = require('fs')
const XLSX = require('node-xlsx');
const { randomInt } = require('crypto');
const axios = require('axios').default;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', async (req, res, next) => {
  const file = `${__dirname}/../public/register.xlsx`;

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
    fs.writeFileSync(`${__dirname}/../public/complete_registration.xlsx`, buffer);

    console.log(x);
  }

  res.status(200).json({})
})

router.get('/feedback', async (req, res, next) => {
  const file = `${__dirname}/../public/feedback.xlsx`;

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
    fs.writeFileSync(`${__dirname}/../public/feedback_complete.xlsx`, buffer);

    console.log(x);
  }

  res.status(200).json({})
})

const registerData = async (mobile) => {
  return axios.post(`http://97.74.85.82/bhopal-first/postPolls`, {
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

module.exports = router;
