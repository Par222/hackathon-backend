const Usertype = require("../../models/UserType");

async function addUser(newUser) {
  const user = new Usertype(newUser);
  const userData = await user.save();
  return userData.toObject({ getters: true });
}

async function findUser(fields) {
  const user = await Usertype.findOne({ ...fields });
  if (!user) {
    return null;
  }
  return user.toObject({ getters: true });
}

module.exports.addUser = addUser;
module.exports.findUser = findUser;
