import { NextRequest, NextResponse } from "next/server";
import { 
  readCommentsFromFile, 
  addCommentToFile, 
  removeCommentFromFile 
} from "@/utils/file-manager";

interface CreateCommentRequest {
  text: string;
  author: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    
    const allComments = await readCommentsFromFile();
    
    const filteredComments = query 
      ? allComments.filter(comment =>
          comment.text.toLowerCase().includes(query.toLowerCase()) ||
          comment.author.toLowerCase().includes(query.toLowerCase())
        )
      : allComments;

    return NextResponse.json({
      success: true,
      data: filteredComments,
      total: filteredComments.length,
      query: query || null
    });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor ao buscar comentários' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json();
    
    // Validação dos dados de entrada
    if (!body.text || !body.author) {
      return NextResponse.json(
        {
          success: false,
          message: 'Texto e autor são obrigatórios'
        },
        { status: 400 }
      );
    }

    // Validação adicional
    if (body.text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'O texto do comentário não pode estar vazio'
        },
        { status: 400 }
      );
    }

    if (body.author.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'O nome do autor não pode estar vazio'
        },
        { status: 400 }
      );
    }

    // Validação de tamanho
    if (body.text.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'O texto do comentário não pode exceder 1000 caracteres'
        },
        { status: 400 }
      );
    }

    if (body.author.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: 'O nome do autor não pode exceder 100 caracteres'
        },
        { status: 400 }
      );
    }

    // Sanitização básica
    const sanitizedComment = {
      text: body.text.trim().replace(/[<>]/g, ''),
      author: body.author.trim().replace(/[<>]/g, ''),
      timestamp: new Date().toISOString()
    };

    // Adicionar comentário ao arquivo
    const newComment = await addCommentToFile(sanitizedComment);

    if (!newComment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Erro ao salvar comentário no arquivo'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newComment,
        message: 'Comentário adicionado e salvo com sucesso'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    
    // Verificar se é erro de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato JSON inválido'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor ao criar comentário'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID do comentário é obrigatório'
        },
        { status: 400 }
      );
    }

    const commentId = parseInt(id);
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID do comentário deve ser um número válido'
        },
        { status: 400 }
      );
    }

    const deletedComment = await removeCommentFromFile(commentId);

    if (!deletedComment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comentário não encontrado ou erro ao remover'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedComment,
      message: 'Comentário removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor ao deletar comentário'
      },
      { status: 500 }
    );
  }
}

