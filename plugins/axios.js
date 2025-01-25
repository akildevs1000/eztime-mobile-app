export default ({ $axios, store }, inject) => {
  // Add an interceptor to modify requests globally
  $axios.onRequest(async (config) => {

    // for DESKTOP
    // config.baseURL = `http://${window.location.hostname ?? "localhost"}:8002/api`;

    // for CLOUD
    config.baseURL = `https://backend.mytime2cloud.com/api`;

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
