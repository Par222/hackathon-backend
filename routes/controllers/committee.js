const HttpError = require("../errors/http-error");
const committeeHelper = require("../helpers/committee");

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
    throw new HttpError("Error updating committee details", 500);
  }
}

module.exports.addCommitteeDetails = addCommitteeDetails;