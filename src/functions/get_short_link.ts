import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { plainToClass } from "class-transformer";
import { nanoid } from 'nanoid';
import { MainLinkDto } from "../dtos/main_link.dto";
import { validate } from "class-validator";
import { AppDataSource } from "../db/data_source";
import { Link } from "../entities/link.entity";

export async function getShortLink(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        context.log(`Http function processed request for url "${request.url}"`);
    
        const bodyText = await request.text();
        const body = JSON.parse(bodyText);
    
        const mainLinkDto = plainToClass(MainLinkDto, body);
    
        const errors = await validate(mainLinkDto);
        if (errors.length > 0) {
            return { status: 400, jsonBody: { error: 'Invalid request body', details: errors } };
        }
    
        const linkRepository = AppDataSource.getRepository(Link);
    
        let link = await linkRepository.findOne({ where: { mainLink: mainLinkDto.url } });
    
        let shortLink: string;
        if (!link) {
          const code = nanoid(6);
    
          const newLink = linkRepository.create({
            mainLink: mainLinkDto.url,
            shortLink: code,
          });
          await linkRepository.save(newLink);
    
          shortLink = newLink.shortLink;
        } else if (link && !link.shortLink) {
          const code = nanoid(6);
    
          const updateLink = await linkRepository.preload({
            id: link.id,
            shortLink: code,
          });
          await linkRepository.save(updateLink);
    
          shortLink = updateLink.shortLink;
        } else {
          shortLink = link.shortLink;
        }
    
        return { jsonBody: {
            url: `${process.env.SHORT_DOMAIN}/${shortLink}`
        }};
    } catch (error) {
        return { status: error.status || 500, jsonBody: {error: error } };
    }
};

app.http('get_short_link', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getShortLink
});
