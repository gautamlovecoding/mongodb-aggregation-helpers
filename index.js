class AggregationBuilder {
  constructor() {
    this.pipeline = [];
  }

  match(query) {
    this.pipeline.push({ $match: query });
    return this;
  }

  group(groupStage) {
    this.pipeline.push({ $group: groupStage });
    return this;
  }

  sort(sortStage) {
    this.pipeline.push({ $sort: sortStage });
    return this;
  }

  project(projectStage) {
    this.pipeline.push({ $project: projectStage });
    return this;
  }

  unwind(field, preserveNullAndEmptyArrays = false) {
    var unwindObj = {
      "$unwind": field
    }
    if (preserveNullAndEmptyArrays) {
      unwindObj = { "$unwind": {} }
      unwindObj["$unwind"]['path'] = field
      unwindObj["$unwind"]["preserveNullAndEmptyArrays"] = true
    }
    this.pipeline.push(unwindObj);
    return this;
  }

  lookup(fromCollection, localField, foreignField, as) {
    // Single foreign field case
    let lookupStage = {
      from: fromCollection,
      localField: localField,
      foreignField: foreignField,
      as: as,
    };

    this.pipeline.push({ $lookup: lookupStage });
    return this;
  }

  lookupMatchWithTwoFields(
    fromCollection,
    localFieldOrFields,
    foreignFieldOrFields,
    conditionMatchInLookupPipeline,
    as,
    dynamicPipeline = []
  ) {
    let lookupStage;

    // Array of two foreign fields case
    const [foreignField1, foreignField2] = foreignFieldOrFields;
    const [localField1, localField2] = localFieldOrFields;

    lookupStage = {
      from: fromCollection,
      let: {
        localFieldValue1: Array.isArray(localField1) ? localField1 : `$${localField1}`,
        localFieldValue2: Array.isArray(localField2) ? localField2 : `$${localField2}`,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                Array.isArray(localField1)
                  ? { $in: [`$${foreignField1}`, "$$localFieldValue1"] }
                  : { $eq: [`$${foreignField1}`, "$$localFieldValue1"] },
                Array.isArray(localField2)
                  ? { $in: [`$${foreignField2}`, "$$localFieldValue2"] }
                  : { $eq: [`$${foreignField2}`, "$$localFieldValue2"] },
                ...conditionMatchInLookupPipeline,
              ],
            },
          },
        },
        ...dynamicPipeline,
      ],
      as: as,
    };

    this.pipeline.push({ $lookup: lookupStage });
    return this;
  }

  sample(size) {
    this.pipeline.push({ $sample: { size } });
    return this;
  }

  facet(facetStage) {
    this.pipeline.push({ $facet: facetStage });
    return this;
  }

  limit(limit) {
    this.pipeline.push({ $limit: limit });
    return this;
  }

  count(countField) {
    this.pipeline.push({ $count: countField });
    return this;
  }

  skip(skipValue) {
    this.pipeline.push({ $skip: skipValue });
    return this;
  }

  filter(filterStage) {
    this.pipeline.push({ $filter: filterStage });
    return this;
  }

  unset(fields) {
    const unsetStage = {};
    fields.forEach((field) => {
      unsetStage[field] = 1;
    });
    this.pipeline.push({ $unset: unsetStage });
    return this;
  }

  addFields(fields) {
    this.pipeline.push({ $addFields: fields });
    return this;
  }

  build() {
    return this.pipeline;
  }
}

module.exports = { AggregationBuilder };
