export class PostsInputModel {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class PostsInputModelForBlogs {
  title: string;
  shortDescription: string;
  content: string;
}

export class PostsQueryInputModel {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export class PostsQueryFixedModel {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
