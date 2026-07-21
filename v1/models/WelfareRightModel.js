
/**
 * Enum สำหรับประเภทสวัสดิการ
 * @enum {string}
 */
const WelfareType = {
    OPD: 'ผู้ป่วยนอก'
};

/**
 * Enum สำหรับโรงพยาบาลคู่สัญญา
 * @enum {string}
 */
const Hospital = {
    RAMA: "รพ.รามาธิบดี"
}

/**
 * คลาสสำหรับเก็บข้อมูลโควต้าและการใช้สวัสดิการแต่ละประเภท
 */
class WelfareRightItem {
    /**
     * @param {string} type - ประเภทสวัสดิการ (จาก WelfareType)
     * @param {number} limit - จำนวนโควต้าทั้งหมด
     * @param {number} use - จำนวนที่ใช้ไปแล้ว
     */
    constructor(type, limit, use) {
        this.type = type;
        this.limit = limit;
        this.use = use;
        this.remain = limit - use;
    }
}

/**
 * คลาสสำหรับเก็บรายละเอียดการเบิกสวัสดิการแต่ละครั้ง
 */
class WelfareDescription {
    /**
     * @param {Date|string} date - วัน เดือน ปี ที่ใช้บริการ
     * @param {string} doc_no - หมายเลขเอกสารอ้างอิง
     * @param {string} disease - อาการ หรือโรค
     * @param {string} hospital - โรงพยาบาลคู่สัญญา (จาก Hospital)
     * @param {string} remark - หมายเหตุเพิ่มเติม
     * @param {number} charges - อัตราค่าบริการ
     */
    constructor(date, doc_no, disease, hospital, remark, charges) {
        this.date = date;
        this.doc_no = doc_no;
        this.disease = disease;
        this.hospital = hospital;
        this.remark = remark;
        this.charges = charges;
    }
}

/**
 * คลาสหลักสำหรับเก็บรวบรวมสิทธิ์สวัสดิการของพนักงานในแต่ละปี
 */
class WelfareRight {
    /**
     * @param {string} id - รหัสพนักงาน
     * @param {number} year - ปีของสวัสดิการ
     * @param {WelfareRightItem[]} staff - รายการสวัสดิการส่วนพนักงาน
     * @param {WelfareRightItem[]} family - รายการสวัสดิการส่วนครอบครัว
     * @param {WelfareDescription[]} description - ประวัติการใช้สวัสดิการ
     */
    constructor(id, year, staff = [], family = [], description = []) {
        this.id = id;
        this.year = year;
        this.staff = staff;
        this.family = family;
        this.description = description;
    }

    /**
     * เพิ่มรายการสวัสดิการส่วนพนักงาน
     * @param {WelfareRightItem} item
     */
    addStaffWelfareItem(item) {
        this.staff.push(item);
    }

    /**
     * เพิ่มรายการสวัสดิการส่วนครอบครัว
     * @param {WelfareRightItem} item
     */
    addFamilyWelfareItem(item) {
        this.family.push(item);
    }

    /**
     * เพิ่มประวัติการใช้สวัสดิการ
     * @param {WelfareDescription} item
     */
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