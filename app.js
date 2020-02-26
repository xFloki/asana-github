const express = require('express');
const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());

app.post('/', function (req, res) {
  console.log(req.header('x-github-event'))

  const event = req.header('x-github-event')
  if (event === 'push') {
    manageCommit(req.body);
  } else if (event === 'pull_request') {
    managePullRequest(req.body);
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
  const asanaRef = commitMessage.match( /(refs#\d+)/)
  
  if (asanaRef) {
    const asanId = asanaRef[0].split('#')[1]
    const msg = `Commit created by ${user}: ${repoURL}`
    updateDescription(asanId, msg);
  }
}

function managePullRequest(body) {
  const user = body.pull_request.user.login
  const action = body.action
  const repoURL = body.pull_request.html_url
  const pullRequestTitle = body.pull_request.title
  let asanaRef = pullRequestTitle.match( /(refs#\d+)/)
  if (asanaRef) {
    const asanId = asanaRef[0].split('#')[1]
    const msg = `Pull Request ${action} by ${user}: ${repoURL}`
    updateDescription(asanId, msg);
  }
}

async function updateDescription(asanId, msg) {
  try {
    let me = await client.users.me();
    const userId = me.gid;
    const workspaceId = me.workspaces[0].gid;
    
    console.log('Searching Asana Task with id ' + asanId)
    let task = await client.tasks.findById(asanId)
    
    let description = {}
    description.notes = msg + '\n' + '\n' + task.notes;
  
    client.tasks.dispatchPut('/tasks/' + asanId, description)

  } catch(e) {
    console.log('Error al contactar con Asana')
    console.log(e.message)
  }
}

// /tasks/{task_gid}/stories COMENTARIOS https://developers.asana.com/docs/#get-a-story
// https://developers.asana.com/docs/#get-a-task UPDATE TASK