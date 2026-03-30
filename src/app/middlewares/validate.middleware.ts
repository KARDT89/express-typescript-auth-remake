import ApiError from "../utils/api-errors.js";
import type { NextFunction, Request, Response } from 'express'

interface DtoClass {
    validate(data: unknown): Promise<{ errors: string[] | null, value: any }>
}

const validate = (DtoClass: DtoClass) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const {errors, value} = await DtoClass.validate(req.body)
        if(errors) {
            throw ApiError.badRequest(errors.join(", "))
        }
        req.body = value
        next()
    }
}

export default validate