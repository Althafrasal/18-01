const mysql = require('mysql2');
const express = require('express');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
//registering log4js 
const log4js = require('log4js');
const port = process.env.PORT || 7937;

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

//---------------------------------- Mysql connection ---------------------------------//

const Connection = mysql.createConnection({
    host: '10.160.15.193',
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

const messageApi = require("@cmdotcom/text-sdk");
const yourProductToken = "0bc81a74-a383-4ed9-a00d-d8d27de1af33"
const myMessageApi = new messageApi.MessageApiClient(yourProductToken)


//#region node routeing

// api given for handling safari 304 error
app.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

app.post('/userCreation', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var usertype = req.body.usertype;
    var status = req.body.status;
    let sql = 'INSERT INTO users(username,password,usertype,status)values(?,?,?,?)';
    Connection.query(sql, [username, password, usertype, status], (err, _result) => {
        if (err) {
            res.send({ status: 0, message: "data is not added" });
        }
        else {
            res.send({ status: 1, message: "data added successfully" });


        }
    })
})

app.post('/login', function (request, response, _next) {
    log.info('login Page');
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        query = `SELECT * FROM users WHERE username = "${username}"`;
        Connection.query(query, function (error, data) {
            try {
                if (data.length > 0) {
                    for (var count = 0; count < data.length; count++) {
                        if (data[count].password == password) {
                            const token = jwt.sign({ id: data[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
                            // request.session.id = data[count].id;
                            loginUserId = data[0].userid;
                            // LoginUserNumber = data[0].username;
                            // console.log("login", loginUserId);

                            // res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                            // res.header("Pragma", "no-cache");
                            // res.header("Expires", 0);

                            return response.json({ message: "logged in", token, data: data });
                        }
                        else {
                            return response.json({ message: "Incorrect password" });
                        }
                    }
                } else {
                    return response.json({ message: "Incorrect user name" });
                }
                response.end();
            } catch (err) {
                log.error('login', error)
            }
        });
    }
    else {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }
});

app.post('/leadsCreation', (req, res) => {
    log.info('Lead Creation')
    let userid = req.body.userid;
    let leadname = req.body.leadName;
    let messagebody = req.body.message;
    let tenantid = req.body.tenantid;
    let adminid = req.body.adminid;
    let sql = 'INSERT INTO leads(userid,leadname,messagebody,dateofcreation,tenantid,adminid)values(?,?,?,UTC_TIMESTAMP(),?,?)';
    Connection.query(sql, [userid, leadname, messagebody, tenantid, adminid], (err, result) => {
        try {
            if (err) {
                log.error("leadsCreation", err);
                res.send({ status: 0, message: "data is not added" });
            }
            else {
                res.send({ status: 1, message: "data added successfully", result })
            }
        } catch (err) {
            log.error("leadsCreation :catch", err);
        }

    })
})

app.post("/leadNumbers/:userId/:leadId", (req, res) => {
    log.info('Lead Numbers')
    let sql ="";
    let leadNumber = req.body.data;
    let userId = req.params.userId;
    let leadId = req.params.leadId;
    // console.log("Lead Numbers",leadNumber,userId,leadId);
    // console.log(leadNumber.length);
    for(i = 0 ; i < leadNumber.length ; i++ ){
        // console.log("for", leadNumber[i].numbers);
        sql+= `insert into leadNumbers(leadId,leadNumber,userId)values(${leadId},${leadNumber[i].numbers},${userId});`
    }
    log.info("lead numbers >>>>" , sql )
    // console.log(sql);
       Connection.query(sql, (err, data) => {
        try {
            if (err) {
                log.error("leadNumbers", err);
            } else {
                res.send({ data: data })
            }
        } catch (err) {
            log.error("leadNumbers :catch", err);
        }
    })
   
})

app.get('/getleads/:id', (req, res) => {
    log.info('getleads');
    let id = req.params.id
    Connection.query(`SELECT ld.leadname,ld.messagebody, ln.leadId,count(ln.leadNumber) as leadCount,CONVERT_TZ(ld.dateofcreation,'+00:00','-05:00') as dateofcreation 
    FROM leadNumbers ln  INNER JOIN leads ld on ln.leadId=ld.leadsid AND ln.userId = ld.userid 
    AND ld.userId =${id} AND ld.status=0 GROUP BY ln.leadId ORDER BY ld.dateofcreation DESC;`, (err, result) => {
        try {
            if (err) {
                res.send(err);
            } else {
                res.json({ result: result });
            }
        } catch (err) {
            log.error('getleads', err)
        }
    })
})
app.get("/getBroadcastedLeads/:id", (req, res) => {
    log.info('deliveredBroadcast');
    let id = req.params.id
    Connection.query(`SELECT ld.leadname,ld.messagebody,ln.leadId,ld.dateofbroadcasting,count(ln.leadNumber) as leadCount,CONVERT_TZ(ld.dateofcreation,'+00:00','-05:00') 
    as dateofcreation FROM leadNumbers ln  INNER JOIN leads ld on ln.leadId=ld.leadsid AND ln.userId = ld.userid 
    AND ld.userId =${id} AND ld.status=1 GROUP BY ln.leadId ORDER BY ld.dateofcreation DESC;`, (err, result) => {
        try {
            if (err) {
                log.error('deliveredBroadcast:SELECT', err);
            } else {
                res.send({ result })

            }
        } catch (error) {
            log.error('deliveredBroadcast', error)
        }
    })
})

app.post('/addToMessages', (req, res) => {
    log.info('addToMessages');
    var leadsid = req.body.leadsid;
    var uerid = req.body.userid;
    var customernumber = req.body.customernumber;
    var message = req.body.message;
    var direction = "out";
    var messagetype = "broadcast";
    let sql = 'INSERT INTO messages(leadsid,userid,customernumber,direction,messagetype,message)values(?,?,?,?,?,?)';
    Connection.query(sql, [leadsid, uerid, customernumber, direction, messagetype, message], (err, data) => {
        try {
            if (err) {
                log.error('addToMessages', err);
            } else {
                return res.json({ result: data });
            }
        } catch (error) {
            log.error('addToMessages', err);
        }

    })
})

app.post('/individualChat', (req, res) => {
    log.info('individualChat');
    var number = req.body.number;
    var message = req.body.message;
    var direction = req.body.direction;
    var messageType = req.body.messageType;
    var agent_id = req.body.agent_id;
    var tenantid = req.body.tenantid;
    var adminid = req.body.adminid;
    var readstatus = "1"
    console.log("heyy", adminid, tenantid);
    let sql = 'INSERT INTO messages(customernumber,direction,messagetype,message,agent_id,delivery_time,readstatus,tenantid,adminid)values(?,?,?,?,?,UTC_TIMESTAMP(),?,?,?)';
    Connection.query(sql, [number, direction, messageType, message, agent_id, readstatus, tenantid, adminid], (err, data) => {
        try {
            if (err) {
                log.error('individualChat', err);
                console.log(err);
            } else {
                Connection.query(`SELECT customernumber from readstatus WHERE customernumber="${number}" and agent_id=${agent_id};`, (err, response) => {
                    if (err) {
                        log.error('individualChat:customernumber', err);
                    } else {
                        length = response.length;
                        if (length > 0) {
                            Connection.query(`UPDATE readstatus SET read_status="1",delivary_time=UTC_TIMESTAMP() WHERE customernumber="${number}" and agent_id=${agent_id};`, (err, resp) => {
                                if (err) {
                                    log.error('individualChat:UPDATE', err);
                                }
                                else {
                                }
                            })
                        } else if (length == 0) {
                            let sql = 'INSERT INTO readstatus(agent_id,customernumber,read_status,delivary_time)values(?,?,?,UTC_TIMESTAMP());';
                            Connection.query(sql, [agent_id, number, readstatus], (err, datas) => {
                                if (err) {
                                    log.error('individualChat:INSERT', err);
                                } else {

                                }
                            })
                        }
                    }
                })
                return res.json({ result: data });
            }
        } catch (error) {
            log.error(error)
        }
    })
})

app.get('/getMessage', (req, res) => {
    log.info('getMessage');
    Connection.query('SELECT * from messages;', (err, result) => {
        try {
            if (err) {
                res.send(err)
            } else {
                resData = result
                let number = []
                let i = 0
                for (result[i].customernumber; i < result.length; i++) {
                    number.push("+" + result[i].customernumber)

                }
                res.send({ result: result })
            }
        } catch (error) {
            log.error('getMessage', error)
        }

    })
})

app.get("/deleteLeadList/:id", (req, res) => {
    log.info('deleteLeadList');
    let leadId = req.params.id;
    Connection.query(`UPDATE leads SET status="2" WHERE leadsid=${leadId};`, (err, data) => {
        try {
            if (err) {
                log.error('deleteLeadList:UPDATE', err);
            }
            else {
                log.info('deleteLeadList', data);
                res.json({ status: true })
            }
        } catch (error) {
            log.error('deleteLeadList', error);
        }
    })
})

app.get('/broadcastMessage/:id', (req, res) => {
    log.info('broadcastMessage');
    let leadId = req.params.id;
    let message;
    Connection.query(`SELECT leadNumbers.leadNumberId, leadNumbers.leadId, leadNumbers.LeadNumber,
    leadNumbers.userId FROM leadNumbers WHERE leadId = ${leadId};`, async (err, result) => {
        try {
            if (err) {
                res.send(err);
            } else {
                log.info(result);
                let number = []
                let i = 0
                for (result[i].LeadNumber; i < result.length; i++) {
                    number.push("+" + result[i].LeadNumber)
                }
                Connection.query(`SELECT messagebody FROM leads WHERE leadsid=${leadId};`, (err, data) => {
                    if (err) {
                        log.error('broadcastMessage:SELECT', err);
                    } else {
                        message = data[0].messagebody
                    }
                    Connection.query(`SELECT leads.userid FROM broadcast.leads leads WHERE (leads.leadsid =${leadId});`, (err, data) => {
                        if (err) {
                            log.error('broadcastMessage:SELECT leads', err);
                        } else {
                            let userid = data[0].userid
                            Connection.query(`SELECT users.username from users WHERE userid =${userid};`, (err, resp) => {
                                if (err) {
                                    log.error('broadcastMessage:SELECT users.username', err);
                                } else {
                                    let senderAgent = resp[0].username;
                                    const response = myMessageApi.sendTextMessage(number, +senderAgent, message, senderAgent + "|Broadcast|" + leadId)
                                    response.then(data => {
                                        Connection.query(`UPDATE leads SET status="1",dateofbroadcasting=UTC_TIMESTAMP() WHERE leadsid=${leadId};`, (err, result) => {
                                            if (err) {
                                                log.error('UPDATE leads', err);
                                                res.json({ status: false, error: err });
                                            }
                                            else {
                                                res.json({ status: true });
                                            }
                                        })
                                    }).catch((error) => {
                                        log.error(error)
                                    })
                                }
                            })
                        }
                    })
                })
            }
        } catch (error) {
            log.error('broadcastMessage', error)
        }
    })
})

// app.get('/saveBroadCast', (req, res) => {

//     var number = "";
//     var message = "how are you";
//     var direction = "outgoing";
//     var messageType = "Broadcast";
//     var delivery_time = new Date();
//     // console.log(customernumber,messageBox);

//     let sql = 'INSERT INTO messages(customernumber,direction,messagetype,message,delivery_time)values(?,?,?,?,?)';
//     Connection.query(sql, [number, direction, messageType, message, delivery_time], (err, data) => {
//         if (err) {
//             log.info(err);
//         }
//         else {
//             log.info(data);

//             return res.json({ result: data });
//         }
//     })
// })

app.post("/sendIndividual", (req, res) => {
    log.info('sendIndividual');
    let number = req.body.number;
    let sender = req.body.senderNumber;
    sender = sender.replace("+", "");
    let messageBox = req.body.messageBox;
    const resp = myMessageApi.sendTextMessage(["00" + number], +sender, messageBox, sender + "|individual");
    resp.then((responsee) => {
        log.info("data from send", "number:" + number, messageBox, "user :" + sender);
    }).catch((error) => {
        console.log(error);
    })
    res.send("successs")

})

router.post("/sms/reply", async (req, res) => {
    log.info('/sms/reply');
    let agent_id;
    let response = req.body;
    let responseMessage = req.body.message.text;
    let fromData = req.body.from;
    let responseNumber = fromData.number;
    responseNumber = responseNumber.replace("+", "");
    let toData = req.body.to;
    let toNumber = toData.number;
    toNumber = toNumber.replace("00", "")
    let direction = "incoming"
    let messageType = "individual"
    let readstatus = "0"
    Connection.query(`SELECT userid,tenantid,adminid FROM users WHERE username=${toNumber}`, (err, result) => {
        try {
            if (err) {
                log.error('/sms/reply:SELECT', err);
            } else {
                agent_id = result[0].userid
                tenant_id = result[0].tenantid
                adminid = result[0].adminid
                let sql = 'INSERT INTO messages(direction,message,customernumber,messagetype,delivery_time,agent_id,readstatus,tenantid,adminid)values(?,?,?,?,UTC_TIMESTAMP(),?,?,?,?);';
                Connection.query(sql, [direction, responseMessage, responseNumber, messageType, agent_id, readstatus, tenant_id, adminid], (err, data) => {
                    if (err) {
                        log.error('/sms/reply:INSERT', err);
                    } else {
                        Connection.query(`SELECT customernumber FROM readstatus WHERE customernumber="${responseNumber}" and agent_id=${agent_id};`, (err, response) => {
                            if (err) {
                                log.error('/sms/reply:SELECT', err);
                            } else {
                                length = response.length
                                if (length > 0) {
                                    Connection.query(`UPDATE readstatus SET read_status="0",delivary_time=UTC_TIMESTAMP() 
                                    WHERE customernumber="${responseNumber}" and agent_id=${agent_id};`, (err, resp) => {
                                        if (err) {
                                            log.error('/sms/reply:UPDATE', err);
                                        }
                                        else {
                                        }
                                    })
                                }
                                else if (length == 0) {
                                    let sql = 'INSERT INTO readstatus(agent_id,customernumber,read_status,delivary_time)values(?,?,?,UTC_TIMESTAMP());';
                                    Connection.query(sql, [agent_id, responseNumber, readstatus], (err, datas) => {
                                        if (err) {
                                            log.error('/sms/reply:INSERT INTO readstatus', err);
                                        } else {
                                        }
                                    })
                                }
                            }
                        })
                        return res.json({ result: data });
                    }
                    res.status(200).end()
                })
            }
        } catch (error) {
            log.error(error)
        }
    })
    log.info("Reply", response);
    // res.status(200).end()
})

// incoming
app.get('/fetchingMessages/:customernumber/:agentid', (req, res) => {
    log.info('/fetchingMessages/:customernumber/:agentid');
    let customernumber = req.params.customernumber;
    let agentid = req.params.agentid;
    Connection.query(`SELECT message,direction,CONVERT_TZ(messages.delivery_time,'+00:00','-05:00') as delivery_time from messages 
     WHERE customernumber="${customernumber}" and agent_id=${agentid} order by delivery_time;`, (err, result) => {
        try {
            if (err) {
                log.error('/fetchingMessages/:customernumber/:agentid', err);
            } else {
                res.json({ result: result });
            }
        } catch (error) {
            log.error('/fetchingMessages/:customernumber/', error);
        }
    })
})

app.get('/readStatus/:id', (req, res) => {
    log.info('readStatus');
    let customernumber = req.params.id;
    Connection.query(`UPDATE readstatus SET read_status="1" WHERE customernumber="${customernumber}";`, (err, data) => {
        try {
            if (err) {
                log.error('readStatus:UPDATE', err);
            } else {
                log.info(data);
            }
        } catch (error) {
            log.error('readStatus', error)
        }
    })
    res.json({ status: true })
})

app.get("/getDistinct/:agentid", (req, res) => {
    log.info('getDistinct');
    let agentid = req.params.agentid;
    Connection.query(`SELECT customernumber,read_status FROM readstatus WHERE agent_id=${agentid} ORDER BY delivary_time desc;`, (err, result) => {
        try {
            if (err) {
                res.send({ err })
            } else {
                res.json({ result: result });
            }
        } catch (error) {
            log.error('getDistinct', error)
        }


    })

})

router.post("/sms/deliverystatus", async (req, res) => {
    log.info('deliverystatus');
    let response = req.body;
    let customernumber = response.messages.msg.to;
    customernumber = customernumber.replace("00", "")
    let deliverystatus = response.messages.msg.status.errorDescription;
    let reference = response.messages.msg.reference;
    reference = reference.split("|")
    let fromNumber = reference[0]
    let messageType = reference[1]
    let leadid = reference[2]
    let leadname;
    log.info("deliverystatus >", fromNumber, messageType, leadid)
    log.info("deliveryStatus", response);
    log.info("customernumber:" + customernumber, "deliverystatus:" + deliverystatus, "fromNumber:" + fromNumber)

    if(messageType == "Broadcast"){
        Connection.query(`SELECT leadname from leads  where leadsid=${leadid}` , (err,resp)=>{
            if(err){
                log.info(err)
            }else{
                log.info("broadcast")
                log.info("resp",resp)
               leadname = resp[0].leadname
                log.info("leaddd name",leadname)
                Connection.query(`select adminid,tenantid from users where username="${fromNumber}"`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        let adminid = res[0].adminid
                        let tenantid = res[0].tenantid
                        let sql = (`INSERT INTO deliverystatus(customernumber,fromnumber,status,messagetype,leadid,tenantid,adminid,leadName)VALUES(?,?,?,?,?,?,?,?);`)
            
                        Connection.query(sql, [customernumber, fromNumber, deliverystatus, messageType, leadid,tenantid,adminid,leadname], (err, data) => {
                            if (err) {
                                log.info(err)
                            }
                            else {
                                log.info(data)
                            }
                        })
                    }
                })
            }
        })
    }else{
        log.info("individual")
         Connection.query(`select adminid,tenantid from users where username="${fromNumber}"`, (err, res) => {
             if (err) {
                 console.log(err);
             }
             else {
                 let adminid = res[0].adminid
                 let tenantid = res[0].tenantid
                 let sql = (`INSERT INTO deliverystatus(customernumber,fromnumber,status,messagetype,tenantid,adminid)VALUES(?,?,?,?,?,?);`)
     
                 Connection.query(sql, [customernumber, fromNumber, deliverystatus, messageType,tenantid,adminid], (err, data) => {
                     if (err) {
                         log.info(err)
                     }
                     else {
                         log.info(data)
                     }
                 })
             }
         })
        
    }
    res.json(response);
})

app.get("/getLeadsByid/:id", (req, res) => {
    log.info('getLeadsByid');
    let id = req.params.id;
    Connection.query(`SELECT * FROM leads WHERE leadsid=${id};`, (err, data) => {
        try {
            if (err) {
                log.error('getLeadsByid:SELECT', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getLeadsByid', err)
        }
    })
})

app.post("/updateLead/:id", (req, res) => {
    log.info('updateLead');
    let lead_id = req.params.id;
    let userid = req.body.userid;
    let leadName = req.body.leadName;
    let message = req.body.message;
    Connection.query(`UPDATE leads SET userid=${userid},leadname="${leadName}",messagebody="${message}" WHERE leadsid=${lead_id};`, (err, data) => {
        try {
            if (err) {
                log.error('updateLead:UPDATE', err);
            } else {
                res.send({ status: 1, message: "data updated successfully", data })
            }
        } catch (error) {
            log.error('updateLead', error);
        }
    })

})

app.get("/deleteLeadNumber/:leadId", (req, res) => {
    log.info('updateLead');
    let leadId = req.params.leadId
    Connection.query(`DELETE FROM leadNumbers WHERE leadId=${leadId};`, (err, data) => {
        try {
            if (err) {
                res.send(err)
            } else {
                res.send({ status: 1, message: "data deleted successfully", data })
            }
        } catch (error) {
            log.error('updateLead', error)
        }
    })
})

app.get("/getAdmins", (req, res) => {
    log.info('getAdmins');
    Connection.query(`SELECT * FROM users WHERE usertype="admin";`, (err, result) => {
        try {
            if (err) {
                res.send({ err })
            } else {
                res.json({ result: result });
            }
        } catch (error) {
            log.error('getAdmins', error)
        }
    })
})

app.get("/getAgents", (req, res) => {
    log.info('getAgents');
    Connection.query(`SELECT * FROM users WHERE usertype="agent";`, (err, result) => {
        try {
            if (err) {
                res.send({ err })
            } else {
                res.json({ result: result });
            }
        } catch (error) {
            log.error('getAgents', error)
        }
    })
})

app.get("/getTenants", (req, res) => {
    log.info('getTenants');
    Connection.query(`SELECT * FROM tenants;`, (err, data) => {
        try {
            if (err) {
                log.error('getTenants:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getTenants', err)
        }
    })
})
app.post('/createTenant', (req, res) => {
    log.info('addToMessages');
    var tenantname = req.body.tenantName;
    var address = req.body.defaultAddress;

    let sql = 'INSERT INTO tenants(tenantName,address)values(?,?)';
    Connection.query(sql, [tenantname, address], (err, data) => {
        try {
            if (err) {
                console.log(err);
                log.error('addToMessages', err);
            } else {
                console.log(data);

                return res.json({ result: data });
            }
        } catch (error) {
            log.error('addToMessages', err);
        }
    })
})

// getAdmins by tenant id
app.get("/getTenantAdmins/:id", (req, res) => {
    log.info('getTenantAdmins');
    let id = req.params.id;
    // console.log(tenanTid);
    Connection.query(`SELECT * FROM users where tenantid="${id}" AND usertype="admin";`, (err, data) => {
        try {
            if (err) {
                console.log(err);
                log.error('getTenantAdmins:select', err);
            }
            else {
                console.log(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getTenantAdmins', err)
        }
    })
})
app.post('/createAdmin', (req, res) => {
    log.info('createAdmin');
    var username = req.body.username;
    var password = req.body.password;
    var usertype = "admin";
    var tenantid = req.body.tenantid;

    let sql = 'INSERT INTO users(username,password,usertype,tenantid)values(?,?,?,?)';
    Connection.query(sql, [username, password, usertype, tenantid], (err, data) => {
        try {
            if (err) {
                console.log(err);
                log.error('createAdmin', err);
            } else {
                console.log(data);

                return res.json({ result: data });
            }
        } catch (error) {
            log.error('createAdmin', err);
        }
    })
})

app.get("/getAgents/:id", (req, res) => {
    log.info('getAgents');
    let id = req.params.id;
    Connection.query(`SELECT * FROM users WHERE adminid="${id}" AND usertype="agent";`, (err, data) => {
        try {
            if (err) {
                console.log(err);
                log.error('getAgents:select', err);
            }
            else {
                console.log(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getAgents', err)
        }
    })
})

app.get("/getAgentsBytenantid/:id", (req, res) => {
    log.info('getAgentsBytenantid');
    let id = req.params.id;
    Connection.query(`SELECT * FROM users WHERE tenantid="${id}" AND usertype="agent";`, (err, data) => {
        try {
            if (err) {
                console.log(err);
                log.error('getAgentsBytenantid:select', err);
            }
            else {
                console.log(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getAgents', err)
        }
    })
})

app.post('/createAgent', (req, res) => {
    log.info('createAgent');
    var username = req.body.username;
    var password = req.body.password;
    var usertype = "agent";
    var tenantid = req.body.tenantid
    var userid = req.body.userid;

    let sql = 'INSERT INTO users(username,password,usertype,tenantid,adminid)values(?,?,?,?,?)';
    Connection.query(sql, [username, password, usertype, tenantid, userid], (err, data) => {
        try {
            if (err) {
                log.error(err);               
                 log.error('createAgent', err);
            } else {
                log.info(data);
                return res.json({ result: data });
            }
        } catch (error) {
            log.error('createAgent', err);
        }
    })
})

app.get("/tenantName/:id", (req, res) => {
    log.info('tenantName');
    let tenantid = req.params.id;
    Connection.query(`SELECT tenantName FROM tenants WHERE id=${tenantid}`, (err, data) => {
        try {
            if (err) {
                log.error(err);               
                 log.error('tenantName:select', err);
            }
            else {
                log.info(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('tenantName', err)
        }
    })
})

app.get("/AgentCount/:id", (req, res) => {
    log.info('count');
    let tenantid = req.params.id;
    Connection.query(`SELECT COUNT(DISTINCT username) AS countNumbers FROM users WHERE tenantid=${tenantid} AND usertype="agent"`, (err, data) => {
        try {
            if (err) {
                log.error(err);        
                log.error('count:select', err);
            }
            else {
                log.info(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('count', err)
        }
    })
})

app.get("/totalMessages/:id", (req, res) => {
    log.info('totalMessages');
    let tenantid = req.params.id;
    Connection.query(`SELECT COUNT(message) AS MessageCount FROM messages WHERE tenantid=${tenantid}`, (err, data) => {
        try {
            if (err) {
                log.error('totalMessages:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('totalMessages', err)
        }
    })
})

app.get("/deliveredMessageCount/:id", (req, res) => {
    log.info('deliveredMessageCount');
    let tenantid = req.params.id;
    Connection.query(`SELECT COUNT(*) AS deliveredMessages FROM deliverystatus WHERE tenantid=${tenantid} AND status="Delivered";`, (err, data) => {
        try {
            if (err) {
                log.error('deliveredMessageCount:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('deliveredMessageCount', err)
        }
    })
})

app.get("/notDeliveredMessageCount/:id", (req, res) => {
    log.info('deliveredMessageCount');
    let tenantid = req.params.id;
    Connection.query(`SELECT COUNT(*) AS NotdeliveredMessages FROM deliverystatus WHERE tenantid=${tenantid} AND status!="Delivered";`, (err, data) => {
        try {
            if (err) {
                log.error('deliveredMessageCount:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('deliveredMessageCount', err)
        }
    })
})

app.get("/getAgentsCountbyAdmin/:id", (req, res) => {
    log.info('getAgentsCountbyAdmin');
    let adminid = req.params.id;
    Connection.query(`SELECT count(username)as agentCount FROM users WHERE adminid=${adminid} AND usertype="agent"`, (err, data) => {
        try {
            if (err) {
                log.error(err);
                log.error('getAgentsCountbyAdmin:select', err);
            }
            else {
                log.info(data);
                res.send({ data: data })
            }
        } catch (error) {
            log.error('getAgentsCountbyAdmin', err)
        }
    })
})

// totalmessages by admin Id
app.get("/totalMessagesbyAdminId/:id", (req, res) => {
    log.info('totalMessages');
    let adminid = req.params.id;
    Connection.query(`SELECT COUNT(message) AS MessageCount FROM messages WHERE adminid=${adminid}`, (err, data) => {
        try {
            if (err) {
                log.error('totalMessagesbyAdminId:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('totalMessagesbyAdminId', err)
        }
    })
})

// get delivered message count by adminid
app.get("/deliveredMessageCountByAdminId/:id", (req, res) => {
    log.info('deliveredMessageCountByAdminId');
    let adminid = req.params.id;
    Connection.query(`SELECT COUNT(*) AS deliveredMessages FROM deliverystatus WHERE adminid=${adminid} AND status="Delivered"`, (err, data) => {
        try {
            if (err) {
                log.error(err);
                log.error('deliveredMessageCountByAdminId:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('deliveredMessageCountByAdminId', err)
        }
    })
})

// get Notdelivered message count by adminid
app.get("/NotdeliveredMessageCountByAdminId/:id", (req, res) => {
    log.info('deliveredMessageCountByAdminId');
    let adminid = req.params.id;
    Connection.query(`SELECT COUNT(*) AS deliveredMessages FROM deliverystatus WHERE adminid=${adminid} AND status!="Delivered"`, (err, data) => {
        try {
            if (err) {
                log.error(err);
                log.error('NotdeliveredMessageCountByAdminId:select', err);
            }
            else {
                res.send({ data: data })
            }
        } catch (error) {
            log.error('NotdeliveredMessageCountByAdminId', err)
        }
    })
})

app.post("/messageReportForTenant", (req, res) => {
    let tenantid = req.body.id;
    let FromDate = req.body.FromDate;
    let ToDate = req.body.ToDate;
    Connection.query(`SELECT u.username,
    COUNT(DISTINCT m.messageid) AS totalMessage, 
    COUNT(DISTINCT CASE WHEN m.direction = 'incoming' THEN m.messageid END) AS "Incoming", 
    COUNT(DISTINCT CASE WHEN m.direction = 'outgoing' THEN m.messageid END) AS "Outgoing"
  FROM 
    users u
    LEFT JOIN messages m ON u.userid = m.agent_id AND m.tenantid =${tenantid}
  WHERE u.usertype = 'agent' AND u.tenantid = ${tenantid} AND m.delivery_time BETWEEN "${FromDate} 00:00:00" AND "${ToDate} 23:59:59" GROUP BY u.userid;`,(err,datas)=>{
        try {
            if (err) {
                console.log(err);
                log.error(err);               
                 log.error('report for tenant', err);
            } else {
                log.info(datas);
                console.log(datas);
                 res.send({ data: datas })
            }
        } catch (error) {
            log.error('report for tenant', err);
        }
    })
})

app.post("/broadcastReportForTenant" , (req,res) =>{
    let tenantid = req.body.id;
    let FromDate = req.body.FromDate;
    let ToDate = req.body.ToDate;
    Connection.query(`SELECT 
    u.username,
    COUNT(DISTINCT l.leadsid) AS total_leads,
    COUNT(DISTINCT ln.leadNumberId) AS total_broadcasts, 
    COUNT(DISTINCT CASE WHEN ds.status = 'delivered' THEN ds.id END) AS total_delivered,
    COUNT(DISTINCT CASE WHEN ds.status != 'delivered' THEN ds.id END) AS total_undelivered
  FROM users u
  JOIN leads l ON u.userid = l.userid
  JOIN leadNumbers ln ON l.leadsid = ln.leadId
  LEFT JOIN deliverystatus ds ON l.leadsid = ds.leadid
  WHERE u.usertype = 'agent' AND u.tenantid = ${tenantid} AND l.dateofbroadcasting BETWEEN "${FromDate} 00:00:00" AND "${ToDate}  23:59:59" AND l.status = 1
  GROUP BY u.username`, (err , result) =>{
    if(err){
        console.log(err);
    }else{
        res.send({ data: result })
    }
  })

})

app.post("/messageReportForAdmin", (req, res) => {
    let adminid = req.body.id;
    let FromDate = req.body.FromDate;
    let ToDate = req.body.ToDate;
    // let agentid=req.body.agentid;
    log.info('report for Admin');
    Connection.query(`SELECT u.username,
    COUNT(DISTINCT m.messageid) AS totalMessage, 
    COUNT(DISTINCT CASE WHEN m.direction = 'incoming' THEN m.messageid END) AS "Incoming", 
    COUNT(DISTINCT CASE WHEN m.direction = 'outgoing' THEN m.messageid END) AS "Outgoing"
  FROM 
    users u
    LEFT JOIN messages m ON u.userid = m.agent_id AND m.adminid =${adminid}
  WHERE u.usertype = 'agent' AND u.adminid = ${adminid} AND m.delivery_time BETWEEN "${FromDate} 00:00:00" AND "${ToDate} 23:59:59" GROUP BY u.userid;`,(err,datas)=>{
        try {
            if (err) {
                console.log(err);
                log.error(err);               
                 log.error('report for Admin', err);
            } else {
                log.info(datas);
                // console.log(datas);
                 res.send({ data: datas })
            }
        } catch (error) {
            log.error('report for Admin', err);
        }
    })
})

app.post("/broadcastReportForAdmin" , (req,res) =>{
    let adminid = req.body.id;
    let FromDate = req.body.FromDate;
    let ToDate = req.body.ToDate;
    Connection.query(`SELECT 
    u.username,
    COUNT(DISTINCT l.leadsid) AS total_leads,
    COUNT(DISTINCT ln.leadNumberId) AS total_broadcasts, 
    COUNT(DISTINCT CASE WHEN ds.status = 'delivered' THEN ds.customernumber END) AS total_delivered,
    COUNT(DISTINCT CASE WHEN ds.status != 'delivered' THEN ds.customernumber END) AS total_undelivered
  FROM users u
  JOIN leads l ON u.userid = l.userid
  JOIN leadNumbers ln ON l.leadsid = ln.leadId
  LEFT JOIN deliverystatus ds ON l.leadsid = ds.leadid
  WHERE u.usertype = 'agent' AND u.adminid = ${adminid} AND l.dateofbroadcasting BETWEEN "${FromDate} 00:00:00" AND "${ToDate}  23:59:59" AND l.status = 1
  GROUP BY u.username`, (err , result) =>{
    if(err){
        console.log(err);
    }else{
        res.send({ data: result })
    }
  })

})


app.post("/agentReportForNotDelivered",(req,res)=>{
    let agent = req.body.agent
    let fromDate = req.body.FromDate
    let toDate = req.body.toDate
    Connection.query(`SELECT customernumber,status,leadname from deliverystatus WHERE status!="delivered" AND fromnumber = ${agent} AND delivary_time BETWEEN "${fromDate} 00:00:00" AND "${toDate} 23:59:59";` , (err, data) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send({ data: data })
        }
    })
})

app.post("/agentReportForDelivered",(req,res)=>{
    let agent = req.body.agent
    let fromDate = req.body.FromDate
    let toDate = req.body.toDate
    Connection.query(`SELECT customernumber,status,leadname from deliverystatus WHERE status="delivered" AND fromnumber = ${agent} AND delivary_time BETWEEN "${fromDate} 00:00:00" AND "${toDate} 23:59:59";` , (err, data) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send({ data: data })
        }
    })
})

app.get("/getDistinctStatus" , (req,res)=>{
    Connection.query('SELECT DISTINCT status FROM deliverystatus',(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.send({ data: data })
        }
    })
})

//#endregion

//given for handling safari 304 error
app.disable('etag');
// ------------------------------------------------------
app.use("/api", router);

app.listen(port, "127.0.0.1", () => {
    log.info(`started on port: ${port}`);
});