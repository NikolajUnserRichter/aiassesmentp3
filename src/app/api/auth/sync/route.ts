import { NextRequest, NextResponse } from 'next/server';
import { getUserByAzureId, createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { azure_id, email, name } = body;

    if (!azure_id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to get existing user
    let user = await getUserByAzureId(azure_id);

    // Create user if doesn't exist
    if (!user) {
      user = await createUser({
        azure_id,
        email,
        name: name || email,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}
