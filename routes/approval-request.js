const approvalRequestController = require("./controllers/approval-request");
const express = require("express");
const router = express.Router();

router.get("/", approvalRequestController?.fetchAllRequests);

router.get("/:requestID", approvalRequestController?.fetchARequest);

router.patch("/:requestID", approvalRequestController?.approveApprovalRequest);

router.post("/", approvalRequestController?.approveApprovalRequest);

module.exports = router;