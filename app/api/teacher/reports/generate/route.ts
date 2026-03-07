import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { reportType, data } = body

        const pdfContent = generateStyledPDF(reportType, data)

        return new NextResponse(pdfContent, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="report-${reportType}-${new Date().toISOString().split("T")[0]}.pdf"`,
            },
        })
    } catch (error) {
        console.error("Error:", error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

function generateStyledPDF(reportType: string, data: any): any {
    let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font 
/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
>>
>>
endobj
5 0 obj
<< /Length 2000 >>
stream
BT
/F2 24 Tf
50 750 Td
(PORTFOLIO REPORT) Tj
ET
BT
/F1 10 Tf
50 730 Td
(${reportType.toUpperCase()} | ${new Date().toLocaleDateString('ru-RU')}) Tj
ET
q
0.8 0.8 0.8 RG
50 725 m
562 725 l
S
Q
`

    if (reportType === 'students') {
        pdfContent += `
BT
/F2 16 Tf
50 700 Td
(General Student Report) Tj
ET
BT
/F1 11 Tf
50 680 Td
(Statistics:) Tj
ET
BT
/F1 10 Tf
70 665 Td
(Total Students: ${data.students?.length ?? 0}) Tj
ET
BT
/F1 10 Tf
70 650 Td
(Average GPA: ${data.avgGpa}) Tj
ET
BT
/F1 10 Tf
70 635 Td
(Deans List: ${data.deansListCount ?? 0}) Tj
ET
BT
/F1 10 Tf
70 620 Td
(Ready for Internship: ${data.internshipReady ?? 0}) Tj
ET
`
    } else if (reportType === 'skills') {
        pdfContent += `
BT
/F2 16 Tf
50 700 Td
(Skills Report) Tj
ET
BT
/F1 11 Tf
50 680 Td
(Top Skills:) Tj
ET
`
        let yPos = 665
        data.topSkills?.slice(0, 10).forEach(([skill, count]: any, idx: number) => {
            pdfContent += `BT
/F1 10 Tf
70 ${yPos} Td
(${idx + 1}. ${skill} - ${count} students) Tj
ET
`
            yPos -= 15
        })
    } else if (reportType === 'employment') {
        const total = data.students?.length ?? 0
        const ready = data.internshipReady ?? 0
        const percent = total > 0 ? ((ready / total) * 100).toFixed(1) : '0'

        pdfContent += `
BT
/F2 16 Tf
50 700 Td
(Employment Report) Tj
ET
BT
/F1 11 Tf
50 680 Td
(Statistics:) Tj
ET
BT
/F1 10 Tf
70 665 Td
(Total Students: ${total}) Tj
ET
BT
/F1 10 Tf
70 650 Td
(Ready for Internship: ${ready}) Tj
ET
BT
/F1 10 Tf
70 635 Td
(Percentage: ${percent}%) Tj
ET
`
    } else if (reportType === 'recommendations') {
        pdfContent += `
BT
/F2 16 Tf
50 700 Td
(Recommendations Report) Tj
ET
BT
/F1 11 Tf
50 680 Td
(Statistics:) Tj
ET
BT
/F1 10 Tf
70 665 Td
(Total Recommendations: ${data.recs?.length ?? 0}) Tj
ET
BT
/F1 10 Tf
70 650 Td
(Verified: ${data.recs?.filter((r: any) => r.verified).length ?? 0}) Tj
ET
`
    }

    pdfContent += `
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
0000000340 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
2400
%%EOF`

    return Buffer.from(pdfContent, "utf8")
}