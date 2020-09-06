import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

// react-base-table
import "react-tabulator/lib/styles.css"
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap4.min.css"
import { ReactTabulator } from 'react-tabulator'

// Bootstrap imports
import { Container } from "react-bootstrap"

// moment.js
import { moment } from "moment"

const IndexPage = ({data}) => {

  let caseLocationData = Object.keys(data.allLocations.edges).map(key=>{
    return data.allLocations.edges[key]["node"]
  }).filter(x => x.case_no !== "-" && x.case_no.trim() !== "")

  let caseHistoryData = Object.assign(...(Object.keys(data.allCases.edges).map(key=>{
    return data.allCases.edges[key]["node"]
  })).map(({case_no, confirmation_date})=> ({[case_no]: confirmation_date})))

  let tableColumns = [{
    title: "個案編號", field: "case_no",
    headerFilter: "input", headerFilterPlaceholder: "個案編號..."
  }, {
    title: "確診日期", field: "confirmation_date",
    headerFilter: "input", headerFilterPlaceholder: "日期...",
    sorter: "date", sorterParams:{format:"YYYY-MM-DD"}
  }, {
    title: "動作", field: "action_zh",
    headerFilter: "select", headerFilterPlaceholder: "動作...", headerFilterParams: { values: {
      "": '所有動作',
      "交通": "交通",
      "住宿": "住宿",
      "家居檢疫": "家居檢疫",
      "工作": "工作",
      "抵港": "抵港",
      "指定診所": "指定診所",
      "檢疫中心": "檢疫中心",
      "求醫": "求醫",
      "聚會": "聚會",
      "聚餐": "聚餐",
      "逗留": "逗留",
      "離港": "離港"
    }}
  }, {
    title: "分區", field: "sub_district_zh",
    headerFilter: "input", headerFilterPlaceholder: "18 區..."
  }, {
    title: "地點", field: "location_zh",
    headerFilter: "input", headerFilterPlaceholder: "關鍵字..."
  }]

  let tableData = caseLocationData.map(x=>{
    x.confirmation_date = caseHistoryData[x.case_no]
    return x
  })

  let tableConfigurations = {
    layout: "fitDataStretch",
    pagination: "local",
    paginationSizeSelector: [10, 20, 25, 50, 100], 
    paginationSize: 10,
    columnMinWidth: 189,
    placeholder: "查無資料。"
  }

  return (<Layout>
    <SEO title="病患行蹤清單" />

    <Container style={{minHeight: "70vh", fontFamily: "san-serif" }}>
      <ReactTabulator
        data={tableData}
        columns={tableColumns}
        layout={"fitData"}
        options={tableConfigurations}
        class="table-sm"
      />
    </Container>
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