/**
 * Flex Message Service
 * Generates LINE Flex Message payloads for showing employee search results.
 */

/**
 * Formats a date string into Thai format.
 * @param {string} dateStr - ISO Date String
 * @returns {string} Formatted Thai date
 */
function formatThaiDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return '-';
    }
}

/**
 * Creates a single employee bubble payload.
 * @param {object} employee - Employee data
 * @param {string} frontendUrl - Frontend application URL
 * @returns {object} LINE Flex Bubble object
 */
function createEmployeeBubble(employee, frontendUrl) {
    const name = employee.fullName || '-';
    const employeeId = employee.employeeId || '-';
    const position = employee.position || '-';
    const department = (employee.bu1 && employee.bu1.toLowerCase() !== 'none') ? employee.bu1 : '-';
    const division = (employee.bu4 && employee.bu4.toLowerCase() !== 'none')
        ? employee.bu4
        : ((employee.bu2 && employee.bu2.toLowerCase() !== 'none') ? employee.bu2 : '-');
    const workplace = employee.workPlace || '-';

    // Map employee type
    let typeTh = '-';
    if (employee.employeeType === 'Permanent') {
        typeTh = 'พนักงานประจำ';
    } else if (employee.employeeType === 'Contract') {
        typeTh = 'พนักงานสัญญาจ้าง';
    } else if (employee.employeeType) {
        typeTh = employee.employeeType;
    }

    const startDateTh = formatThaiDate(employee.startDate);

    return {
        type: 'bubble',
        size: 'mega',
        header: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: 'ข้อมูลพนักงาน / Employee Profile',
                    weight: 'bold',
                    color: '#FFFFFF',
                    size: 'sm',
                    align: 'center'
                }
            ],
            backgroundColor: '#ff5100',
            paddingAll: 'md'
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                // Employee Identity
                {
                    type: 'text',
                    text: name,
                    weight: 'bold',
                    size: 'lg',
                    align: 'center',
                    color: '#0F172A'
                },
                {
                    type: 'text',
                    text: position,
                    size: 'sm',
                    color: '#64748B',
                    align: 'center',
                    margin: 'xs'
                },
                {
                    type: 'separator',
                    margin: 'lg',
                    color: '#E2E8F0'
                },
                // Metadata Details
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'รหัสพนักงาน',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: employeeId,
                                    size: 'sm',
                                    color: '#334155',
                                    weight: 'bold',
                                    flex: 8,
                                    align: 'end'
                                }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'แผนก (BU1)',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: department,
                                    size: 'sm',
                                    color: '#334155',
                                    flex: 8,
                                    align: 'end',
                                    wrap: true
                                }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'ฝ่าย/ส่วนงาน',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: division,
                                    size: 'sm',
                                    color: '#334155',
                                    flex: 8,
                                    align: 'end',
                                    wrap: true
                                }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'สถานที่ทำงาน',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: workplace,
                                    size: 'sm',
                                    color: '#334155',
                                    flex: 8,
                                    align: 'end'
                                }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'ประเภทพนักงาน',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: typeTh,
                                    size: 'sm',
                                    color: '#334155',
                                    flex: 8,
                                    align: 'end'
                                }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'วันที่เริ่มงาน',
                                    size: 'sm',
                                    color: '#94A3B8',
                                    flex: 4
                                },
                                {
                                    type: 'text',
                                    text: startDateTh,
                                    size: 'sm',
                                    color: '#334155',
                                    flex: 8,
                                    align: 'end'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'button',
                    action: {
                        type: 'uri',
                        label: 'ดูโปรไฟล์บนระบบ',
                        uri: `${frontendUrl}/profile/${employeeId}`
                    },
                    color: '#ff5100',
                    style: 'primary'
                }
            ],
            paddingAll: 'md'
        }
    };
}

/**
 * Generates the full LINE Flex Message payload for employee(s).
 * @param {Array|object} data - One or multiple employee records
 * @returns {object} LINE Flex Message envelope payload
 */
