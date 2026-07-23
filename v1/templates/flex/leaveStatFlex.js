const safeText = (val, fallback = "-") => {
  if (val === undefined || val === null || val === "") return fallback;
  return String(val);
};

const generateLeaveStatFlex = (leaveStatisticData) => {
  const { id, year, statistic } = leaveStatisticData;

  const statItems = statistic.map(stat => {
    const isExceeded = (stat.used > stat.privileges && stat.privileges > 0) || (stat.privileges === 0 && stat.used > 0);
    const valueColor = isExceeded ? "#ff5252" : "#111111";

    let remaining = stat.remaining;
    if (remaining === undefined || remaining === null || remaining === "") {
      if (!isNaN(stat.privileges) && !isNaN(stat.used) && stat.privileges !== "" && stat.used !== "") {
        remaining = Number(stat.privileges) - Number(stat.used);
      }
    }

    return {
      type: "box",
      layout: "horizontal",
      margin: "md",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: safeText(stat.leaveType),
          size: "sm",
          color: "#333333",
          flex: 4,
          wrap: true,
          weight: "bold"
        },
        {
          type: "text",
          text: safeText(stat.privileges),
          size: "sm",
          color: "#555555",
          flex: 2,
          align: "center"
        },
        {
          type: "text",
          text: safeText(remaining),
          size: "sm",
          color: valueColor,
          flex: 2,
          align: "end",
          weight: "bold"
        }
      ]
    };
  });

  return {
    type: "flex",
    altText: `สถิติการลาของคุณ ปี ${year}`,
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#00B900",
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
                text: `${id}`,
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
          ...statItems
        ]
      }
    }
  };
};

module.exports = { generateLeaveStatFlex };
