const generateRequirePinFlex = (liffUrl) => {
  return {
    type: "flex",
    altText: "กรุณายืนยันรหัส PIN",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "ยืนยันตัวตน",
            weight: "bold",
            size: "xl",
            color: "#111111"
          },
          {
            type: "text",
            text: "กรุณาใส่รหัส PIN 4 หลักเพื่อความปลอดภัยก่อนเข้าดูข้อมูลสิทธิการลาของคุณครับ",
            margin: "md",
            wrap: true,
            color: "#666666"
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#ff5100",
            action: {
              type: "uri",
              label: "ใส่รหัส PIN",
              uri: liffUrl
            }
          }
        ]
      }
    }
  };
};

module.exports = { generateRequirePinFlex };
