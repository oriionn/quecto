const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const SHA256 = require("crypto-js/sha256");
const {Base64} = require('js-base64');
const crypto = require('crypto');
const config = require('./config');
const arguments = process.argv.slice(2);

if (process.env.DOCKER) {
    Object.entries(process.env).forEach(([key, value]) => {
        config[key] = value;
    });

    config.PORT = arguments[0];
}


let url = `mongodb://${config.DB_HOST}:${config.DB_PORT}/?authMechanism=DEFAULT`;
if (config.DB_USER && config.DB_PASS) {
    url = `mongodb://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:${config.DB_PORT}/?authMechanism=DEFAULT`;
}
const client = new MongoClient(url);
const dbName = config.DB_NAME
const isJSON = config.DB_TYPE.toLowerCase() === "json";
const isMongoDB = config.DB_TYPE.toLowerCase() === "mongodb";
const multer = require('multer');

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let lookup;
async function checkURL(url){
    if(!lookup) lookup = require('safe-browse-url-lookup')({ apiKey: config.SAFE_BROWSING_APIKEY });
    return await lookup.checkSingle(url)
}

function generateCode() {
    const buffer = crypto.randomBytes(1);
    const hex = buffer.toString('hex');

    return Date.now().toString(16) + hex;
}

async function shorten(url, password) {
    let data = {}

    if (isJSON) {
        if (!config.DB_JSON_PATH) {
            console.log("Error: DB_JSON_PATH not found");
            return res.status(500).send("Error: DB_JSON_PATH not found");
        } else {
            if (!fs.existsSync(config.DB_JSON_PATH)) fs.writeFileSync(config.DB_JSON_PATH, JSON.stringify({}));
        }

        let db = JSON.parse(fs.readFileSync(config.DB_JSON_PATH));
        let code = generateCode();

        if (password) {
            let hashPass = SHA256(password).toString();
            db[code] = { link: url, password: hashPass };
        } else {
            db[code] = { link: url };
        }

        fs.writeFileSync(config.DB_JSON_PATH, JSON.stringify(db));
        data = { status: 200, data: { original: url, shorten: `${config.DOMAIN}/s/${code}` } };
    } else if (isMongoDB) {
        let code = generateCode();

        await client.connect();
        let db = client.db(dbName);
        if (!db) {
            console.log("Error: db not found");
            return;
        }
        let collection = db.collection('links');

        if (password) {
            let hashPass = SHA256(password).toString();
            await collection.insertOne({link: url, code: code, password: hashPass});
        } else {
            await collection.insertOne({link: url, code: code});
        }

        data = {status: 200, data: {original: url, shorten: `${config.DOMAIN}/s/${code}`} };
    }

    return data;
}

app.post('/api/form_shorten', multer().none(), async (req, res) => {
    let resp = await shorten(req.body.link, req.body.password);
    res.redirect(`/generated?link=${Base64.encode(resp.data.shorten)}`);
});

app.post('/api/shorten', multer().none(), async (req, res) => {
    res.json(await shorten(req.body.link, req.body.password));
});

app.get("/s/:code", async (req, res) => {
    let code = req.params.code;
    let password = req.query.password;

    if (isJSON) {
        if (!config.DB_JSON_PATH) {
            console.log("Error: DB_JSON_PATH not found");
            return res.status(500).send("Error: DB_JSON_PATH not found");
        } else {
            if (!fs.existsSync(config.DB_JSON_PATH)) fs.writeFileSync(config.DB_JSON_PATH, JSON.stringify({}));
        }

        let db = JSON.parse(fs.readFileSync(config.DB_JSON_PATH));

        if (!db[code]) {
            return res.status(404).send("Error: Code not found");
        }

        if (db[code].link) {
            if (db[code].password) {
                if (password) {
                    let hashPass = SHA256(password).toString();
                    if (hashPass === db[code].password) {
                        let isSafe = !(await checkURL(db[code].link));
                        if (isSafe) res.redirect(db[code].link);
                        else res.redirect(`/warning?link=${Base64.encode(db[code].link)}`);
                    } else {
                        res.redirect(`/s/${code}`)
                    }
                } else {
                    res.sendFile(__dirname + '/public/password.html');
                }
            } else {
                let isSafe = !(await checkURL(db[code].link));
                if (isSafe) res.redirect(db[code].link);
                else res.redirect(`/warning?link=${Base64.encode(db[code].link)}`);
            }
        } else {
            let isSafe = !(await checkURL(db[code]));
            if (isSafe) res.redirect(db[code]);
            else res.redirect(`/warning?link=${Base64.encode(db[code])}`);
        }
    } else if (isMongoDB) {
        await client.connect();
        let db = client.db(dbName);
        if (!db) {
            console.log("Error: db not found");
            return;
        }
        let collection = db.collection('links');

        let filtered = await collection.find({code: code}).toArray();

        if (filtered.length === 0) {
            return res.status(404).send("Error: Code not found");
        }

        if (filtered[0].password) {
            if (password) {
                let hashPass = SHA256(password).toString();
                if (hashPass === filtered[0].password) {
                    let isSafe = !(await checkURL(filtered[0].link));
                    if (isSafe) res.redirect(filtered[0].link);
                    else res.redirect(`/warning?link=${Base64.encode(filtered[0].link)}`);
                } else {
                    res.redirect(`/s/${code}`)
                }
            } else {
                res.sendFile(__dirname + '/public/password.html');
            }
        } else {
            let isSafe = !(await checkURL(filtered[0].link));
            if (isSafe) res.redirect(filtered[0].link);
            else res.redirect(`/warning?link=${Base64.encode(filtered[0].link)}`);
        }
    }
});

