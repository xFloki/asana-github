require('dotenv').config()
const asana = require('asana');

const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);

exports.getMe = async () => client.users.me();

exports.getTask = async taskId => client.tasks.findById(taskId);

exports.commentTask = (taskId, data) => client.tasks.addComment(taskId, data);

exports.updateDescription = (taskId, description) => {
  client.tasks.dispatchPut(`/tasks/${taskId}`, description);
}
