import { NextRequest, NextResponse } from 'next/server';
import { getAssessments, createAssessment } from '@/lib/db';

// GET /api/assessments?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const assessments = await getAssessments(userId);
    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

// POST /api/assessments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      project_type,
      ai_tool,
      ai_use_cases,
      data_types,
      autonomy_level,
      impact_scope,
      transparency_level,
      risk_score,
      risk_level,
      measures,
      status,
    } = body;

    if (!user_id || !project_type || !ai_tool) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const assessment = await createAssessment({
      user_id,
      project_type,
      ai_tool,
      ai_use_cases: ai_use_cases || [],
      data_types: data_types || [],
      autonomy_level,
      impact_scope,
      transparency_level,
      risk_score,
      risk_level,
      measures: measures || [],
      status,
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}
