const mysql = require('mysql');
const express = require('express');
const app = express();
const router = express.Router();
// const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
//registering log4js 
const log4js = require('log4js');
const axios = require('axios')
const port = process.env.PORT || 3000;

//Configuring log file types & path
log4js.configure({
    appenders: {
        access: {
            type: 'dateFile',
            filename: __dirname + '/log/access.log',
            pattern: '-yyyy-MM-dd',
            category: 'http'
        },
        app: {
            type: 'file',
            filename: __dirname + '/log/app.log',
            maxLogSize: 10485760,
            numBackups: 3
        },
        errorFile: {
            type: 'file',
            filename: __dirname + '/log/errors.log'
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile'
        }
    },
    categories: {
        default: { appenders: ["app", "errors"], level: "ALL" },
        http: { appenders: ["access"], level: "ALL" }
    }
});
//initializing log4js 
const log = log4js.getLogger("startup");
//initializing body-parser 
const bodyparser = require('body-parser');
const cors = require('cors')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

app.use(cors())

const Connection = mysql.createConnection({
    host: '10.160.0.63',
    user: 'devuser',
    password: 'P@ssw0rd',
    database: 'broadcast',
    port: '3306',
    multipleStatements: true
});
Connection.connect((err) => {
    if (!err) {
        log.debug('db is connected');
    }
    else {
        log.debug('db connection failed', err);
    }
})

app.post('/userCreation', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var usertype = req.body.usertype;
    var status = req.body.status;

    let sql = 'INSERT INTO users(username,password,usertype,status)values(?,?,?,?)';
    Connection.query(sql, [username, password, usertype, status], (err, result) => {
        if (err) {
            res.send({ status: 0, message: "data is not added" });
        }
        else {
            res.send({ status: 1, message: "data added successfully" });


        }
    })
})


app.post('/login', function (request, response, next) {

    var username = request.body.username;

    var password = request.body.password;

    if (username && password) {
        query = `
        SELECT * FROM users 
        WHERE username = "${username}"
        `;

        Connection.query(query, function (error, data) {

            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].password == password) {
                        const token = jwt.sign({ id: data[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });

                        // request.session.id = data[count].id;
                        return response.json({ message: "logged in", token, data: data });
                    }
                    else {
                        response.send('Incorrect Password');
                    }
                }
            }
            else {
                response.send('Incorrect user name');
            }
            response.end();
        });
    }
    else {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});

app.post('/leadsCreation', (req, res) => {
    var userid = req.body.userid;
    var leadname = req.body.leadName;
    var messagebody = req.body.message;

    let sql = 'INSERT INTO leads(userid,leadname,messagebody)values(?,?,?)';
    Connection.query(sql, [userid, leadname, messagebody], (err, result) => {
        if (err) {
            res.send({ status: 0, message: "data is not added" });
        }
        else {
            res.send({ status: 1, message: "data added successfully", result })
        }
    })
})
app.post("/leadNumbers",(req,res)=>{
    let leadNumber=req.body.leadNumber;
    let userId=req.body.userId;
    let leadId=req.body.leadId;
    let sql='insert into leadNumbers(leadId,leadNumber,userId)values(?,?,?);'
    Connection.query(sql, [leadId, leadNumber, userId], (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            res.send({data:data})
        }
})
})

app.get('/getleads', (req, res) => {
    Connection.query('select * from leads;', (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.json({ result: result });
        }
    })

})

app.post('/addToMessages', (req, res) => {
    var leadsid = req.body.leadsid;
    var uerid = req.body.userid;
    var customernumber = req.body.customernumber;
    var message = req.body.message;
    var direction = "out";
    var messagetype = "broadcast";

    let sql = 'INSERT INTO messages(leadsid,userid,customernumber,direction,messagetype,message)values(?,?,?,?,?,?)';
    Connection.query(sql, [leadsid, uerid, customernumber, direction, messagetype, message], (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            return res.json({ result: data });
        }
    })
})

app.get('/getMessage', (req, res) => {
    let resData = {}
    Connection.query('select * from messages;', (err, result) => {
        if (err) {
            res.send(err)
        }
        else {
            // console.log(result);
            resData = result
            // console.log(resData);
            console.log(result[0].customernumber);
            console.log("record set length: " + result.length);
            let number = []
            let i = 0
            for (result[i].customernumber; i < result.length; i++) {
                number.push("+" + result[i].customernumber)

            }
            console.log(number);

            res.send({ result: result })
        }
    })
})

const messageApi = require("@cmdotcom/text-sdk")
const yourProductToken = "0bc81a74-a383-4ed9-a00d-d8d27de1af33"
const myMessageApi = new messageApi.MessageApiClient(yourProductToken)


app.get('/broadcastMessage', (req, res) => {
    Connection.query('select leadNumbers.leadNumberId, leadNumbers.leadId, leadNumbers.LeadNumber,leadNumbers.userId from leadNumbers;', async (err, result) => {
        
        console.log(result);
        if (err) {
            res.send(err);
            
        }
        else {
            log.info(result);
            let number = []
            let i = 0
            for (result[i].LeadNumber; i < result.length; i++) {
                console.log(result[i].LeadNumber);
                number.push("+" + result[i].LeadNumber)
            }
            console.log(number);
            const res = myMessageApi.sendTextMessage(number, 14383009922, "this is a test from v2.0!?")
            res.then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            })

        }
    })

})


router.post("/sms/reply", async (req, res) => {
    let response = req.body;
    
    let responseMessage = req.body.message.text;
    let fromData = req.body.from;
    let responseNumber = fromData.number;
    responseNumber=responseNumber.replace("+","");
    let direction = "incoming"
    let messageType = "broadcast"
    log.info(responseMessage, responseNumber)
    log.info("Reply", response);
    let sql = 'INSERT INTO messages(direction,message,customernumber,messagetype)values(?,?,?,?);';
    Connection.query(sql, [direction, responseMessage, responseNumber,messageType], (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            return res.json({ result: data });
        }
    })

    res.json(response);


})
router.post("/sms/deliveryStatus", async (req, res) => {
    console.log('Entering');
    let response = req.body;
    // let key = utils.printValues(response);
    // console.log("object",key);
    res.json(response);
    log.info(response);

})

app.use("/api", router);
app.listen(port, () => {
    console.log(`started on port: ${port}`);
});