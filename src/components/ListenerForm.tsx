import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Redirect, useLocation, useParams } from "react-router-dom";

import Alert from "./Alert";
import Listener from "../interfaces/Listener";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(1),
    },
    title: {
      marginTop: theme.spacing(1),
    },
    titleButtons: {
      marginLeft: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    formControl: {
      marginTop: theme.spacing(2),
    },
  })
);

function ListenerForm() {
  const classes = useStyles();
  const { id } = useParams();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(
    ["create", "edit"].indexOf(location.pathname.split("/").slice(-1)[0]) > -1
  );
  const [redirect, setRedirect] = React.useState("");
  const [listener, setListener] = React.useState<Listener>({
    id: Number(id),
    name: "",
  });

  React.useEffect(() => {
    listener.id &&
      axios
        .get(`/api/v1/listener/${listener.id}`)
        .then(function (response) {
          setListener(response.data);
        })
        .catch(function (error) {
          setErrorMessage(error.response.statusText);
        });
  }, [listener.id]);

  const handleChange = (prop: keyof Listener) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setListener({
      ...listener,
      [prop]: event.target.value,
    });
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleToggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/listener/${listener.id}`)
      .then(function (response) {
        setRedirect("/listener");
      })
      .catch(function (error) {
        setErrorMessage(error.response.statusText);
      });
  };

  const handleSave = () => {
    if (listener.id) {
      axios
        .put(`/api/v1/listener/${listener.id}`, listener)
        .then(function (response) {
          setListener(response.data);
          setIsEdit(false);
          setRedirect(`/listener/${response.data.id}`);
        })
        .catch(function (error) {
          setErrorMessage(error.response.statusText);
        });
    } else {
      axios
        .post("/api/v1/listener", listener)
        .then(function (response) {
          setListener(response.data);
          setIsEdit(false);
          setRedirect(`/listener/${response.data.id}`);
        })
        .catch(function (error) {
          setErrorMessage(error.response.statusText);
        });
    }
  };

  return (
    <div>
      {redirect && <Redirect to={redirect} />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseErrorMessage}
        open={errorMessage.length === 0 ? false : true}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Box className={classes.title} display="flex" alignItems="center">
        <Typography variant="h4" display="inline">
          {listener.id ? (isEdit ? "Edit" : "View") : "Create"}{" "}
          {listener.id ? listener.name : "Listener"}
        </Typography>
        <span className={classes.titleButtons}>
          {!isEdit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setRedirect(`/listener/${listener.id}/edit`);
                  setIsEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToggleDialog}
              >
                Delete
              </Button>
              <Dialog open={isDialogOpen} onClose={handleToggleDialog}>
                <DialogTitle>Delete {listener.name}?</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    The listener will be deleted from the database.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleToggleDialog} color="primary">
                    No
                  </Button>
                  <Button onClick={handleDelete} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </span>
      </Box>
      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.formControl} fullWidth>
            <TextField
              label="Name"
              value={listener.name}
              onChange={handleChange("name")}
              InputProps={{
                readOnly: !isEdit,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          {!isEdit && (
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label="Updated At"
                value={listener.updatedAt}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ListenerForm;