const approvalRequestHelper = require("../helpers/approval-request");
const helper = require("./../helpers/Mongo");
const Event = require("../../models/events");
const Faculty = require("../../models/Faculty");
const Venue = require("../../models/Venue");
const committeeHelper = require("../helpers/committee");
const emailService = require("../helpers/email-service");
const moment = require("moment");

async function approveApprovalRequest(req, res, err) {
  const requestID = req?.params?.requestID;
  try {
    const prevStatus = await approvalRequestHelper?.fetchApprovalRequest(
      requestID
    );
    const newStatus = await approvalRequestHelper?.updateApprovalRequest(
      requestID,
      req?.body
    );
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: prevStatus?.committeeID,
    });
    const event = await helper?.getField(Event, { id: prevStatus?.eventID });
    if (req?.body?.status_level === 3) {
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
        emailService?.sendEmail
      }
    }
  } catch (error) {}
}
