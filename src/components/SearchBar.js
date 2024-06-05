import React from "react";
import { Container, Row } from "react-bootstrap";
import styles from "../styles/SearchBar.module.css";
import TitleComponent from "./TitleComponent";

function SearchBar() {
  return (
    <Container fluid className={styles.searchBarContainer}>
      <Row>
        <TitleComponent/>
      </Row>
    </Container>
  );
}

export default SearchBar;
