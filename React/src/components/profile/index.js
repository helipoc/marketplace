import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../redux/actions/alert";
import Item from "../item";
import axios from "axios";

function Profile(props) {
  const usern = useSelector((state) => state.User);
  const username = props.match.params.username;

  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`/user/${username || usern.username}`)
      .then(({ data }) =>
        data.error && username
          ? dispatch(setAlert("User not found", "error"))
          : setUser(data)
      );
  }, [usern]);

  console.log(user);

  if (user && user.username) {
    return (
      <Grid>
        <Typography variant="h6">
          {/** if the requested user is the same as the connected one AKA if we hit /profile display You instead of the profile name */}
          {user.username == usern.username ? "You" : user.username} have{" "}
          {user.Items.length} listed item
        </Typography>
        <hr />
        <Grid container spacing={4} direction="row">
          {/** damn that's alot of items */}
          {user.Items.map((item) => (
            <Grid item xs={12} md={4}>
              <Item item={item} profile owner />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
}

export default Profile;
