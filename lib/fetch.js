import axios from 'axios';

export default async (options) => {
    try {
        const { data } = await axios({
            ...options,
            withCredentials: true
        });
        return data;
    } catch (err) {
        const { response = {} } = err;
        response.msg = response.statusText || '请求失败';
        response.code = response.status || 404;
        return response;
    }
};
