import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { InternalRequest } from '../../../common/utilities/internal.request';
import { StatusCodes } from 'http-status-codes';
import { BoosterRepository } from '../../../common/persistance/repositories/booster.repository';
import { Filter } from 'mongodb';
import { IBooster } from '../../../common/persistance/entities/booster.entity';

@Controller('api/admin/boosters')
export class BoostersController {

    @Get('key/page/:page')
    async getList(req: InternalRequest, res: Response): Promise<void> {
        const armors = <Array<string>>req.query.armors || [];
        const classes = <Array<string>>req.query.classes || [];
        const filter: Filter<IBooster> = {
            name: req.query.name ? { $regex: new RegExp(`${req.query.name}`, 'i') } : undefined
        };
        for (const armor of armors) {
            filter[`armors.${armor}`] = true;
        }
        for (const clazz of classes) {
            filter[`classes.${clazz}`] = true;
        }
        try {
            res.status(StatusCodes.OK).json(await BoosterRepository.newRepository().paginate({
                page: Number(req.params.page),
                take: 20,
                orderBy: {
                    sort: 'name',
                    order: 'ASC'
                },
                filter: filter
            }));
        } catch (err) {
            console.error(err);
            res.status(StatusCodes.BAD_REQUEST).json();
        }
    }
}
