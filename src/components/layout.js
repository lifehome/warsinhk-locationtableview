/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header siteTitle="🤒武漢肺炎民間資訊😷 - 病患行蹤清單" />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1280,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <main>{children}</main>
        <footer style={{ textAlign: "center", paddingTop: "21px", marginTop: "13px", borderTop: "1px solid rgba(0,0,0,.34)" }}>
          資料以 CC-BY-SA 4.0 授權取自 <a href="https://wars.vote4.hk" target="_blank" rel="noreferrer">wars.vote4.hk 武漢肺炎民間資訊</a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