function createEmployeeFlexMessage(data, query = '') {
    const frontendUrl = process.env.NEXTAUTH_URL;
    // For data as a arrays
    const employees = Array.isArray(data) ? data : [data];

    if (employees.length === 0) {
        return {
            type: 'text',
            text: 'ไม่พบข้อมูลพนักงาน'
        };
    }

    if (employees.length === 1) {
        const bubble = createEmployeeBubble(employees[0], frontendUrl);
        return {
            type: 'flex',
            altText: `ข้อมูลพนักงาน: ${employees[0].fullName || ''}`,
            contents: bubble
        };
    }

    if (employees.length > 10) {
        return {
            type: 'flex',
            altText: `ผลการค้นหาพนักงาน (${employees.length} คน)`,
            contents: {
                type: 'bubble',
                size: 'mega',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'ผลการค้นหาพนักงาน / Search Results',
                            weight: 'bold',
                            color: '#FFFFFF',
                            size: 'sm',
                            align: 'center'
                        }
                    ],
                    backgroundColor: '#ff5100',
                    paddingAll: 'md'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: `พบข้อมูลพนักงานทั้งหมด ${employees.length} คน`,
                            weight: 'bold',
                            size: 'lg',
                            align: 'center',
                            color: '#0F172A',
                            wrap: true
                        },
                        {
                            type: 'text',
                            text: 'เนื่องจากผลการค้นหามีจำนวนมาก กรุณาคลิกปุ่มด้านล่างเพื่อดูผลการค้นหาทั้งหมดบนเว็บไซต์',
                            size: 'sm',
                            color: '#64748B',
                            align: 'center',
                            margin: 'md',
                            wrap: true
                        }
                    ],
                    paddingAll: 'lg'
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'button',
                            action: {
                                type: 'uri',
                                label: 'ดูผลการค้นหาทั้งหมด',
                                uri: (() => {
                                    const cleanQuery = query.trim();
                                    if (/^\d+$/.test(cleanQuery)) {
                                        return `${frontendUrl}/search-result?employeeId=${encodeURIComponent(cleanQuery)}`;
                                    } else if (/^[ก-๙\s]+$/.test(cleanQuery)) {
                                        return `${frontendUrl}/search-result?fullName=${encodeURIComponent(cleanQuery)}`;
                                    } else {
                                        return `${frontendUrl}/search-result?query=${encodeURIComponent(cleanQuery)}`;
                                    }
                                })()
                            },
                            color: '#ff5100',
                            style: 'primary'
                        }
                    ],
                    paddingAll: 'md'
                }
            }
        };
    }

    // Carousel for multiple search results (LINE allows max 10 bubbles)
    const displayList = employees.slice(0, 10);
    const bubbles = displayList.map(emp => createEmployeeBubble(emp, frontendUrl));

    return {
        type: 'flex',
        altText: `ผลการค้นหาพนักงาน (${employees.length} คน)`,
        contents: {
            type: 'carousel',
            contents: bubbles
        }
    };
}

/**
 * Creates a welfare Flex Message payload.
 * @param {object} welfareData - Welfare data (staff and family)
 * @param {string} frontendUrl - Frontend application URL
 * @returns {object} LINE Flex Message object
 */
function createWelfareFlexMessage(welfareData, frontendUrl) {
    const contents = [];

    const formatCurrency = (val) => {
        const num = parseFloat(val) || 0;
        return num.toLocaleString('th-TH');
    };

    const addSection = (title, items, color) => {
        if (!items || items.length === 0) return;

        contents.push({
            type: 'text',
            text: title,
            weight: 'bold',
            color: color,
            size: 'sm',
            margin: 'md'
        });

        items.forEach(item => {
            const limit = parseFloat(item.limit) || 0;
            const use = parseFloat(item.use) || 0;
            const remain = parseFloat(item.remain) || 0;

            contents.push({
                type: 'box',
                layout: 'vertical',
                margin: 'sm',
                contents: [
                    {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                            { type: 'text', text: item.type, size: 'xs', color: '#333333', weight: 'bold', flex: 1 },
                            { type: 'text', text: `฿${formatCurrency(use)} / ฿${formatCurrency(limit)}`, size: 'xs', color: '#666666', align: 'end' }
                        ]
                    },
                    {
                        type: 'text',
                        text: `คงเหลือ: ฿${formatCurrency(remain)}`,
                        size: 'xxs',
                        color: '#999999',
                        align: 'end',
                        margin: 'xs'
                    }
                ]
            });
            contents.push({
                type: 'separator',
                margin: 'sm'
            });
        });
    };

    addSection('สวัสดิการของฉัน', welfareData.staff, '#10b981');
    addSection('สวัสดิการครอบครัว', welfareData.family, '#3b82f6');

    if (contents.length === 0) {
        contents.push({
            type: 'text',
            text: 'ไม่พบข้อมูลสวัสดิการในปีนี้',
            color: '#999999',
            size: 'sm',
            align: 'center',
            margin: 'md'
        });
    }

    return {
        type: 'flex',
        altText: 'ข้อมูลสวัสดิการของคุณ',
        contents: {
            type: 'bubble',
            size: 'mega',
            header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#f59e0b',
                paddingAll: 'md',
                contents: [
                    {
                        type: 'text',
                        text: 'ข้อมูลสวัสดิการพนักงาน',
                        weight: 'bold',
                        color: '#ffffff',
                        size: 'md',
                        align: 'center'
                    }
                ]
            },
            body: {
                type: 'box',
                layout: 'vertical',
                paddingAll: 'lg',
                contents: contents
            }
        }
    };
}

module.exports = {
    createEmployeeFlexMessage,
    createWelfareFlexMessage
};
