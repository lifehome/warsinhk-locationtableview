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
    headerName: "開始日期", field: "start_date", minWidth: 120
  }, {
    headerName: "結束日期", field: "end_date", minWidth: 120
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
          rowData={Object.keys(data.allLocations.edges).map(key=>{
            return data.allLocations.edges[key]["node"]
          })}>
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
          start_date
          end_date
          action_zh
          sub_district_zh
          location_zh
        }
      }
    }
  }
`