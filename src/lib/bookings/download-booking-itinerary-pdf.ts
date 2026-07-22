import { jsPDF } from 'jspdf'

import type { BookingItineraryContent } from '@/lib/bookings/booking-itinerary-content'

export type BookingItineraryPdfInput = {
    agencyName: string
    agencyContact?: string
    agencySiteUrl?: string | null
    referenceId: string
    listingKindLabel: string
    title: string
    schedule: string
    location: string
    members: string
    status: string
    itineraryContent: BookingItineraryContent
}

function slugifyFilename(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'booking'
}

function drawWrappedLine(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight = 14,
) {
    const lines = doc.splitTextToSize(text, maxWidth) as string[]
    doc.text(lines, x, y)
    return y + lines.length * lineHeight
}

function ensureSpace(doc: jsPDF, cursorY: number, needed: number): number {
    const pageHeight = doc.internal.pageSize.getHeight()
    if (cursorY + needed > pageHeight - 56) {
        doc.addPage()
        return 48
    }
    return cursorY
}

function drawLabelValue(
    doc: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number,
    maxWidth: number,
) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(60)
    y = drawWrappedLine(doc, label, x, y, maxWidth, 12)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.setTextColor(0)
    return drawWrappedLine(doc, value, x, y + 2, maxWidth, 14) + 8
}

function drawSectionHeading(
    doc: jsPDF,
    title: string,
    x: number,
    y: number,
    maxWidth: number,
) {
    y = ensureSpace(doc, y, 36)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(0, 41, 35)
    y = drawWrappedLine(doc, title, x, y, maxWidth, 18) + 6

    doc.setDrawColor(192, 200, 201)
    doc.setLineWidth(0.5)
    doc.line(x, y, x + maxWidth, y)
    return y + 12
}

function drawRouteSection(
    doc: jsPDF,
    section: BookingItineraryContent['routes'],
    x: number,
    y: number,
    maxWidth: number,
) {
    if (section.items.length === 0) return y

    y = drawSectionHeading(doc, section.sectionTitle, x, y, maxWidth)

    for (const item of section.items) {
        y = ensureSpace(doc, y, 48)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(0)
        y = drawWrappedLine(doc, item.title || 'Route segment', x, y, maxWidth, 14)

        if (item.description) {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10)
            doc.setTextColor(60)
            y = drawWrappedLine(doc, item.description, x, y + 2, maxWidth, 12) + 10
        } else {
            y += 8
        }
    }

    return y
}

function drawStaySection(
    doc: jsPDF,
    section: BookingItineraryContent['stayAndDine'],
    x: number,
    y: number,
    maxWidth: number,
) {
    if (section.items.length === 0) return y

    y = drawSectionHeading(doc, section.sectionTitle, x, y, maxWidth)

    for (const item of section.items) {
        y = ensureSpace(doc, y, 52)
        const heading = item.subtitle ? `${item.title} (${item.subtitle})` : item.title
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(0)
        y = drawWrappedLine(doc, heading, x, y, maxWidth, 14)

        if (item.description) {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10)
            doc.setTextColor(60)
            y = drawWrappedLine(doc, item.description, x, y + 2, maxWidth, 12) + 10
        } else {
            y += 8
        }
    }

    return y
}

function drawServicesSection(
    doc: jsPDF,
    section: BookingItineraryContent['services'],
    x: number,
    y: number,
    maxWidth: number,
) {
    if (section.items.length === 0) return y

    y = drawSectionHeading(doc, section.sectionTitle, x, y, maxWidth)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(0)

    for (const item of section.items) {
        y = ensureSpace(doc, y, 20)
        y = drawWrappedLine(doc, `• ${item}`, x + 8, y, maxWidth - 8, 12) + 4
    }

    return y + 4
}

function drawFooter(doc: jsPDF, marginX: number, pageWidth: number) {
    const footerY = doc.internal.pageSize.getHeight() - 40
    doc.setDrawColor(192, 200, 201)
    doc.line(marginX, footerY - 12, pageWidth - marginX, footerY - 12)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(
        `Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        marginX,
        footerY,
    )
}

export function downloadBookingItineraryPdf(input: BookingItineraryPdfInput): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const marginX = 48
    const contentWidth = pageWidth - marginX * 2
    let cursorY = 52

    doc.setFillColor(0, 41, 35)
    doc.rect(0, 0, pageWidth, 96, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    cursorY = drawWrappedLine(doc, input.agencyName.trim() || 'Travel Itinerary', marginX, 40, contentWidth, 24)

    if (input.agencyContact?.trim()) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        drawWrappedLine(doc, input.agencyContact.trim(), marginX, cursorY + 2, contentWidth, 12)
    }

    if (input.agencySiteUrl?.trim()) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        drawWrappedLine(doc, input.agencySiteUrl.trim(), marginX, cursorY + 16, contentWidth, 12)
    }

    cursorY = 120
    doc.setTextColor(0, 41, 35)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    cursorY = drawWrappedLine(doc, 'Booking Itinerary', marginX, cursorY, contentWidth, 22)

    doc.setDrawColor(192, 200, 201)
    doc.setLineWidth(0.5)
    doc.line(marginX, cursorY + 4, pageWidth - marginX, cursorY + 4)
    cursorY += 20

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(80)
    cursorY = drawWrappedLine(
        doc,
        'This document summarizes your confirmed booking details. Please keep it for your records.',
        marginX,
        cursorY,
        contentWidth,
        14,
    )
    cursorY += 8

    doc.setTextColor(0)
    cursorY = drawLabelValue(doc, 'Booking reference', input.referenceId, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Tour type', input.listingKindLabel, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Tour / package', input.title, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Schedule', input.schedule, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Destination', input.location, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Travelers', input.members, marginX, cursorY, contentWidth)
    cursorY = drawLabelValue(doc, 'Booking status', input.status, marginX, cursorY, contentWidth)

    cursorY += 4
    cursorY = drawRouteSection(doc, input.itineraryContent.routes, marginX, cursorY, contentWidth)
    cursorY = drawStaySection(doc, input.itineraryContent.stayAndDine, marginX, cursorY, contentWidth)
    cursorY = drawServicesSection(doc, input.itineraryContent.services, marginX, cursorY, contentWidth)

    drawFooter(doc, marginX, pageWidth)

    const filename = `${slugifyFilename(input.referenceId)}-${slugifyFilename(input.title)}-itinerary.pdf`
    doc.save(filename)
}
