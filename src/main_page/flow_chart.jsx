import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  minWidth: 180,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  borderRadius: "16px",
  position: "relative",
}));

const steps = [
  {
    title: "Create Test",
    points: [
      "Add questions & rules",
      "Set marks and types",
      "Organize question banks"
    ],
  },
  {
    title: "Configuration",
    points: [
      "Set timing & proctoring",
      "Restrict attempts",
      "Assign to students"
    ],
  },
  {
    title: "Invite Students",
    points: [
      "Generate exam links",
      "Notify via dashboard",
      "Authenticate access"
    ],
  },
  {
    title: "Monitor Exam",
    points: [
      "Monitor activity logs",
      "Receive flag notifications"
    ],
  },
  {
    title: "Review & Results",
    points: [
      "Auto-grade objective",
      "Faculty reviews",
      "Generate results"
    ],
  },
];

export default function FlowChart() {
  return (
    <Box sx={{ padding: 4, backgroundColor: 'aliceblue' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#AB444C', marginBottom: 8 }}>
        How Proctor Qube Works
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Grid item>
              <StepCard>
                <Typography variant="h6" gutterBottom className="text-primary">{step.title}</Typography>
                <ul style={{ paddingLeft: 16, textAlign: "left" }}>
                  {step.points.map((point, i) => (
                    <li key={i} style={{ fontSize: "0.9rem", color: "#555" }}>{point}</li>
                  ))}
                </ul>
              </StepCard>
            </Grid>
            {index < steps.length - 1 && (
              <Grid item>
                <ArrowForwardIcon fontSize="large" className="text-primary sm:rotate-90" />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
}
