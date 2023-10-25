// holds your root state
export const state = () => ({
    locationData: {},
    locationData: {},
    navigator: {},
    disableCheckInButton: false,
    disableCheckOutButton: true,

    latitude: null,
    longitude: null,
    currentDate: null,
    initialPunch: true,
});

// contains your mutations
export const mutations = {
    locationData(state, value) {
        state.locationData = value;
    },
    locationError(state, value) {
        state.locationError = value;
    },
    navigator(state, value) {
        state.navigator = value;
    },
    disableCheckInButton(state, value) {
        state.disableCheckInButton = value;
    },
    disableCheckOutButton(state, value) {
        state.disableCheckOutButton = value;
    },

    latitude(state, value) {
        state.latitude = value;
    },
    longitude(state, value) {
        state.longitude = value;
    },
    currentDate(state, value) {
        state.currentDate = value;
    },
    initialPunch(state, value) {
        state.initialPunch = value;
    },
};
