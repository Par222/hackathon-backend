const ApprovalRequest = require("../../models/ApprovalRequest");

async function fetchApprovalRequest(requestID) {
  const request = await ApprovalRequest.findById(requestID);
  if (!request) {
    return null;
  }
  return request.toObject({ getters: true });
}

async function updateApprovalRequest(requestID, request) {
  const updatedRequest = await ApprovalRequest.findByIdAndUpdate(
    requestID,
    request,
    { new: true }
  );
  return updatedRequest.toObject({ getters: true });
}

async function addApprovalRequest(newRequest) {
  const request = new ApprovalRequest(newRequest);
  const requestData = await request.save();
  return requestData.toObject({ getters: true 
  });
}

module.exports.addApprovalRequest = addApprovalRequest;
module.exports.fetchApprovalRequest = fetchApprovalRequest;
module.exports.updateApprovalRequest = updateApprovalRequest;
