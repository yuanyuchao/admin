export function checkAdd(data) {
    return axios.request({
        url: API.CHECK_ADD,
        method: 'post',
        data
    })
}
