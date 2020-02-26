const express = require('express');
const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());

app.post('/', function (req, res) {
  console.log(req.header('x-github-event'))

  const event = req.header('x-github-event')
  const repoURL = req.body.head_commit.url 
  let commitMessage = req.body.head_commit.message
  let asanaRef = commitMessage.match( /(refs#\d+)/)
  if (asanaRef) {

    let asanId = asanaRef[0].split('#')[1]
    commentAsana(asanId, event, repoURL);
  }
 
  res.sendStatus(200);
 });
 
app.listen(port, function () {
 console.log('Listening on ' + port);
});

async function commentAsana(asanId, method, repoURL) {
  try {
    console.log('commentAsana')

    let me = await client.users.me();
    const userId = me.gid;
    const workspaceId = me.workspaces[0].gid;
    
    console.log('Searching Asana Task with id ' + asanId)
    let task = await client.tasks.findById(asanId)
    
    let description = {}
    if (method === 'push') {
      description.notes = 'Commit created by Alejandro: ' + repoURL + '\n' + '\n' + task.notes;
    }
    client.tasks.dispatchPut('/tasks/' + asanId, description)

  } catch(e) {
    console.log('Error al contactar con Asana')
    console.log(e.message)
  }
  /*
  task.dispatchPut('/tasks/' + asanId, comments) {

  }
  */
}

// /tasks/{task_gid}/stories COMENTARIOS https://developers.asana.com/docs/#get-a-story
// https://developers.asana.com/docs/#get-a-task UPDATE TASK