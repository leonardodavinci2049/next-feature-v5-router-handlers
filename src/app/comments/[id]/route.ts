import { comments } from "../data";

interface Comment {
  params: Promise<{ id: string }>;  
}
  
export async function GET(_request: Request, { params }: Comment) {
  const { id } = await params;

    const comment = comments.find(comment => comment.id === parseInt(id));
    if (!comment) {
        return new Response('Comment not found', { status: 404 });
    }

    return new Response(JSON.stringify(comment), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });
 
}

//http://localhost:3000/comments/1