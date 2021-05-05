import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
} from '@material-ui/core';
import OrganizationCard from "../components/organization/OrganizationCard";
import OrganizationListToolbar from "../components/organization/OrganizationListToolbar";
import React from "react";
import userApiService from "../services/userApi";

const OrganizationList = () => {

  const [organizations, setOrganizations] = React.useState(null)

  // get the organizations, projects, and mosaics for the current user
  React.useEffect(() => {
    userApiService.getOrgs().then((response) => {
      const data = response.data;
      if (data.code === "SUCCESS") {
        setOrganizations(data.message.organizations);
      } else {
        alert(data.message);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Organizations | OURepository</title>
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
