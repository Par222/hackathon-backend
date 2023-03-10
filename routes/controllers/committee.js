const Committee = require("../../models/Committee");
const db = require("../helpers/Mongo");
const HttpError = require("../errors/http-error");
const committeeHelper = require("../helpers/committee");
const Faculty = require("../../models/Faculty");

async function addCommitteeDetails(req, res, err) {
  const committeeID = req?.params?.committeeID;
  try {
    let faculty;
    if (req?.body?.faculty) {
       faculty = db?.getField(Faculty, {
        name: req?.body?.faculty,
      });
    }
    const updatedCommittee = await committeeHelper?.updateCommitee(committeeID, {
      ...req?.body,
      faculty_coordinatorID: faculty?.id,
    });
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
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: committeeID,
    });
    res.status(200);
    res.json({ committee: committee });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching committee details!", 500);
  }
}

async function getCommittees(req, res) {
  const results = await db.getFields(Committee, req?.query);
  res.json(results);
}

module.exports.addCommitteeDetails = addCommitteeDetails;
module.exports.fetchCommitteeDetails = fetchCommitteeDetails;
module.exports.getCommittees = getCommittees;
