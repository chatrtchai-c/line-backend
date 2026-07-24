const LeaveType = {
  SICK: 'ลาป่วย',
  LEAVE: 'ลาหยุด',
  ANNUAL: 'ลาหยุดพักผ่อนประจำปี',
  BUSY: 'ลากิจ',
  FUNERAL: 'ลาเพื่อประกอบพิธีศพ',
  DISASTER: 'ลาเนื่องจากภัยพิบัติ',
  PATERNITY: 'ลาเพื่อช่วยเหลือภรรยาเลี้ยงดูบุตร',
  MILITARY: 'ลาเพื่อรับราชการทหาร',
  ORDINATION: 'ลาอุปสมบท',
  HAJJ: 'ลาเพื่อประกอบพิธีฮัจย์',
  VOLUNTEER: 'อาสาสมัครเพื่อกิจกรรมทางสังคม',
  STERILIZATION: 'ลาเพื่อทำหมัน',
  MARRIAGE: 'ลาเพื่อประกอบพิธีสมรส',
  TRAINING: 'ลาเพื่อฝึกอบรมหรือพัฒนาความรู้',
  TRAINING_UNPAID: 'ลาเพื่อฝึกอบรมหรือพัฒนาความรู้ไม่ได้รับค่าจ้าง',
  RELIGIOUS_PRACTICE: 'ลาเพื่อปฏิบัติธรรม',
  OTHER: 'ลาหยุดในกรณีอื่นๆ',
  LATE: 'Late (total  55  time)',
};

class LeaveStatItem {
  constructor(used, year, leaveType, remaining, privileges) {
    const validValues = Object.values(LeaveType);

    let resolvedLeaveType = LeaveType[leaveType];
    if (!resolvedLeaveType) {
      resolvedLeaveType = validValues.includes(leaveType) ? leaveType : LeaveType.OTHER;
    }

    this.used = used;
    this.year = year;
    this.leaveType = resolvedLeaveType;
    this.remaining = remaining;
    this.privileges = privileges;
  }
}





class LeaveStatistic {
  constructor(id, year, statistic = []) {
    this.id = id;
    this.year = year;
    this.statistic = statistic;
  }

  addStatItem(item) {
    this.statistic.push(item);
  }
}

module.exports = {
  LeaveType,
  LeaveStatItem,
  LeaveStatistic
};
