const generateLeaveStatFlex = (leaveStatisticData) => {
  const { id, year, statistic } = leaveStatisticData;

  // สร้าง block รายการสถิติการลาแต่ละประเภท
  const statItems = statistic.map(stat => {
    // คำนวณเปอร์เซ็นต์ของ progress bar (จำนวนที่ใช้ไปเทียบกับสิทธิ์ที่มี)
    let percentage = 0;
    if (stat.privileges > 0) {
      percentage = Math.min(100, Math.max(0, (stat.used / stat.privileges) * 100));
    } else if (stat.used > 0) {
      percentage = 100; // กรณีไม่มีสิทธิ์ (0) แต่มีการใช้ จะให้ bar เต็ม
    }

    // กำหนดสีของ bar ถ้ายอดใช้เกินสิทธิ์ ให้เป็นสีแดง ถ้าปกติให้เป็นสีเขียว
    const isExceeded = (stat.used > stat.privileges && stat.privileges > 0) || (stat.privileges === 0 && stat.used > 0);
    const barColor = isExceeded ? "#ff5252" : "#4CAF50";

    return {
      type: "box",
      layout: "vertical",
      margin: "xl",
      spacing: "sm",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: stat.leaveType,
              size: "sm",
              color: "#333333",
              flex: 1,
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: stat.privileges > 0 ? `เหลือ ${stat.remaining} / ${stat.privileges} วัน` : `${stat.used} วัน`,
              size: "sm",
              color: isExceeded ? "#ff5252" : "#111111",
              align: "end",
              weight: "bold"
            }
          ]
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "ใช้ไปแล้ว",
              size: "xs",
              color: "#aaaaaa"
            },
            {
              type: "text",
              text: `${stat.used} วัน`,
              size: "xs",
              color: "#aaaaaa",
              align: "end"
            }
          ]
        },
        // Progress Bar
        {
          type: "box",
          layout: "horizontal",
          margin: "sm",
          height: "6px",
          backgroundColor: "#F0F0F0",
          cornerRadius: "md",
          contents: [
            {
              type: "box",
              layout: "vertical",
              width: `${percentage}%`,
              backgroundColor: barColor,
              cornerRadius: "md",
              contents: [
                {
                  type: "filler"
                }
              ]
            }
          ]
        }
      ]
    };
  });

  // สร้างโครงร่าง Flex Message
  return {
    type: "flex",
    altText: `สถิติการลาของคุณ ปี ${year}`,
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#00B900", // สีเขียว LINE
        paddingTop: "25px",
        paddingBottom: "25px",
        paddingStart: "20px",
        paddingEnd: "20px",
        contents: [
          {
            type: "text",
            text: "สถิติการลา",
            color: "#ffffff",
            weight: "bold",
            size: "xl"
          },
          {
            type: "text",
            text: `ปี ${year}`,
            color: "#ffffff",
            size: "md",
            margin: "xs"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "รหัสพนักงาน",
                color: "#888888",
                size: "sm",
                flex: 1
              },
              {
                type: "text",
                text: id,
                color: "#111111",
                size: "sm",
                flex: 2,
                align: "end",
                weight: "bold"
              }
            ]
          },
          {
            type: "separator",
            margin: "lg"
          },
          // นำรายการสถิติการลาแต่ละประเภทมาแสดง
          ...statItems
        ]
      }
    }
  };
};

module.exports = { generateLeaveStatFlex };
