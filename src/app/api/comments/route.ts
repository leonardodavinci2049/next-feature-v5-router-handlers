import { comments } from './data';

export async function GET() {
  return new Response(JSON.stringify(comments), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

export async function POST(request: Request) {
  const newComment = await request.json();
  comments.push(newComment);
  
  return new Response(JSON.stringify(newComment), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

