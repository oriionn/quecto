const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const crypto = require('crypto');

const config = require('./config');
const url = `mongodb://${config.DB_HOST}:${config.DB_PORT}`;
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

function generateCode() {
    const buffer = crypto.randomBytes(1);
    const hex = buffer.toString('hex');

    return Date.now().toString(16) + hex;
}

async function shorten(url) {
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

        db[code] = url;
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

        await collection.insertOne({link: url, code: code});
        data = {status: 200, data: {original: url, shorten: `${config.DOMAIN}/s/${code}`}};
    }

    return data;
}

app.post('/api/form_shorten', multer().none(), async (req, res) => {
    let resp = await shorten(req.body.link);
    res.redirect(`/generated?link=${resp.data.shorten}`);
});

app.post('/api/shorten', multer().none(), async (req, res) => {
    res.json(await shorten(req.body.link));
});

app.get("/s/:code", async (req, res) => {
    let code = req.params.code;

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

        res.redirect(db[code]);
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

        res.redirect(filtered[0].link);
    }
});

app.get("/api/:code", async (req, res) => {
    let code = req.params.code;

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

        res.json({status: 200, data: {original: db[code], shorten: `${config.DOMAIN}/s/${code}`}});
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

        res.json({status: 200, data: {original: filtered[0].link, shorten: `${config.DOMAIN}/s/${code}`}});
    }
});

app.get("/api/quectoCheck", (req, res) => {
    res.json({status: 200, data: {quecto: true}});
});

app.get("/generated", (req, res) => {
    res.sendFile(__dirname + '/public/generated.html');
})

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