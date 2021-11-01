var express = require('express');
var router = express.Router();

const ServerApp = require("../../server/server_app");
const AgentHandler = require("../../server/server_agent_handler");

const middleWare = [
    ServerApp.checkLoggedInAPIMiddleWare
]



router.get('/agents', middleWare, function (req, res, next) {
    AgentHandler.API_GetAllAgents().then(agents => {
        res.json({
            result: "success",
            data: agents
        });
    }).catch(err => {
        res.json({
            result: "error",
            error: err.message
        });
    })
});

router.post('/create', middleWare, function (req, res, next) {
    AgentHandler.CreateNewDockerAgent().then(() => {
        res.json({
            result: "success"
        });
    }).catch(err => {
        res.json({
            result: "error",
            error: err.message
        });
    })
});

router.post('/start', middleWare, function (req, res, next) {
    const agentId = parseInt(req.body.id);

    console.log(req.body);

    AgentHandler.StartDockerAgent(agentId).then(() => {
        res.json({
            result: "success"
        });
    }).catch(err => {
        res.json({
            result: "error",
            error: err.message
        });
    })
});

router.post('/stop', middleWare, function (req, res, next) {
    const agentId = parseInt(req.body.id);
    AgentHandler.StopDockerAgent(agentId).then(() => {
        res.json({
            result: "success"
        });
    }).catch(err => {
        res.json({
            result: "error",
            error: err.message
        });
    })
});


module.exports = router;