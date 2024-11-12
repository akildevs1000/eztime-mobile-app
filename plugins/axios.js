export default ({ $axios, store }, inject) => {
  // Add an interceptor to modify requests globally
  $axios.onRequest(async (config) => {
    config.baseURL = `http://${window.location.hostname ?? "localhost"}:8000/api`;
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
