import hotkeys from 'hotkeys-js'
import dayjs from 'dayjs'
const EventEmitter = require('events');
import _ from 'lodash'

export default class Scanning extends EventEmitter {
    constructor() {
        super();
        let code = '';
        let startTime = dayjs().valueOf();
        // let presstime = 0;
        hotkeys('*', e => {
            let nowTime = dayjs().valueOf();
            if (nowTime - startTime > 80) {
                startTime = nowTime;
                code = e.key;
            } else {
                startTime = nowTime;
                if (e.keyCode === 13) {
                    if (code.length > 3) {
                        code = code.replace(/Shift/g,'');
                        this.emit('data',  code);
                    }
                    code = '';
                } else {
                    if (!_.isUndefined(e.key)) {
                        code += e.key;
                    } else if (e.keyCode) {
                        code += String.fromCharCode(e.keyCode)
                    } else {
                        code += String.fromCharCode(e.which)
                    }
                }
            }
        });
    }
}
