export interface IUser {
  email: string;
  password: string;
  username: string;
}

export interface IArticle {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface IComment {
  body?: string;
}

export type UserResponse = {
  user: {
    id?: number;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    username: string;
    bio?: null | boolean | string;
    image?: null | boolean | string;
    token: string;
  };
};

export type ArticleResponse = {
  article: {
    title?: string;
    slug: string;
    body?: string;
    createdAt?: string;
    updatedAt?: string;
    tagList?: string[];
    description?: string;
    author: {
      username: string;
      bio?: null | boolean | string;
      image?: string;
      following?: boolean;
    };
    favorited: boolean;
    favoritesCount: number;
  };
};

export type CommentResponse = {
  comments: {
    index: {
      id: number | string;
      body: string;
      createdAt: string;
      author: {
        username: string;
        image?: string;
        following?: boolean;
      };
    };
  };
};
