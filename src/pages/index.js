import React from "react"
import styled from "styled-components"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

// react-base-table
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap4.min.css"
import { ReactTabulator } from 'react-tabulator'

// Bootstrap imports
import "bootstrap/dist/css/bootstrap.min.css"
import { Alert, Button, Container } from "react-bootstrap"

// moment.js
import moment from "moment"

export default class IndexPage extends React.Component {
  // Mount components to window
  componentDidMount() {
    window.moment = moment
  }

  // custom function
  downloadSheetResult = ()=>{
    this.ref.table.download("csv", "result.csv")
  }

  // Process all the messy stuff here
  render(){
    // Load data from props
    let data = this.props.data

    // custom components
    const TabulatorTable = styled(ReactTabulator)`
      div.tabulator-header-filter > input[type=search] {
        border: 1px solid rgba(0,0,0,.13);
        border-radius: 3px
      }
    `

    const SmallScreenAlert = styled(Alert)`
      @media (min-width: 1200px){
        &&& {
          display: none
        }
      }
    `

    // Popping data from GraphQL queries
    let caseLocationData = Object.keys(data.allLocations.edges).map(key=>{
      return data.allLocations.edges[key]["node"]
    }).filter(x => x.case_no !== "-" && x.case_no.trim() !== "")

    // Popping and insert data from GraphQL queries
    let caseHistoryData = Object.assign(...(Object.keys(data.allCases.edges).map(key=>{
      return data.allCases.edges[key]["node"]
    })).map(({case_no, confirmation_date}) => ({[case_no]: confirmation_date})))

    // Table column definitions
    let tableColumns = [{
      title: "個案編號", field: "case_no", width: 121,
      headerFilter: "input", headerFilterPlaceholder: "個案編號..."
    }, {
      title: "行蹤活動日期", field: "end_date", width: 155, 
      headerFilter: "input", headerFilterPlaceholder: "日期...",
      sorter: "date", sorterParams:{format:"YYYY-MM-DD"}
    }, {
      title: "確診日期", field: "confirmation_date", width: 134, 
      headerFilter: "input", headerFilterPlaceholder: "日期...",
      sorter: "date", sorterParams:{format:"YYYY-MM-DD"}
    },  {
      title: "動作", field: "action_zh", width: 121, 
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
      title: "分區", field: "sub_district_zh", width: 121, 
      headerFilter: "input", headerFilterPlaceholder: "18 區..."
    }, {
      title: "地點", field: "location_zh",
      headerFilter: "input", headerFilterPlaceholder: "關鍵字..."
    }]

    let tableData = caseLocationData.map(x=>{
      x.confirmation_date = caseHistoryData[x.case_no]
      return x
    })
    
    // Table display configurations
    let tableConfigurations = {
      layout: "fitDataStretch",
      locale: true,
      langs:{
        "en-us":{ // overriding english
          "columns":{
              "name": "欄位名稱", //replace the title of column name with the value "Name"
          },
          "ajax":{
              "loading": "載入中...", //ajax loader text
              "error": "錯誤 x_x", //ajax error text
          },
          "groups":{ //copy for the auto generated item count in group header
              "item": " 項資料", //the singular  for item
              "items": " 項資料", //the plural for items
          },
          "pagination":{
            "page_size": "每頁顯示", //label for the page size select element
              "page_title": "顯示第幾頁：",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
              "first": "<<", //text for the first page button
              "first_title": "第一頁", //tooltip text for the first page button
              "last": ">>",
              "last_title": "最後一頁",
              "prev": "<",
              "prev_title": "上一頁",
              "next": ">",
              "next_title": "下一頁",
              "all": "顯示所有資料",
          },
          "headerFilters":{
              "default": "關鍵字...", //default header filter placeholder text
              // "columns":{ // translations for customized column name
              //     "name": "filter name...", //replace default header filter text for column name
              // }
          }
        }
      },
      pagination: "local",
      paginationSizeSelector: [10, 20, 25, 50, 100, true], 
      paginationSize: 10,
      placeholder: "查無資料。",
      downloadDataFormatter: (data) => data,
      downloadReady: (fileContents, blob) => blob
    }

    // Final render components
    return (<Layout>
      <SEO title="病患行蹤清單" />

      <Container style={{minHeight: "75vh", fontFamily: "san-serif" }}>
        <SmallScreenAlert variant="warning">
          <strong>注意！</strong>由於表格會顯示較多資料，建議使用較大的螢幕閱讀。
        </SmallScreenAlert>
        <Alert variant="info">
          <strong>你知道嗎？</strong>你可以按住 Shift 鍵來多重排序欄位！
        </Alert>
        <div className="float-right" style={{ padding: "0 0 13px"}}>
          <Link as={Button} className="btn btn-sm btn-info" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT6aoKk3iHmotqb5_iHggKc_3uAA901xVzwsllmNoOpGgRZ8VAA3TSxK6XreKzg_AUQXIkVX5rqb0Mo/pub?gid=0&range=A2:ZZ&output=csv">下載表格原始資料</Link>
          {' '}
          <Button variant="success" className="btn-sm" onClick={this.downloadSheetResult}>下載表格搜尋結果</Button>
        </div>
        <TabulatorTable
          ref={ref => (this.ref = ref)}
          data={tableData}
          columns={tableColumns}
          layout={"fitData"}
          options={tableConfigurations}
          className="table-sm" // Bootstrap table fix
        />
      </Container>
    </Layout>)
  }
}

export const pageQuery = graphql`
  query IndexPage {
    allLocations: allWarsCaseLocation {
      edges {
        node {
          case_no
          action_zh
          end_date
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