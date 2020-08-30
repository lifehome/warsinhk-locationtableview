import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

// react-table
import { useTable } from 'react-table'

const IndexPage = ({data}) => {

  let caseLocationData = Object.keys(data.allLocations.edges).map(key=>{
    return data.allLocations.edges[key]["node"]
  })

  let caseHistoryData = Object.assign(...(Object.keys(data.allCases.edges).map(key=>{
    return data.allCases.edges[key]["node"]
  })).map(({case_no, confirmation_date})=> ({[case_no]: confirmation_date})))

  let tableColumns = [{
    Header: "個案編號", accessor: "case_no"
  }, {
    Header: "確診日期", accessor: "confirmation_date"
  }, {
    Header: "動作", accessor: "action_zh"
  }, {
    Header: "分區", accessor: "sub_district_zh"
  }, {
    Header: "地點", accessor: "location_zh"
  }]

  let tableData = caseLocationData.map(x=>{
    x.confirmation_date = caseHistoryData[x.case_no]
    return x
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ tableColumns, tableData });

  return (<Layout>
    <SEO title="Home" />
    <h1>wars.vote4.hk - 確診病人活動地點清單</h1>

    <main>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  </Layout>)
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPage {
    allLocations: allWarsCaseLocation {
      edges {
        node {
          case_no
          action_zh
          sub_district_zh
          location_zh
        }
      }
    }
    allCases: allWarsCase {
      edges {
        node {
          case_no
          confirmation_date
        }
      }
    }
  }
`