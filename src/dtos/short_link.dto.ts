import { MaxLength, MinLength } from "class-validator";

export class ShortLinkDto {
  @MaxLength(6)
  @MinLength(6)
  code: string;
}