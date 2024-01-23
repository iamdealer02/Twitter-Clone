 // this file can be used for the load balancer or probes for kube/pods
// to check the health of the API

const router = require("express").Router();

router.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "All up and running!!",
  });
});

module.exports = router;