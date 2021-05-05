import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import React from "react";
import {useParams} from "react-router-dom";
import organizationApiService from "../services/organizationApi";
import ProjectCard from "../components/project/ProjectCard";
import ProjectListToolbar from "../components/project/ProjectListToolbar";

const Organization = () => {

  const {organizationUuid} = useParams();

  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    organizationApiService.getProjects(organizationUuid).then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setProjects(data.message.projects);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, [organizationUuid]);

  return (
    <>
      <Helmet>
        <title>Organization | OURepository</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ProjectListToolbar key={organizationUuid} />
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
