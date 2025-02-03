import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AppDataSource } from "../db/data_source";
import { Link } from "../entities/link.entity";
import { plainToClass } from "class-transformer";
import { ShortLinkDto } from "../dtos/short_link.dto";
import { validate } from "class-validator";

export async function getMainLink(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try{
        context.log(`Http function processed request for url "${request.url}"`);
    
        const code = request.params.code;
        
        const shortLinkDto = plainToClass(ShortLinkDto, { code });
    
        const errors = await validate(shortLinkDto);
            if (errors.length > 0) {
                return { status: 400, jsonBody: { error: 'Invalid request body', details: errors } };
            }
    
        const linkRepository = AppDataSource.getRepository(Link);
    
        const link = await linkRepository.findOne({
            where: {
              shortLink: shortLinkDto.code,
            },
          });
      
          if (!link) {
            return { status: 404, jsonBody: {error: 'Link not found' } };
          }
    
        return { jsonBody: {url: link.mainLink} };
    } catch (error) {
        return { status: error.status || 500, jsonBody: {error: error } };
    }
};

app.http('get_main_link', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get_main_link/{code}',
    handler: getMainLink
});
