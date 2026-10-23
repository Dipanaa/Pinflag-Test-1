import { Type } from "class-transformer";
import { IsOptional, Max, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @Type(() => Number)
    @Max(10)
    @Min(0)
    limit?: number = 10;

    @IsOptional()
    // @IsPositive() // El 0 no es numero positivo xd?
    @Type(() => Number)
    @Min(0)
    offset?: number = 0;
}
