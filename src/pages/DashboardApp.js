// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  // AppTasks,
  // AppNewsUpdate,
  // AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppConversionRates
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Thống kê">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Thống kê</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <AppCurrentVisits />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
}
