export default ({ $axios, store }, inject) => {
  // Add an interceptor to modify requests globally
  $axios.onRequest(async (config) => {

    config.baseURL = `http://${window.location.hostname ?? "localhost"}:8000/api`;

    // config.baseURL = `https://backend.mytime2cloud.com/api`;

    // if (process.env.LOCAL_IP == 'localhost') {
    //   config.baseURL = `https://mytime2cloud-backend.test/api`;
    // }

    // Append the branchid parameter to all requests
    let user = store.state.auth.user;

    if (user) {
      config.params = {
        ...config.params,
        company_id: user.company_id,
      };
    }
    return config;
  });
};
