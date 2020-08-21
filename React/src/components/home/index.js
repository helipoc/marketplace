import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api/items";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { setAlert } from "../../redux/actions/alert";
import Item from "../item";

function Home(props) {
  const items = useSelector((state) => state.Items);
  const username = useSelector((state) => state.User.username);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(api.LoadItems());
  }, []);

  if (username && items.length > 0) {
    console.log(items);
    return (
      <>
        <Grid container spacing={8} alignContent="center">
          {items.map((item) => (
            <Grow in={true} key={item._id}>
              <Grid item xs={12} md={4} key={item._id}>
                <Item item={item} owner={item.Owner === username} />
              </Grid>
            </Grow>
          ))}
        </Grid>
        <Button
          style={{ marginTop: "2em", marginLeft: "90vw" }}
          onClick={() => dispatch(api.LoadNext())}
          color="primary"
          variant="contained"
        >
          NEXT PAGE
        </Button>
      </>
    );
  } else {
    return "No avaiable Items ";
  }
}

export default Home;
