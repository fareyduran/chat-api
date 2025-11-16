import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 30;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pageInfo: {
    hasMoreMessages: boolean;
    nextCursor: string | null;
    count: number;
  };
}
