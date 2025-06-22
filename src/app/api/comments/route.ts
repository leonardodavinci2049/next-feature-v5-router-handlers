import { type NextRequest } from 'next/server';
import { comments } from './data';

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get('query') || '';

  const filteredComments = searchQuery
    ? comments.filter((comment) => comment.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : comments;

  // Simulate a delay for demonstration purposes
  //await new Promise(resolve => setTimeout(resolve, 1000));

  return new Response(JSON.stringify(filteredComments), {
    status: 200,
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

