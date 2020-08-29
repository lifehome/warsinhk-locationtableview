import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

// ag-grid import
import { AgGridReact } from 'ag-grid-react'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const table = {
  columnDefs: [{
    headerName: "個案編號", field: "case_no", maxWidth: 120
  }, {
    headerName: "確診日期", field: "confirmation_date", minWidth: 120
  }, {
    headerName: "動作", field: "action_zh", minWidth: 120
  }, {
    headerName: "分區", field: "sub_district_zh", minWidth: 140
  }, {
    headerName: "地點", field: "location_zh", minWidth: 380
  }],
  defaultColDef: {
    flex: 1,
    sortable: true,
    editable: true,
    filter: true,
    floatingFilter: true,
  }
}

const IndexPage = ({data}) => {

  let caseLocationData = Object.keys(data.allLocations.edges).map(key=>{
    return data.allLocations.edges[key]["node"]
  })

  let caseHistoryData = Object.assign(...(Object.keys(data.allCases.edges).map(key=>{
    return data.allCases.edges[key]["node"]
  })).map(({case_no, confirmation_date})=> ({[case_no]: confirmation_date})))

  let tableData = caseLocationData.map(x=>{
    x.confirmation_date = caseHistoryData[x.case_no]
    return x
  })


  return (<Layout>
    <SEO title="Home" />
    <h1>wars.vote4.hk - 確診病人活動地點清單</h1>

    <main style={{ width: "100%", height: "100%" }}>
    <div
        className="ag-theme-alpine"
        style={{
        height: '70vh',
        width: '960px' }}
      >
        <AgGridReact
          columnDefs={table.columnDefs}
          defaultColDef={table.defaultColDef}
          rowData={tableData}>
        </AgGridReact>
      </div>
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