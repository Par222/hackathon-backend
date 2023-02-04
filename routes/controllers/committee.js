const HttpError = require("../errors/http-error");
const committeeHelper = require("../helpers/committee");
const helper = require("../helpers/Mongo");

async function addCommitteeDetails(req, res, err) {
  const committeeID = req?.params?.committeeID;
  try {
    const updatedCommittee = committeeHelper?.updateCommitee(
      committeeID,
      req?.body
    );
    res.status(200);
    res.json({ committee: updatedCommittee });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error updating committee details!", 500);
  }
}

async function fetchCommitteeDetails(req, res, err) {
  const committeeID = req?.params?.committeeID;
  try {
    const committee = await committeeHelper?.fetchCommitteeDetails({id: committeeID});
    res.status(200);
    res.json({ committee: committee });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching committee details!", 500);
  }
}

module.exports.addCommitteeDetails = addCommitteeDetails;
module.exports.fetchCommitteeDetails = fetchCommitteeDetails;
