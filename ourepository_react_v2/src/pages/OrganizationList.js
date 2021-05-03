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

const OrganizationList = () => {

  const [organizations, setOrganizations] = React.useState(null)

  // get the organizations, projects, and mosaics for the current user
  React.useEffect(() => {
    apiService.getOrgs().then((response) => {
      const data = response.data;
      if (data.code === "ORGS_RECEIVED") {
        setOrganizations(data.message.organizations);
      } else {
        alert("Something went wrong");
      }
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Organizations | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <OrganizationListToolbar />
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {organizations && organizations.map((organization) => (
                <Grid
                  item
                  key={organization.uuid}
                  lg={2}
                  md={6}
                  xs={12}
                >
                  <OrganizationCard organization={organization} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default OrganizationList;
