import { CreateOptions, Model, ProjectionType, QueryOptions } from "mongoose";

export abstract class DBRepository<T> {

    constructor(protected readonly model: Model<T>) {}
    async findOne({data,projection,option}:{data:Partial<T>,projection?:ProjectionType<T>,option?:QueryOptions<T>}):Promise<T | null>{
        return this.model.findOne(data,projection,option)
    }
    async createOne({data,option}:{data:Partial<T>,option?:CreateOptions}):Promise<T[]>{
        return this.model.create([data],option)
    }
    
}
