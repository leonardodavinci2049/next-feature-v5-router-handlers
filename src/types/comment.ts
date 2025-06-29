export interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export interface CreateCommentRequest {
  text: string;
  author: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export type CommentsResponse = ApiResponse<Comment[]>;
export type CommentResponse = ApiResponse<Comment>;
