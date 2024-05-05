const express = require("express");
const bodyParser = require("body-parser");
const compiler = require("compilex");

const router = express.Router();
router.use(bodyParser());
 
const option = { stats: true };
compiler.init(option);

router.post("/", function (req, res) {
    var code = req.body.code; 
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;

    
    if (lang === "Python") {
        if (inputRadio === "true") {
            var envData = { OS: "windows" };
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                if (data.error) {
                    console.error(data.error);
                    res.send(data.error);
                } else {

                    res.send(data.output);
                }
            });
        } else {
            var envData = { OS: "windows" };
            compiler.compilePython(envData, code, function (data) {
                if (data.error) {
                    console.error(data.error);
                    res.send(data.error);
                } else {

                    res.send(data.output);
                }
            });
        }
    }
    else if (lang === "JavaScript") {
        try {
            var consoleOutput = "";
            var originalLog = console.log;
            console.log = function (message) {
                consoleOutput += message + "\n";
            };
            eval(code);
            console.log = originalLog;
            res.send(consoleOutput, " ", originalLog);
        } catch (error) {
            res.send("Error: " + error.message);
        }
    } 
    else if (lang === "Java") {
        var envData = { OS: "windows", cmd: "javac", options: { timeout: 10000 } };
        if (inputRadio === "true") {
            compiler.compileJavaWithInput(envData, code, input, function (data) {
                if (data.error) { 
                    res.send(data.error);
                } else {
                    console.log("Compiled and executed successfully:", data.output);
                    res.send(data.output);
                }
            });
        } else {
            compiler.compileJava(envData, code, function (data) {
                if (data.error) {
                     
                    res.send(data.error);
                } else {
                     
                    res.send(data.output);
                }
            });
        }
    }
    else {
        res.send("Unsupported language!");
    }
});


// Get full stats route
router.get("/fullStat", function (req, res) {
    compiler.fullStat(function (data) {
        res.send(data);
    });
});

module.exports = router;
