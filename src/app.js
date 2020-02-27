const express = require('express');
const Utils = require('./utils/main');
const Asana = require('./modules/asana');

const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());

const TASK_TEST = 1163201043384436;

app.get('/', function (req, res) {
  console.log('HELLO')
  const msg = `Commit created by`
  Asana.commentTask(TASK_TEST, { text: msg } );

  res.send('KAPPA')
});

app.post('/', function (req, res) {
  console.log(req.header('x-github-event'))

  const event = req.header('x-github-event')
  if (event === 'push') {
    manageCommit(req.body);
  } 

  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('Listening on ' + port);
 });

function manageCommit(body) {
  const user = body.sender.login
  const repoURL = body.head_commit.url 
  const commitMessage = body.head_commit.message
  const asanaId = Utils.findById(commitMessage);
  
  if (asanaId) {
    const msg = `Commit created by ${user}: ${repoURL}`
    Asana.commentTask(asanaId, { text: msg } );
  }
}


/*
else if (event === 'pull_request') {
    managePullRequest(req.body);
  } 

function managePullRequest(body) {
  const user = body.pull_request.user.login
  const action = body.action
  const repoURL = body.pull_request.html_url
  const pullRequestTitle = body.pull_request.title
  const asanaId = Utils.findTaskId(pullRequestTitle);
  if (asanaId) {
    const msg = `Pull Request ${action} by ${user}: ${repoURL}`
    updateDescription(asanId, msg);
  }
}

async function updateDescription(asanId, msg) {
    let me = await client.users.me();
    const userId = me.gid;
    const workspaceId = me.workspaces[0].gid;
    
    console.log('Searching Asana Task with id ' + asanId)
    let task = await client.tasks.findById(asanId)
    
    let description = {}
    description.notes = msg + '\n' + '\n' + task.notes;
  
    client.tasks.dispatchPut('/tasks/' + asanId, description)

    console.log('Error al contactar con Asana')
    console.log(e.message)
}

*/

// /tasks/{task_gid}/stories COMENTARIOS https://developers.asana.com/docs/#get-a-story
// https://developers.asana.com/docs/#get-a-task UPDATE TASK