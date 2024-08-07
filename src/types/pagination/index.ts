export enum BooksOrderBy {
  Author = 'author',
  CreatedAt = 'createdAt',
  Pages = 'pages',
  Rating = 'rating',
  Title = 'title',
}

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export type PaginationResult<T> = {
  data: T[];
  nextToken?: string;
  prevToken?: string;
};
