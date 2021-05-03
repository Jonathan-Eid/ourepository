import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import OrganizationCard from "../components/organization/OrganizationCard";
import OrganizationListToolbar from "../components/organization/OrganizationListToolbar";
import React from "react";
import apiService from "../services/api";
import {Navigate, useLocation} from "react-router-dom";

const ProjectList = () => {

  const {state} = useLocation();

  // const {organization} = state ? state : null;

  const [organization, setOrganization] = React.useState(null)
  // const [projectItems, setProjectItems] = React.useState(null)

  // get the organization from the previous page
  React.useEffect(() => {
    if (state) {
      setOrganization({state});
    }
  }, []);

  // // get the projects, projects, and mosaics for the current user
  // React.useEffect(() => {
  //   apiService.getOrgs().then((response) => {
  //     const data = response.data;
  //     if (data.code === "ORGS_RECEIVED") {
  //       const projectItems = [];
  //       data.message.projects.forEach(project => {
  //         const projectItem = {};
  //         projectItem['title'] = project.name;
  //
  //         const projectItems = [];
  //         project.projects.forEach(project => {
  //           const projectItem = {};
  //           projectItem['title'] = project.name;
  //
  //           const mosaicItems = [];
  //           project.mosaics.forEach(mosaic => {
  //             const mosaicItem = {};
  //             mosaicItem['title'] = mosaic.name;
  //
  //             mosaicItems.push(mosaicItem);
  //           })
  //
  //           projectItem["items"] = mosaicItems;
  //           projectItems.push(projectItem);
  //         })
  //
  //         projectItem["items"] = projectItems;
  //         projectItems.push(projectItem);
  //       })
  //
  //       setProjectItems(projectItems);
  //     } else {
  //       alert("Something went wrong");
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }, []);

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
        <title>Projects | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          {/*<ProjectListToolbar />*/}
          {/*<Box sx={{ pt: 3 }}>*/}
          {/*  <Grid*/}
          {/*    container*/}
          {/*    spacing={3}*/}
          {/*  >*/}
          {/*    /!*{projectItems && projectItems.map((projectItem) => (*!/*/}
          {/*    /!*  <Grid*!/*/}
          {/*    /!*    item*!/*/}
          {/*    /!*    key={projectItem.uuid}*!/*/}
          {/*    /!*    lg={2}*!/*/}
          {/*    /!*    md={6}*!/*/}
          {/*    /!*    xs={12}*!/*/}
          {/*    /!*  >*!/*/}
          {/*    /!*    <ProjectCard project={projectItem} />*!/*/}
          {/*    /!*  </Grid>*!/*/}
          {/*    /!*))}*!/*/}
          {/*  </Grid>*/}
          {/*</Box>*/}
        </Container>
      </Box>
    </>
  );
}

export default ProjectList;
