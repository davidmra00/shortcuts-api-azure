import { IsUrl } from "class-validator";

export class MainLinkDto {
  @IsUrl()
  url: string;
}