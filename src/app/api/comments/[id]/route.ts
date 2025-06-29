import { NextRequest, NextResponse } from "next/server";
import { 
  readCommentsFromFile, 
  updateCommentInFile, 
  removeCommentFromFile 
} from "@/utils/file-manager";

interface UpdateCommentRequest {
  text?: string;
  author?: string;
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const commentId = parseInt(params.id);
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID do comentário deve ser um número válido'
        },
        { status: 400 }
      );
    }

    const comments = await readCommentsFromFile();
    const comment = comments.find(c => c.id === commentId);

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comentário não encontrado'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Erro ao buscar comentário:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor ao buscar comentário'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const commentId = parseInt(params.id);
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID do comentário deve ser um número válido'
        },
        { status: 400 }
      );
    }

    const body: UpdateCommentRequest = await request.json();
    
    // Validação básica
    if (body.text !== undefined && body.text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'O texto do comentário não pode estar vazio'
        },
        { status: 400 }
      );
    }

    if (body.author !== undefined && body.author.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'O nome do autor não pode estar vazio'
        },
        { status: 400 }
      );
    }

    // Sanitização
    const updateData: Partial<UpdateCommentRequest> = {};
    if (body.text !== undefined) {
      updateData.text = body.text.trim().replace(/[<>]/g, '');
    }
    if (body.author !== undefined) {
      updateData.author = body.author.trim().replace(/[<>]/g, '');
    }

    const updatedComment = await updateCommentInFile(commentId, updateData);

    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comentário não encontrado ou erro ao atualizar'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: 'Comentário atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    
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
        message: 'Erro interno do servidor ao atualizar comentário'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const commentId = parseInt(params.id);
    
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
          message: 'Comentário não encontrado'
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