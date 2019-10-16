const express = require('express');

const app = express();
app.use(express.json());

const projects = [];
let requests = 0;

app.use((req, res, next) => {
   requests++;
   console.log(`Request: ${req.method} | URL: ${req.url} | Count of requests: ${requests}`);
   
   next();
});

function checkIfIdAlreadyRegistred(req, res, next) {
   const { id } = req.body;
   if(projects.find(p => p.id == id)) {
      return res.json({ message: "This id is already registred. Please, insert other." })
   }

   return next();
}

function checkIfIdExists(req, res, next) {
   const { id } = req.params;
   if(!projects.find(p => p.id == id)) {
      return res.json({ message: "Id does not exists" });
   }

   next();
}

app.get('/projects', (req, res) => {
   if(projects.length == 0) {
      return res.json({ message: "No projects registered" });
   }

   return res.json({ projects })
});

app.post('/projects', checkIfIdAlreadyRegistred, (req, res) => {
   const { id, title } = req.body;

   projects.push({ id, title, tasks: [] });

   return res.json(projects);
});

app.post('/projects/:id/tasks', checkIfIdExists, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;

   const project = projects.find(p => p.id == id);
   project.tasks.push(title);

   return res.json(projects);
});

app.put('/projects/:id', checkIfIdExists, (req, res) => {
   const { id } = req.params;
   const { title } = req.body;

   const project = projects.find(p => p.id == id);
   
   project.title = title;

   return res.json(project);
});

app.delete('/projects/:id', checkIfIdExists, (req, res) => {
   const { id } = req.params;
   
   projects.splice(id, 1);

   return res.json({ message: "Task deleted" });
})

app.listen(3333);