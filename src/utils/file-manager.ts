import { promises as fs } from 'fs';
import path from 'path';
import type { Comment } from '@/types/comment';

const COMMENTS_FILE_PATH = path.join(process.cwd(), 'src/app/api/comments/data.json');

/**
 * Lê os comentários do arquivo data.json
 */
export const readCommentsFromFile = async (): Promise<Comment[]> => {
  try {
    // Verificar se o arquivo existe
    try {
      await fs.access(COMMENTS_FILE_PATH);
    } catch {
      // Se o arquivo não existe, criar com dados iniciais
      const initialComments: Comment[] = [
        {
          id: 1,
          text: "Este é o primeiro comentário.",
          author: "Alice",
          timestamp: "2023-10-01T12:00:00Z"
        },
        {
          id: 2,
          text: "Este é o segundo comentário.",
          author: "Bob",
          timestamp: "2023-10-01T12:05:00Z"
        },
        {
          id: 3,
          text: "Este é o terceiro comentário.",
          author: "Charlie",
          timestamp: "2023-10-01T12:10:00Z"
        }
      ];
      await fs.writeFile(COMMENTS_FILE_PATH, JSON.stringify(initialComments, null, 2));
      return initialComments;
    }

    const fileContent = await fs.readFile(COMMENTS_FILE_PATH, 'utf-8');
    const comments: Comment[] = JSON.parse(fileContent);
    return comments;
  } catch (error) {
    console.error('Erro ao ler arquivo de comentários:', error);
    throw new Error('Falha ao ler comentários do arquivo');
  }
};

/**
 * Salva os comentários no arquivo data.json
 */
const saveCommentsToFile = async (comments: Comment[]): Promise<void> => {
  try {
    await fs.writeFile(COMMENTS_FILE_PATH, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Erro ao salvar arquivo de comentários:', error);
    throw new Error('Falha ao salvar comentários no arquivo');
  }
};

/**
 * Adiciona um novo comentário e persiste no arquivo
 */
export const addCommentToFile = async (commentData: {
  text: string;
  author: string;
  timestamp: string;
}): Promise<Comment> => {
  try {
    const comments = await readCommentsFromFile();
    
    // Gerar novo ID (pegar o maior ID existente + 1)
    const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) : 0;
    const newComment: Comment = {
      id: maxId + 1,
      ...commentData
    };

    comments.push(newComment);
    await saveCommentsToFile(comments);
    
    return newComment;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw new Error('Falha ao adicionar comentário');
  }
};

/**
 * Atualiza um comentário existente no arquivo
 */
export const updateCommentInFile = async (
  id: number, 
  updateData: { text?: string; author?: string }
): Promise<Comment | null> => {
  try {
    const comments = await readCommentsFromFile();
    const commentIndex = comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) {
      return null;
    }

    // Atualizar apenas os campos fornecidos
    if (updateData.text !== undefined) {
      comments[commentIndex].text = updateData.text;
    }
    if (updateData.author !== undefined) {
      comments[commentIndex].author = updateData.author;
    }

    await saveCommentsToFile(comments);
    return comments[commentIndex];
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    throw new Error('Falha ao atualizar comentário');
  }
};

/**
 * Remove um comentário e persiste no arquivo
 */
export const removeCommentFromFile = async (id: number): Promise<Comment | null> => {
  try {
    const comments = await readCommentsFromFile();
    const commentIndex = comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) {
      return null;
    }

    const deletedComment = comments[commentIndex];
    comments.splice(commentIndex, 1);
    
    await saveCommentsToFile(comments);
    return deletedComment;
  } catch (error) {
    console.error('Erro ao remover comentário:', error);
    throw new Error('Falha ao remover comentário');
  }
};
