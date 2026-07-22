const generateLeaveStatFlex = (leaveStatisticData) => {
  const { id, year, statistic } = leaveStatisticData;

  // สร้าง block รายการสถิติการลาแต่ละประเภทเป็นตาราง
  const statItems = statistic.map(stat => {
    // กำหนดสีถ้ายอดใช้เกินสิทธิ์ ให้เป็นสีแดง ถ้าปกติให้เป็นสีปกติ
    const isExceeded = (stat.used > stat.privileges && stat.privileges > 0) || (stat.privileges === 0 && stat.used > 0);
    const valueColor = isExceeded ? "#ff5252" : "#111111";

    return {
      type: "box",
      layout: "horizontal",
      margin: "md",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: stat.leaveType,
          size: "sm",
          color: "#333333",
          flex: 4,
          wrap: true,
          weight: "bold"
        },
        {
          type: "text",
          text: stat.privileges > 0 ? `${stat.privileges}` : "-",
          size: "sm",
          color: "#555555",
          flex: 2,
          align: "center"
        },
        {
          type: "text",
          text: `${stat.used}`,
          size: "sm",
          color: valueColor,
          flex: 2,
          align: "center",
          weight: "bold"
        },
        {
          type: "text",
          text: stat.privileges > 0 ? `${stat.remaining}` : "-",
          size: "sm",
          color: valueColor,
          flex: 2,
          align: "end",
          weight: "bold"
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
          // Header ของตาราง
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "ประเภท",
                color: "#aaaaaa",
                size: "xs",
                flex: 4
              },
              {
                type: "text",
                text: "สิทธิ์",
                color: "#aaaaaa",
                size: "xs",
                flex: 2,
                align: "center"
              },
              {
                type: "text",
                text: "ใช้ไป",
                color: "#aaaaaa",
                size: "xs",
                flex: 2,
                align: "center"
              },
              {
                type: "text",
                text: "คงเหลือ",
                color: "#aaaaaa",
                size: "xs",
                flex: 2,
                align: "end"
              }
            ]
          },
          {
            type: "separator",
            margin: "md"
          },
          // นำรายการสถิติการลาแต่ละประเภทมาแสดง
          ...statItems
        ]
      }
    }
  };
};

module.exports = { generateLeaveStatFlex };
