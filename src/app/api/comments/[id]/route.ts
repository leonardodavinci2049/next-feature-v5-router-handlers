import { comments } from "../data";

interface Comment {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Comment) {
  const { id } = await params;

  const comment = comments.find((comment) => comment.id === parseInt(id));
  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  return new Response(JSON.stringify(comment), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}

//http://localhost:3000/comments/1
export async function PATCH(_request: Request, { params }: Comment) {
  const { id } = await params;

  const index = comments.findIndex((comment) => comment.id === parseInt(id));

  const body = await _request.json();
  if (index !== -1) {
    comments[index] = { ...comments[index], ...body };
    return new Response(JSON.stringify(comments[index]), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  return new Response("Comment not found", { status: 404 });
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