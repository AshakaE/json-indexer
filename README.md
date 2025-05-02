# JSON INDEXER

- Indexes JSON data into mongodb every 5 minutes
- Uses BullMQ with Redis to process large datasets in background

## Requirements

- Redis
- MongoDB
- NestJS

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ pnpm run start:dev
```

## API example
```bash
http://localhost:3000/allDocs
http://localhost:3000/allDocs?country=Brazil
http://localhost:3000/allDocs?country=Australia&priceForNight=400&maxPrice=700&sortBy=city&sortOrder=asc
```
## Support

How to handle varying JSON structures
- Check depth of the JSON nesting
- Track attributes in a separate collection
- Detect attributes during indexing to properly tag JSONs with same attributes, this will also aid faster querying

## Updates TBA

- Separate API from Indexer using microservices to ensure API is not blocked during indexing

