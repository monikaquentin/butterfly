import IndexIFC from '@root/controllers/index/index.interface'

import { Schema, model } from 'mongoose'

/**
 *  !-- INDEX MODEL (schema)
 *
 * @desc Index database schema, example.
 */
const IndexSchema: Schema = new Schema(
  // Do whatever
  {
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
)

export default model<IndexIFC>('Indexe', IndexSchema)
