import { NextRequest, NextResponse } from 'next/server';
import { getReleaseReadiness } from '@/lib/release/readiness';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const repo = searchParams.get('repo');
  const branch = searchParams.get('branch');

  if (!repo || !branch) {
    return NextResponse.json(
      { error: 'Missing required query parameters: repo and branch' },
      { status: 400 }
    );
  }

  try {
    const readiness = await getReleaseReadiness(repo, branch);
    return NextResponse.json(readiness);
  } catch (error) {
    console.error('Error fetching release readiness:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve release readiness' },
      { status: 500 }
    );
  }
}