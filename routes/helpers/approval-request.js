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
  if(!updateApprovalRequest) {

    return null;
  }
  return updatedRequest.toObject({ getters: true });
}

async function addApprovalRequest(newRequest) {
  const request = new ApprovalRequest(newRequest);
  const requestData = await request.save();
  return requestData.toObject({ getters: true });
}

async function fetchApprovalRequests(fields) {
  const requests = await ApprovalRequest.find(fields);
  return requests?.map((request) => {
    return request.toObject({ getters: true });
  });
}

module.exports.addApprovalRequest = addApprovalRequest;
module.exports.fetchApprovalRequest = fetchApprovalRequest;
module.exports.updateApprovalRequest = updateApprovalRequest;
module.exports.fetchApprovalRequests = fetchApprovalRequests;
