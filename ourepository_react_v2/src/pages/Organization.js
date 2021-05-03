import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {Navigate, useLocation} from "react-router-dom";
import organizationApiService from "../services/organizationApi";
import ProjectCard from "../components/project/ProjectCard";
import ProjectListToolbar from "../components/project/ProjectListToolbar";

const Organization = () => {

  const {state} = useLocation();


  const [organization, setOrganization] = React.useState(null)
  const [projects, setProjects] = React.useState([])
  // const [projectItems, setProjectItems] = React.useState(null)

  // get the organization from the previous page
  React.useEffect(() => {
    if (state) {
      setOrganization({state});
    }
  }, []);

  React.useEffect(() => {
    if (!state) {
      return;
    }

    organizationApiService.getProjects(state.organization.uuid).then((response) => {
      const data = response.data;
      if (data.code === "PROJECTS_RECEIVED") {
        setProjects(data.message.projects);
      } else {
        alert("Something went wrong");
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const determineRedirect = () => {
    if (state) {
      return <></>;
    } else {
      return <Navigate to="/app/organizations" />;
    }
  }

  return (
    <>
      {determineRedirect()}
      <Helmet>
        <title>Projects | OURepostory</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ProjectListToolbar />
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {projects && projects.map((project) => (
                <Grid
                  item
                  key={project.uuid}
                  lg={2}
                  md={6}
                  xs={12}
                >
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Organization;
