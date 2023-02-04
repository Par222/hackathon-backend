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

async function sendEmail(config) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nodemailer69420@gmail.com",
      pass: "aefj xelt ziln xhvx",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("../../views/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("../../views/"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  let mailOptions = {
    from: "nodemailer69420e@gmail.com",
    ...config,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
}
// const pdfGenerator = require("handlebars-pdf");

async function createApprovalRequest(req, res, err) {
  try {
    const request = await approvalRequestHelper?.addApprovalRequest(req?.body);
    res.status(200);
    res.json({
      request: request,
    });
    const faculty = await helper?.getField(Faculty, {
      designation: "gs",
    });
    const event = await helper?.getField(Event, {
      id: req?.body?.eventID,
    });
    const committee = await committeeHelper?.fetchCommitteeDetails({
      id: event?.committeeID,
    });
    const venue = await helper?.getField(Venue, { id: event?.venue });

    sendEmail({
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
    const faculty = await helper?.getField(Faculty, {
      id: committee?.faculty_coordinatorID,
    });
    const genSec = await helper?.getField(Faculty, {
      designation: "gs",
    });
    const venue = await helper?.getField(Venue, { id: event?.venue });

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
      const dean = await helper?.getField(Faculty, {
        designation: "Dean",
      });

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

      sendEmail({
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
          eventLink: `https://localhost:3000/${event?.id}`,
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
        },
        attachments: newStatus?.permission_documents,
      };
      if (req?.body?.status_level === 1) {
        sendEmail({
          ...emailConfig,
        });
      } else if (req?.body?.status_level === 2) {
        const dean = await helper?.getField(Faculty, {
          designation: "Dean",
        });
        sendEmail({
          ...emailConfig,
          to: dean?.email,
          facultySignature: faculty?.id,
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
