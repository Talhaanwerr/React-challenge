import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


interface ProjectItem {
  creationDate: any;
  projectName: any;
  projectNamee: any;
  id: any;
  status: string;
}

const useStyles = makeStyles({
  root: {
    margin: 10,
  },
});

interface CardProps {
  date: any;
  name: string;
  status: string;
}

const useCardStyles = makeStyles({
  root: {
    width: 350,
    margin: 10,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 10,
  },
});
function isValidDate(dateString: any) {
  let date: any = new Date(dateString);
  return !isNaN(date);
}

function convertToValidDate(invalidDate: any) {
  let validDate: any = new Date(invalidDate);
  if (isNaN(validDate)) {
    let dateParts = invalidDate.split(/[-T:.Z]+/);
    dateParts[4] = dateParts[4] > "59" ? "59" : dateParts[4];
    dateParts[5] = dateParts[5] > "59" ? "59" : dateParts[5];
    validDate = new Date(dateParts.slice(0, 3).join("-") + "T" + dateParts.slice(3, 6).join(":") + "." + dateParts[6] + "Z");
  }
  return validDate;
}

const ProjectCard: React.FC<CardProps> = ({ date, name, status }) => {
  const classes = useCardStyles();
  const toDate = isValidDate(date) ? new Date(date) : convertToValidDate(date);

  return (
    <Card className={classes.root} variant="outlined">
      <div>
        <Typography
          data-testid="date"
          className={classes.title}
          color="textSecondary"
        >
          {toDate.toUTCString()}
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography style={{ /*color: "white",*/ marginBottom: 10 }}>
          {status}
        </Typography>
      </div>
    </Card>
  );
};

function App() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filterApplied, setFilterApplied] = useState("")
  // const [sortedField, setSortedField] = useState<string>("");
  // let sortedProjects = [...projects];

  const classes = useStyles();

  // Specify that API is called once on page load
  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchProjects();
      if(filterApplied !== ""){
        const filteredProjects = projectsFromServer.data.filter((project: any) => {
          return project.status === filterApplied
        })
        setProjects(filteredProjects)
      }
      else{
        setProjects(projectsFromServer.data);
      }
    };
    getProjects();
  }, [filterApplied]);

  // Fetch Projects
  const fetchProjects = async () => {
    const res = await fetch("http://localhost:3004/projects");
    const data = await res.json();

    return data;
  };

  function handleChange(sortedType: "earliest" | "latest") {
    const sorted = [...projects].sort((a, b) => {
      let date1: any = isValidDate(a.creationDate) ? new Date(a.creationDate) : new Date(convertToValidDate(a.creationDate));
      let date2: any = isValidDate(b.creationDate) ? new Date(b.creationDate) : new Date(convertToValidDate(b.creationDate));
      if (sortedType === "earliest") {
        return date1.getTime() - date2.getTime();
      } else if (sortedType === "latest") {
        return date2.getTime() - date1.getTime();
      } else {
        return 0;
      }
    });
    setProjects(sorted);
  }

  // write a function to filter project by status
  const handleFilter = (event: any) => {
    setFilterApplied(event.target.value)
    // write code for filter project by status
    // const allProjects = [...projects]
    // const filteredProjects = [...allProjects].filter((project) => {
    //   console.log("project.status", project.status, event.target.value)
    //   return project.status === event.target.value
    // })
    // setProjects(filteredProjects)
    // console.log("event.target.value", filteredProjects)
  };
  // render App
  return (
    <div className="App">
      <div className="buttons-menu">
        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("earliest")}
          data-testid="earliest-button"
        >
          Earliest
        </Button>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter by Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterApplied}
            label="Age"
            onChange={handleFilter}
          >
            <MenuItem value={"lost"}>Lost</MenuItem>
            <MenuItem value={"won"}>Won</MenuItem>
            <MenuItem value={"inProgress"}>In Progress</MenuItem>
          </Select>
        </FormControl>
        <Button
          className={classes.root}
          variant="contained"
          onClick={() => handleChange("latest")}
          data-testid="latest-button"
        >
          Latest
        </Button>
      </div>
      <div className="projects-content">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            date={project.creationDate}
            name={project.projectName || project.projectNamee}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
