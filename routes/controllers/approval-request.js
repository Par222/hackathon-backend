const approvalRequestHelper = require("../helpers/approval-request");
const helper = require("./../helpers/Mongo");
const Event = require("../../models/events");
const Faculty = require("../../models/Faculty");
const Venue = require("../../models/Venue");
const committeeHelper = require("../helpers/committee");
const emailService = require("../helpers/email-service");
const moment = require("moment");
const HttpError = require("../errors/http-error");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const pdfGenerator = require("handlebars-pdf");

async function createApprovalRequest(req, res, err) {
  const body = JSON.parse(JSON.stringify(req?.body));
  try {
    const gs = await helper?.getField(Faculty, {
      designation: "gs",
    });

    const event = await helper?.getField(Event, {
      id: body?.eventID,
    });
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: event?.committeeID,
    });
    const venue = await helper?.getField(Venue, { id: event?.venue });

    const dean = await helper?.getField(Faculty, {
      designation: "Dean",
    });

    const faculty = await helper?.getField(Faculty, {
      id: committee?.faculty_coordinatorID,
    });

    const request = await approvalRequestHelper?.addApprovalRequest({
      ...req?.body,
      facultyID: faculty?.id,
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
        deanName: dean?.name,
        facultyName: faculty?.name,
        gsName: gs?.name,
        approvalLink: "http://localhost:3000/authorities/gs",
      },
    });
    res.json({
      request: {
        ...request,
        facultyID: faculty?.id,
      },
    });
  } catch (error) {
    console.log(error);
    throw new HttpError("Error creating a request!", 500);
  }
}

async function approveApprovalRequest(req, res, err) {
  const body = JSON.parse(JSON.stringify(req?.body));
  const requestID = req?.params?.requestID;
  try {
    const prevStatus = await approvalRequestHelper?.fetchApprovalRequest(
      requestID
    );
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: prevStatus?.committeeID,
    });
    const event = await helper?.getField(Event, { id: prevStatus?.eventID });
    const faculty = await helper?.getField(Faculty, {
      id: committee?.faculty_coordinatorID,
    });
    const genSec = await helper?.getField(Faculty, {
      designation: "gs",
    });
    const venue = await helper?.getField(Venue, { id: event?.venue });

    const dean = await helper?.getField(Faculty, {
      designation: "Dean",
    });

    console.log(prevStatus, body);

    if (body?.status_level == 3) {
      const newStatus = await approvalRequestHelper?.updateApprovalRequest(
        requestID,
        { ...body, status: "Approved" }
      );
      await helper?.putField(
        Event,
        { id: prevStatus?.eventID },
        { status: "Approved" }
      );

      // const document = {
      //   template: "eventPermission",
      //   context: {
      //     committeeName: committee?.name,
      //     committeeLogo: committee?.logo,
      //     eventName: event?.name,
      //     eventVenue: venue?.name,
      //     eventDate: moment(new Date(event?.date)).format("DD MM YYYY"),
      //     eventStartTime: event?.startTime,
      //     eventEndTime: event?.endTime,
      //     deanSignature: dean?.signature,
      //     facultySignature: faculty?.signature,
      //     genSecSignature: genSec?.signature,
      //   },
      // };

      // const pdf = await pdfGenerator.create(document);
      // console.log(pdf);

      emailService?.sendEmail({
        to: "paramrkothari@gmail.com",
        subject: "Event Alert",
        template: "studentNotif",
        context: {
          header: `${committee?.name} presents to you`,
          committeeLogo: committee?.logo,
          eventName: event?.name,
          eventBanner: event?.banner,
          eventDescription: event?.description,
          eventDate: moment(new Date(event?.date)).format("DD MM YYYY"),
          eventLink: `https://localhost:3000/api/events/${event?.id}`,
        },
      });
    } else if (prevStatus?.status_level == body?.status_level) {
      const newStatus = await approvalRequestHelper?.updateApprovalRequest(
        requestID,
        { ...body, status: "Rejected" }
      );
      console.log(newStatus);
      await helper?.putField(
        Event,
        { id: prevStatus?.eventID },
        { status: "Rejected" }
      );
    } else {
      const newStatus = await approvalRequestHelper?.updateApprovalRequest(
        requestID,
        { ...body }
      );

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
          genSecSignature: genSec?.signature,
          deanName: dean?.name,
          facultyName: faculty?.name,
          gsName: genSec?.name,
        },
        attachments: newStatus?.permission_documents,
      };

      console.log("wow");
      console.log(body);
      if (body?.status_level == 1) {
        const context = {
          ...emailConfig?.context,
          approvalLink: `http://localhost:3000/authorities/faculty/${faculty?.id}`,
        };
        emailService?.sendEmail({
          ...emailConfig,
          context: context,
        });
      } else if (body?.status_level == 2) {
        const dean = await helper?.getField(Faculty, {
          designation: "Dean",
        });
        const context = {
          ...emailConfig?.context,
          facultySignature: faculty?.signature,
          approvalLink: `http://localhost:3000/authorities/Dean`,
        };
        emailService?.sendEmail({
          ...emailConfig,
          to: dean?.email,
          context: context,
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
    const results =await Promise.all( requests?.map(async (request) => {
      const event = await helper?.getField(Event, {id: request?.eventID});
      return {...request, ...event};
    }))
    res.status(200);
    res.json({
      requests: results,
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
