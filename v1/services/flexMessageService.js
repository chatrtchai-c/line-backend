/**
 * Flex Message Service
 * Generates LINE Flex Message payloads for showing employee search results.
 */

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

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
    // Map employee fields with fallback values
    const name = employee.fullName || employee.name_th || '-';
    const employeeId = employee.employeeId || employee.code || '-';
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
    const rawAvatarUrl = employee.picture || employee.avatar || defaultAvatar;
    let avatarUrl = defaultAvatar;
    if (typeof rawAvatarUrl === 'string') {
        if (rawAvatarUrl.startsWith('https://')) {
            avatarUrl = rawAvatarUrl;
        } else if (rawAvatarUrl.startsWith('http://')) {
            avatarUrl = rawAvatarUrl.replace('http://', 'https://');
        }
    }

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
            backgroundColor: '#1E293B',
            paddingAll: 'md'
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                // Avatar Frame
                {
                    type: 'box',
                    layout: 'vertical',
                    alignItems: 'center',
                    contents: [
                        {
                            type: 'image',
                            url: avatarUrl,
                            size: 'md',
                            aspectRatio: '1:1',
                            aspectMode: 'cover'
                        }
                    ],
                    margin: 'md',
                    paddingBottom: 'md'
                },
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
                        uri: `${frontendUrl}/profile`
                    },
                    color: '#1E293B',
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
function createEmployeeFlexMessage(data) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
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
            altText: `ข้อมูลพนักงาน: ${employees[0].fullName || employees[0].name_th || ''}`,
            contents: bubble
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

module.exports = {
    createEmployeeFlexMessage
};
