import store from "../store";

const UploadsApi = {
  fetch(date) {
    return axios
      .get("/api/upload/" + date)
      .then(response => response.data)
      .catch(err => {
        store.dispatch("api_response", {
          err: err.response
        });
      });
  },
  create(id) {
    return axios
      .post("/api/post", {
        id: id
      })
      .then(response => response.data)
      .catch(err => {
        store.dispatch("api_response", {
          err: err.response
        });
      });
  },
};

export default HoursApi;
