const Committee = require("../../models/Committee");

async function addCommittee(newCommittee) {
  const committee = new Committee(newCommittee);
  const committeeData = await committee.save();
  return committeeData.toObject({ getters: true });
}

async function updateCommitee(committeeID, newCommittee) {
  const committee = await Committee.findByIdAndUpdate(committeeID, newCommittee, {
    new: true,
  });
  return committee.toObject({ getters: true });
}

async function fetchCommitteeDetails(fields) {
  const committee = await Committee.findOne(fields);
  console.log(committee)
  return committee.toObject({ getters: true });
}

module.exports.addCommittee = addCommittee;
module.exports.updateCommitee = updateCommitee;
module.exports.fetchCommitteeDetails = fetchCommitteeDetails;
