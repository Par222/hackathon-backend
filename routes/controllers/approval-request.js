const approvalRequestHelper = require("../helpers/approval-request");
const helper = require("./../helpers/Mongo");
const Event = require("../../models/events");
const Faculty = require("../../models/Faculty");
const Venue = require("../../models/Venue");
const committeeHelper = require("../helpers/committee");
const emailService = require("../helpers/email-service");
const moment = require("moment");
const HttpError = require("../errors/http-error");

async function createApprovalRequest(req, res, err) {
  try {
    const request = await approvalRequestHelper?.addApprovalRequest(req?.body);
    res.status(200);
    res.json({
      request: request,
    });
    emailService?.sendEmail({
      to: faculty?.email,
      subject: "Permission Letter",
      template: "eventPermission",
      context: {
        committeeName: committee?.name,
        committeeLogo: committee?.logo,
        eventName: event?.name,
        eventVenue: venue?.name,
        eventDate: moment(new Date(event?.date)).format("DD MM YYYY"),
        eventStartTime: event?.startTime,
        eventEndTime: event?.endTime,
        deanSignature: "",
        facultySignature: "",
        genSecSignature: "",
      },
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error creating a request!", 500);
  }
}

async function approveApprovalRequest(req, res, err) {
  const requestID = req?.params?.requestID;
  try {
    const prevStatus = await approvalRequestHelper?.fetchApprovalRequest(
      requestID
    );
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: prevStatus?.committeeID,
    });
    const event = await helper?.getField(Event, { id: prevStatus?.eventID });
    if (req?.body?.status_level === 3) {
      const newStatus = await approvalRequestHelper?.updateApprovalRequest(
        requestID,
        { ...req?.body, status: "Approved" }
      );
      await helper?.putField(
        Event,
        { id: prevStatus?.eventID },
        { status: "Approved" }
      );
      emailService?.sendEmail({
        to: "paramrkothari@gmail.com",
        subject: "Testing",
        text: "First mail",
        template: "studentNotif",
        context: {
          header: "FACE SPIT presents to you", // replace {{name}} with Adebola
          committeeLogo: "https://face.spit.ac.in/assets/images/logo_icon.png",
          eventName: "FACE CUP",
          eventBanner: "https://face.spit.ac.in/assets/images/logo_icon.png",
          eventDescription: "",
          eventDate: "13 Oct, 2023",
          eventLink: "",
        },
      });
    } else if (prevStatus?.status_level === req?.body?.status_level) {
      const newStatus = await approvalRequestHelper?.updateApprovalRequest(
        requestID,
        { ...req?.body, status: "Rejected" }
      );
      await helper?.putField(
        Event,
        { id: prevStatus?.eventID },
        { status: "Rejected" }
      );
    } else {
      const faculty = await helper?.getField(Faculty, {
        id: committee?.faculty_coordinatorID,
      });
      const venue = await helper?.getField(Venue, { id: event?.venue });
      const emailConfig = {
        to: faculty?.email,
        subject: "Permission Letter",
        template: "eventPermission",
        context: {
          committeeName: committee?.name,
          committeeLogo: committee?.logo,
          eventName: event?.name,
          eventVenue: venue?.name,
          eventDate: moment(new Date(event?.date)).format("DD MM YYYY"),
          eventStartTime: event?.startTime,
          eventEndTime: event?.endTime,
          deanSignature: "",
          facultySignature: "",
          genSecSignature: "",
        },
        attachments: newStatus?.permission_documents,
      };
      if (req?.body?.status_level === 1) {
        emailService?.sendEmail({
          ...emailConfig,
          genSecSignature: "",
        });
      } else if (req?.body?.status_level === 2) {
        emailService?.sendEmail({
          ...emailConfig,
          genSecSignature: "",
          facultySignature: "",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllRequests(req, res, err) {
  try {
    const requests = await approvalRequestHelper?.fetchApprovalRequests(
      req?.query
    );
    res.status(200);
    res.json({
      requests: requests,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching requests!", 500);
  }
}

async function fetchARequest(req, res, err) {
  const requestID = req?.params?.requestID;
  try {
    const request = await approvalRequestHelper?.fetchApprovalRequest({
      id: requestID,
    });
    res.status(200);
    res.json({
      request: request,
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error fetching the request", 500);
  }
}

module.exports.createApprovalRequest = createApprovalRequest;
module.exports.approveApprovalRequest = approveApprovalRequest;
module.exports.fetchAllRequests = fetchAllRequests;
module.exports.fetchARequest = fetchARequest;
