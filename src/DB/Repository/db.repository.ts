import {
  CreateOptions,
  FilterQuery,
  FlattenMaps,
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
} from "mongoose";

export default abstract class DBRepository<T> {
  constructor(protected readonly model: Model<T>) {}
  findOne = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<
    FlattenMaps<HydratedDocument<T>> | HydratedDocument<T> | null
  > => {
    const doc = this.model.findOne(filter, projection, options);
    if (options?.lean) {
      doc.lean();
    }
    return doc;
  };
  create = async ({
    data,
    options,
  }: {
    data: Partial<HydratedDocument<T>>[];
    options?: CreateOptions;
  }): Promise<T[]> => {
    return this.model.create(data, options);
  };

  findById = async ({
    id,
    projection,
    options,
  }: {
    id: Types.ObjectId | string;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<
    FlattenMaps<HydratedDocument<T>> | HydratedDocument<T> | null
  > => {
    const doc = this.model.findById(id, projection, options);
    if (options?.lean) {
      doc.lean();
    }
    return doc;
  };

  find = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<
    FlattenMaps<HydratedDocument<T>>[] | HydratedDocument<T>[] | null
  > => {
    const doc = this.model.find(filter, projection, options);
    if (options?.lean) {
      doc.lean();
    }
    return doc;
  };
}
