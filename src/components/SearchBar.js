import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/SearchBar.module.css";

function SearchBar() {
  return (
    <Container fluid className={styles.searchBarContainer}>
      <Row>
        <Col><h1>Hello world</h1></Col>
      </Row>
    </Container>
  );
}

export default SearchBar;
