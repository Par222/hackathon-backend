const Event = require('../../models/events');
const db = {};

db.postField = async (schema, payload) => {
  const data = new schema(payload);
  const result = await data.save();
  return result.toObject({ getters: true });
};

db.getFields = async (schema, keys) => {
  let results = await schema.find(keys);
  return results.map((e) => e.toObject({ getters: true }));
};

db.getField = async (schema, keys) => {
  let result = await schema.findOne(keys);
  return result?.toObject({ getters: true }) || {};
};

db.putField = async (schema, keys, options) => {
  let result = await schema.updateMany(keys, options);
  return await db.getField(schema, keys);
};

db.deleteField = async (schema, keys) => {
  return await schema.deleteOne(keys);
};

module.exports = db;
