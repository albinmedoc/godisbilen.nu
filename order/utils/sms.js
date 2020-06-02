const axios = require('axios');

const budget_sms_url = 'https://api.budgetsms.net/sendsms/';

function BudgetSMS() {
    let _options = {
        userid: process.env.BUDGETSMS_USERID,
        username: process.env.BUDGETSMS_USERNAME,
        handle: process.env.BUDGETSMS_HANDLE,
        credit: 1,
        price: 1,
    };

    _optionsShape = {
        userid: null,
        username: null,
        handle: null,
        from: null,
        to: null,
        msg: null,
    };

    function _validateOptions() {
        Object.keys(_options).forEach((optionKey) => {
            if (!_optionsShape.hasOwnProperty(optionKey)) {
                throw new Error(`Option '${optionKey}' does not exist`);
            }
        });
    }

    this.from = function (from) {
        _options = Object.assign({}, _options, { from: from });
        return this;
    };

    this.to = function (to) {
        _options = Object.assign({}, _options, { to: to });
        return this;
    };

    this.message = function (message) {
        _options = Object.assign({}, _options, { msg: message });
        return this;
    };

    this.send = function () {
        _validateOptions();
        return axios
            .get(budget_sms_url, null, { params: _options })
            .then((res) => res.data);
    };
}

module.exports = BudgetSMS;
