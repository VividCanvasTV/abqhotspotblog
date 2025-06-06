import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/events/[id]/attendance - Check if user is attending
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const attendance = await prisma.eventAttendance.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
        }
      }
    })

    return NextResponse.json({
      isAttending: !!attendance
    })
  } catch (error) {
    console.error('Error checking attendance:', error)
    return NextResponse.json(
      { error: 'Failed to check attendance' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/attendance - Mark as attending
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if event is at capacity
    if (event.capacity && event.attendees >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at capacity' },
        { status: 400 }
      )
    }

    // Check if user is already attending
    const existingAttendance = await prisma.eventAttendance.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
        }
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Already attending this event' },
        { status: 400 }
      )
    }

    // Create attendance record and update attendee count
    await prisma.$transaction([
      prisma.eventAttendance.create({
        data: {
          userId: session.user.id,
          eventId: id,
        }
      }),
      prisma.event.update({
        where: { id },
        data: {
          attendees: {
            increment: 1
          }
        }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id]/attendance - Remove attendance
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is attending
    const attendance = await prisma.eventAttendance.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id,
        }
      }
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Not attending this event' },
        { status: 400 }
      )
    }

    // Remove attendance record and update attendee count
    await prisma.$transaction([
      prisma.eventAttendance.delete({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: id,
          }
        }
      }),
      prisma.event.update({
        where: { id },
        data: {
          attendees: {
            decrement: 1
          }
        }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing attendance:', error)
    return NextResponse.json(
      { error: 'Failed to remove attendance' },
      { status: 500 }
    )
  }
} 