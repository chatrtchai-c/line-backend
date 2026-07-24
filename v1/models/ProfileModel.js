const EmployeeType = {
    PERMANENT: 'พนักงานประจำ',
    CONTRACT: 'พนักงานสัญญาจ้าง'
};

class Employee {
    constructor(data = {}) {
        Object.assign(this, data);
    }
}

module.exports = {
    EmployeeType,
    Employee
};