const WelfareType = {
    OPD: 'ผู้ป่วยนอก'
};

const Hospital = {
    RAMA: "รพ.รามาธิบดี"
}

class WelfareRightItem {
    constructor(type, limit, use) {
        this.type = type;
        this.limit = limit;
        this.use = use;
        this.remain = limit - use;
    }
}

class WelfareDescription {
    constructor(date, doc_no, disease, hospital, remark, charges) {
        this.date = date;
        this.doc_no = doc_no;
        this.disease = disease;
        this.hospital = hospital;
        this.remark = remark;
        this.charges = charges;
    }
}

class WelfareRight {
    constructor(id, year, staff = [], family = [], description = []) {
        this.id = id;
        this.year = year;
        this.staff = staff;
        this.family = family;
        this.description = description;
    }

    addStaffWelfareItem(item) {
        this.staff.push(item);
    }

    addFamilyWelfareItem(item) {
        this.family.push(item);
    }

    addWelfareDescription(item) {
        this.description.push(item);
    }
}

module.exports = {
    WelfareType,
    Hospital,
    WelfareRightItem,
    WelfareDescription,
    WelfareRight
}