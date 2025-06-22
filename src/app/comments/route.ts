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

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = comments.findIndex(comment => comment.id === id);
  
  if (index !== -1) {
    comments.splice(index, 1);
    return new Response(null, { status: 204 });
  }
  
  return new Response('Comment not found', { status: 404 });
}

export async function PUT(request: Request) {
  const updatedComment = await request.json();
  const index = comments.findIndex(comment => comment.id === updatedComment.id);
  
  if (index !== -1) {
    comments[index] = updatedComment;
    return new Response(JSON.stringify(updatedComment), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  return new Response('Comment not found', { status: 404 });
}
export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();
  const index = comments.findIndex(comment => comment.id === id);
  
  if (index !== -1) {
    Object.assign(comments[index], updates);
    return new Response(JSON.stringify(comments[index]), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  return new Response('Comment not found', { status: 404 });
}
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Allow': 'GET, POST, DELETE, PUT, PATCH, OPTIONS',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

export async function HEAD() {
  return new Response(null, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}
