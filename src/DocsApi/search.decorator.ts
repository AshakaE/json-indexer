import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SearchCriteria = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Record<string, any> => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.query;

    const andCriteria: any[] = [];

    const allowedSortFields = [
      'pricePerNight',
      'priceForNight',
      'name',
      'city',
      'country',
    ];

    const sortFieldMap: Record<string, string[]> = {
      city: ['data.city', 'data.address.city'],
      country: ['data.address.country'],
      name: ['data.name'],
      priceForNight: ['data.priceForNight'],
      pricePerNight: ['data.pricePerNight'],
    };

    const sort: Record<string, 1 | -1> = {};

    if (params.sortBy && allowedSortFields.includes(params.sortBy as string)) {
      const direction =
        params.sortOrder?.toString().toLowerCase() === 'asc' ? 1 : -1;
      const fieldsToSort = sortFieldMap[params.sortBy as string];

      if (fieldsToSort && fieldsToSort.length > 0) {
        for (const field of fieldsToSort) {
          sort[field] = direction;
        }
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) {
        return;
      }

      switch (key) {
        case 'country':
          andCriteria.push({
            $or: [{ 'data.address.country': new RegExp(value as string, 'i') }],
          });
          break;

        case 'city':
          andCriteria.push({
            $or: [
              { 'data.address.city': new RegExp(value as string, 'i') },
              { 'data.city': new RegExp(value as string, 'i') },
            ],
          });
          break;

        case 'isAvailable':
        case 'availability':
          const available = (value as string).toLowerCase() === 'true';
          andCriteria.push({
            $or: [
              { 'data.isAvailable': available },
              { 'data.availability': available },
            ],
          });
          break;

        case 'priceForNight':
        case 'pricePerNight':
          const minPrice = parseInt(value as string, 10);
          const maxPrice = params.maxPrice
            ? parseInt(params.maxPrice as string, 10)
            : null;

          const orConditions: Record<string, any>[] = [];

          if (!isNaN(minPrice)) {
            orConditions.push(
              {
                'data.priceForNight': {
                  ...(maxPrice
                    ? { $gte: minPrice, $lte: maxPrice }
                    : { $gte: minPrice }),
                },
              },
              {
                'data.pricePerNight': {
                  ...(maxPrice
                    ? { $gte: minPrice, $lte: maxPrice }
                    : { $gte: minPrice }),
                },
              },
            );
          }

          if (orConditions.length > 0) {
            andCriteria.push({ $or: orConditions });
          }

          break;
        case 'priceSegment':
          andCriteria.push({
            'data.priceSegment': new RegExp(value as string, 'i'),
          });
          break;

        case 'name':
          andCriteria.push({
            'data.name': new RegExp(value as string, 'i'),
          });
          break;

        default:
          [];
      }
    });

    const filter = andCriteria.length > 0 ? { $and: andCriteria } : {};
    return { filter, sort };
  },
);