app.get("/api/s/:code", async (req, res) => {
    let code = req.params.code;
    let password = req.query.password;

    if (isJSON) {
        if (!config.DB_JSON_PATH) {
            console.log("Error: DB_JSON_PATH not found");
            return res.status(500).send("Error: DB_JSON_PATH not found");
        } else {
            if (!fs.existsSync(config.DB_JSON_PATH)) fs.writeFileSync(config.DB_JSON_PATH, JSON.stringify({}));
        }

        let db = JSON.parse(fs.readFileSync(config.DB_JSON_PATH));

        if (!db[code]) {
            return res.status(404).json({status: 404, data: { original: "Error: Code not found", shorten: `${config.DOMAIN}/s/${code}` }})
        }

        if (db[code].link) {
            if (db[code].password) {
                if (password) {
                    let hashPass = SHA256(password).toString();
                    if (hashPass === db[code].password) {
                        let isSafe = !(await checkURL(db[code].link));
                        res.json({status: 200, data: {original: db[code].link, shorten: `${config.DOMAIN}/s/${code}`, safe: isSafe }});
                    } else {
                        res.json({status: 401, data: { original: "Error: Unauthorized", shorten: `${config.DOMAIN}/s/${code}` }})
                    }
                } else {
                    res.json({status: 401, data: { original: "Error: Unauthorized", shorten: `${config.DOMAIN}/s/${code}` }})
                }
            } else {
                let isSafe = !(await checkURL(db[code].link));
                res.json({status: 200, data: {original: db[code].link, shorten: `${config.DOMAIN}/s/${code}`, safe: isSafe }});
            }
        } else {
            let isSafe = !(await checkURL(db[code]));
            res.json({status: 200, data: {original: db[code], shorten: `${config.DOMAIN}/s/${code}`, safe: isSafe }});
        }
    } else if (isMongoDB) {
        await client.connect();
        let db = client.db(dbName);
        if (!db) {
            console.log("Error: db not found");
            return;
        }
        let collection = db.collection('links');

        let filtered = await collection.find({code: code}).toArray();

        if (filtered.length === 0) {
            return res.status(404).json({status: 404, data: { original: "Error: Code not found", shorten: `${config.DOMAIN}/s/${code}` }})
        }

        if (filtered[0].password) {
            if (password) {
                let hashPass = SHA256(password).toString();
                if (hashPass === filtered[0].password) {
                    res.json({status: 200, data: {original: filtered[0].link, shorten: `${config.DOMAIN}/s/${code}`}});
                } else {
                    res.json({status: 401, data: { original: "Error: Unauthorized", shorten: `${config.DOMAIN}/s/${code}` }})
                }
            } else {
                res.json({status: 401, data: { original: "Error: Unauthorized", shorten: `${config.DOMAIN}/s/${code}` }});
            }
        } else {
            res.json({status: 200, data: {original: filtered[0].link, shorten: `${config.DOMAIN}/s/${code}`}});
        }
    }
});

app.get("/api/quectoCheck", (req, res) => {
    res.json({status: 200, data: {quecto: true}});
});

app.get("/generated", (req, res) => {
    res.sendFile(__dirname + '/public/generated.html');
})

app.get("/warning", (req, res) => {
    res.sendFile(__dirname + '/public/warning.html');
});

app.listen(process.env.PORT || config.PORT, async () => {
    if (isJSON) {
        if (!config.DB_JSON_PATH) {
            console.log("Error: DB_JSON_PATH not found");
            return;
        } else {
            if (!fs.existsSync(config.DB_JSON_PATH)) fs.writeFileSync(config.DB_JSON_PATH, JSON.stringify({}));

        }
    } else if (isMongoDB) {
        await client.connect();
        let db = client.db(dbName);
        if (!db) {
            console.log("Error: db not found");
            return;
        }
        let collection = db.collection('links');
        if (!collection) collection = await db.createCollection('links');
    }

    console.log('Quecto listening on port ' + config.PORT + '!');
});