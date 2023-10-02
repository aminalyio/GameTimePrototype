import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => {
        return error.response?.status === 500;
    },
});

export default axios;
