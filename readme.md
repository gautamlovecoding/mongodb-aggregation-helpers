# AggregationBuilder
![MongoDB Logo](https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg)

`AggregationBuilder` is a utility class that simplifies the creation of MongoDB aggregation pipelines by providing a fluent interface for building complex aggregation stages.

## Installation
- You can install the AggregationBuilder package using npm:

```sh
npm install aggregation-builder
```

## Stages
- **Match -** The `$match` stage filters documents based on specified conditions.

- **Group -** The `$group` stage groups documents by a specified _id expression and allows you to perform aggregations on grouped data.

- **Sort -** The `$sort` stage sorts documents in the pipeline based on specified criteria.

- **Project -** The `$project` stage reshapes documents, including including or excluding fields.

- **Unwind -** The `$unwind` stage deconstructs an array field from input documents, creating one document per array element.

- **Lookup -** The `$lookup` stage performs a left outer join with another collection, combining documents based on specified conditions.

- **Sample -** The `$sample` stage randomly selects a specified number of documents from the pipeline.

- **Facet -** The `$facet` stage allows you to run multiple pipelines within a single aggregation operation.

- **Limit -** The `$limit` stage restricts the number of documents in the pipeline.

- **Count -** The `$count` stage returns the count of documents in the pipeline.

- **Skip -** The `$skip` stage skips a specified number of documents from the pipeline.

- **Filter -** The `$filter` stage filters an array field in a document, returning only the elements that match the specified condition.

- **Unset -** The `$unset` stage removes specified fields from documents in the pipeline.

- **AddFields -** The `$addFields` stage adds new fields to documents in the pipeline.

## Building the Pipeline
The aggregation pipeline is built using a fluent interface. Each stage is added to the pipeline using methods like .match(), .group(), .sort(), etc. You can chain these methods to construct a comprehensive aggregation pipeline. Finally, the .build() method returns the complete aggregation pipeline.

- For detailed information on MongoDB aggregation stages, consult the MongoDB Aggregation Pipeline documentation.


## Usage/Examples

```javascript
const { AggregationBuilder } = require("mongodb-aggregation-helpers");

// Create an instance of AggregationBuilder
const aggregationBuilder = new AggregationBuilder();

// Build the aggregation pipeline using various stages
const pipeline = aggregationBuilder
  .match({ age: { $gte: 18 } })
  .group({
    _id: '$department',
    averageSalary: { $avg: '$salary' }
  })
  .sort({ age: 1 })
  .project({ fullName: { $concat: ['$firstName', ' ', '$lastName'] } })
  .unwind('$skills')
  .lookup('departments', 'departmentId', '_id', 'departmentInfo')
  .lookupMatchWithTwoFields(
    'orders',
    ['customerId', 'productId'],
    ['_id', 'productId'],
    [],
    'orderDetails'
  )
  .sample(5)
  .facet({
    ageStats: [{ $group: { _id: null, avgAge: { $avg: '$age' } } }],
    departmentStats: [{ $group: { _id: '$department', count: { $sum: 1 } } }]
  })
  .limit(10)
  .count('totalEmployees')
  .skip(20)
  .filter({
    input: '$items',
    as: 'item',
    cond: { $gte: ['$$item.price', 100] }
  })
  .unset(['temporaryField', 'obsoleteField'])
  .addFields({ isNewEmployee: { $cond: { if: { $gte: ['$hireDate', new Date('2023-01-01')] }, then: true, else: false } } })
  .build();

// Execute the aggregation pipeline
db.collection.aggregate(pipeline);

```

## Conclusion
The AggregationBuilder class simplifies the creation of complex MongoDB aggregation pipelines by providing a fluent and intuitive interface for building various aggregation stages.

```vbnet
Feel free to adjust the content of the `readme.md` file as needed. This provides a comprehensive guide to using each stage of the `AggregationBuilder` class along with relevant examples.
```

## Package Information
- ***Package Name:*** mongodb-aggregation-helpers
- ***Author Name:*** gautamtheprogrammer
- ***GitHub URL:*** https://github.com/gautamlovecoding/mongodb-aggregation-helpers



