'use strict';

let express = require('express');
let winston = require('winston');
let router = express.Router();

/*
 * POST to set a flow information.
 */
router.post('/:id([0-9a-zA-Z]{64})', (req, res) => {
  let rd = req.rd;
  let flowID = req.params.id;
  let flowInfo = req.body;

  if (req.body.id !== req.params.id) {
    // Invalid ID
    res.sendStatus(400);
    winston.info('[x] Invalid ID');
  }

  // flowInfo example
  // {
  //    "probabilityDistribution":{
  //       "mDNSResponder":0.11666666666666668,
  //       "filezilla":0.12,
  //       "chrome":0.7633333333333333
  //    },
  //    "id":"23ee09f2ad9c5ff4dda22b7deadbb982c72f31819611d5e6eb8ad3fb0bdaeb04",
  //    "classifiedResult":{
  //       "groundTruth":"avp",
  //       "classifiedName":"chrome"
  //    },
  //    "info":{
  //       "destinationIP":"104.25.11.6",
  //       "destinationPort":443,
  //       "sourcePort":50566,
  //       "protocol":6,
  //       "sourceIP":"192.168.111.191",
  //       "classifierID":"123"
  //    }
  // }

  rd.set(flowID, JSON.stringify(flowInfo), (err, dbRes) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
  rd.expire(flowID, 120);
});

/*
 * GET to get a single flow.
 */
router.get('/:id([0-9a-zA-Z]{64})', (req, res) => {
  let rd = req.rd;
  let flowID = req.params.id;
  rd.get(flowID, (err, dbRes) => {
    if (err) {
      winston.info(err);
      res.sendStatus(500);
    } else {
      if (!dbRes) {
        res.sendStatus(204);
      } else {
        res.send(JSON.parse(dbRes));
      }
    }
  });
});

/*
 * Flush Database
 */
router.delete('/flush', (req, res) => {
  let rd = req.rd;
  rd.flushdb((err, dbRes) => {
    if (err) {
      winston.info(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
