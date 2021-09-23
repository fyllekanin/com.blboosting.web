import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../utilities/internal.request';
import { StatusCodes } from 'http-status-codes';

@Controller('api/page')
export class PageController {

    @Get('test')
    async getTest(req: InternalRequest, res: Response): Promise<void> {
        res.status(StatusCodes.OK).json({ message: 'Tjabba tjena hallå' });
    }
}
