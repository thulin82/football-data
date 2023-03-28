const express = require("express");
const router = express.Router();
const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

router.get("/", function (req, response) {
    let url = "https://api.football-data.org/v2/competitions/PL/standings";

    var options = {
        method: "GET",
        headers: {
            "X-Auth-Token": process.env.API_KEY,
            Accept: "application/json",
        },
    };

    let data = "";

    https.get(url, options, function (res) {
        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            var json = JSON.parse(data);
            response.set("Content-Type", "text/html");
            response.render("index", { result: json });
        });
    });
});

router.get("/team/:id", function (req, response) {
    let teamId = req.params.id;
    let url = `https://api.football-data.org/v2/teams/${teamId}`;
    let url2 = `https://api.football-data.org/v2/teams/${teamId}/matches?status=SCHEDULED&limit=5`;

    var options = {
        method: "GET",
        headers: {
            "X-Auth-Token": process.env.API_KEY,
            Accept: "application/json",
        },
    };

    let data = "";
    let teamdata = "";

    https.get(url, options, function (res) {
        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            var json = JSON.parse(data);
            teamdata = json;
        });
    });

    let data2 = "";

    https.get(url2, options, function (res) {
        res.on("data", (chunk) => {
            data2 += chunk;
        });

        res.on("end", () => {
            var json2 = JSON.parse(data2);
            response.render("teams", { result: teamdata, fixtures: json2 });
        });
    });
});

module.exports = router;
