import _ from 'lodash'
/*
修改循环赋值
 */
export function initData(formData, params) { //引用传值
    _.map(formData, (item, index) => {
        if (_.has(params, index)) {
            formData[index] = params[index]
        }
    })
}

//datepicker设置不可选日期
export const options = {
    disabledDate (date) {
    return date && date.valueOf() < Date.now() - 86400000;
    }
}

//导出表格
// export const output = async (tableName, funcName) => {
//     let res = await eval(funcName+'("'+page_params+'")')
//     if (res.status) {
//         let data = res.data.data
//         this.$refs.table.exportCsv({
//             data: data,
//             filename: tableName
//         })
//     }else {
//         this.$Message.error(res.info)
//     }
// }
