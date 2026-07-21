/**
 * Enum สำหรับประเภทการลา
 * @enum {string}
 */
const LeaveType = {
  SICK: 'ลาป่วย',
  LEAVE: 'ลาหยุด',
  ANNUAL: 'ลาพักร้อน',
  FUNERAL: 'ลาเพื่อประกอบพิธีศพ',
  PATERNITY: 'ลาเพื่อช่วยเหลือภรรยาเลี้ยงดูบุตร',
  MARRIAGE: 'ลาเพื่อประกอบพิธีสมรส',
  MILITARY: 'ลาเพื่อรับราชการทหาร',
  ORDINATION: 'ลาอุปสมบท',
  HAJJ: 'ลาเพื่อประกอบพิธีฮัจ',
  VOLUNTEER: 'อาสาสมัครเพื่อกิจกรรมทางสังคม',
  STERILIZATION: 'ลาเพื่อทำหมัน',
  TRAINING: 'ลาเพื่อฝึกอบรมหรือพัฒนาความรู้',
  TRAINING_UNPAID: 'ลาเพื่อฝึกอบรมหรือพัฒนาความรู้ (ไม่ได้รับค่าจ้าง)',
  RELIGIOUS_PRACTICE: 'ลาเพื่อปฏิบัติธรรม',
  LATE: 'มาสาย (จำนวน 55 ครั้ง)',
  OTHER: 'ลาหยุดกรณีอื่นๆ',
};

/**
 * คลาสสำหรับเก็บข้อมูลสถิติการลาในแต่ละประเภท
 */
class LeaveStatItem {
  /**
   * @param {number} year - ปีของโควต้าวันลา
   * @param {string} leaveType - ประเภทการลา (จาก LeaveType)
   * @param {number} privileges - สิทธิ์วันลาทั้งหมด
   * @param {number} used - จำนวนวันที่ใช้ไปแล้ว
   */
  constructor(year, leaveType, privileges, used) {
    this.year = year;
    this.leaveType = leaveType;
    this.privileges = privileges;
    this.used = used;
    this.remaining = privileges - used;
  }
}

/**
 * คลาสหลักสำหรับเก็บรวบรวมสถิติการลาทั้งหมดของพนักงานในปีนั้นๆ
 */
class LeaveStatistic {
  /**
   * @param {string} id - รหัสพนักงาน
   * @param {number} year - ปีของสถิติ
   * @param {LeaveStatItem[]} statistic - รายการสถิติการลา
   */
  constructor(id, year, statistic = []) {
    this.id = id;
    this.year = year;
    this.statistic = statistic;
  }

  /**
   * เพิ่มสถิติการลาประเภทต่างๆ
   * @param {LeaveStatItem} item - รายการสถิติการลา
   */
  addStatItem(item) {
    this.statistic.push(item);
  }
}

module.exports = {
  LeaveType,
  LeaveStatItem,
  LeaveStatistic
};
