/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const fetch = require("node-fetch")
const csv2json = require("csvtojson")

const PUBLISHED_SPREADSHEET_WARS_CASES_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSr2xYotDgnAq6bqm5Nkjq9voHBKzKNWH2zvTRx5LU0jnpccWykvEF8iB_0g7Tzo2pwzkTuM3ETlr_h/pub?gid=0"
const PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6aoKk3iHmotqb5_iHggKc_3uAA901xVzwsllmNoOpGgRZ8VAA3TSxK6XreKzg_AUQXIkVX5rqb0Mo/pub?gid=0"

exports.sourceNodes = async props => {
  await Promise.all([
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_CASES_URL,
      "WarsCase",
      { skipFirstLine: true }
    ),
    createPublishedGoogleSpreadsheetNode(
      props,
      PUBLISHED_SPREADSHEET_WARS_CASES_LOCATION_URL,
      "WarsCaseLocation",
      {
        skipFirstLine: true,
        subtype: "default",
      }
    )
  ])
}

const createPublishedGoogleSpreadsheetNode = async (
    { actions: { createNode, createTypes }, createNodeId, createContentDigest },
    publishedURL,
    type,
    { skipFirstLine = false, alwaysEnabled = false, subtype = null }
  ) => {
    // All table has first row reserved
    const result = await fetch(
      `${publishedURL}&single=true&output=csv&headers=0${
        skipFirstLine ? "&range=A2:ZZ" : ""
      }&q=${Math.floor(new Date().getTime(), 1000)}`
    )
    const data = await result.text()
    const records = await csv2json().fromString(data)
    const filteredRecords = records.filter(
      r => alwaysEnabled || r.enabled === "Y"
    )
  
    if (filteredRecords.length > 0) {
      filteredRecords.forEach((p, i) => {
        // create node for build time data example in the docs
        const meta = {
          // required fields
          id: createNodeId(
            `${type.toLowerCase()}${subtype ? `-${subtype}` : ""}-${i}`
          ),
          parent: null,
          children: [],
          internal: {
            type,
            contentDigest: createContentDigest(p),
          },
        }
        const node = { ...p, subtype, ...meta }
        createNode(node)
      })
    } else if (records.length > 0) {
      // So if filtered rows is empty,
      // we manually create the type here.
  
      // TODO: handle not even a single row ...
      const fields = Object.keys(records[0])
      const fieldString = fields.map(field => `${field}: String`).join("\n")
      const typeTemplate = `
        type ${type} implements Node {
          ${fieldString}
        }
      `
      createTypes(typeTemplate)
    }
  }

// https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    `type WarsCase implements Node {
      locations: [WarsCaseLocation] @link(by: "case_no", from: "case_no") # easy back-ref
    }`,
    `type WarsCaseLocation implements Node {
      case: WarsCase @link(by: "case_no", from: "case_no")
    }`,
  ]
  createTypes(typeDefs)
}