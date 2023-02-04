const HTTPError = require("../errors/http-error");
const userTypeHelper = require("../helpers/user-type");
const committeHelper = require("../helpers/committee");

async function userSignup(req, res, err) {
  let existingUser;
  console.log(req?.body);
  try {
    existingUser = await userTypeHelper?.findUser({ email: req?.body?.email });
    if (!existingUser) {
      const userDetails = {
        name: req?.body?.name,
        email: req?.body?.email,
      };
      const newUser = { ...req?.body };
      const userType = req?.body?.user_type;
      if (userType === "Committee") {
        const committee = await committeHelper?.addCommittee(userDetails);
        newUser.committeeID = committee?.id;
      }
      const userData = await userTypeHelper?.addUser(newUser);
      delete userData?.password;
      res.status(200);
      res.json({
        user: userData,
      });
    }
    res.status(500);
    res.json({
      message: "Committee already exists!",
    });
  } catch (error) {
    console.log(error);
    throw new HTTPError("Error signing up!", 500);
  }
}

async function userLogin(req, res, err) {
  let existingUser;
  try {
    existingUser = await userTypeHelper?.findUser({
      email: req?.body?.email,
      password: req?.body?.password,
    });
    if (!existingUser) {
      res.status(500);
      res.json({
        message: "Invalid credentials!",
      });
    }
    delete existingUser?.password;
    res.status(200);
    res.json({ user: existingUser });
  } catch (error) {
    throw new HTTPError("Error logging in!", 500);
  }
}

module.exports.userSignup = userSignup;
module.exports.userLogin = userLogin;
