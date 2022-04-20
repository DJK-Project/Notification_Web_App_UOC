require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var fs = require('fs')
var https = require('https')
var session = require('express-session')
global.config=require("./config.json")
let DDDoS = require('dddos');
const port = config.http_port
const fileUpload= require("express-fileupload")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const nodemailer = require('nodemailer');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');
const data = [
  {
     "name":"Shadab Shaikh",
     "email":"shadab@gmail.com",
     "mobile":"1234567890"
  }
 ]
 const headingColumnNames = [
     "Name",
     "Email",
     "Mobile",
 ]



// api routes
app.use('/users', require('./Controller/users.controller'));
app.use('/companies', require('./Controller/companies.controller'));
app.use('/markers', require('./Controller/markers.controller'));
app.use('/types', require('./Controller/types.controller'));

// global error handler
app.use(errorHandler);

 // Paypal Section
 //Write Column Title in Excel file
 let headingColumnIndex = 1;
 headingColumnNames.forEach(heading => {
     ws.cell(1, headingColumnIndex++)
         .string(heading)
 });
 //Write Data in Excel file
 let rowIndex = 2;
 data.forEach( record => {
     let columnIndex = 1;
     Object.keys(record ).forEach(columnName =>{
         ws.cell(rowIndex,columnIndex++)
             .string(record [columnName])
     });
     rowIndex++;
 }); 
 wb.write('data.xlsx');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AcZ208jdzPitcMDbCxLHFX5URkSmjXb5Wq9EVK9vNEJOdTTw1cC007DnZXU8WwBgQFtdi32BzpNb3HNx',
  'client_secret': 'EFyCi4SExR-ML7jRGQycdQzmsMCySO3cvS-7gvTQ81LWNUAGd6oSOjKt2rgGbiq4vKY0-WgoSuqxdSio'
});


app.set('view engine', 'ejs');

app.get('/Paypal', (req, res) => res.render('index'));

app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "https://localhost:443/Paypal/success",
        "cancel_url": "https://localhost:443/Paypal/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Marker Data",
                "sku": "001",
                "price": "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "Marker data history from Notification Web App"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/Paypal/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'djk.project2@gmail.com',
            pass: 'Testing12345'
          }
        });

        var mailOptions = {
          from: 'djk.project2@gmail.com',
          to: '1131028@student.uoc.cw',
          subject: 'Order# ' + paymentId,
          text: 'Thank You for your purchase',
          attachments: [
            {
              path: './data.xlsx'
            },
        ],
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    }
});
});

app.get('/Paypal/cancel', (req, res) => res.send('Cancelled'))





app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use('/api-docs', require('_helpers/swagger'));
app.set('trust proxy', 1) // trust first proxy
app.use(session(config.session))


app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(new DDDoS(config.ddos).express('ip', 'path')); 
//Default values for the IP and path property names, may be omitted.

app.use((req,res,next)=>{

console.log(res)
  next()
  
})

// app.listen(port, ( ) => {

//   console.log(` App listening at http://localhost:${port}`)

// })

https.createServer({
  key: fs.readFileSync('./Certificate/90542467_localhost.key'),
  cert: fs.readFileSync('./Certificate/90542467_localhost.cert')
}, app)

.listen(config.https_port, function () {
  console.log(' App app listening on port '+config.https_port+'! Go to https://localhost:'+config.https_port+'/')
})

