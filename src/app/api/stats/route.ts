import { NextRequest, NextResponse } from 'next/server';
import { getAssessmentStats } from '@/lib/db';

// GET /api/stats?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const stats = await getAssessmentStats(userId || undefined);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
